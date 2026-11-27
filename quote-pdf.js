// Builds the customer's quotation PDF (same look as the order PDF: green header, gold section titles).
// Used for the instant download AND the email attachment, so both are always identical.
const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb, pushGraphicsState, popGraphicsState, moveTo, appendBezierCurve, closePath, clip, endPath } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const { priceInfo, standardText, inr, OWNER_NAME } = require('./pricing');
const { loadI18n } = require('./i18n-server');

// The PDF library's Hindi/Telugu text shaping needs "regeneratorRuntime". Use the official package if it is installed,
// otherwise this tiny stand-in (the library uses it in exactly one place).
if (typeof regeneratorRuntime === 'undefined') {
  try { require('regenerator-runtime/runtime'); } catch (e) {
    global.regeneratorRuntime = {
      mark: function (fn) { return fn; },
      wrap: function (inner, outer, self) {
        const ctx = { prev: 0, next: 0, done: false, sent: undefined, rval: undefined,
          stop: function () { ctx.done = true; return ctx.rval; },
          abrupt: function (type, arg) { ctx.done = true; ctx.rval = type === 'return' ? arg : undefined; return ctx.rval; } };
        const it = { next: function (v) {
          ctx.sent = v;
          if (ctx.done) return { value: undefined, done: true };
          const r = inner.call(self, ctx);
          return ctx.done ? { value: ctx.rval, done: true } : { value: r, done: false };
        } };
        it[Symbol.iterator] = function () { return it; };
        return it;
      }
    };
  }
}


// Telugu and Hindi need their own fonts: run  npm install @fontsource/noto-sans-telugu @fontsource/noto-sans-devanagari
// (or point PDF_FONT_TE / PDF_FONT_HI / PDF_FONT_TE_BOLD / PDF_FONT_HI_BOLD in .env at any .ttf/.woff file)
const INDIC_FONT_CACHE = {};
const INDIC_MODE = {};      // per script: null = full shaping works, an object = the simpler mode that works
function indicFile(script, bold) {
  const key = script + (bold ? 'B' : 'R');
  if (key in INDIC_FONT_CACHE) return INDIC_FONT_CACHE[key];
  let buf = null;
  try {
    const env = process.env['PDF_FONT_' + script.toUpperCase() + (bold ? '_BOLD' : '')] || (bold ? '' : process.env['PDF_FONT_' + script.toUpperCase()]);
        const pk = script === 'te' ? ['noto-sans-telugu', 'NotoSansTelugu'] : ['noto-sans-devanagari', 'NotoSansDevanagari'];
    let own = ''; try { own = path.join(path.dirname(require.resolve('@expo-google-fonts/' + pk[0] + '/package.json')), (bold ? '700Bold/' : '400Regular/') + pk[1] + (bold ? '_700Bold.ttf' : '_400Regular.ttf')); } catch (e) { own = ''; }
    if (env) buf = fs.readFileSync(env);
    else if (own && fs.existsSync(own)) buf = fs.readFileSync(own);
    else {
      const pkg = script === 'te' ? '@fontsource/noto-sans-telugu' : '@fontsource/noto-sans-devanagari';
      const dir = path.join(path.dirname(require.resolve(pkg + '/package.json')), 'files');
      const re = new RegExp('-(telugu|devanagari)-' + (bold ? '700' : '400') + '-normal\\.woff$');
      const f = fs.readdirSync(dir).find(function (n) { return re.test(n); });
      if (f) buf = fs.readFileSync(path.join(dir, f));
    
    }
    
  } catch (e) { buf = null; }
  INDIC_FONT_CACHE[key] = buf;
  return buf;
}

// ---- EDIT HERE: business details printed in the header ----
const BIZ = {
  owner: 'V. JAGADEESWARI',
  phones: 'Ph: 77940 93779 | 93466 64914',
  name: 'ABHINAV CATERERS',
  sub: 'PURE VEG & OUTDOOR CATERING',
  tagline: 'Artistry on a plate, excellence at your table.',
  address: '5-1-45, Saheb Nagar, Vanasthalipuram, Hyderabad - 500070'
};
const LOGO = path.join(__dirname, 'public', 'assets', 'abhinav-logo-pdf.png');
const LOGO_BYTES = fs.existsSync(LOGO) ? fs.readFileSync(LOGO) : null;
const FONT_DIR = path.join(path.dirname(require.resolve('@fontsource/cormorant-garamond/package.json')), 'files');
const FONT_CACHE = {};
const cgFont = function (weight, style) {
  const k = weight + style;
  if (!FONT_CACHE[k]) FONT_CACHE[k] = fs.readFileSync(path.join(FONT_DIR, 'cormorant-garamond-latin-' + weight + '-' + style + '.woff'));
  return FONT_CACHE[k];
};

const GREEN = rgb(0.067, 0.165, 0.129);
const GOLD = rgb(0.80, 0.66, 0.42);
const GOLD_DK = rgb(0.54, 0.41, 0.17);
const INK = rgb(0.10, 0.10, 0.10);
const GREY = rgb(0.45, 0.45, 0.45);
const LINE = rgb(0.90, 0.84, 0.72);
const CREAM = rgb(0.945, 0.90, 0.815);

const W = 595.28, H = 841.89, MX = 48;

async function buildQuotePdf(q) {
  const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifI = await pdf.embedFont(StandardFonts.TimesRomanItalic);
    const cg = await pdf.embedFont(cgFont(700, 'normal'), { subset: true });    // header: title + address
  const cgI = await pdf.embedFont(cgFont(700, 'italic'), { subset: true });   // header: tagline
  const cgI5 = await pdf.embedFont(cgFont(600, 'italic'), { subset: true });  // header: owner + small line
  let logo = null;
 try { logo = await pdf.embedPng(LOGO_BYTES); } catch (e) { console.log('PDF logo missing:', LOGO); }

  // ---- language: English (default), Telugu or Hindi. Text of any of them can be mixed in one line. ----
  let lang = ['te', 'hi'].indexOf(q.lang) >= 0 ? q.lang : 'en';
  const I18N = lang === 'en' ? null : loadI18n();
  const tr = function (t) { return lang === 'en' || !I18N ? t : I18N.tr(t, lang); };
  const indic = {};                                   // { te: {r, b, set}, hi: {...} }
  if (lang !== 'en') {
        for (const sc of [lang]) {
      const r = indicFile(sc, false), bd = indicFile(sc, true) || r;
      if (!r) continue;
                const modes = INDIC_MODE[sc] !== undefined ? [INDIC_MODE[sc]] : [sc === 'te' ? { abvm: false } : null, { abvm: false }, { mark: false, mkmk: false, abvm: false, blwm: false, dist: false }];
      for (const mode of modes) {
        try {
          const opt = mode ? { subset: true, features: mode } : { subset: true };
          const fr = await pdf.embedFont(r, opt), fb = bd === r ? fr : await pdf.embedFont(bd, opt);
          if (INDIC_MODE[sc] === undefined) {          // first time: make sure the font can draw every word we have
            (loadI18n().all(sc) || []).forEach(function (w) { fr.widthOfTextAtSize(w, 10); fb.widthOfTextAtSize(w, 10); });
            INDIC_MODE[sc] = mode;
            if (mode) console.log('PDF ' + sc + ' font: using simpler mark positioning (the font failed the full test).');
          }
          indic[sc] = { r: fr, b: fb, setR: new Set(fr.getCharacterSet()), setB: new Set(fb.getCharacterSet()) };
          break;
        } catch (e) { console.log('PDF ' + sc + ' font problem' + (mode ? '' : ' (will retry simpler)') + ':', e.message); }
      }
    }
    if (!indic[lang]) { console.log('PDF: no ' + lang + ' font found or usable (npm install @fontsource/noto-sans-telugu @fontsource/noto-sans-devanagari). Using English.'); lang = 'en'; }
  }
  const okChars = new Set(sans.getCharacterSet());
  const clean = function (s) { return String(s == null ? '' : s).replace(/[\r\n\t]+/g, ' ').trim(); };
  const scriptOf = function (cp) { return cp >= 0x0C00 && cp <= 0x0C7F ? 'te' : cp >= 0x0900 && cp <= 0x097F ? 'hi' : null; };
  function fontFor(ch, bold, prev) {                  // which font draws this character (null = it cannot be drawn)
    const cp = ch.codePointAt(0), sc = scriptOf(cp);
    if (cp === 0x200C || cp === 0x200D) return prev && prev !== sans && prev !== sansB ? prev : null;
    if (sc) return indic[sc] ? (bold ? indic[sc].b : indic[sc].r) : null;
    if (ch === ' ') return prev || (bold ? sansB : sans);
    if (okChars.has(cp)) return bold ? sansB : sans;
    for (const k of Object.keys(indic)) { if ((bold ? indic[k].setB : indic[k].setR).has(cp)) return bold ? indic[k].b : indic[k].r; }
    return null;
  }
  function runs(text, bold) {
    const out = []; let prev = null;
    for (const ch of String(text)) {
      const f = fontFor(ch, bold, prev); if (!f) continue;
      if (out.length && out[out.length - 1].font === f) out[out.length - 1].text += ch; else out.push({ font: f, text: ch });
      prev = f;
    }
    return out;
  }
  const widthOf = function (text, size, bold) { return runs(text, bold).reduce(function (w, r) { return w + r.font.widthOfTextAtSize(r.text, size); }, 0); };
  const mx = { widthOfTextAtSize: function (t, s) { return widthOf(t, s, false); } };    // body text fonts (English + Telugu + Hindi together)
  const mxB = { widthOfTextAtSize: function (t, s) { return widthOf(t, s, true); } };
  const up = function (t) { return lang === 'en' ? String(t).toUpperCase() : t; };      // capitals only make sense in English
  function dt(text, o) {                              // draw text: translated, and each piece in the right font
    if (o.font !== mx && o.font !== mxB) return page.drawText(text, o);
    const bold = o.font === mxB; let x = o.x;
    runs(tr(text), bold).forEach(function (r) {
      page.drawText(r.text, Object.assign({}, o, { x: x, font: r.font }));
      x += r.font.widthOfTextAtSize(r.text, o.size);
    });
  }

  let page, y;
  function watermark() {
    if (!logo) return;
    const s = 330;
    page.drawImage(logo, { x: (W - s) / 2, y: (H - s) / 2 - 20, width: s, height: s, opacity: 0.07 });
  }
  function newPage() { page = pdf.addPage([W, H]); watermark(); y = H - 56; }

  function spaced(text, font, size, x, yy, gap, color) {
    let cx = x;
    for (const ch of text) { page.drawText(ch, { x: cx, y: yy, size: size, font: font, color: color }); cx += font.widthOfTextAtSize(ch, size) + gap; }
  }
  function spacedWidth(text, font, size, gap) {
    let w = 0; for (const ch of text) w += font.widthOfTextAtSize(ch, size) + gap; return w - gap;
  }
  function wrap(text, font, size, maxW) {
    const words = tr(clean(text)).split(' '), lines = []; let cur = '';
    words.forEach(function (w) {
      const t = cur ? cur + ' ' + w : w;
      if (font.widthOfTextAtSize(t, size) <= maxW) cur = t; else { if (cur) lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }

  // ---------- header band (first page): same look as the order PDF ----------
  newPage();
  const bandY = H - 164;
  page.drawRectangle({ x: 0, y: bandY, width: W, height: 164, color: rgb(0.059, 0.149, 0.122) });
  page.drawRectangle({ x: 16.5, y: H - 150.5, width: W - 33, height: 137, borderColor: GOLD, borderWidth: 1 });

  // logo: white circle, the logo is cut to the circle (always shown, it is part of the header)
  const lcx = 77.76, lcy = H - 80.64, lr = 43.92;
  page.drawCircle({ x: lcx, y: lcy, size: lr, color: rgb(1, 1, 1) });
  if (logo) {
    const k = 0.5522847498 * lr;
    page.pushOperators(
      pushGraphicsState(), moveTo(lcx + lr, lcy),
      appendBezierCurve(lcx + lr, lcy + k, lcx + k, lcy + lr, lcx, lcy + lr),
      appendBezierCurve(lcx - k, lcy + lr, lcx - lr, lcy + k, lcx - lr, lcy),
      appendBezierCurve(lcx - lr, lcy - k, lcx - k, lcy - lr, lcx, lcy - lr),
      appendBezierCurve(lcx + k, lcy - lr, lcx + lr, lcy - k, lcx + lr, lcy),
      closePath(), clip(), endPath()
    );
    const ls = lr * 2 * 1.04;   // logo a little larger than the circle, like the order PDF
    page.drawImage(logo, { x: lcx - ls / 2, y: lcy - ls / 2, width: ls, height: ls });
    page.pushOperators(popGraphicsState());
  }

  // text: sizes and widths measured from the order PDF header. EDIT HERE to nudge anything.
  const HGOLD = rgb(0.91, 0.76, 0.48);
  const fontOf = function (ch, font) { return ch === '&' ? cg : font; };   // the "&" is a plain one
  const gapFor = function (text, font, size, targetW) {
    let nat = 0, n = 0; for (const ch of text) { nat += fontOf(ch, font).widthOfTextAtSize(ch, size); n++; }
    return n > 1 ? (targetW - nat) / (n - 1) : 0;
  };
  const put = function (text, font, size, x, base, targetW, color) {      // left edge x, baseline from top
    const g = gapFor(text, font, size, targetW); let cx = x;
    for (const ch of text) {
      const f = fontOf(ch, font);
      page.drawText(ch, { x: cx, y: H - base, size: size, font: f, color: color });
      cx += f.widthOfTextAtSize(ch, size) + g;
    }
  };
  put(BIZ.owner.toUpperCase(), cgI5, 12, 137.9, 36.6, 113.8, HGOLD);
  const phones = BIZ.phones.replace(' | ', '  |  ');
  page.drawText(phones, { x: 416.4, y: H - 35.7, size: 148.3 / sansB.widthOfTextAtSize(phones, 1), font: sansB, color: CREAM });

  // big name: letters fade cream -> gold -> cream, like the order PDF
  const NAME_SIZE = 39.2, NAME_X = 136.8, NAME_W = 423.8, nameGap = gapFor(BIZ.name, cg, NAME_SIZE, NAME_W);
  let nx = NAME_X;
  for (const ch of BIZ.name) {
    const cw = cg.widthOfTextAtSize(ch, NAME_SIZE), t = Math.sin(Math.PI * Math.min(1, Math.max(0, (nx - NAME_X + cw / 2) / NAME_W)));
    page.drawText(ch, { x: nx, y: H - 74, size: NAME_SIZE, font: cg, color: rgb(0.98 - 0.07 * t, 0.92 - 0.17 * t, 0.78 - 0.34 * t) });
    nx += cw + nameGap;
  }
  put(BIZ.sub, cgI5, 14, 224, 92, 253, HGOLD);
  put(BIZ.tagline, cgI, 21.8, 178.2, 113.8, 343.5, HGOLD);
  put(BIZ.address, cg, 17, 153.4, 135.4, 393.8, CREAM);
  y = bandY - 36;

  // ---------- title ----------
  dt('QUOTATION REQUEST', { x: MX, y: y, size: 17, font: mxB, color: GREEN });
  const when = tr('Requested on:') + ' ' + new Date(q.createdAt || Date.now()).toISOString().slice(0, 10);
  dt(when, { x: W - MX - mx.widthOfTextAtSize(when, 8.5), y: y + 3, size: 8.5, font: mx, color: GREY });
  y -= 30;

  // ---------- helpers for sections ----------
    function need(h) { if (y - h < 44) newPage(); }
  function section(title) {
    need(60);
    dt(clean(title), { x: MX, y: y, size: 10, font: mxB, color: GOLD_DK });
    y -= 6;
    page.drawLine({ start: { x: MX, y: y }, end: { x: W - MX, y: y }, thickness: 0.6, color: LINE });
    y -= 18;
  }
  const VX = MX + 122;
    function row(label, value, bold) {
    const lblSize = bold ? 9 : 10.5, lblFont = bold ? mxB : mx;
    const vx = Math.max(VX, MX + lblFont.widthOfTextAtSize(tr(clean(label)), lblSize) + 14);
    const lines = wrap(value, bold ? mxB : mx, 10.5, W - MX - vx);
    need(lines.length * 14 + 8);
    dt(clean(label), { x: MX, y: y, size: lblSize, font: lblFont, color: bold ? GOLD_DK : GREY });
    lines.forEach(function (l, i) { dt(l, { x: vx, y: y - i * 14, size: 10.5, font: mx, color: INK }); });
    y -= lines.length * 14 + 8;
  }

  // ---------- two-column helpers (these keep the page short and tidy) ----------
  const COLW = (W - 2 * MX - 28) / 2;              // width of one column
  function colH(list, w) {                         // height a list of label/value pairs will take
    let h = 0;
    list.forEach(function (f) { h += 12 + wrap(f[1], mx, 10.5, w).length * 13 + 8; });
    return h;
  }
  function colFields(list, x, w, yy) {             // small grey label, value under it; returns the new y
    list.forEach(function (f) {
      dt(up(clean(f[0])), { x: x, y: yy, size: 7.5, font: mxB, color: GREY });
      const lines = wrap(f[1], mx, 10.5, w);
      lines.forEach(function (l, i) { dt(l, { x: x, y: yy - 12 - i * 13, size: 10.5, font: mx, color: INK }); });
      yy -= 12 + lines.length * 13 + 8;
    });
    return yy;
  }
  function colTitle(title, x, w) {
    dt(clean(title), { x: x, y: y, size: 10, font: mxB, color: GOLD_DK });
    page.drawLine({ start: { x: x, y: y - 6 }, end: { x: x + w, y: y - 6 }, thickness: 0.6, color: LINE });
  }
  function twoCols(titleL, listL, titleR, listR) {  // two titled boxes side by side (CUSTOMER | EVENT)
    const RX = MX + COLW + 28;
    need(30 + Math.max(colH(listL, COLW), colH(listR, COLW)));
    colTitle(titleL, MX, COLW); colTitle(titleR, RX, COLW);
    const eL = colFields(listL, MX, COLW, y - 22), eR = colFields(listR, RX, COLW, y - 22);
    y = Math.min(eL, eR) - 6;
  }
  function grid(list) {                             // fields in pairs, two per line
    const RX = MX + COLW + 28;
    for (let i = 0; i < list.length; i += 2) {
      const a = [list[i]], b = list[i + 1] ? [list[i + 1]] : [];
      const h = Math.max(colH(a, COLW), b.length ? colH(b, COLW) : 0);
      need(h + 4);
      colFields(a, MX, COLW, y); if (b.length) colFields(b, RX, COLW, y);
      y -= h;
    }
  }

  // ---------- customer + event, side by side ----------
  const mealList = q.meals || [];
  const times = mealList.filter(function (m) { return m.time; }).map(function (m) {
    return mealList.length > 1 ? (m.label || m.meal) + ' ' + m.time : m.time;
  });
  const custList = [['Customer name', q.name || '-'], ['Phone', q.phone || '-']];
  if (q.email) custList.push(['Email', q.email]);
  if (q.address) custList.push(['Address', q.address]);
  const evList = [['Event type', q.eventType || '-'], ['Event date', q.date || '-']];
  if (times.length) evList.push(['Event time', times.join(', ')]);
  twoCols('CUSTOMER', custList, 'EVENT', evList);
  y -= 8;

  // ---------- the menu: each meal = green heading bar, dishes on the left, plate picture on the right ----------
  for (const m of mealList) {
    const head = up(tr(m.label || m.meal || 'Meal')) +
      (m.time ? '   |   ' + m.time : '') + (m.guests ? '   |   ' + m.guests + ' guests' : '');
    const order = [], groups = {};
    (m.dishes || []).forEach(function (d) {
      const c = d.cat || 'Dishes';
      if (!groups[c]) { groups[c] = []; order.push(c); }
      groups[c].push(tr(d.en));
    });

    // plate picture (if any): size it first so we know how tall this block will be
    let pic = null, pw = 0, ph = 0, panelH = 0;
    const PANEL_W = 205;
    if (typeof m.plate === 'string' && m.plate.indexOf('data:image/png;base64,') === 0 && m.plate.length < 4000000) {
      try {
        pic = await pdf.embedPng(Buffer.from(m.plate.split(',')[1], 'base64'));
        const k = Math.min((PANEL_W - 20) / pic.width, 190 / pic.height, 1.4);
        pw = pic.width * k; ph = pic.height * k; panelH = ph + 20;
      } catch (e) { pic = null; console.log('Plate picture skipped:', e.message); }
    }
    const LBL = lang === 'en' ? 104 : 132, leftW = W - 2 * MX - (pic ? PANEL_W + 14 : 0), DW = leftW - LBL - 6;
    const rows = order.map(function (c) { return { c: c, lines: wrap(groups[c].join(', '), mx, 10, DW) }; });
    const leftH = rows.reduce(function (s, r) { return s + r.lines.length * 13 + 8; }, 0);
    const bodyH = Math.max(leftH, panelH);

    need(22 + 12 + bodyH + 14);                       // heading bar + dishes + picture stay together, but the block is short now
    page.drawRectangle({ x: MX, y: y - 15, width: W - 2 * MX, height: 22, color: GREEN });
    dt(clean(head), { x: MX + 10, y: y - 8, size: 9.5, font: mxB, color: HGOLD });
    let ry = y - 15 - 18;
    rows.forEach(function (r) {
      dt(clean(r.c), { x: MX + 4, y: ry, size: 8.5, font: mxB, color: GOLD_DK });
      r.lines.forEach(function (l, i) { dt(l, { x: MX + 4 + LBL, y: ry - i * 13, size: 10, font: mx, color: INK }); });
      ry -= r.lines.length * 13 + 8;
      page.drawLine({ start: { x: MX + 4, y: ry + 9 }, end: { x: MX + leftW - 8, y: ry + 9 }, thickness: 0.4, color: LINE });
    });
    if (pic) {
      const px = W - MX - PANEL_W, top = y - 15 - 8;
      page.drawRectangle({ x: px, y: top - panelH, width: PANEL_W, height: panelH, color: GREEN, borderColor: GOLD, borderWidth: 0.8 });
      page.drawImage(pic, { x: px + (PANEL_W - pw) / 2, y: top - panelH + 10, width: pw, height: ph });
    }
    y = y - 15 - 12 - bodyH - 14;
  }

  // ---------- service and preferences (after the menu) ----------
  section('SERVICE DETAILS');
  const svc = [];
  svc.push(['Service boys', +q.staff > 0 ? String(+q.staff) : 'Please suggest']);
  svc.push(['Spice level', q.spice || '-']);
  svc.push(['Pickup / delivery', q.fulfil || '-']);
  svc.push(['Serving style', q.style || '-']);
  const extras = (q.extras || []).map(function (e) {
    return e === 'Live counter' && (q.live || []).length ? tr('Live counter') + ' (' + q.live.map(tr).join(', ') + ')' : tr(e);
  });
  if (extras.length) svc.push(['Extras', extras.join(', ')]);
  if (q.notes) svc.push(['Special requests', q.notes]);
    grid(svc);
  row('Note', 'Service boys are charged extra. The amount will be confirmed in your final quotation.');
  y -= 8;
  

  // ---------- PRICE ----------
  const price = priceInfo(q);
  if (price.items.length) {
    section('PRICE');
    price.items.forEach(function (it) {
      if (it.kind === 'standard') row(it.meal + ' - Standard Menu', standardText(it), true);
      else row(it.meal + ' - All Events Menu', 'Price to be finalised with ' + OWNER_NAME, true);
    });

    {                                                           // the TOTAL box 
      need(46);
      const boxH = 30;
      page.drawRectangle({ x: MX, y: y - boxH + 10, width: W - 2 * MX, height: boxH, color: CREAM, borderColor: GOLD, borderWidth: 0.8 });
      const label = price.total > 0 && price.hasAll ? 'TOTAL (STANDARD MENU MEALS ONLY)' : 'TOTAL';
      dt(label, { x: MX + 12, y: y - 8, size: 10, font: mxB, color: GOLD_DK });
      const amt = inr(price.total);
      dt(amt, { x: W - MX - 12 - mxB.widthOfTextAtSize(amt, 14), y: y - 10, size: 14, font: mxB, color: GREEN });
      y -= boxH + 12;
    }
    if (price.hasStd) row('Note', 'The Standard Menu rate may vary in some seasons or due to inflation.');
    if (price.hasAll) {
      row('Note', 'For the All Events Menu, ' + OWNER_NAME + ' will review your selection and contact you to discuss and finalise the price.');
    }
  }

  return Buffer.from(await pdf.save());
}

module.exports = { buildQuotePdf };
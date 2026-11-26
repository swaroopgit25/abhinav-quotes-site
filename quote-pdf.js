// Builds the customer's quotation PDF (same look as the order PDF: green header, gold section titles).
// Used for the instant download AND the email attachment, so both are always identical.
const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb, pushGraphicsState, popGraphicsState, moveTo, appendBezierCurve, closePath, clip, endPath } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const { priceInfo, standardText, inr, OWNER_NAME } = require('./pricing');

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

  // standard PDF fonts only know Western characters; drop anything else instead of crashing
  const okChars = new Set(sans.getCharacterSet());
  const clean = function (s) {
    return String(s == null ? '' : s).replace(/[\r\n\t]+/g, ' ')
      .split('').filter(function (c) { return okChars.has(c.codePointAt(0)); }).join('').trim();
  };

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
    const words = clean(text).split(' '), lines = []; let cur = '';
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
  page.drawText('QUOTATION REQUEST', { x: MX, y: y, size: 17, font: sansB, color: GREEN });
  const when = 'Requested on: ' + new Date(q.createdAt || Date.now()).toISOString().slice(0, 10);
  page.drawText(when, { x: W - MX - sans.widthOfTextAtSize(when, 8.5), y: y + 3, size: 8.5, font: sans, color: GREY });
  y -= 30;

  // ---------- helpers for sections ----------
    function need(h) { if (y - h < 44) newPage(); }
  function section(title) {
    need(60);
    page.drawText(clean(title), { x: MX, y: y, size: 10, font: sansB, color: GOLD_DK });
    y -= 6;
    page.drawLine({ start: { x: MX, y: y }, end: { x: W - MX, y: y }, thickness: 0.6, color: LINE });
    y -= 18;
  }
  const VX = MX + 122;
  function row(label, value, bold) {
    const lines = wrap(value, bold ? sansB : sans, 10.5, W - MX - VX);
    need(lines.length * 14 + 8);
    page.drawText(clean(label), { x: MX, y: y, size: bold ? 9 : 10.5, font: bold ? sansB : sans, color: bold ? GOLD_DK : GREY });
    lines.forEach(function (l, i) { page.drawText(l, { x: VX, y: y - i * 14, size: 10.5, font: sans, color: INK }); });
    y -= lines.length * 14 + 8;
  }

     // ---------- two-column helpers (these keep the page short and tidy) ----------
  const COLW = (W - 2 * MX - 28) / 2;              // width of one column
  function colH(list, w) {                         // height a list of label/value pairs will take
    let h = 0;
    list.forEach(function (f) { h += 12 + wrap(f[1], sans, 10.5, w).length * 13 + 8; });
    return h;
  }
  function colFields(list, x, w, yy) {             // small grey label, value under it; returns the new y
    list.forEach(function (f) {
      page.drawText(clean(f[0]).toUpperCase(), { x: x, y: yy, size: 7.5, font: sansB, color: GREY });
      const lines = wrap(f[1], sans, 10.5, w);
      lines.forEach(function (l, i) { page.drawText(l, { x: x, y: yy - 12 - i * 13, size: 10.5, font: sans, color: INK }); });
      yy -= 12 + lines.length * 13 + 8;
    });
    return yy;
  }
  function colTitle(title, x, w) {
    page.drawText(clean(title), { x: x, y: y, size: 10, font: sansB, color: GOLD_DK });
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
        const head = (m.label || m.meal || 'Meal').toUpperCase() +
      (m.time ? '   |   ' + m.time : '') + (m.guests ? '   |   ' + m.guests + ' guests' : '');
    const order = [], groups = {};
    (m.dishes || []).forEach(function (d) {
      const c = d.cat || 'Dishes';
      if (!groups[c]) { groups[c] = []; order.push(c); }
      groups[c].push(d.en);
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
    const LBL = 104, leftW = W - 2 * MX - (pic ? PANEL_W + 14 : 0), DW = leftW - LBL - 6;
    const rows = order.map(function (c) { return { c: c, lines: wrap(groups[c].join(', '), sans, 10, DW) }; });
    const leftH = rows.reduce(function (s, r) { return s + r.lines.length * 13 + 8; }, 0);
    const bodyH = Math.max(leftH, panelH);

    need(22 + 12 + bodyH + 14);                       // heading bar + dishes + picture stay together, but the block is short now
    page.drawRectangle({ x: MX, y: y - 15, width: W - 2 * MX, height: 22, color: GREEN });
    page.drawText(clean(head), { x: MX + 10, y: y - 8, size: 9.5, font: sansB, color: HGOLD });
    let ry = y - 15 - 18;
    rows.forEach(function (r) {
      page.drawText(clean(r.c), { x: MX + 4, y: ry, size: 8.5, font: sansB, color: GOLD_DK });
      r.lines.forEach(function (l, i) { page.drawText(l, { x: MX + 4 + LBL, y: ry - i * 13, size: 10, font: sans, color: INK }); });
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
    return e === 'Live counter' && (q.live || []).length ? 'Live counter (' + q.live.join(', ') + ')' : e;
  });
  if (extras.length) svc.push(['Extras', extras.join(', ')]);
  if (q.notes) svc.push(['Special requests', q.notes]);
  grid(svc);
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
      page.drawText(label, { x: MX + 12, y: y - 8, size: 10, font: sansB, color: GOLD_DK });
      const amt = inr(price.total);
      page.drawText(amt, { x: W - MX - 12 - sansB.widthOfTextAtSize(amt, 14), y: y - 10, size: 14, font: sansB, color: GREEN });
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
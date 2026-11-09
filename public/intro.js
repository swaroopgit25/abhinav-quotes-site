/* =========================================================
   Abhinav Caterers - cinematic opening
   glowing dot -> "!" -> ABHINAV -> CATERERS -> dust that
   assembles into the banana-leaf meal -> real photo fades in
========================================================= */
(function () {
  'use strict';
  window.__cinAlive = true;

  var root = document.documentElement;
  var hero = document.getElementById('cinema');
  var landing = document.getElementById('landing');
  var nav = document.querySelector('.nav');

  /* ---- nav goes see-through while the hero is at the top ---- */
  function updateAtop() {
    var on = !!hero && landing && !landing.hidden && window.scrollY < 30;
    root.classList.toggle('cin-atop', on);
  }
  window.addEventListener('scroll', updateAtop, { passive: true });
  if (landing && 'MutationObserver' in window) {
    new MutationObserver(updateAtop).observe(landing, { attributes: true, attributeFilter: ['hidden'] });
  }
  updateAtop();

  if (!hero) { root.classList.add('cin-done'); root.classList.remove('cin-lock'); return; }

  var animate = root.classList.contains('cin-js');   // false when the visitor prefers reduced motion
  if (!animate) return;                              // page just shows its final state
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo(0, 0);

  var canvas = document.getElementById('cin-canvas');
  var ctx = canvas.getContext('2d');
  var leaf = document.getElementById('cin-leaf');
  var title = document.getElementById('cin-title');
  var word = document.getElementById('cin-word');
  var word2 = document.getElementById('cin-word2');   // ABHINAV, sits on top of CATERERS
  var bang = document.getElementById('cin-bang');
  var glow = hero.querySelector('.cin-glow');
  var skipBtn = hero.querySelector('.cin-skip');

  var isMobile = Math.min(window.innerWidth, window.innerHeight) < 640 || /Mobi|Android/i.test(navigator.userAgent);
  var finePointer = !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);

    var DUST_IN = 3.2, A_START = 3.9, FADE_START = 5.0, FADE_END = 6.0, END_AT = 6.2;

  var W = 1, H = 1, dpr = 1;
  var t = 0, last = 0, raf = 0, started = false, visible = true, done = false;
  var cues = [], cueIdx = 0;
  var slots = [], slots2 = [], cur = '', scr = [];
  var P = null;                       // main particle set (the food)
  var motes = [], moteOn = false, moteA = 0;
  var pointer = { x: -999, y: -999, on: false };
  var par = { x: 0, y: 0, r: 0 };     // eased parallax values

  /* ------------------------------------------------------- sizing */
  function size() {
    var r = hero.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
       dpr = 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hero.style.setProperty('--nav-h', (nav ? nav.offsetHeight : 100) + 'px');
  }

  function initMotes() {
    var n = isMobile ? 58 : 70;
    motes = [];
    for (var i = 0; i < n; i++) {
      motes.push({
        x: Math.random() * W, y: Math.random() * H,
        r: (isMobile ? 0.9 : 0.6) + Math.random() * (isMobile ? 1.9 : 1.5),
        vy: 6 + Math.random() * 16,
        ph: Math.random() * 6.28, tw: 0.8 + Math.random() * 1.6
      });
    }
  }

  /* --------------------------------------------------- the word */
  var TILTS = [-16, 11, -9, 0, 13, -12, 8, -10];
    function glyph(c) { return c === ' ' ? '\u00A0' : c; }   // keeps the space in "V. JAGADEESWARI"
  function makeLetter(ch, i, visibleNow) {
    var s = document.createElement('span');
    s.className = 'L' + (visibleNow ? ' in' : '');
        s.textContent = glyph(ch);
    s.style.setProperty('--r', TILTS[i % TILTS.length] + 'deg');
    return s;
  }
  function buildWord(str, visibleNow) {
    word.textContent = '';
    slots = [];
    cur = str;
    for (var i = 0; i < str.length; i++) {
      var s = makeLetter(str.charAt(i), i, visibleNow);
      word.appendChild(s);
      slots.push(s);
    }
  }
  function buildTop(visibleNow) {
    word2.textContent = '';
    slots2 = [];
    var str = 'ABHINAV';
    for (var i = 0; i < str.length; i++) {
      var s = makeLetter(str.charAt(i), i, visibleNow);
      word2.appendChild(s);
      slots2.push(s);
    }
  }
  function showTop(i) { if (slots2[i]) slots2[i].classList.add('in'); }
  function showSlot(i) { if (slots[i]) slots[i].classList.add('in'); }

  function placeBang() {
    var hr = hero.getBoundingClientRect();
    var sr = slots[3].getBoundingClientRect();
    var fs = parseFloat(getComputedStyle(word).fontSize) || 100;
    var bw = Math.max(7, fs * 0.085);
    var capH = fs * 0.64;
    bang.style.setProperty('--bw', bw + 'px');
    bang.style.setProperty('--bh', Math.max(20, capH - bw * 1.6) + 'px');
    bang.style.left = (sr.left - hr.left + sr.width / 2) + 'px';
    bang.style.top = (sr.top - hr.top + sr.height / 2 + fs * 0.02) + 'px';
  }

    function fitWord() {                      // shrink long words (JAGADEESWARI) to fit the screen
    word.style.fontSize = '';
    var max = W * 0.92;
    var w = word.getBoundingClientRect().width;
    if (w > max) {
      var fs = parseFloat(getComputedStyle(word).fontSize) || 100;
      word.style.fontSize = (fs * max / w) + 'px';
    }
  }

  var SCR_CHARS = 'ABCDEFGHKLMNPRSTUVWXYZ';
  function startMorph(to) {

    var from = cur;
    word.textContent = '';
    slots = [];
    for (var i = 0; i < to.length; i++) {
      var vis = i < from.length;
      var s = makeLetter(vis ? from.charAt(i) : to.charAt(i), i, vis);
      word.appendChild(s);
      slots.push(s);
    }
       cur = to;
    fitWord();
    scr = [];
    for (var j = 0; j < to.length; j++) {
            var plain = (to.charAt(j) === ' ' || to.charAt(j) === '.');   // space and dot don't scramble
      scr.push({ i: j, el: slots[j], ch: to.charAt(j), start: t + j * 0.04, end: plain ? t + j * 0.04 : t + 0.26 + j * 0.04 + (j % 3) * 0.03, next: 0, fin: false });
    
    }
  }
    function setLetter(s, text) {             // swap in a fresh span, so the browser always repaints it
    var old = s.el, n = old.cloneNode(false);
    n.textContent = text;
    if (old.parentNode) old.parentNode.replaceChild(n, old);
    s.el = n;
    slots[s.i] = n;
  }
  function tickMorph() {
    for (var i = 0; i < scr.length; i++) {
      var s = scr[i];
      if (s.fin || t < s.start) continue;
      s.el.classList.add('in');
            if (t >= s.end) { setLetter(s, glyph(s.ch)); s.fin = true; continue; }
      if (t >= s.next) {
        setLetter(s, SCR_CHARS.charAt((Math.random() * SCR_CHARS.length) | 0));
        s.next = t + 0.055;
      }{
        s.el.textContent = SCR_CHARS.charAt((Math.random() * SCR_CHARS.length) | 0);
        s.next = t + 0.055;
      }
    }
  }

  /* ----------------------------- particles that become the food */
  function leafAngle() {                          // must match the CSS rotation of .cin-leaf
    return (window.matchMedia && window.matchMedia('(min-width: 641px)').matches) ? -90 : 0;
  }
  function buildParticles() {
    if (P || !leaf.naturalWidth) return;
    var hr = hero.getBoundingClientRect(), lr = leaf.getBoundingClientRect();
    var rx = lr.left - hr.left, ry = lr.top - hr.top, rw = lr.width, rh = lr.height;
    if (rw < 20 || rh < 20) return;

        var maxN = isMobile ? 2800 : 4500;
    var step = Math.max(3.4, Math.sqrt(rw * rh * 0.77 / maxN));
    var cols = Math.max(8, Math.floor(rw / step));
    var rows = Math.max(8, Math.floor(rh / step));
    var oc = document.createElement('canvas');
    oc.width = cols; oc.height = rows;
    var octx = oc.getContext('2d');
    var ang = leafAngle();
    if (ang) {                                   // leaf is shown rotated: sample it rotated too
      octx.translate(cols / 2, rows / 2);
      octx.rotate(ang * Math.PI / 180);
      octx.drawImage(leaf, -rows / 2, -cols / 2, rows, cols);
    } else {
      octx.drawImage(leaf, 0, 0, cols, rows);
    }
    var d;
    try { d = octx.getImageData(0, 0, cols, rows).data; } catch (e) { return; }

    var n = 0, i, j, k;
    for (k = 3; k < d.length; k += 4) if (d[k] > 120) n++;
    if (!n) return;

    var X = new Float32Array(n), Y = new Float32Array(n);
    var SX = new Float32Array(n), SY = new Float32Array(n);
    var TX = new Float32Array(n), TY = new Float32Array(n);
    var AX = new Float32Array(n), AY = new Float32Array(n);
    var DL = new Float32Array(n), DU = new Float32Array(n), PH = new Float32Array(n);
    var OX = new Float32Array(n), OY = new Float32Array(n);
    var colors = [], lists = [], map = {};
    var cx = W / 2, cy = H * 0.55;
    var cw = rw / cols, ch = rh / rows;
    var p = 0;

    for (j = 0; j < rows; j++) {
      for (i = 0; i < cols; i++) {
        var o = (j * cols + i) * 4;
        if (d[o + 3] <= 120) continue;
        var tx = rx + (i + 0.5) * cw, ty = ry + (j + 0.5) * ch;
        var sx = Math.max(-20, Math.min(W + 20, cx + (Math.random() - 0.5) * W * 1.15));
        var sy = Math.max(-20, Math.min(H + 20, cy + (Math.random() - 0.5) * H * 1.1));
        TX[p] = tx; TY[p] = ty; SX[p] = sx; SY[p] = sy; X[p] = sx; Y[p] = sy;
        var dx = tx - sx, dy = ty - sy, len = Math.sqrt(dx * dx + dy * dy) || 1;
        var amp = (Math.random() * 2 - 1) * Math.min(120, len * 0.35);
        AX[p] = (-dy / len) * amp; AY[p] = (dx / len) * amp;
        var dn = Math.sqrt(Math.pow((tx - cx) / (rw * 0.5), 2) + Math.pow((ty - cy) / (rh * 0.5), 2)) / 1.4;
        DL[p] = Math.min(1, dn) * 0.45 + Math.random() * 0.15;
        DU[p] = 0.8 + Math.random() * 0.4;
        PH[p] = Math.random() * 6.28;
               var key = ((d[o] >> 6) << 4) | ((d[o + 1] >> 6) << 2) | (d[o + 2] >> 6);
        var b = map[key];
        if (b === undefined) {
          b = colors.length; map[key] = b;
                    colors.push('rgb(' + (((d[o] >> 6) << 6) + 32) + ',' + (((d[o + 1] >> 6) << 6) + 32) + ',' + (((d[o + 2] >> 6) << 6) + 32) + ')');
          lists.push([]);
        }
        lists[b].push(p);
        p++;
      }
    }
    for (k = 0; k < lists.length; k++) lists[k] = Int32Array.from(lists[k]);
    P = { n: n, X: X, Y: Y, SX: SX, SY: SY, TX: TX, TY: TY, AX: AX, AY: AY, DL: DL, DU: DU, PH: PH, OX: OX, OY: OY, colors: colors, lists: lists, base: step * 0.85 };
  }

  function drawParticles() {
    if (!P) return;
    if (t > FADE_END) { P = null; return; }

    var a = 0;
    if (t >= DUST_IN) {
            a = Math.min(1, (t - DUST_IN) / 0.6) * 0.55 + Math.min(1, Math.max(0, (t - A_START) / 0.9)) * 0.45;
    }
    if (t > FADE_START) a *= Math.max(0, 1 - (t - FADE_START) / (FADE_END - FADE_START));
    if (a <= 0.003) return;

    var sf = 0.55 + 0.45 * Math.min(1, Math.max(0, (t - A_START) / 1.4));
    var sz = P.base * sf;
    var X = P.X, Y = P.Y, n = P.n, i;
    var pr = 78, pr2 = pr * pr;

    for (i = 0; i < n; i++) {
      var tt = t - A_START - P.DL[i];
      var x, y, settled = false;
      if (tt <= 0) {
        x = P.SX[i] + Math.sin(t * 0.7 + P.PH[i]) * 6;
        y = P.SY[i] + Math.cos(t * 0.6 + P.PH[i] * 1.3) * 6;
      } else {
        var pp = tt / P.DU[i];
        if (pp >= 1) { pp = 1; settled = true; }
        var e = 1 - Math.pow(1 - pp, 3);
        var sw = Math.sin(Math.PI * e);
        x = P.SX[i] + (P.TX[i] - P.SX[i]) * e + P.AX[i] * sw;
        y = P.SY[i] + (P.TY[i] - P.SY[i]) * e + P.AY[i] * sw;
      }
      if (settled && pointer.on) {
        var mx = x - pointer.x, my = y - pointer.y, dd = mx * mx + my * my;
        if (dd < pr2 && dd > 0.01) {
          var dist = Math.sqrt(dd), f = (1 - dist / pr) * 6;
          P.OX[i] += (mx / dist) * f; P.OY[i] += (my / dist) * f;
        }
      }
      P.OX[i] *= 0.9; P.OY[i] *= 0.9;
      X[i] = x + P.OX[i]; Y[i] = y + P.OY[i];
    }

    ctx.globalAlpha = Math.min(1, a);
    for (var b = 0; b < P.lists.length; b++) {
      var L = P.lists[b];
      ctx.fillStyle = P.colors[b];
      ctx.beginPath();
      for (var k = 0; k < L.length; k++) { var idx = L[k]; ctx.rect(X[idx], Y[idx], sz, sz); }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawMotes(dt) {
    if (!moteOn) return;
    moteA = Math.min(1, moteA + dt * 0.7);
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      m.y -= m.vy * dt;
      m.x += Math.sin(t * 0.5 + m.ph) * 6 * dt;
      if (m.y < -4) { m.y = H + 4; m.x = Math.random() * W; }
      var al = moteA * (0.25 + 0.6 * Math.abs(Math.sin(t * m.tw + m.ph)));
      ctx.fillStyle = 'rgba(238,208,150,' + al.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill();
    }
  }

  function updateParallax() {
    if (!finePointer || !leaf.classList.contains('show')) return;
    var tx = 0, ty = 0, tr = 0;
    if (pointer.on) {
      var nx = (pointer.x / W - 0.5), ny = (pointer.y / H - 0.5);
      tx = -nx * 16; ty = -ny * 12; tr = nx * 0.8;
    }
    par.x += (tx - par.x) * 0.06; par.y += (ty - par.y) * 0.06; par.r += (tr - par.r) * 0.06;
    leaf.style.setProperty('--px', par.x.toFixed(2) + 'px');
    leaf.style.setProperty('--py', par.y.toFixed(2) + 'px');
    leaf.style.setProperty('--pr', par.r.toFixed(3) + 'deg');
  }

  /* ----------------------------------------------------- the loop */
  function frame(now) {
    raf = requestAnimationFrame(frame);
        var dt = Math.min(0.25, Math.max(0, (now - last) / 1000));
    last = now;
    step(dt);
  }
  function step(dt) {
    t += dt;
    while (cueIdx < cues.length && cues[cueIdx][0] <= t) { var fn = cues[cueIdx][1]; cueIdx++; fn(); }
    if (scr.length) tickMorph();
    ctx.clearRect(0, 0, W, H);
    drawParticles();
    drawMotes(dt);
    updateParallax();
  }
  function resume() { if (raf || !started || !visible) return; last = performance.now(); raf = requestAnimationFrame(frame); }
  function pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  /* ----------------------------------------------- end / skip */
  function finish() {
    if (done) return;
    done = true;
    root.classList.add('cin-snap');
    if (cur !== 'CATERERS') buildWord('CATERERS', true);
    else for (var i = 0; i < slots.length; i++) { slots[i].textContent = 'CATERERS'.charAt(i); slots[i].classList.add('in'); }
    scr = [];
    buildTop(true);
    title.classList.add('docked');
    leaf.classList.add('show');
    glow.classList.add('on');
    bang.classList.remove('s1', 's2', 'tilt');
    P = null;
    moteOn = true;
    root.classList.add('cin-navin', 'cin-subin', 'cin-done');
        word.style.fontSize = '';
    root.classList.remove('cin-lock');
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('cin-snap'); }); });
  }

  /* -------------------------------------------------- start up */
  function start() {
if (started || done) return;
    started = true;
    size();
    initMotes();
    buildWord('ABHINAV', false);
    buildTop(false);
   

        cues = [
            [0.05, function () { glow.classList.add('on'); }],
      [0.2,  function () { bang.classList.add('s1'); }],
      [0.7,  function () { showSlot(0); }],
      [0.77, function () { showSlot(1); }],
      [0.84, function () { showSlot(2); }],
      [0.91, function () { showSlot(3); }],
      [0.98, function () { showSlot(4); }],
      [1.05, function () { showSlot(5); }],
      [1.12, function () { showSlot(6); }],
      [1.2,  buildParticles],
      [1.45, function () { bang.classList.remove('s1'); }],
      [1.65, function () { bang.classList.remove('s1'); showSlot(3); }],
      [1.72, function () { showSlot(4); }],
      [1.79, function () { showSlot(5); }],
      [1.86, function () { showSlot(6); }],
      [2.1,  function () { startMorph('V. JAGADEESWARI'); }],
      [3.6,  function () { startMorph('CATERERS'); }],
      [4.0,  function () { title.classList.add('docked'); }],
      [4.1,  function () { root.classList.add('cin-navin'); root.classList.remove('cin-lock'); }],
      [4.3,  function () { root.classList.add('cin-subin'); moteOn = true; }],
      [4.4,  function () { showTop(0); }],
      [4.46, function () { showTop(1); }],
      [4.52, function () { showTop(2); }],
      [4.58, function () { showTop(3); }],
      [4.64, function () { showTop(4); }],
      [4.7,  function () { showTop(5); }],
      [4.76, function () { showTop(6); }],
      [4.9,  function () { leaf.classList.add('show'); }],
      [END_AT, finish]
    ];
    cueIdx = 0; t = 0;
    resume();
  }

  /* ---------- events ---------- */
  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var r = hero.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.on = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { pointer.on = false; });

  if (skipBtn) skipBtn.addEventListener('click', finish);
  document.addEventListener('keydown', function (e) {
    if (!done && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); finish(); }
  });

  var rzTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(function () {
      if (!started) return;
      if (!done) finish();
      size(); initMotes();
    }, 150);
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) resume();
      else { pause(); if (!done) finish(); }   // hero off-screen: never leave the page locked
    }).observe(hero);
  }

  /* wait for the serif font and the food photo, but never longer than 2.5s */
  var fontsP = (document.fonts && document.fonts.load)
    ? Promise.all([document.fonts.load('700 100px "Cormorant Garamond"'), document.fonts.ready]).catch(function () {})
    : Promise.resolve();
  var leafP = new Promise(function (res) {
    if (leaf.complete && leaf.naturalWidth) return res();
    leaf.addEventListener('load', res); leaf.addEventListener('error', res);
  });
  var timeout = new Promise(function (res) { setTimeout(res, 2500); });
  Promise.race([Promise.all([fontsP, leafP]), timeout]).then(start);

  /* test hook (harmless in production) */
  window.__cin = { step: step, finish: finish, isDone: function () { return done; } };
})();
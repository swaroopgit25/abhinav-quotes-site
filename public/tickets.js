/* Ticket rail: a taste of the menu. Swipe on touch, drag with a mouse, arrows and keys everywhere. */
(function () {
  'use strict';
  var rail = document.getElementById('tk-rail');
  if (!rail) return;
  var MENU = window.MENU || [], TE = window.MENU_TE || {};
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = window.matchMedia ? matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)') : { matches: false };

    var MS = window.MenuSection || null;
  var mode = 'standard';   // 'standard' or 'all', the same two menus as the Menu section
  /* fallback if the menu section did not load */
  var ORDER = ['Sweets', 'Hot Snacks', 'Saree Items', 'Snacks', 'Roti', 'Rice', 'Biryani Rice',
    'North Indian Curries', 'South Indian Curries', 'South Indian Fry', 'South Indian Liquids',
    'Dal Items', 'Raitas', 'Chat Items', 'Soups', 'Pickles & Chutneys', 'Podulu', 'Tiffins',
    'Fruit Juices & Fruit Chat', 'Hot Drinks', 'Ice Creams', 'Special Items', 'Default Items'];
    /* photo for each category (files live in assets/taste/). A category with no photo simply shows no picture. */
var PHOTOS = {
  'Sweets': 'sweets.png',
  'Hot Snacks': 'hot-snacks.png', 
  'Rice': 'rice.png',
   'Biryani Rice': 'biryani.png',
  'South Indian Curries': 'south-curries.png', 
  'North Indian Curries': 'north-curries.png',
  'Dal Items': 'dal.png', 
  'South Indian Liquids': 'sambar.png',
   'Default Items': 'default.png',
  'Ice Creams': 'ice-cream.png',
   'Special Items': 'paan.png',
    'Hot Drinks': 'hot-drinks.png',
  'Fruit Juices': 'juices.png', 
  'Podulu': 'podulu.png', 
  'Pickles & Chutneys': 'pickles.png',
   'Saree Items': 'saree-items.png',
  'Snacks': 'snacks.png',
  'Roti': 'roti.png',
  'South Indian Fry': 'south-indian-fry.png',
'Raitas': 'raitas.png',
'Chat Items': 'chat-items.png',
'Tiffins': 'tiffins.png',
'Soups': 'soups.png'
};
  var FEATURED = [], tickets = [];
  var TILTS = [-1.6, 1.2, -0.6, 1.8, -1.2, 0.5, -1.9, 1.4, -0.8];

  /* cat = real category name, chip = its name in the menu, title = what the ticket says
     (standard menu tickets read like the order: "1- Sweet", "2- Hot") */
  function featuredFor(m) {
    var set = MS && MS.sets[m], cats = set ? set.cats : ORDER, out = [];
    cats.forEach(function (c) {
      var name = Array.isArray(c) ? c[0] : c, label = Array.isArray(c) ? c[1] : c;
      if (countOf(name) <= 0) return;
      var plan = set && set.plan && set.plan[name];
      out.push({ cat: name, chip: label, title: plan || label, plan: !!plan, menu: m });
    });
    return out;
  }

  function countOf(cat) {
    for (var i = 0; i < MENU.length; i++) if (MENU[i].category === cat) return MENU[i].items.length;
    return 0;
  }
    function sampleOf(cat) {
    for (var i = 0; i < MENU.length; i++) if (MENU[i].category === cat) return MENU[i].items.slice(0, 3).join(' · ');
    return '';
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

    /* ---- build the tickets ---- */
  function build() {
    FEATURED = featuredFor(mode);
    rail.innerHTML = '';
    tickets = FEATURED.map(function (f, i) {
      var li = el('li', 'tk');
      li.style.setProperty('--tilt', TILTS[i % TILTS.length] + 'deg');
      li.appendChild(el('span', 'tk-wire'));
      var card = el('article', 'tk-card');
      var n = countOf(f.cat);
      card.setAttribute('aria-label', f.cat + ', ' + n + ' dishes' + (f.plan ? '. Standard menu: ' + f.title : ''));
      card.appendChild(el('span', 'tk-clip'));
      var top = el('div', 'tk-top');
      top.appendChild(el('span', '', 'No. ' + pad(i + 1)));
      top.appendChild(el('span', '', 'Category'));
      card.appendChild(top);
      card.appendChild(el('hr', 'tk-rule'));
      card.appendChild(el('h3', 'tk-name', f.title));
      card.appendChild(el('p', 'tk-te', sampleOf(f.cat)));
      if (PHOTOS[f.cat]) {                      // the photo sits between the dish names and the footer
  var pic = el('img', 'tk-img');
 pic.src = './assets/' + PHOTOS[f.cat];
  pic.alt = '';                           // the ticket title already names it, so screen readers skip the photo
  pic.loading = 'lazy';                   // loads only when the ticket comes near the screen
  pic.draggable = false;                  // so dragging the rail never drags the picture
  card.appendChild(pic);
  li.classList.add('has-img');
}
      var foot = el('div', 'tk-foot');
      foot.appendChild(el('span', '', n ? n + ' dishes' : ''));
      var open = el('button', 'tk-open', 'Open taste');
      open.type = 'button';
      open.setAttribute('aria-label', 'Open ' + f.cat + ' in the menu');
      open.tabIndex = -1;
      open.addEventListener('click', function () { showTaste(f); });
      foot.appendChild(open);
      card.appendChild(foot);
      li.appendChild(card);
      card.addEventListener('click', function (e) {
        if (e.target.closest('.tk-open')) return;
        if (i === active) showTaste(f); else goTo(i);
      });
      rail.appendChild(li);
      return li;
    });
  }

  var active = 0;
  var status = document.getElementById('tk-status');
  var prev = document.getElementById('tk-prev');
  var next = document.getElementById('tk-next');
  var wrap = document.getElementById('tk-wrap');

  function setActive(i) {
    if (i === active && tickets[i].classList.contains('active')) return;
    active = i;
    tickets.forEach(function (li, k) {
      var on = k === i;
      li.classList.toggle('active', on);
      var card = li.querySelector('.tk-card'), btn = li.querySelector('.tk-open');
      if (on) card.setAttribute('aria-current', 'true'); else card.removeAttribute('aria-current');
      btn.tabIndex = on ? 0 : -1;
    });
    if (status) status.textContent = 'Taste ' + (i + 1) + ' of ' + tickets.length + ': ' + FEATURED[i].title;
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === tickets.length - 1;
  }

  function stopX(i) {   // scroll position that centres ticket i, kept inside what the rail can really scroll
    var li = tickets[i], max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    return Math.max(0, Math.min(max, li.offsetLeft + li.offsetWidth / 2 - rail.clientWidth / 2));
  }
  function nearestTo(x) {   // x is a scrollLeft value
    var best = 0, bd = Infinity;
    for (var i = 0; i < tickets.length; i++) { var d = Math.abs(stopX(i) - x); if (d < bd) { bd = d; best = i; } }
    return best;
  }
  var pending = null, pendTimer = 0;   // while we move the rail ourselves, scroll events must not pick another ticket
  function lockTo(i, ms) { pending = i; clearTimeout(pendTimer); if (ms) pendTimer = setTimeout(function () { pending = null; }, ms); }
  function unlock() { pending = null; clearTimeout(pendTimer); }
  function goTo(i, focusIt) {
    i = Math.max(0, Math.min(tickets.length - 1, i));
    setActive(i);
    lockTo(i, 600);
    stopSpring();
    if (reduce) rail.scrollLeft = stopX(i); else rail.scrollTo({ left: stopX(i), behavior: 'smooth' });
    if (focusIt) tickets[i].querySelector('.tk-open').focus({ preventScroll: true });
  }

  /* ---- scroll (touch swipe, trackpad, keys) decides the active ticket ---- */
  var raf = 0;
  rail.addEventListener('scroll', function () {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      var x = rail.scrollLeft, max = rail.scrollWidth - rail.clientWidth;
      if (pending !== null) { clearTimeout(pendTimer); pendTimer = setTimeout(unlock, 200); return; }   // stay locked until the scrolling has settled
      setActive(x <= 1 ? 0 : (x >= max - 1 ? tickets.length - 1 : nearestTo(x)));   // the ends are exact even when stops tie
    });
  }, { passive: true });

  rail.addEventListener('keydown', function (e) {
    var k = e.key, t = null;
    if (k === 'ArrowRight') t = active + 1;
    else if (k === 'ArrowLeft') t = active - 1;
    else if (k === 'Home') t = 0;
    else if (k === 'End') t = tickets.length - 1;
    if (t === null) return;
    e.preventDefault();
    goTo(t, true);
  });
  if (prev) prev.addEventListener('click', function () { goTo(active - 1); });
  if (next) next.addEventListener('click', function () { goTo(active + 1); });

  /* ---- mouse drag with a critically damped spring (fine pointer, 768px and up) ---- */
  var drag = null, springRaf = 0, suppressClick = false;
  function stopSpring() {
    if (springRaf) { cancelAnimationFrame(springRaf); springRaf = 0; }
    if (!drag || !drag.moved) rail.style.scrollSnapType = '';
  }
  function springTo(target, v0) {
    var x = rail.scrollLeft, v = v0, k = 60, c = 2 * Math.sqrt(k), last = performance.now();
    rail.style.scrollSnapType = 'none';
    function step(now) {
      var dt = Math.min(.032, (now - last) / 1000); last = now;
      v += (-k * (x - target) - c * v) * dt;
      x += v * dt;
      rail.scrollLeft = x;
      if (Math.abs(x - target) < .3 && Math.abs(v) < 4) { rail.scrollLeft = target; springRaf = 0; rail.style.scrollSnapType = ''; lockTo(pending, 250); return; }
      springRaf = requestAnimationFrame(step);
    }
    springRaf = requestAnimationFrame(step);
  }
  rail.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !fine.matches) return;
    if (springRaf) { cancelAnimationFrame(springRaf); springRaf = 0; }
    unlock();
    drag = { x: e.clientX, left: rail.scrollLeft, moved: false, last: e.clientX, lt: performance.now(), v: 0 };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 5) return;
      drag.moved = true;
      rail.classList.add('dragging');
      rail.style.scrollSnapType = 'none';
    }
    var now = performance.now(), dt = now - drag.lt;
    if (dt > 0) drag.v = drag.v * .7 + ((e.clientX - drag.last) / dt) * .3;   // px per ms
    drag.last = e.clientX; drag.lt = now;
    rail.scrollLeft = drag.left - dx;
  });
  function release() {
    if (!drag) return;
    var d = drag; drag = null;
    rail.classList.remove('dragging');
    if (!d.moved) return;
    suppressClick = true; setTimeout(function () { suppressClick = false; }, 0);
    var v0 = -d.v * 1000;                                   // scroll speed, px per second
    var i = nearestTo(rail.scrollLeft + v0 * .35);          // where it would land 0.35 s later
    setActive(i);
    lockTo(i, reduce ? 400 : 0);
    if (reduce) { rail.scrollLeft = stopX(i); rail.style.scrollSnapType = ''; }
    else springTo(stopX(i), v0);
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  rail.addEventListener('click', function (e) { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  rail.addEventListener('wheel', function () { stopSpring(); unlock(); }, { passive: true });
  rail.addEventListener('touchstart', function () { stopSpring(); unlock(); }, { passive: true });
  rail.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* ---- "Open taste": that taste's dishes drop down under the rail ---- */
  var panel = document.getElementById('tk-panel');
  var openCat = null;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function itemsOf(cat) {
    for (var i = 0; i < MENU.length; i++) if (MENU[i].category === cat) return MENU[i].items;
    return [];
  }
  function closeTaste() {
    if (!panel) return;
    panel.hidden = true; panel.innerHTML = ''; openCat = null;
    tickets.forEach(function (li) { li.classList.remove('opened'); li.querySelector('.tk-open').textContent = 'Open taste'; });
  }
  function showTaste(f) {
    if (!panel) { openInMenu(f); return; }
    if (openCat === f.cat) { closeTaste(); return; }
    var items = itemsOf(f.cat);
    var html = '<div class="tk-panel-head"><h3>' + esc(f.chip) + '<small>' + items.length + ' dishes</small></h3>' +
      '<span><button type="button" class="tk-panel-full">See in full menu →</button>' +
      '<button type="button" class="tk-panel-close" aria-label="Close">✕</button></span></div><div class="mn-list">';
    items.forEach(function (name, idx) {
      var te = TE[name] || '';
      html += '<div class="mn-item" style="--i:' + idx + '"><span class="n">' + (idx + 1) + '</span><span><span class="en">' + esc(name) + '</span>' +
        (te ? '<span class="te" lang="te">' + esc(te) + '</span>' : '') + '</span></div>';
    });
    html += '</div>';
    panel.innerHTML = html; panel.hidden = false; openCat = f.cat;
    tickets.forEach(function (li, k) {
      var on = FEATURED[k].cat === f.cat;
      li.classList.toggle('opened', on);
      li.querySelector('.tk-open').textContent = on ? 'Close' : 'Open taste';
    });
    panel.querySelector('.tk-panel-close').addEventListener('click', closeTaste);
    panel.querySelector('.tk-panel-full').addEventListener('click', function () { openInMenu(f); });
    panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

    /* ---- "See in full menu": switch menu, open that category's dropdown, bring it into view ---- */
  function openInMenu(f) {
    if (window.MenuSection) window.MenuSection.open(f.menu, f.cat);
    var target = document.getElementById('mn-cats') || document.getElementById('menu');
    if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  window.addEventListener('resize', function () { rail.scrollLeft = stopX(active); });
   /* ---- Standard Menu / All Events Menu switch ---- */
  var modeBox = document.getElementById('tk-modes');
  var modeBtns = modeBox ? Array.prototype.slice.call(modeBox.querySelectorAll('[data-mode]')) : [];
  function fresh() {
    closeTaste();
    active = 0;
    build();
    setActive(0);
    rail.scrollLeft = stopX(0);
  }
  function setMode(m) {
    if (m === mode) return;
    mode = m;
    modeBtns.forEach(function (b) {
      var on = b.getAttribute('data-mode') === m;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    fresh();
    rail.classList.remove('swap'); void rail.offsetWidth; rail.classList.add('swap');
  }
  if (modeBox) {
    modeBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-mode]');
      if (b) setMode(b.getAttribute('data-mode'));
    });
    modeBox.addEventListener('keydown', function (e) {
      var k = e.key, at = modeBtns.map(function (b) { return b.getAttribute('data-mode'); }).indexOf(mode), to = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') to = (at + 1) % modeBtns.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') to = (at - 1 + modeBtns.length) % modeBtns.length;
      else if (k === 'Home') to = 0;
      else if (k === 'End') to = modeBtns.length - 1;
      if (to === null) return;
      e.preventDefault();
      setMode(modeBtns[to].getAttribute('data-mode'));
      modeBtns[to].focus();
    });
  }

  fresh();
})();
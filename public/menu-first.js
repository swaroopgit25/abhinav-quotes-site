/* Planner: choose the MEAL first. For lunch, then choose Standard Menu or All Events Menu.
   Standard Menu = one dish from each section, with the price shown. EDIT THE SETTINGS BELOW. */
(function () {
  'use strict';

  /* ---------------- SETTINGS: edit here ---------------- */
  var STANDARD_PRICE = 290;                 // rupees per plate
  var STANDARD_MEALS = ['Lunch', 'Dinner'];  // meals that offer the Standard / All Events choice
var PRICE_NOTE = 'Note: the plate rate may vary in some seasons or due to inflation.';
var PRICE_NOTE_TE = 'గమనిక: సీజన్‌ను బట్టి లేదా ద్రవ్యోల్బణం వల్ల ప్లేట్ ధర మారవచ్చు.';
  var LIMITS = [                            // [category in menu.js, how many allowed, name used in the message]
    ['Sweets', 1, 'sweet'],
    ['Hot Snacks', 1, 'hot snack'],
    ['Rice', 1, 'rice'],
    ['Biryani Rice', 1, 'biryani rice'],
    ['South Indian Curries', 1, 'South Indian curry'],
    ['North Indian Curries', 1, 'North Indian curry'],
    ['South Indian Fry', 1, 'South Indian fry'],
    ['Dal Items', 1, 'dal'],
    ['South Indian Liquids', 1, 'liquid (sambar, rasam)']
  ];
  var FREE = ['Default Items', 'Water Bottles'];   // can be picked with no limit
  /* ------------------------------------------------------ */

    var OWNER = 'Mrs. Vuppala Jagadeeswari';  // the All Events Menu quotation goes to her

  var RUPEE = '\u20B9';
  var meal = document.getElementById('q-meal');
  var form = document.getElementById('quote-form');
  var mealLeg = document.getElementById('qp-meal-l');   // made by quote-picker.js
  var sesLeg = document.getElementById('qp-ses-l');
  var list = document.getElementById('items-list');
  var builder = document.querySelector('.builder');
  var appBox = document.getElementById('app');
  if (!meal || !form || !mealLeg || !list || !builder || !window.setMealFilter || !window.getPicked) return;

  var mode = null;            // null (not chosen yet), 'standard' or 'all'
  var lastMeal = meal.value;

    /* CHANGE 1: the page shows ONLY the meal question first. */
  var planner = document.getElementById('planner');
  var chosen = false;         // has the customer picked a meal yet?
  var opened = false;         // have the steps been shown yet?
    var guests = document.getElementById('q-guests');
  window.STANDARD_PRICE_RS = STANDARD_PRICE;     // quote-form.js reads the price from here

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
  function norm(s) { return String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function offers(m) { return STANDARD_MEALS.indexOf(m) >= 0; }
  function isStd(m) { return mode === 'standard' && offers(m); }
  function ruleFor(cat) { for (var i = 0; i < LIMITS.length; i++) if (norm(LIMITS[i][0]) === norm(cat)) return LIMITS[i]; return null; }
  function stdCats() { return LIMITS.map(function (l) { return l[0]; }).concat(FREE); }
  function count(cat) { return window.getPicked().filter(function (p) { return norm(p.cat) === norm(cat); }).length; }
  function say(n, word) { return (n === 1 ? 'one' : n) + ' ' + word + (n > 1 ? 's' : ''); }

  /* ---- linked sections: Rice, Biryani Rice, North curry, South curry ----
     Usual plate: 1 rice, 1 biryani rice, 1 North curry, 1 South curry.
     2 rice (no biryani rice)  -> no North curry, up to 2 South curries.
     2 biryani rice (no rice)  -> no South curry, up to 2 North curries. */
  var RICE = 'Rice', BIR = 'Biryani Rice', NORTH = 'North Indian Curries', SOUTH = 'South Indian Curries';
  function same(a, b) { return norm(a) === norm(b); }
  function isCombo(cat) { return same(cat, RICE) || same(cat, BIR) || same(cat, NORTH) || same(cat, SOUTH); }
  function combo(cat, d) {                       // the four counts, after adding d to cat
    var c = { r: count(RICE), b: count(BIR), n: count(NORTH), s: count(SOUTH) };
    if (same(cat, RICE)) c.r += d; else if (same(cat, BIR)) c.b += d;
    else if (same(cat, NORTH)) c.n += d; else if (same(cat, SOUTH)) c.s += d;
    return c;
  }
  function comboOk(c) {
    if (c.r === 2 && c.b === 0) return c.n === 0 && c.s <= 2;
    if (c.b === 2 && c.r === 0) return c.s === 0 && c.n <= 2;
    return c.r <= 1 && c.b <= 1 && c.n <= 1 && c.s <= 1;
  }
  function comboMax(cat) {                       // most dishes allowed in this section right now
    var k = count(cat), c = combo(cat, 0);
    if (c.r + c.b + c.n + c.s === 0) return 1;   // nothing chosen yet: show the usual 1
    var m = k;
    while (m < 2 && comboOk(combo(cat, m + 1 - k))) m++;
    return m;
  }
  function comboWhyNot(cat) {                    // why this pick is not allowed
    var c = combo(cat, 0);
    if (same(cat, RICE)) {
      if (c.r >= 2) return 'You can choose up to two rice.';
      if (c.b === 2) return 'Two biryani rice means no plain rice. Remove one biryani rice first.';
      if (c.b > 0) return 'Two rice cannot go with biryani rice. Remove your biryani rice first, or keep one rice.';
      if (c.n > 0) return 'Two rice means no North Indian curry. Remove your North Indian curry first.';
    } else if (same(cat, BIR)) {
      if (c.b >= 2) return 'You can choose up to two biryani rice.';
      if (c.r === 2) return 'Two rice means no biryani rice. Remove one rice first.';
      if (c.r > 0) return 'Two biryani rice cannot go with plain rice. Remove your rice first, or keep one biryani rice.';
      if (c.s > 0) return 'Two biryani rice means no South Indian curry. Remove your South Indian curry first.';
    } else if (same(cat, NORTH)) {
      if (c.n >= 2) return 'You can choose up to two North Indian curries.';
      if (c.r === 2) return 'Two rice means no North Indian curry. Remove one rice to add one.';
      return 'To choose two North Indian curries, pick two biryani rice and no plain rice.';
    } else if (same(cat, SOUTH)) {
      if (c.s >= 2) return 'You can choose up to two South Indian curries.';
      if (c.b === 2) return 'Two biryani rice means no South Indian curry. Remove one biryani rice to add one.';
      return 'To choose two South Indian curries, pick two rice and no biryani rice.';
    }
    return 'That choice is not available with your current picks.';
  }

  /* ---- 1. the new block at the top: meal tiles + menu choice ---- */
  var sec = el('section', 'quote-form mf'); sec.id = 'mf'; sec.setAttribute('aria-labelledby', 'mf-h');
  sec.appendChild(el('p', 'step-no', 'Start here'));
  var h = el('h3', '', 'What meal is it for?'); h.id = 'mf-h'; sec.appendChild(h);
  sec.appendChild(el('p', 'qf-help', 'Choose the meal first. We then show the dishes that suit it.'));
  var grid = el('div', 'qf-grid mf-grid'); sec.appendChild(grid);
  grid.appendChild(mealLeg.parentNode);                        // the meal tiles move here (they keep working)
  if (sesLeg) grid.appendChild(sesLeg.parentNode);             // Breakfast: morning / night

    /* CHANGE 1: nothing is chosen at the start (Welcome Drinks used to look selected) */
  Array.prototype.forEach.call(mealLeg.parentNode.querySelectorAll('.qp-meal'), function (b, i) {
    b.setAttribute('aria-checked', 'false'); b.tabIndex = i === 0 ? 0 : -1;
  });

  var typeBox = el('div', 'qf-pick wide mf-type'); typeBox.hidden = true;
  var typeLeg = el('span', 'qf-legend', 'Which menu would you like?'); typeLeg.id = 'mf-type-l';
  var cards = el('div', 'qp-meals'); cards.setAttribute('role', 'radiogroup'); cards.setAttribute('aria-labelledby', 'mf-type-l');
  var OPTIONS = [
    { id: 'standard', title: 'Standard Menu', price: RUPEE + STANDARD_PRICE + ' per plate', text: 'One dish from each section' },
    { id: 'all', title: 'All Events Menu', price: '', text: 'Choose from the full menu' }
  ];
  OPTIONS.forEach(function (o) {
    var b = el('button', 'qp-meal'); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.id = o.id;
    b.appendChild(el('b', '', o.title));
    if (o.price) b.appendChild(el('small', 'mf-price', o.price));
    b.appendChild(el('small', '', o.text));
    b.addEventListener('click', function () { setMode(o.id); });
    cards.appendChild(b);
  });
  cards.addEventListener('keydown', function (e) {
    var items = Array.prototype.slice.call(cards.querySelectorAll('[role="radio"]')), i = items.indexOf(document.activeElement);
    if (i < 0) return;
    var t = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') t = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') t = (i - 1 + items.length) % items.length;
    if (t === null) return;
    e.preventDefault(); items[t].focus(); items[t].click();
  });
    /* CHANGE 2: the line under the two cards */
  var line = el('p', 'mf-line'); line.setAttribute('aria-live', 'polite'); line.hidden = true;
var rateNote = el('div', 'mf-rate-note'); rateNote.hidden = true;             // sits above "You can choose"
rateNote.appendChild(el('p', '', PRICE_NOTE));
var rateTe = el('p', 'te', PRICE_NOTE_TE); rateTe.lang = 'te'; rateNote.appendChild(rateTe);
  var need = el('p', 'mf-need'); need.setAttribute('role', 'status'); need.hidden = true;
  var counts = el('div', 'mf-counts'); counts.hidden = true; counts.setAttribute('aria-live', 'polite');
  typeBox.appendChild(typeLeg); typeBox.appendChild(cards); typeBox.appendChild(line); typeBox.appendChild(rateNote); typeBox.appendChild(need); typeBox.appendChild(counts);
  grid.appendChild(typeBox);

  form.parentNode.insertBefore(sec, form);

    /* CHANGE 5: a calm hint + ornament under the meal card */
  var wait = el('div', 'mf-wait'); wait.setAttribute('aria-hidden', 'true');
  wait.innerHTML = '<svg viewBox="-60 -60 120 120" width="96" height="96" fill="none" stroke="currentColor" stroke-width="1">' +
    '<g><path d="M0-48C13-26 13-11 0 0C-13-11-13-26 0-48Z"/><path d="M0-48C13-26 13-11 0 0C-13-11-13-26 0-48Z" transform="rotate(90)"/>' +
    '<path d="M0-48C13-26 13-11 0 0C-13-11-13-26 0-48Z" transform="rotate(180)"/><path d="M0-48C13-26 13-11 0 0C-13-11-13-26 0-48Z" transform="rotate(270)"/>' +
    '<path d="M0-48C13-26 13-11 0 0C-13-11-13-26 0-48Z" transform="rotate(45) scale(.55)"/><path d="M0-48C13-26 13-11 0 0C-13-11-13-26 0-48Z" transform="rotate(135) scale(.55)"/>' +
    '<path d="M0-48C13-26 13-11 0 0C-13-11-13-26 0-48Z" transform="rotate(225) scale(.55)"/><path d="M0-48C13-26 13-11 0 0C-13-11-13-26 0-48Z" transform="rotate(315) scale(.55)"/></g>' +
    '<circle r="3"/></svg>';
  wait.appendChild(el('p', '', 'Pick a meal above, and your event form opens here.'));
  sec.parentNode.insertBefore(wait, sec.nextSibling);

  /* ---- 2. the price message, below the dishes ---- */
  var note = el('div', 'mf-std'); note.hidden = true;
  note.appendChild(el('p', 'mf-std-h', 'Standard Menu: ' + RUPEE + STANDARD_PRICE + ' per plate'));
    var totalLine = el('p', 'mf-total');                        // live total, updates as guests change
  note.appendChild(totalLine);
  var more = el('button', 'mf-link', 'Want more choices? Switch to the All Events Menu'); more.type = 'button';
  more.addEventListener('click', function () { setMode('all'); sec.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  note.appendChild(more);
  builder.parentNode.insertBefore(note, builder.nextSibling);
    /* CHANGE 4: the matching note for the All Events Menu */
  var noteAll = el('div', 'mf-std'); noteAll.hidden = true;
  noteAll.appendChild(el('p', 'mf-std-h', 'All Events Menu'));
  noteAll.appendChild(el('p', '', 'Choose whatever you prefer from the full menu. When you send your quotation, it goes to ' + OWNER + ', and you can discuss and finalise the price with her.'));
  var fewer = el('button', 'mf-link', 'Prefer a fixed price? Switch to the Standard Menu (' + RUPEE + STANDARD_PRICE + ' per plate)'); fewer.type = 'button';
  fewer.addEventListener('click', function () { setMode('standard'); sec.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  noteAll.appendChild(fewer);
  note.parentNode.insertBefore(noteAll, note.nextSibling);

  /* ---- 3. the "only one sweet" message ---- */
  var toast = el('div', 'mf-toast'); toast.setAttribute('role', 'status'); toast.hidden = true;
  document.body.appendChild(toast);
  var toastTimer = 0;
  function warn(text, noLink) {
    toast.textContent = text + ' ';
    if (!noLink) {
      var sw = el('button', 'mf-link', 'Switch to the All Events Menu'); sw.type = 'button';
      sw.addEventListener('click', function () { setMode('all'); sec.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
      toast.appendChild(sw);
    }
    toast.hidden = false;
    toast.classList.remove('show'); void toast.offsetWidth; toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 7000);
  }

  /* ---- 4. the rules ---- */
  window.beforePick = function (dish) {                          // app.js asks this before adding a dish
    if (!isStd(meal.value)) return true;
    var r = ruleFor(dish.cat);
    if (!r) return true;                                         // Default Items and Water Bottles: no limit
    if (isCombo(r[0])) {                                         // rice / biryani / North / South depend on each other
      if (comboOk(combo(r[0], 1))) return true;
      warn(comboWhyNot(r[0])); return false;
    }
    if (count(r[0]) >= r[1]) { warn('Our standard menu serves only ' + say(r[1], r[2]) + '.'); return false; }
    return true;
  };
  window.beforeUnpick = function (dish) {                        // app.js asks this before removing a dish
    if (!isStd(meal.value)) return true;
    var r = ruleFor(dish.cat);
    if (!r || !isCombo(r[0]) || comboOk(combo(r[0], -1))) return true;
    if (same(r[0], RICE)) warn('Remove one South Indian curry first. One rice allows only one South Indian curry.', true);
    else if (same(r[0], BIR)) warn('Remove one North Indian curry first. One biryani rice allows only one North Indian curry.', true);
    else warn('That change is not allowed with your current picks.', true);
    return false;
  };

    window.menuModeOf = function (m) {                             // 'standard', 'all' or '' (sent with each meal)
    return offers(m) && mode ? mode : '';
  };
  window.menuModeLabel = function (m) {                          // quote-form.js adds this to the meal name (PDF, email, WhatsApp)
    if (!offers(m)) return '';
    if (mode === 'standard') return ' - Standard Menu (Rs. ' + STANDARD_PRICE + '/plate)';
    if (mode === 'all') return ' - All Events Menu';
    return '';
  };

  var origSet = window.setMealFilter;
  window.setMealFilter = function (cats, m) {                    // standard menu shows only its own sections
    if (m !== lastMeal) { mode = null; lastMeal = m; }
    if (isStd(m)) cats = stdCats();
    origSet(cats, m);
    sync();
  };

  function setMode(m) {
    if (mode === m) return;
    var had = window.getPicked().length > 0;
    mode = m;
    window.clearPicked();                                        // start again under the new rules
    window.setMealFilter(window.MEALS[meal.value].cats, meal.value);
    toast.hidden = true;
    if (had) { warn('Menu changed, so your dishes were cleared. Pick again below.'); toast.lastChild.remove(); }
    else if (m === 'standard') warn('Standard Menu ' + RUPEE + STANDARD_PRICE + ' per plate. Pick one dish from each section. Tap a picked dish to change it.', true);
  }

  function sync() {
    var m = meal.value;
    typeBox.hidden = !offers(m);
    Array.prototype.forEach.call(cards.children, function (b) {
      var on = b.dataset.id === mode;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on || (!mode && b === cards.firstChild) ? 0 : -1;
    });
    need.hidden = !!mode || !offers(m) || !need.textContent;
    if (mode) need.hidden = true;
    var std = isStd(m);
    counts.hidden = !std; note.hidden = !std;
        noteAll.hidden = !(mode === 'all' && offers(m));
    if (!std) toast.hidden = true;
            if (std) { paintCounts(); paintTotal(); }
        paintLine(m);
        paintHint();
    openSteps();            // CHANGE 1
  }

    /* CHANGE 2: the line under the two cards */
  function paintLine(m) {
    rateNote.hidden = !(offers(m) && mode === 'standard');
    if (!offers(m) || !mode) { line.hidden = true; return; }
        line.textContent = mode === 'standard'
      ? RUPEE + STANDARD_PRICE + ' per plate. One dish from each section. Your quotation PDF will show the total (' + RUPEE + STANDARD_PRICE + ' \u00D7 number of guests).'
      : 'Choose whatever you prefer from the full menu. Your quotation goes to ' + OWNER + ', and you can discuss and finalise the price with her.';
    line.hidden = false;
  }

    /* CHANGE 1: open the steps once a meal (and for Lunch, a menu) is chosen */
  function ready() { return chosen && (!offers(meal.value) || !!mode); }
  function openSteps() {
    if (opened || !planner || !ready()) return;
    opened = true;
    planner.classList.remove('await-meal');
    planner.classList.add('mf-opening');
    setTimeout(function () { planner.classList.remove('mf-opening'); }, 1000);
    document.dispatchEvent(new Event('planner-open'));   // replays the plate animation
    setTimeout(function () { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150);
  }
  if (planner) planner.classList.add('await-meal');      // start with only the meal question showing

    /* CHANGE 5: the hint follows the customer's progress */
  function paintHint() {
    var p = wait.lastChild;
    p.textContent = chosen && offers(meal.value) && !mode
      ? 'Now choose the Standard Menu or the All Events Menu, and your event form opens here.'
      : 'Pick a meal above, and your event form opens here.';
  }

      wait.hidden = true;

    /* CHANGE 3: "Your total: ₹290 × 150 guests = ₹43,500" */
  function paintTotal() {
    var g = parseInt(guests && guests.value, 10);
    totalLine.textContent = g > 0
      ? 'Your total: ' + RUPEE + STANDARD_PRICE + ' \u00D7 ' + g + ' guests = ' + RUPEE + (STANDARD_PRICE * g).toLocaleString('en-IN')
      : 'Enter the number of guests in the event details to see your total.';
  }
  if (guests) guests.addEventListener('input', function () { if (isStd(meal.value)) paintTotal(); });

  function paintCounts() {
    counts.textContent = '';
    counts.appendChild(el('span', 'mf-counts-l', 'You can choose:'));
    LIMITS.forEach(function (r) {
      var max = isCombo(r[0]) ? comboMax(r[0]) : r[1];
      var n = count(r[0]), name = r[2].charAt(0).toUpperCase() + r[2].slice(1);
     var c = el('span', 'mf-chip' + (n >= max ? ' done' : ''), max === 0 ? name + ' not available now' : max + ' - ' + name);
      counts.appendChild(c);
    });
  }
  if (appBox && 'MutationObserver' in window) {
    new MutationObserver(function () { if (isStd(meal.value)) paintCounts(); }).observe(appBox, { childList: true, subtree: true });
  }

  /* ---- 5. do not send a lunch without a menu choice ---- */
  function guard(e) {
        if (isStd(meal.value) && !(parseInt(guests && guests.value, 10) > 0)) {    // Standard needs the guest number for the total
      e.stopImmediatePropagation(); e.preventDefault();
      var m0 = document.getElementById('quote-msg');
      if (m0) m0.textContent = 'Please enter the number of guests, so your Standard Menu total can be worked out.';
      if (guests) { guests.focus(); guests.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }
    if (!offers(meal.value) || mode || !window.getPicked().length) return;
    e.stopImmediatePropagation(); e.preventDefault();
    need.textContent = 'Please choose the Standard Menu or the All Events Menu for your ' + meal.value.toLowerCase() + '.';
    need.hidden = false;
    sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  ['quote-btn', 'save-meal-btn'].forEach(function (id) { var b = document.getElementById(id); if (b) b.addEventListener('click', guard, true); });

  /* after "Save this meal & add another", take them back up to choose the next meal */
  var saveBtn = document.getElementById('save-meal-btn'), msg = document.getElementById('quote-msg');
  if (saveBtn && msg) saveBtn.addEventListener('click', function () {
    if (/saved\./.test(msg.textContent)) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

    meal.addEventListener('change', function () { chosen = true; need.textContent = ''; sync(); });   // CHANGE 1
  sync();
})();
/* Planner: visual meal tiles.
   The original <select id="q-meal"> stays in the page and remains the source of truth,
   so the quotation, WhatsApp message and /api/quote keep working exactly as before.
   (Event time is the plain #q-time dropdown; there are no time slot tiles any more.) */
(function () {
  'use strict';
  var meal = document.getElementById('q-meal');
  var grid = document.querySelector('.qf-grid');
  if (!meal || !grid) return;
  var mealLab = meal.closest('label');
  if (!mealLab) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function clock(h, m) { return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h >= 12 ? 'PM' : 'AM'); }
  function range(name) {
    var r = window.MEALS && window.MEALS[name];
    if (!r) return '';
    var a = r.from.split(':'), b = r.to.split(':');
    return clock(+a[0], +a[1]) + ' to ' + clock(+b[0], +b[1]);
  }
  function fire(select) { select.dispatchEvent(new Event('change', { bubbles: true })); }

  /* roving radio group: arrows move + select, Home/End jump */
  function radios(group, onPick) {
    group.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(group.querySelectorAll('[role="radio"]'));
      var i = items.indexOf(document.activeElement);
      if (i < 0) return;
      var t = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') t = (i + 1) % items.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') t = (i - 1 + items.length) % items.length;
      else if (e.key === 'Home') t = 0;
      else if (e.key === 'End') t = items.length - 1;
      if (t === null) return;
      e.preventDefault();
      items[t].focus();
      onPick(items[t]);
    });
  }
  function mark(group, chosen) {
    var items = group.querySelectorAll('[role="radio"]'), any = false;
    Array.prototype.forEach.call(items, function (b) {
      var on = b === chosen;
      if (on) any = true;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    if (!any && items[0]) items[0].tabIndex = 0;
  }

  /* ---- meal tiles ---- */
  var mealBox = el('div', 'qf-pick wide');
  var mealLeg = el('span', 'qf-legend', 'Meal'); mealLeg.id = 'qp-meal-l';
  var mealGrp = el('div', 'qp-meals'); mealGrp.setAttribute('role', 'radiogroup'); mealGrp.setAttribute('aria-labelledby', 'qp-meal-l');
  mealBox.appendChild(mealLeg); mealBox.appendChild(mealGrp);
  Array.prototype.forEach.call(meal.options, function (o) {
    var b = el('button', 'qp-meal'); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.value = o.value;
    b.appendChild(el('b', '', o.text));
    var r = range(o.value); if (r) b.appendChild(el('small', '', r));
    b.addEventListener('click', function () { pickMeal(b); });
    mealGrp.appendChild(b);
  });
  function pickMeal(b) {
    meal.value = b.dataset.value;
    fire(meal);                    // quote-form.js refills the times and filters the dishes
    syncMeal();
  }
  function syncMeal() {
    var chosen = null;
    Array.prototype.forEach.call(mealGrp.children, function (b) { if (b.dataset.value === meal.value) chosen = b; });
    mark(mealGrp, chosen);
  }
  radios(mealGrp, pickMeal);

  /* ---- put them in the form, hide the plain dropdown (kept in the page) ---- */
  grid.insertBefore(mealBox, mealLab);
  mealLab.classList.add('qf-synced');
  grid.classList.add('has-pickers');

  meal.addEventListener('change', syncMeal);
  syncMeal();
})();
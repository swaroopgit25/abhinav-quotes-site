/* Planner: show only the steps that suit the chosen meal.
   - Welcome Drinks: sweetness instead of spice, 3 drink serving styles, no extras
   - Saree: only pickup or delivery
   - Snacks / High Tea: no serving style
   - Breakfast: live counters are only Dosa and Puri Counter
   If the quotation holds several meals, a step stays when ANY of those meals needs it.
   quote-form.js asks window.stepsOn() so hidden steps are not sent in the quotation. */
(function () {
  'use strict';
  var meal = document.getElementById('q-meal');
  if (!meal) return;

  // EDIT HERE: true = the step is shown for that meal. A meal that is not listed shows the normal steps.
  var NORMAL = { staff: true, spice: true, sweet: false, style: true, dstyle: false, extras: true };
  var RULES = {
    'Welcome Drinks':    { staff: true,  spice: false, sweet: true,  style: false, dstyle: true,  extras: false },
    'Snacks / High Tea': { staff: true,  spice: true,  sweet: false, style: false, dstyle: false, extras: true },
    'Saree':             { staff: false, spice: false, sweet: false, style: false, dstyle: false, extras: false }
  };
  // which section of the page belongs to which step (Pickup or delivery is not listed: it is always shown)
  var BLOCK = { staff: 'blk-staff', spice: 'blk-spice', sweet: 'blk-sweet', style: 'blk-style', dstyle: 'blk-dstyle', extras: 'blk-extras' };
  var BREAKFAST_LIVE = ['Dosa', 'Puri Counter'];   // the only live counters offered for Breakfast

  function mealsInQuote() {
    var saved = window.savedMealNames ? window.savedMealNames() : [];
    return saved.concat(meal.value);
  }
  function stepsOn() {
    var on = {};
    mealsInQuote().forEach(function (m) {
      var r = RULES[m] || NORMAL;
      Object.keys(BLOCK).forEach(function (k) { if (r[k]) on[k] = true; });
    });
    return on;
  }
  window.stepsOn = stepsOn;

  function apply() {
    var on = stepsOn(), n = 0, last = null;
    Array.prototype.forEach.call(document.querySelectorAll('.svc > .svc-block'), function (b) {
      var key = null;
      Object.keys(BLOCK).forEach(function (k) { if (BLOCK[k] === b.id) key = k; });
      var show = key ? !!on[key] : true;
      b.hidden = !show;
      b.classList.remove('last-vis');
      if (!show) return;
      n++; last = b;
      var no = b.querySelector('.step-no'), label = 'Step ' + (2 + n);
      if (no && no.dataset.n !== label) { no.textContent = label; no.dataset.n = label; }   // the big numerals count themselves in CSS
    });
    if (last) last.classList.add('last-vis');
    var solo = document.querySelector('.step-solo'), soloLabel = 'Step ' + (3 + n);
    if (solo && solo.dataset.n !== soloLabel) { solo.textContent = soloLabel; solo.dataset.n = soloLabel; }

    var onlyBreakfast = mealsInQuote().every(function (m) { return m === 'Breakfast'; });
    Array.prototype.forEach.call(document.querySelectorAll('#live-grid .qs-opt'), function (lab) {
      var box = lab.querySelector('input');
      var keep = !onlyBreakfast || BREAKFAST_LIVE.indexOf(box.value) >= 0;
      lab.hidden = !keep;
      if (!keep) box.checked = false;
    });
  }

  meal.addEventListener('change', apply);
  document.addEventListener('mealschange', apply);   // quote-form.js fires this when a meal is saved or removed
  apply();
})();
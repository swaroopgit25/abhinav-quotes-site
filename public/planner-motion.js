/* Planner motion: icons, live counters, service-boy crew, scroll reveals.
   All form values still live in normal inputs, so quote-form.js reads them as before. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. icons: one place to edit. The HTML only says data-ico="truck" ---- */
  var ICONS = {
    truck:   '<path d="M2 7h11v9H2z"/><path d="M13 10h4l3 3v3h-7"/><circle class="wheel" cx="6" cy="18" r="1.8"/><circle class="wheel" cx="17" cy="18" r="1.8"/>',
    bag:     '<path d="M5 9h14l-1 11H6z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>',
    buffet:  '<path d="M2 18h20"/><path class="lid" d="M3 18a3 3 0 0 1 6 0"/><path class="lid" d="M9 18a3 3 0 0 1 6 0"/><path class="lid" d="M15 18a3 3 0 0 1 6 0"/>',
    cloche:  '<path d="M2 18h20"/><g class="lid"><path d="M4 18a8 8 0 0 1 16 0"/><path d="M12 10V8"/></g>',
    leaf:    '<path class="leafp" d="M3 18C6 8 15 5 21 6c0 7-6 12-18 12z"/><path d="M5 17c5-4 9-7 14-9"/>',
    tawa:    '<ellipse cx="11" cy="16" rx="8" ry="2.6"/><path d="M19 15.5h3"/><path class="steam" d="M8 11c-1-1.5 1-2.5 0-4"/><path class="steam s2" d="M12 11c-1-1.5 1-2.5 0-4"/><path class="steam s3" d="M16 11c-1-1.5 1-2.5 0-4"/>',
    chafing: '<path d="M3 17h18"/><g class="lid"><path d="M5 17a7 7 0 0 1 14 0"/></g><path d="M8 20h8"/><path class="steam" d="M10 8c-1-1.2 1-2 0-3.5"/><path class="steam s2" d="M14 8c-1-1.2 1-2 0-3.5"/>',
    broom:   '<g class="broom"><path d="M15 3l-4 9"/><path d="M6 12h9l2 9H4z"/></g><path class="spark" d="M20 5v3M18.5 6.5h3"/>',
    paan:    '<path class="sway" d="M12 21C5 16 4 10 8 8c2-1 3 0 4 2 1-2 2-3 4-2 4 2 3 8-4 13z"/>',
    bobbatlu:'<g class="flip"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></g>',
    dosa:    '<path d="M3 17C5 9 14 6 21 9c0 5-7 8-18 8z"/><path class="steam" d="M9 6c-1-1.2 1-2 0-3.5"/><path class="steam s2" d="M14 5c-1-1.2 1-2 0-3.5"/>',
    chaat:   '<path d="M4 12h16a8 8 0 0 1-16 0z"/><circle class="bit" cx="9" cy="8" r="1.2"/><circle class="bit b2" cx="13" cy="6.5" r="1.2"/><circle class="bit b3" cx="16" cy="8.5" r="1.2"/>',
    jalebi:  '<path class="spin" d="M12 12a1.5 1.5 0 1 1 3 0 4 4 0 1 1-8 0 6.5 6.5 0 1 1 13 0 9 9 0 1 1-18 0"/>',
    panipuri:'<circle cx="9" cy="14" r="5"/><path class="bit" d="M17 5c-1.5 2.5-2.5 3.5-2.5 5a2.5 2.5 0 0 0 5 0c0-1.5-1-2.5-2.5-5z"/>',
        icecarve:'<path class="lid" d="M12 3l6 7-6 11-6-11z"/><path d="M6 10h12M12 3v18"/><path class="spark" d="M20 4v3M18.5 5.5h3"/>',
    vegcarve:'<g class="spin"><ellipse cx="12" cy="6.5" rx="2.2" ry="3.5"/><ellipse cx="12" cy="17.5" rx="2.2" ry="3.5"/><ellipse cx="6.5" cy="12" rx="3.5" ry="2.2"/><ellipse cx="17.5" cy="12" rx="3.5" ry="2.2"/><circle cx="12" cy="12" r="1.2"/></g>',
    fruitstall:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><circle class="bit" cx="9" cy="14" r=".8"/><circle class="bit b2" cx="12" cy="16.5" r=".8"/><circle class="bit b3" cx="15" cy="14" r=".8"/>',
    icecream:'<path d="M8 12l4 9 4-9"/><path class="lid" d="M7.5 12a4.5 4.5 0 1 1 9 0z"/>'
  };
  function paintIcons() {
    Array.prototype.forEach.call(document.querySelectorAll('.ico[data-ico]'), function (el) {
      if (el.firstChild || !ICONS[el.dataset.ico]) return;
      el.innerHTML = '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[el.dataset.ico] + '</svg>';
    });
  }

  /* ---- 2. live counters: ticking "Live counter" opens the list ---- */
  var LIVE = [['Paan', 'paan'], ['Bobbatlu', 'bobbatlu'], ['Dosa', 'dosa'], ['Chaat', 'chaat'],
              ['Jalebi', 'jalebi'], ['Pani puri', 'panipuri'], ['Ice cream', 'icecream'],
              ['Ice carving', 'icecarve'], ['Veg carving', 'vegcarve'], ['Fruit stall', 'fruitstall']];   // add or remove here
  var liveGrid = $('live-grid'), livePanel = $('live-panel');
  var liveBox = document.querySelector('input[name="q-extra"][value="Live counter"]');
  LIVE.forEach(function (it, i) {
    var l = document.createElement('label');
    l.className = 'qs-opt'; l.style.setProperty('--i', i);
    l.innerHTML = '<input type="checkbox" name="q-live" value="' + it[0] + '"><span class="qs-card"><span class="ico" data-ico="' + it[1] + '"></span><b>' + it[0] + '</b></span>';
    liveGrid.appendChild(l);
  });
  paintIcons();
  liveBox.addEventListener('change', function () {
    livePanel.hidden = !liveBox.checked;
    if (!liveBox.checked) Array.prototype.forEach.call(liveGrid.querySelectorAll('input'), function (c) { c.checked = false; });
  });

  /* ---- 3. service boys: a little waiter pops in for each one ---- */
  var staff = $('q-staff'), crew = $('crew'), CAP = 16;
  var more = document.createElement('span'); more.className = 'more'; more.hidden = true; crew.appendChild(more);
  var waiter = '<svg viewBox="0 0 24 32" width="26" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4.5"/><path d="M4 30v-7a8 8 0 0 1 16 0v7z"/><path d="M9 20l3 3 3-3"/></svg>';
  function renderCrew() {
    var n = Math.max(0, Math.min(99, Math.round(+staff.value) || 0)), want = Math.min(n, CAP);
    var have = crew.querySelectorAll('.waiter');
    for (var i = have.length; i < want; i++) {
      var w = document.createElement('span'); w.className = 'waiter new'; w.innerHTML = waiter;
      crew.insertBefore(w, more);
    }
    for (var j = have.length; j > want; j--) crew.removeChild(have[j - 1]);
    more.textContent = '+' + (n - CAP); more.hidden = n <= CAP;
    if (!reduce) { staff.classList.remove('bump'); void staff.offsetWidth; staff.classList.add('bump'); }
  }
  ['q-staff-minus', 'q-staff-plus'].forEach(function (id) { $(id).addEventListener('click', renderCrew); });
  staff.addEventListener('change', renderCrew);
  staff.addEventListener('input', renderCrew);

    /* ---- 3b. a short friendly line under each step title ---- */
  var NOTES = {
    'Event details': 'Tell us about the occasion and who it is for.',
    'Service boys': 'Trained helpers to serve your guests with a smile.',
    'Pickup or delivery': 'We can bring it to your door, or you can collect it.',
    'Spice level': 'We cook to your family’s taste.',
    'Serving style': 'How the food reaches your guests.',
    'Extras': 'Little touches that make the day feel grand.'
  };
  Array.prototype.forEach.call(document.querySelectorAll('.svc-block > h3, #quote-form > h3'), function (h) {
    if (!NOTES[h.textContent]) return;
    var p = document.createElement('p'); p.className = 'svc-note'; p.textContent = NOTES[h.textContent];
    h.insertAdjacentElement('afterend', p);
  });

    /* ---- 3c. step 2 shows how many dishes are on the plate ---- */
  var head = document.querySelector('.step-head'), app = $('app');
  var count = document.createElement('span'); count.className = 'dish-count'; count.setAttribute('aria-live', 'polite');
  head.appendChild(count);
  function updateCount() {
    var h = app.querySelector('.picked h3'), n = h ? +(h.textContent.match(/\d+/) || [0])[0] : 0;
    var txt = n ? n + (n === 1 ? ' dish' : ' dishes') + ' on your plate' : 'No dishes yet';
    if (count.textContent !== txt) { count.textContent = txt; count.classList.toggle('has', n > 0); }
  }
  updateCount();
  new MutationObserver(updateCount).observe(app, { childList: true, subtree: true, characterData: true });
  $('quote-form').setAttribute('data-reveal', 'left');   // step 1 slides in like the others

  /* ---- 4. each step slides in its own way when scrolled to ---- */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.remove('pre'); e.target.classList.add('in'); io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(document.querySelectorAll('#planner [data-reveal]'), function (el) {
      el.classList.add('pre'); io.observe(el);
    });
  }
})();
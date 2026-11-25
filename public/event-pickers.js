/* Planner: event type tiles + "sky" time picker.
   The original <select id="q-type"> and <select id="q-time"> stay in the page (hidden) and remain the
   source of truth, so quote-form.js, the PDF and the email keep reading the same values. */
(function () {
  'use strict';
  var type = document.getElementById('q-type');
  var time = document.getElementById('q-time');
  var grid = document.querySelector('.qf-grid');
  if (!type || !time || !grid) return;
  var typeLab = type.closest('label'), timeLab = time.closest('label');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
  function fire(s) { s.dispatchEvent(new Event('change', { bubbles: true })); }
  function roving(group, onPick) {
    group.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(group.querySelectorAll('[role="radio"]'));
      var i = items.indexOf(document.activeElement); if (i < 0) return;
      var t = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') t = (i + 1) % items.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') t = (i - 1 + items.length) % items.length;
      else if (e.key === 'Home') t = 0; else if (e.key === 'End') t = items.length - 1;
      if (t === null) return;
      e.preventDefault(); items[t].focus(); onPick(t);
    });
  }

  /* =============== 1. EVENT TYPE TILES =============== */
  // one icon per event: EDIT HERE (the key is the exact text of the event type)
  var TYPE_ICONS = {
    'Wedding / Reception': '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M12 2.5l2 2-2 2-2-2z"/>',
    'Engagement': '<circle cx="12" cy="15" r="6"/><path d="M9 6.5L12 3l3 3.5-3 3z"/>',
    'Birthday Party': '<rect x="4" y="13" width="16" height="7" rx="1.5"/><path d="M4 16.5c2 1.5 3 1.5 4 0s3-1.5 4 0 3 1.5 4 0 3-1.5 4 0"/><path d="M12 9v4"/><path class="flame" d="M12 4c1.3 1.6 1.6 2.4 1.6 3.2a1.6 1.6 0 0 1-3.2 0c0-.8.3-1.6 1.6-3.2z"/>',
    'Housewarming': '<path d="M3 11.5l9-7.5 9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-6h4v6"/>',
    'Baby Shower / Seemantham': '<circle cx="9" cy="9" r="5"/><path d="M12.8 12.8L20 20"/><circle cx="20.2" cy="20.2" r="1.3"/><path d="M7 7.5c.7-.8 1.5-1 2.4-.9"/>',
    'Saree / Half Saree Function': '<path d="M12 20c-4-2-6.5-6-5.5-10.5 3 .2 5 2 5.5 4.5.5-2.5 2.5-4.3 5.5-4.5C18.5 14 16 18 12 20z"/><path d="M12 14v6"/><path d="M12 8.5c-1-1.5-1-3 0-4.5 1 1.500 1 3 0 4.500z"/>',
    'Pooja / Festival': '<path d="M3 14h18c0 4-4 7-9 7s-9-3-9-7z"/><path class="flame" d="M12 3.500c2 2.800 3 4 3 5.500a3 3 0 0 1-6 0c0-1.500 1-2.700 3-5.500z"/>',
    'Corporate Event': '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13.500h18"/>',
    'Other': '<path d="M12 3l2.200 6 6 2.200-6 2.200L12 19.500l-2.200-6-6-2.200 6-2.200z"/>'
  };
  var typeBox = el('div', 'qf-pick wide');
  var typeLeg = el('span', 'qf-legend', 'Event type'); typeLeg.id = 'ep-type-l';
  var typeGrp = el('div', 'ep-types'); typeGrp.setAttribute('role', 'radiogroup'); typeGrp.setAttribute('aria-labelledby', 'ep-type-l');
  typeBox.appendChild(typeLeg); typeBox.appendChild(typeGrp);
  Array.prototype.forEach.call(type.options, function (o, i) {
    var b = el('button', 'ep-type'); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.value = o.value; b.style.setProperty('--i', i);
    var ico = el('span', 'ep-ico');
    ico.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (TYPE_ICONS[o.value] || TYPE_ICONS.Other) + '</svg>';
    b.appendChild(ico); b.appendChild(el('b', '', o.text));
    b.addEventListener('click', function () { pickType(i); });
    typeGrp.appendChild(b);
  });
  function pickType(i) {
    type.selectedIndex = i; fire(type); syncType();
    var b = typeGrp.children[i]; b.classList.remove('pop'); void b.offsetWidth; if (!reduce) b.classList.add('pop');
  }
  function syncType() {
    Array.prototype.forEach.call(typeGrp.children, function (b, i) {
      var on = i === type.selectedIndex;
      b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
    });
  }
  roving(typeGrp, pickType);
  grid.insertBefore(typeBox, typeLab);
  typeLab.classList.add('qf-synced');
    grid.classList.add('has-pickers');
  type.addEventListener('change', syncType);
  syncType();

 
})();
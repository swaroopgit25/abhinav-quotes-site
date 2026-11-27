(function () {
  const $ = function (id) { return document.getElementById(id); };
    // Lunch and Dinner share one list (no Fruit Juices, no Saree Items). EDIT HERE.
  const MAIN_MEAL = ['Sweets', 'Hot Snacks', 'Snacks', 'Roti', 'Rice', 'Biryani Rice', 'North Indian Curries',
    'South Indian Curries', 'South Indian Fry', 'South Indian Liquids', 'Dal Items', 'Raitas', 'Chat Items', 'Soups',
    'Pickles & Chutneys', 'Podulu', 'Tiffins', 'Hot Drinks', 'Ice Creams', 'Special Items', 'Default Items', 'Water Bottles'];

  // Meal -> which dish categories to show, and the time range for Event time. EDIT HERE.
  const MEALS = {
    'Welcome Drinks':    { cats: ['Fruit Juices & Fruit Chat'], from: '10:00', to: '21:00' },
    'Breakfast': { cats: ['Sweets', 'South Indian Liquids', 'Pickles & Chutneys', 'Podulu', 'Tiffins', 'Hot Drinks', 'Water Bottles'], from: '06:00', to: '11:00',
      sessions: { Morning: { from: '06:00', to: '11:00' }, Night: { from: '19:00', to: '23:00' } } },
    'Lunch':             { cats: MAIN_MEAL, from: '11:00', to: '15:00' },
    'Snacks / High Tea': { cats: ['Sweets', 'Hot Snacks', 'Chat Items', 'Fruit Juices & Fruit Chat', 'Hot Drinks', 'Special Items', 'Water Bottles'], from: '16:00', to: '19:00' },
    'Dinner':            { cats: MAIN_MEAL, from: '19:00', to: '23:00' },
    'Saree':             { cats: ['Sweets', 'Saree Items', 'Special Items'], from: '09:00', to: '21:00' }
    
  };
    window.MEALS = MEALS;   // read by quote-picker.js for the meal tiles
  const EVENTS = ['Wedding / Reception', 'Engagement', 'Birthday Party', 'Housewarming', 'Baby Shower / Seemantham',
    'Saree / Half Saree Function', 'Pooja / Festival', 'Corporate Event', 'Other'];
  const WHATSAPP = '917794093779';

  function fill(sel, values, placeholder) {
    sel.innerHTML = '';
    if (placeholder) sel.appendChild(new Option(placeholder, ''));
    values.forEach(function (v) { sel.appendChild(new Option(v, v)); });
  }
  function label(h, m) { return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h >= 12 ? 'PM' : 'AM'); }
  function times(from, to) {
    const out = [];
    let h = +from.split(':')[0], m = +from.split(':')[1];
    const end = +to.split(':')[0] * 60 + +to.split(':')[1];
    while (h * 60 + m <= end) { out.push(label(h, m)); m += 30; if (m >= 60) { m -= 60; h++; } }
    return out;
  }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // ---- fill the dropdowns ----
  fill($('q-type'), EVENTS);
  fill($('q-meal'), Object.keys(MEALS));

  const today = new Date();
  $('q-date').min = today.toISOString().slice(0, 10);
  $('q-date').value = today.toISOString().slice(0, 10);

  // meal changes -> event times change + only that meal's dishes are shown
    window.mealSession = 'Morning';
  function mealRange(name) { const m = MEALS[name]; return m.sessions ? (m.sessions[window.mealSession] || m.sessions.Morning) : m; }
   function mealLabel(name) {
    const base = MEALS[name].sessions ? name + ' (' + window.mealSession + ')' : name;
    return base + (window.menuModeLabel ? window.menuModeLabel(name) : '');   // adds " - Standard Menu (Rs. 290/plate)" for lunch
  }
  function fillTimes() { const r = mealRange($('q-meal').value); fill($('q-time'), times(r.from, r.to), 'Select time'); }
  window.refillTimes = fillTimes;
  function onMeal() {
    const m = MEALS[$('q-meal').value];
    fillTimes();
    window.setMealFilter(m.cats, $('q-meal').value);
  }
  $('q-meal').addEventListener('change', onMeal);
  onMeal();

   // ---- service & preferences ----
  const pickedValue = function (name) { const r = document.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; };
  const checkedValues = function (name) { return Array.prototype.map.call(document.querySelectorAll('input[name="' + name + '"]:checked'), function (c) { return c.value; }); };
const listText = function (a) { return a.length ? a.join(', ') : 'None'; };

  const extrasText = function (d) {
    const out = d.extras.map(function (e) { return e === 'Live counter' && d.live.length ? 'Live counter (' + d.live.join(', ') + ')' : e; });
    return out.length ? out.join(', ') : 'None';
  };
  const staffText = function (n) { return +n > 0 ? String(+n) : 'Please suggest'; };

  // service boys: - / + buttons, always a whole number from 0 to 99
  const staff = $('q-staff');
  function setStaff(n) { n = Math.round(+n); staff.value = Math.max(0, Math.min(99, isNaN(n) ? 0 : n)); }
  $('q-staff-minus').addEventListener('click', function () { setStaff(+staff.value - 1); });
  $('q-staff-plus').addEventListener('click', function () { setStaff(+staff.value + 1); });
  staff.addEventListener('change', function () { setStaff(staff.value); });

  // pickup or delivery: a short note under the choice. EDIT THE PICKUP ADDRESS HERE.
  const PICKUP_ADDRESS = '5-1-45, Saheb Nagar, Vanasthalipuram, Hyderabad – 500070';
  function fulfilNote() {
    const delivery = pickedValue('q-fulfil') === 'Delivery by us';
    $('qs-fulfil-note').textContent = !delivery ? 'Collect from ' + PICKUP_ADDRESS + '.'
      : ($('q-address').value.trim() ? 'We’ll deliver to the address above.' : 'Please add your delivery address above.');
  }
  Array.prototype.forEach.call(document.querySelectorAll('input[name="q-fulfil"]'), function (r) { r.addEventListener('change', fulfilNote); });
  $('q-address').addEventListener('input', fulfilNote);
  fulfilNote();

  // ---- build the quotation ----
  function readForm() {
    return {
      name: $('q-name').value.trim(), phone: $('q-phone').value.trim(), email: $('q-email').value.trim(),
      address: $('q-address').value.trim(), eventType: $('q-type').value, date: $('q-date').value,
            meal: $('q-meal').value, time: $('q-time').value, guests: $('q-guests').value,
      spice: pickedValue('q-spice'), staff: $('q-staff').value, fulfil: pickedValue('q-fulfil'), notes: $('q-notes').value.trim(),
      style: pickedValue('q-style'), extras: checkedValues('q-extra'), live: checkedValues('q-live'), lang: window.LANG || 'en'
    
    };
  }
    function dishLines(picked) {
    const lines = [], order = [];
    picked.forEach(function (p) { const c = p.cat || window.ZONE_LABELS[p.zone]; if (order.indexOf(c) < 0) order.push(c); });
    order.forEach(function (c) {
      lines.push([c, picked.filter(function (p) { return (p.cat || window.ZONE_LABELS[p.zone]) === c; }).map(function (i) { return i.en; }).join(', ')]);
    });
    return lines;
  }

    // ---- a picture of the plate (leaf + dishes) for the quotation PDF ----
  function plateImage() {
    return new Promise(function (resolve) {
      try {
        const svg = $('vessel');
        if (!svg || !svg.firstChild) return resolve('');
        const clone = svg.cloneNode(true);
        const src = svg.querySelectorAll('*'), dst = clone.querySelectorAll('*');
        const props = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'opacity', 'font-family', 'font-size',
          'font-weight', 'text-anchor', 'paint-order', 'stroke-linejoin', 'dominant-baseline', 'display', 'visibility'];
        const drop = [];
        for (let i = 0; i < src.length; i++) {            // the picture is made outside the page, so copy the look of each part
          const cs = getComputedStyle(src[i]);
          props.forEach(function (p) { dst[i].style.setProperty(p, cs.getPropertyValue(p)); });
          if (cs.display === 'none' || cs.visibility === 'hidden' || src[i].closest('.slots')) drop.push(dst[i]);   // empty-slot guides
        }
        drop.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
        const size = 640;
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clone.setAttribute('width', size); clone.setAttribute('height', size);
        const img = new Image();
        const giveUp = setTimeout(function () { resolve(''); }, 5000);
        img.onload = function () {
          try {
            clearTimeout(giveUp);
            const c = document.createElement('canvas'); c.width = size; c.height = size;
            const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0, size, size);
            const px = ctx.getImageData(0, 0, size, size).data;        // cut away the empty space around the plate
            let x0 = size, y0 = size, x1 = -1, y1 = -1;
            for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
              if (px[(y * size + x) * 4 + 3] > 12) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
            }
            if (x1 < x0) return resolve('');
            const pad = 10; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(size - 1, x1 + pad); y1 = Math.min(size - 1, y1 + pad);
            const out = document.createElement('canvas'); out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
            out.getContext('2d').drawImage(c, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
            resolve(out.toDataURL('image/png'));
          } catch (e) { resolve(''); }
        };
        img.onerror = function () { clearTimeout(giveUp); resolve(''); };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
      } catch (e) { resolve(''); }
    });
  }

    // ---- several meals in one quotation ----
  const savedMeals = [];
  function currentMeal() {
    const picked = window.getPicked().slice();
           return { meal: $('q-meal').value, label: mealLabel($('q-meal').value), menu: window.menuModeOf ? window.menuModeOf($('q-meal').value) : '',
        time: $('q-time').value, guests: $('q-guests').value, picked: picked, lines: dishLines(picked) };
  }
   function title(m) { return (m.label || m.meal) + (m.time ? ' · ' + m.time : '') + (m.guests ? ' · ' + m.guests + ' guests' : ''); }
  function renderSaved() {
    const box = $('saved-meals');
    box.innerHTML = '';
    savedMeals.forEach(function (m, i) {
      const row = el('div', 'saved-meal');
      row.appendChild(el('b', '', title(m) + ' (' + m.picked.length + ' dishes)'));
      const rm = el('button', '', 'Remove'); rm.type = 'button';
      rm.addEventListener('click', function () { savedMeals.splice(i, 1); renderSaved(); });
      row.appendChild(rm);
      box.appendChild(row);
    });
    box.hidden = !savedMeals.length;
  }
   $('save-meal-btn').addEventListener('click', function () {
    const msg = $('quote-msg');
    if (!window.getPicked().length) { msg.textContent = 'Pick at least one dish before saving this meal.'; return; }
    const m = currentMeal();
    plateImage().then(function (png) {            // picture first, then the dishes are cleared
      m.plate = png;
      savedMeals.push(m);
      renderSaved();
      window.clearPicked();
      msg.textContent = m.meal + ' saved. Now choose the next meal above and pick its dishes.';
      ($('mf') || $('q-meal')).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

   $('quote-btn').addEventListener('click', function () {
    const msg = $('quote-msg'), d = readForm();
    const meals = savedMeals.slice();
        const current = window.getPicked().length ? currentMeal() : null;
    if (current) meals.push(current);   // the meal on screen counts tooif (window.getPicked().length) meals.push(currentMeal());   // the meal on screen counts too
    msg.textContent = '';
    if (!d.name) { msg.textContent = 'Please enter your name.'; $('q-name').focus(); return; }
    if (d.phone.replace(/\D/g, '').length < 10) { msg.textContent = 'Please enter a valid phone number.'; $('q-phone').focus(); return; }
    if (!meals.length) { msg.textContent = 'Please pick at least one dish from the Items panel.'; return; }

    const btn = $('quote-btn');
    btn.disabled = true;
    msg.textContent = 'Sending your quotation…';

        (current ? plateImage() : Promise.resolve('')).then(function (png) {
    if (current) current.plate = png;
    // what we send: the form + every meal with its dishes grouped by category (the PDF and the email use this)
    const payload = Object.assign({}, d, { meals: meals.map(function (m) {
           return { meal: m.meal, label: m.label, menu: m.menu, time: m.time, guests: m.guests, plate: m.plate || '',
        dishes: m.picked.map(function (p) { return { en: p.en, zone: p.zone, cat: p.cat || window.ZONE_LABELS[p.zone] }; }) };
    }) });

    // the quotation goes to our server, which saves it, emails the PDF and passes it on to the management site
    if (!IS_IOS) downloadPdf(payload);   // start the PDF at once (iPhone must wait, its download replaces the page)
    fetch('/api/quote', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error('not saved');
        msg.textContent = '';
       lastPayload = payload;
showSent(d, meals);
if (IS_IOS) downloadPdf(payload);
      })
      .catch(function () {
        msg.textContent = 'Sorry, we could not send your quotation. Please try again, or call us on 77940 93779.';
      })
      .then(function () { btn.disabled = false; });
      }); // end of the plate picture step before the handler's final });
  });

    // PDF download = a normal form post, so it works on desktop, Android, iPhone and iPad alike
  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let lastPayload = null;
function downloadPdf(payload) {
  if (IS_IOS) {   // iPhone/iPad: a normal form post to the page itself
    const f = document.createElement('form');
    f.method = 'POST'; f.action = '/api/quote-pdf'; f.target = '_self'; f.hidden = true;
    const i = document.createElement('input'); i.type = 'hidden'; i.name = 'data'; i.value = JSON.stringify(payload);
    f.appendChild(i); document.body.appendChild(f); f.submit();
    setTimeout(function () { f.remove(); }, 3000);
    return;
  }
    // Android, tablets, computers: the PDF downloads by itself (no message). One quiet retry if the first try fails.
  function go(tries) {
    fetch('/api/quote-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: JSON.stringify(payload) }) })
      .then(function (r) { if (!r.ok) throw new Error('pdf ' + r.status); return r.blob(); })
      .then(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'Abhinav-Caterers-Quotation.pdf'; a.hidden = true;
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 10000);
      })
      .catch(function () { if (tries > 0) setTimeout(function () { go(tries - 1); }, 2500); });
  }
  go(1);
}


     function showSent(d, meals) {
    const box = $('quote-result');
    box.innerHTML = '';
    box.appendChild(el('h3', '', 'Your quotation request'));
    const grid = function (rows) {
      const g = el('div', 'qr-grid');
      rows.forEach(function (r) {
        const c = el('div'); c.appendChild(el('small', '', r[0])); c.appendChild(el('b', '', r[1])); g.appendChild(c);
      });
      return g;
    };
    box.appendChild(grid([['Name', d.name], ['Phone', d.phone], ['Event', d.eventType], ['Date', d.date]]));
    meals.forEach(function (m) {                               // the menu
      box.appendChild(el('h4', '', title(m)));
      m.lines.forEach(function (l) {
        const row = el('div', 'picked-zone'); row.appendChild(el('b', '', l[0]));
        row.appendChild(el('span', '', l[1])); box.appendChild(row);
      });
    });

        const priced = meals.filter(function (m) { return m.menu === 'standard' || m.menu === 'all'; });
    if (priced.length) {
      box.appendChild(el('h4', '', 'Price'));
      let sum = 0, anyAll = false;
      priced.forEach(function (m) {
        const row = el('div', 'picked-zone'); row.appendChild(el('b', '', m.meal));
        const g = parseInt(m.guests, 10) > 0 ? parseInt(m.guests, 10) : 0;
        if (m.menu === 'standard') {
          const rate = window.STANDARD_PRICE_RS || 290;
          row.appendChild(el('span', '', g ? 'Standard Menu: Rs. ' + rate + ' x ' + g + ' guests = Rs. ' + (rate * g).toLocaleString('en-IN')
            : 'Standard Menu: Rs. ' + rate + ' per plate'));
          sum += rate * g;
        } else { anyAll = true; row.appendChild(el('span', '', 'All Events Menu: price to be finalised with Mrs. Vuppala Jagadeeswari')); }
        box.appendChild(row);
      });
      if (priced.some(function (m) { return m.menu === 'standard'; })) box.appendChild(el('p', 'qr-note', 'Note: the Standard Menu rate may vary in some seasons or due to inflation.'));
      if (sum > 0) { const t = el('div', 'picked-zone'); t.appendChild(el('b', '', anyAll ? 'Total (Standard Menu only)' : 'Total'));
        t.appendChild(el('span', '', 'Rs. ' + sum.toLocaleString('en-IN'))); box.appendChild(t); }
    }


    const more = grid([['Service boys', staffText(d.staff)], ['Spice level', d.spice], ['Pickup / delivery', d.fulfil],
      ['Serving style', d.style], ['Extras', extrasText(d)]]);   // after the menu
    more.style.marginTop = '18px';
    box.appendChild(more);
        box.appendChild(el('p', 'qr-note', 'Note: Service boys are charged extra. The amount will be confirmed in your final quotation.'));
    if (d.notes) { const nr = el('div', 'picked-zone'); nr.appendChild(el('b', '', 'Special requests')); nr.appendChild(el('span', '', d.notes)); box.appendChild(nr); }
    const thanks = el('div', 'qr-thanks');
    thanks.appendChild(el('h4', '', 'Your quotation has been sent ✓'));
        thanks.appendChild(el('p', '', meals.some(function (m) { return m.menu === 'all'; })
      ? 'Mrs. Vuppala Jagadeeswari will review your selection and call you to discuss and finalise the price.'
      : 'Mrs. Vuppala Jagadeeswari will call you for further details and any changes.'));
    thanks.appendChild(el('p', '', 'Thank you for choosing Abhinav Caterers.'));
    box.appendChild(thanks);

const dl = el('button', 'outline', 'Download PDF'); dl.type = 'button';
dl.addEventListener('click', function () { if (lastPayload) downloadPdf(lastPayload); });
box.appendChild(dl);
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
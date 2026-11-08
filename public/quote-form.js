(function () {
  const $ = function (id) { return document.getElementById(id); };
  const ALL = null; // null = show every dish category

  // Meal -> which dish categories to show, and the time range for Event time. EDIT HERE.
  const MEALS = {
    'Welcome Drinks':    { cats: ['Fruit Juices & Fruit Chat'], from: '10:00', to: '21:00' },
    'Breakfast': { cats: ['Sweets', 'South Indian Liquids', 'Pickles & Chutneys', 'Podulu', 'Tiffins', 'Hot Drinks', 'Default Items', 'Water Bottles'], from: '06:00', to: '11:00' },
    'Lunch':             { cats: ALL, from: '11:00', to: '15:00' },
    'Snacks / High Tea': { cats: ['Hot Snacks', 'Chat Items', 'Fruit Juices & Fruit Chat', 'Hot Drinks', 'Special Items', 'Default Items', 'Water Bottles'], from: '16:00', to: '19:00' },
    'Dinner':            { cats: ALL, from: '19:00', to: '23:00' },
    'Saree':             { cats: ['Sweets', 'Saree Items', 'Special Items'], from: '09:00', to: '21:00' }
    
  };
  const EVENTS = ['Wedding / Reception', 'Engagement', 'Birthday Party', 'Housewarming', 'Baby Shower / Seemantham',
    'Saree / Half Saree Function', 'Pooja / Festival', 'Corporate Event', 'Other'];
  const GUESTS = ['Manual', 50, 100, 150, 200, 300, 400, 500, 750, 1000];
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
  fill($('q-guestsel'), GUESTS);
  const today = new Date();
  $('q-date').min = today.toISOString().slice(0, 10);
  $('q-date').value = today.toISOString().slice(0, 10);

  // meal changes -> event times change + only that meal's dishes are shown
  function onMeal() {
    const m = MEALS[$('q-meal').value];
    fill($('q-time'), times(m.from, m.to), 'Select time');
       window.setMealFilter(m.cats, $('q-meal').value);
  }
  $('q-meal').addEventListener('change', onMeal);
  onMeal();

  // guests preset fills the number box; "Manual" lets the customer type
  $('q-guestsel').addEventListener('change', function () {
    const v = $('q-guestsel').value;
    if (v === 'Manual') { $('q-guests').value = ''; $('q-guests').focus(); }
    else $('q-guests').value = v;
  });

  // ---- build the quotation ----
  function readForm() {
    return {
      name: $('q-name').value.trim(), phone: $('q-phone').value.trim(), email: $('q-email').value.trim(),
      address: $('q-address').value.trim(), eventType: $('q-type').value, date: $('q-date').value,
      meal: $('q-meal').value, time: $('q-time').value, guests: $('q-guests').value
    };
  }
  function dishLines(picked) {
    const lines = [];
    Object.keys(window.ZONE_LABELS).forEach(function (zone) {
      const items = picked.filter(function (p) { return p.zone === zone; });
      if (items.length) lines.push([window.ZONE_LABELS[zone], items.map(function (i) { return i.en; }).join(', ')]);
    });
    return lines;
  }

    // ---- several meals in one quotation ----
  const savedMeals = [];
  function currentMeal() {
    const picked = window.getPicked().slice();
    return { meal: $('q-meal').value, time: $('q-time').value, guests: $('q-guests').value, picked: picked, lines: dishLines(picked) };
  }
  function title(m) { return m.meal + (m.time ? ' · ' + m.time : '') + (m.guests ? ' · ' + m.guests + ' guests' : ''); }
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
    savedMeals.push(m);
    renderSaved();
    window.clearPicked();
    msg.textContent = m.meal + ' saved. Now choose the next meal above and pick its dishes.';
    $('q-meal').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  $('quote-btn').addEventListener('click', function () {
    const msg = $('quote-msg'), d = readForm();
    const meals = savedMeals.slice();
    if (window.getPicked().length) meals.push(currentMeal());   // the meal on screen counts too
    msg.textContent = '';
    if (!d.name) { msg.textContent = 'Please enter your name.'; $('q-name').focus(); return; }
    if (d.phone.replace(/\D/g, '').length < 10) { msg.textContent = 'Please enter a valid phone number.'; $('q-phone').focus(); return; }
    if (!meals.length) { msg.textContent = 'Please pick at least one dish from the Items panel.'; return; }

    fetch('/api/quote', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, d, { meals: meals.map(function (m) {
        return { meal: m.meal, time: m.time, guests: m.guests, dishes: m.picked.map(function (p) { return { en: p.en, zone: p.zone }; }) };
      }) }))
    }).catch(function () {});

    let text = 'Quotation request - Abhinav Caterers\n\nName: ' + d.name + '\nPhone: ' + d.phone
      + (d.email ? '\nEmail: ' + d.email : '') + (d.address ? '\nAddress: ' + d.address : '')
      + '\nEvent: ' + d.eventType + '\nDate: ' + d.date;
    meals.forEach(function (m) {
      text += '\n\n' + title(m) + ':\n' + m.lines.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n');
    });

    const box = $('quote-result');
    box.innerHTML = '';
    box.appendChild(el('h3', '', 'Your quotation request'));
    const grid = el('div', 'qr-grid');
    [['Name', d.name], ['Phone', d.phone], ['Event', d.eventType], ['Date', d.date]].forEach(function (r) {
      const c = el('div'); c.appendChild(el('small', '', r[0])); c.appendChild(el('b', '', r[1])); grid.appendChild(c);
    });
    box.appendChild(grid);
    meals.forEach(function (m) {
      box.appendChild(el('h4', '', title(m)));
      m.lines.forEach(function (l) {
        const row = el('div', 'picked-zone'); row.appendChild(el('b', '', l[0]));
        row.appendChild(el('span', '', l[1])); box.appendChild(row);
      });
    });
    const wa = el('a', 'primary', 'Send on WhatsApp ✦');
    wa.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
    wa.target = '_blank'; wa.rel = 'noopener';
    box.appendChild(wa);
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
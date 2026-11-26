const app = document.getElementById('app');

// what the customer has picked: [{ key, en, te, zone }]
const picked = [];
function keyOf(zone, en) { return zone + ':' + en; }
function pickedIndex(key) { return picked.findIndex(function (p) { return p.key === key; }); }

// ---- category names: tolerate small spelling differences between menu.js and the meal lists ----
function normName(s) { return String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim(); }
const JUICE_NAME_IN_CONFIG = window.JUICE_CAT;   // the spelling the meal lists use
function resolveCat(name) {
  const n = normName(name);
  const hit = window.MENU.find(function (c) { return normName(c.category) === n; });
  if (hit) return hit.category;
  if (n === normName(JUICE_NAME_IN_CONFIG) && window.JUICE_CAT !== JUICE_NAME_IN_CONFIG) return window.JUICE_CAT;   // juice category was renamed in menu.js
  return null;
}
// the juice category: exact name if it exists, else any category with "juice" in its name
(function () {
  const exact = resolveCat(window.JUICE_CAT);
  const loose = window.MENU.find(function (c) { return /juice/i.test(c.category); });
  if (exact) window.JUICE_CAT = exact;
  else if (loose) window.JUICE_CAT = loose.category;
  else console.warn('Planner: no juice category found in menu.js (expected "' + window.JUICE_CAT + '").');
})();

const tabs = document.getElementById('items-tabs');
const list = document.getElementById('items-list');

const pickedBox = document.createElement('div');
pickedBox.className = 'picked';
app.appendChild(pickedBox);

const state = { vessel: window.VESSELS[0], allowed: null, drink: false, group: null, meal: '' };
const vesselSvg = document.getElementById('vessel');
const vesselSwitch = document.getElementById('vessel-switch');

// ---- picking dishes ----
function isJuice(p) { return p.cat === window.JUICE_CAT; }
function redrawDishes(newKey) {
    if (state.drink) { window.renderExtras(vesselSvg, [], null); window.renderDrinkTray(vesselSvg, picked.filter(isJuice), newKey); }   // Welcome Drinks: glasses
  else window.renderDishes(vesselSvg, state.vessel, picked, newKey);
}

function togglePick(dish, zone) {
  const key = keyOf(zone, dish.en);
  const i = pickedIndex(key);
    if (i < 0 && window.beforePick && window.beforePick(dish) === false) return;   // Standard Menu: one dish per section
  if (i >= 0 && window.beforeUnpick && window.beforeUnpick(dish) === false) return;   // Standard Menu: keep rice and curry combos valid
  if (i >= 0) picked.splice(i, 1);                       // already picked: remove it
   else picked.push({ key: key, en: dish.en, te: dish.te, zone: zone, cat: dish.cat });

  list.querySelectorAll('.chip').forEach(function (c) {  // highlight / unhighlight the button
    if (c.dataset.key === key) c.classList.toggle('selected', i < 0);
  });
  redrawDishes(i < 0 ? key : null);
  renderPicked();
}
function clearAll() {
  picked.length = 0;
  list.querySelectorAll('.chip.selected').forEach(function (c) { c.classList.remove('selected'); });
  redrawDishes('*');
  renderPicked();
}
window.clearPicked = clearAll;
function renderPicked() {
  pickedBox.innerHTML = '';
  const h = document.createElement('h3');
  h.textContent = 'Your menu (' + picked.length + ')';
  pickedBox.appendChild(h);
    if (picked.length) {
    const clr = document.createElement('button');
    clr.type = 'button';
    clr.className = 'clear-all';
    clr.textContent = 'Clear all';
    clr.addEventListener('click', clearAll);
    pickedBox.appendChild(clr);
  }

  if (!picked.length) {
    const p = document.createElement('p');
    p.className = 'picked-empty';
    p.textContent = 'Tap dishes above to place them on your plate.';
    pickedBox.appendChild(p);
    return;
  }
   const cats = [];
  picked.forEach(function (p) { const c = p.cat || window.ZONE_LABELS[p.zone]; if (cats.indexOf(c) < 0) cats.push(c); });
  cats.forEach(function (cat) {
    const items = picked.filter(function (p) { return (p.cat || window.ZONE_LABELS[p.zone]) === cat; });
    const row = document.createElement('div');
    row.className = 'picked-zone';
    const label = document.createElement('b');
        label.textContent = cat;
    row.appendChild(label);
    items.forEach(function (it) {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'pill';
      pill.textContent = it.en + ' ';
      const x = document.createElement('span');
      x.textContent = '×';
      pill.appendChild(x);
      pill.addEventListener('click', function () { togglePick(it, it.zone); });
      row.appendChild(pill);
    });
    pickedBox.appendChild(row);
  });
}

// ---- dish tabs and buttons ----
function showGroup(group) {
  if (!group) return;
  state.group = group;
  Array.from(tabs.children).forEach(function (b) {
    b.classList.toggle('active', b.dataset.id === group.id);
  });

  list.innerHTML = '';
    visibleDishes(group).forEach(function (d) {
        const zone = group.zone || zoneOfCat(d.cat);   // the "All" tab has no single zone
    const key = keyOf(zone, d.en);
    const chip = document.createElement('button');
    chip.className = 'chip' + (pickedIndex(key) >= 0 ? ' selected' : '');
    chip.type = 'button';
    chip.dataset.key = key;

        const pic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');   // little picture of the dish
    pic.setAttribute('viewBox', '-21 -21 42 42');
    pic.setAttribute('class', 'chip-pic');
      pic.innerHTML = window.foodArt(d.en, zone, d.cat);
    chip.appendChild(pic);

    const en = document.createElement('span');
    en.textContent = d.en;
    chip.appendChild(en);

    if (d.te) {
      const te = document.createElement('small');
      te.textContent = d.te;
      chip.appendChild(te);
    }
    chip.addEventListener('click', function () { togglePick(d, zone); });
    list.appendChild(chip);
  });
}
// only show dishes of the chosen meal (allowed = list of categories, or null for all)
function visibleDishes(group) {
  return window.dishesOf(group).filter(function (d) {
    return !state.allowed || state.allowed.indexOf(d.cat) >= 0;
  });
}

// ---- one tab per menu category of the chosen meal, plus "All" ----
function zoneOfCat(cat) {
  const g = window.GROUPS.find(function (x) { return x.cats.indexOf(cat) >= 0; });
  return g ? g.zone : 'starter';
}
function buildTabs() {
  tabs.innerHTML = '';
  const cats = window.MENU.map(function (c) { return c.category; })
    .filter(function (c) { return !state.allowed || state.allowed.indexOf(c) >= 0; })
    .sort(function (a, b) { return (a === 'Water Bottles') - (b === 'Water Bottles'); });   // water bottles last
  const groups = cats.map(function (c) { return { id: 'cat:' + c, label: c, zone: zoneOfCat(c), cats: [c] }; });
  if (!groups.length) {   // nothing in menu.js matches this meal: say so instead of failing silently
    console.warn('Planner: no menu category matches this meal. Meal wants:', state.allowed,
      'menu.js has:', window.MENU.map(function (c) { return c.category; }));
    list.innerHTML = '';
    const msg = document.createElement('p');
    msg.className = 'picked-empty';
    msg.style.gridColumn = '1 / -1';
    msg.textContent = 'No items found for this meal yet.';
    list.appendChild(msg);
    state.group = null;
    return;
  }
  if (groups.length > 1) groups.unshift({ id: 'all', label: 'All', zone: null, cats: cats });
  groups.forEach(function (g) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tab'; b.dataset.id = g.id; b.textContent = g.label;
    b.addEventListener('click', function () { showGroup(g); });
    tabs.appendChild(b);
  });
  showGroup(groups[0]);
}

window.setMealFilter = function (cats, meal) {
  const mealChanged = (meal || '') !== state.meal;
  if (cats) {   // match each name to the real category in menu.js (ignores case, spaces, "&" vs "and")
    cats = cats.map(function (c) {
      const real = resolveCat(c);
      if (!real) console.warn('Planner: "' + c + '" is not a category in menu.js');
      return real;
    }).filter(Boolean);
  }
  state.allowed = cats;
  state.meal = meal || '';
    if (mealChanged) { picked.length = 0; renderPicked(); }   // a different meal starts with an empty plate
  state.drink = !!cats && cats.length === 1 && cats[0] === window.JUICE_CAT;   // Welcome Drinks
  const plates = availableVessels();
if (mealChanged || plates.indexOf(state.vessel) < 0) state.vessel = plates[0] || window.VESSELS[0];   // first plate of the meal (banana leaf for lunch and dinner)
buildSwitch();   // glasses <-> plates for this meal
buildTabs();   // one tab per category of this meal
  if (state.drink) redrawDishes('*'); else showVessel(state.vessel);
};
window.getPicked = function () { return picked; };
window.clearPicked = function () {
  picked.length = 0;
  list.querySelectorAll('.chip.selected').forEach(function (c) { c.classList.remove('selected'); });
  redrawDishes('*');
  renderPicked();
};
window.GROUPS.forEach(function (g) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'tab';
  b.dataset.id = g.id;
  b.textContent = g.label;
  b.addEventListener('click', function () { showGroup(g); });
  tabs.appendChild(b);
});

// ---- plate (vessel) picker ----
function showVessel(v) {
  state.vessel = v;
  Array.from(vesselSwitch.children).forEach(function (b) {
    b.classList.toggle('active', b.dataset.id === v.id);
  });
  window.renderVessel(vesselSvg, v);
  // the dishes land after the plate has dropped in
  setTimeout(function () { if (state.vessel === v) redrawDishes('*'); }, 450);
}

function showGlass(g) {
  window.glassStyle = g.id;
  Array.from(vesselSwitch.children).forEach(function (b) { b.classList.toggle('active', b.dataset.id === g.id); });
  redrawDishes('*');                         // every glass pours again in the new style
  if (state.group) showGroup(state.group);   // refresh the small glass pictures
}

// plates allowed for the chosen meal (a plate with "meals" is only for those meals)
function availableVessels() {
  return window.VESSELS.filter(function (v) { return !v.meals || v.meals.indexOf(state.meal) >= 0; });
}

function buildSwitch() {
  vesselSwitch.innerHTML = '';
  const opts = state.drink ? window.GLASSES : availableVessels();
  opts.forEach(function (v) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.id = v.id;
    b.textContent = v.label;
    b.className = 'tab' + ((state.drink ? window.glassStyle === v.id : state.vessel.id === v.id) ? ' active' : '');
    b.addEventListener('click', function () { if (state.drink) showGlass(v); else showVessel(v); });
    vesselSwitch.appendChild(b);
  });
}
buildSwitch();

showGroup(window.GROUPS[0]);
renderPicked();
showVessel(window.VESSELS[0]);

// redraw the plate (so it animates) when the planner opens
document.addEventListener('planner-open', function () {
  if (state.drink) redrawDishes('*'); else showVessel(state.vessel);
});



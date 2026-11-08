const app = document.getElementById('app');

// what the customer has picked: [{ key, en, te, zone }]
const picked = [];
function keyOf(zone, en) { return zone + ':' + en; }
function pickedIndex(key) { return picked.findIndex(function (p) { return p.key === key; }); }

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
  if (state.drink) window.renderDrinkTray(vesselSvg, picked.filter(isJuice), newKey);   // Welcome Drinks: glasses
  else window.renderDishes(vesselSvg, state.vessel, picked, newKey);
}

function togglePick(dish, zone) {
  const key = keyOf(zone, dish.en);
  const i = pickedIndex(key);
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
  Object.keys(window.ZONE_LABELS).forEach(function (zone) {
    const items = picked.filter(function (p) { return p.zone === zone; });
    if (!items.length) return;
    const row = document.createElement('div');
    row.className = 'picked-zone';
    const label = document.createElement('b');
    label.textContent = window.ZONE_LABELS[zone];
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
  state.group = group;
  Array.from(tabs.children).forEach(function (b) {
    b.classList.toggle('active', b.dataset.id === group.id);
  });

  list.innerHTML = '';
    visibleDishes(group).forEach(function (d) {
    const key = keyOf(group.zone, d.en);
    const chip = document.createElement('button');
    chip.className = 'chip' + (pickedIndex(key) >= 0 ? ' selected' : '');
    chip.type = 'button';
    chip.dataset.key = key;

        const pic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');   // little picture of the dish
    pic.setAttribute('viewBox', '-21 -21 42 42');
    pic.setAttribute('class', 'chip-pic');
      pic.innerHTML = window.foodArt(d.en, group.zone, d.cat);
    chip.appendChild(pic);

    const en = document.createElement('span');
    en.textContent = d.en;
    chip.appendChild(en);

    if (d.te) {
      const te = document.createElement('small');
      te.textContent = d.te;
      chip.appendChild(te);
    }
    chip.addEventListener('click', function () { togglePick(d, group.zone); });
    list.appendChild(chip);
  });
}
// only show dishes of the chosen meal (allowed = list of categories, or null for all)
function visibleDishes(group) {
  return window.dishesOf(group).filter(function (d) {
    return !state.allowed || state.allowed.indexOf(d.cat) >= 0;
  });
}
window.setMealFilter = function (cats, meal) {
  const mealChanged = (meal || '') !== state.meal;
  state.allowed = cats;
  state.meal = meal || '';
  state.drink = !!cats && cats.length === 1 && cats[0] === window.JUICE_CAT;   // Welcome Drinks
  const plates = availableVessels();
if (mealChanged || plates.indexOf(state.vessel) < 0) state.vessel = plates[0];   // first plate of the meal (banana leaf for lunch and dinner)
buildSwitch();   // glasses <-> plates for this meal
let first = null;
  Array.from(tabs.children).forEach(function (b, i) {
    const has = visibleDishes(window.GROUPS[i]).length > 0;
    b.hidden = !has;
    if (has && !first) first = window.GROUPS[i];
  });
  if (first) showGroup(first);
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
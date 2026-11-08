// Which categories belong to which customer-facing tab.
// "cats" must match the category names in menu.js exactly.
window.GROUPS = [
  { id: 'welcome', label: 'Welcome Drinks', zone: 'drink',
    cats: ['Fruit Juices & Fruit Chat'] },
  { id: 'tiffin', label: 'Tiffins', zone: 'starter',
    cats: ['Tiffins'] },
  { id: 'starters', label: 'Starters & Snacks', zone: 'starter',
    cats: ['Hot Snacks', 'Snacks', 'Chat Items', 'Soups'] },
  { id: 'rice', label: 'Rice & Roti', zone: 'rice',
    cats: ['Roti', 'Rice', 'Biryani Rice'] },
  { id: 'curries', label: 'Curries & Dal', zone: 'curry',
    cats: ['North Indian Curries', 'South Indian Curries', 'South Indian Fry',
           'Dal Items', 'South Indian Liquids'] },
  { id: 'sweets', label: 'Sweets', zone: 'sweet',
    cats: ['Sweets'] },
  { id: 'sides', label: 'Sides & Pickles', zone: 'side',
    cats: ['Raitas', 'Pickles & Chutneys', 'Podulu', 'Default Items'] },
  { id: 'drinks', label: 'Drinks & Ice Cream', zone: 'drink',
    cats: ['Hot Drinks', 'Ice Creams'] },
    { id: 'water', label: 'Water Bottles', zone: 'water',
  cats: ['Water Bottles'] },
  { id: 'special', label: 'Saree & Special', zone: 'special',
    cats: ['Saree Items', 'Special Items'] }
];

// All dishes of one group, as { en, te, cat } objects.
window.dishesOf = function (group) {
  const out = [];
  group.cats.forEach(function (catName) {
    const cat = window.MENU.find(function (c) { return c.category === catName; });
    if (!cat) return;
    cat.items.forEach(function (name) {
      out.push({ en: name, te: (window.MENU_TE || {})[name] || '', cat: catName });
    });
  });
  return out;
};
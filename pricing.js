// One place that works out the price for the quotation PDF and the emails.
// EDIT HERE: keep STANDARD_PRICE the same as STANDARD_PRICE in public/menu-first.js
const STANDARD_PRICE = 290;
const OWNER_NAME = 'Mrs. Vuppala Jagadeeswari';

const inr = function (n) { return 'Rs. ' + Number(n).toLocaleString('en-IN'); };

function priceInfo(q) {
  const items = [];
  let total = 0;
  (q && q.meals || []).forEach(function (m) {
    if (m.menu !== 'standard' && m.menu !== 'all') return;
    const guests = parseInt(m.guests, 10) > 0 ? parseInt(m.guests, 10) : 0;
    const item = { meal: m.meal || 'Meal', kind: m.menu, guests: guests, amount: 0 };
    if (m.menu === 'standard' && guests) { item.amount = guests * STANDARD_PRICE; total += item.amount; }
    items.push(item);
  });
  return {
    items: items, total: total,
    hasStd: items.some(function (i) { return i.kind === 'standard'; }),
    hasAll: items.some(function (i) { return i.kind === 'all'; })
  };
}

function standardText(item) {
  if (!item.guests) return inr(STANDARD_PRICE) + ' per plate (total will be confirmed once the number of guests is final)';
  return inr(STANDARD_PRICE) + ' x ' + item.guests + ' guests = ' + inr(item.amount);
}

module.exports = { STANDARD_PRICE, OWNER_NAME, inr, priceInfo, standardText };
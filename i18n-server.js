// Loads the same word lists the website uses (public/i18n-core.js, menu-te.js, menu-hi.js), so the PDF and the email
// are translated exactly like the page. Nothing to edit here.
const fs = require('fs');
const path = require('path');
let cached = null;
function loadI18n() {
  if (cached) return cached;
  const dir = path.join(__dirname, 'public'), win = {};
  ['menu-te.js', 'menu-hi.js', 'i18n-core.js'].forEach(function (f) {
    new Function('window', fs.readFileSync(path.join(dir, f), 'utf8'))(win);
  });
  cached = win.I18N;
  return cached;
}
module.exports = { loadI18n };
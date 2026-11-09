/* Menu section: Standard Menu + All Events Menu, built from menu.js and menu-te.js */
(function () {
  var MENU = window.MENU || [], TE = window.MENU_TE || {};
  var tabs = document.getElementById('mn-tabs');
  var chipsBox = document.getElementById('mn-cats');
  var listBox = document.getElementById('mn-list');
  var countBox = document.getElementById('mn-count');
  var search = document.getElementById('mn-search');
  var pdfLink = document.getElementById('mn-pdf');
  if (!MENU.length || !tabs || !chipsBox || !listBox || !search) return;

  /* Which categories each menu shows, in the same order as the printed PDFs.
     ['Real category name', 'Name to show'] renames a heading. */
  var SETS = {
    standard: {
      pdf: './assets/Abhinav-Caterers-Standard-Menu.pdf',
      cats: ['Sweets', 'Hot Snacks', 'Rice', 'Biryani Rice', 'South Indian Curries',
             'North Indian Curries', 'Dal Items', ['South Indian Liquids', 'Sambar (Liquids)'], 'Default Items']
    },
    all: {
      pdf: './assets/Abhinav-Caterers-All-Events-Menu.pdf',
      cats: ['Sweets', 'Hot Snacks', 'Saree Items', 'Snacks', 'Roti', 'Rice', 'Biryani Rice',
             'North Indian Curries', 'South Indian Curries', 'South Indian Fry', 'South Indian Liquids',
             'Dal Items', 'Raitas', 'Chat Items', 'Soups', 'Pickles & Chutneys', 'Podulu', 'Tiffins',
             'Fruit Juices & Fruit Chat', 'Hot Drinks', 'Ice Creams', 'Special Items', 'Default Items']
    }
  };

  var byName = {};
  MENU.forEach(function (c) { byName[c.category] = c.items; });

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function catsOf(key) {
    return SETS[key].cats.map(function (c) {
      var name = Array.isArray(c) ? c[0] : c;
      var label = Array.isArray(c) ? c[1] : c;
      return { name: name, label: label, items: byName[name] || [] };
    }).filter(function (c) { return c.items.length; });
  }

  var menuKey = 'standard', catIdx = 0;

  function itemHtml(name, n, i) {
    var te = TE[name] || '';
    return '<div class="mn-item" style="--i:' + i + '"><span class="n">' + n + '</span><span>' +
      '<span class="en">' + esc(name) + '</span>' +
      (te ? '<span class="te">' + esc(te) + '</span>' : '') + '</span></div>';
  }

  function render() {
    var cats = catsOf(menuKey);
    if (catIdx >= cats.length) catIdx = 0;
    var q = search.value.trim().toLowerCase();

    chipsBox.innerHTML = cats.map(function (c, i) {
      return '<button type="button" class="mn-chip' + (!q && i === catIdx ? ' active' : '') + '" data-i="' + i + '">' +
        esc(c.label) + '<small>' + c.items.length + '</small></button>';
    }).join('');

    var html = '', shown = 0;
    if (q) {                                   // searching: look through every category of this menu
      cats.forEach(function (c) {
        var rows = '', k = 0;
        c.items.forEach(function (name, idx) {
          if (name.toLowerCase().indexOf(q) < 0 && (TE[name] || '').toLowerCase().indexOf(q) < 0) return;
          rows += itemHtml(name, idx + 1, k++);
        });
        if (rows) { html += '<h3 class="mn-group">' + esc(c.label) + '</h3>' + rows; shown += k; }
      });
      if (!shown) html = '<p class="mn-empty">No dish found for “' + esc(search.value.trim()) + '”. Try another spelling.</p>';
      countBox.textContent = shown ? shown + (shown > 1 ? ' dishes found' : ' dish found') : '';
    } else {                                   // normal: one category at a time
      var cat = cats[catIdx];
      html = cat.items.map(function (name, idx) { return itemHtml(name, idx + 1, idx); }).join('');
      countBox.textContent = cat.label + ': ' + cat.items.length + ' dishes';
    }
    listBox.innerHTML = html;
  }

  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('.mn-tab');
    if (!b) return;
    menuKey = b.getAttribute('data-menu');
    catIdx = 0;
    Array.prototype.forEach.call(tabs.querySelectorAll('.mn-tab'), function (t) {
      var on = (t === b);
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (pdfLink) pdfLink.href = SETS[menuKey].pdf;
    render();
  });

  chipsBox.addEventListener('click', function (e) {
    var b = e.target.closest('.mn-chip');
    if (!b) return;
    catIdx = +b.getAttribute('data-i');
    search.value = '';
    render();
  });

  search.addEventListener('input', render);
  render();
})();
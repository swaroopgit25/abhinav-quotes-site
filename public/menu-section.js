/* Menu section: Standard Menu + All Events Menu, built from menu.js and menu-te.js.
   A category chip opens a dropdown panel with that category's dishes. */
(function () {
  var MENU = window.MENU || [], TE = window.MENU_TE || {};
  var tabs = document.getElementById('mn-tabs');
  var chipsBox = document.getElementById('mn-cats');
  var listBox = document.getElementById('mn-list');
  var countBox = document.getElementById('mn-count');
  var search = document.getElementById('mn-search');
  var pdfLink = document.getElementById('mn-pdf');
  var drop = document.getElementById('mn-drop');
  var dropIn = document.getElementById('mn-drop-in');
  var dropTitle = document.getElementById('mn-drop-title');
  var dropMeta = document.getElementById('mn-drop-meta');
  var dropClose = document.getElementById('mn-drop-close');
  var dropScroll = document.getElementById('mn-drop-scroll');
  if (!MENU.length || !tabs || !chipsBox || !listBox || !search || !drop) return;

  /* plan (standard only) = how the standard menu is ordered, e.g. "2- Hot" = 2 hot snacks.
     The ticket rail reads these same lists. */
  var SETS = {
    standard: {
      pdf: './assets/Abhinav-Caterers-Standard-Menu.pdf',
      cats: ['Sweets', 'Hot Snacks', 'Rice', 'Biryani Rice', 'South Indian Curries',
             'North Indian Curries', 'Dal Items', ['South Indian Liquids', 'Sambar (Liquids)'], 'Default Items'],
      plan: {
        'Sweets': '1- Sweet', 'Hot Snacks':  '2- Hot Snacks', 'Rice': '1- Plain Rice', 'Biryani Rice': '1- Biryani Rice',
        'South Indian Curries': '1- South Indian Curry', 'North Indian Curries': '1- North Indian Curry',
        'Dal Items': '1- Dal', 'South Indian Liquids': '1- Liquid', 'Default Items': 'Default Items'
      }
    },
    all: {
      pdf: './assets/Abhinav-Caterers-All-Events-Menu.pdf',
      cats: ['Sweets', 'Hot Snacks', 'Saree Items', 'Snacks', 'Roti', 'Rice', 'Biryani Rice',
             'North Indian Curries', 'South Indian Curries', 'South Indian Fry', 'South Indian Liquids',
             'Dal Items', 'Raitas', 'Chat Items', 'Soups', 'Pickles & Chutneys', 'Podulu', 'Tiffins',
             'Fruit Juices', 'Hot Drinks', 'Ice Creams', 'Special Items', 'Default Items']
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

  var HINT = 'Choose a category above to open its dishes.';
  var menuKey = 'standard', openIdx = null;   // openIdx null = dropdown closed

  function itemHtml(name, n, i) {
    var te = TE[name] || '';
    return '<div class="mn-item" style="--i:' + i + '"><span class="n">' + n + '</span><span>' +
      '<span class="en">' + esc(name) + '</span>' +
      (te ? '<span class="te" lang="te">' + esc(te) + '</span>' : '') + '</span></div>';
  }

  function setOpen(on) {
    drop.classList.toggle('open', on);
    if (on) dropIn.removeAttribute('inert'); else dropIn.setAttribute('inert', '');
  }

  function render() {
    var cats = catsOf(menuKey);
    if (openIdx !== null && openIdx >= cats.length) openIdx = null;
    var q = search.value.trim().toLowerCase();

    chipsBox.innerHTML = cats.map(function (c, i) {
      var on = !q && i === openIdx;
      return '<button type="button" class="mn-chip' + (on ? ' active' : '') + '" data-i="' + i + '" aria-expanded="' + on +
        '" aria-controls="mn-drop">' + esc(c.label) + '<small>' + c.items.length + '</small></button>';
    }).join('');

    var html = '', title = '', meta = '', shown = 0;
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
      title = 'Search results';
      meta = shown ? shown + (shown > 1 ? ' dishes found' : ' dish found') : 'No matches';
    } else if (openIdx !== null) {             // one category, in the dropdown
      var cat = cats[openIdx];
      html = cat.items.map(function (name, idx) { return itemHtml(name, idx + 1, idx); }).join('');
      title = cat.label;
      meta = cat.items.length + ' dishes';
    }

    if (q || openIdx !== null) {               // fill first, then open, so the panel never opens empty
      dropTitle.textContent = title;
      dropMeta.textContent = meta;
      listBox.innerHTML = html;
      dropScroll.scrollTop = 0;
      countBox.textContent = '';
      setOpen(true);
    } else {                                   // closed: keep old content until the panel has folded away
      countBox.textContent = HINT;
      setOpen(false);
    }
  }

  function setMenu(key) {
    menuKey = key;
    openIdx = null;
    Array.prototype.forEach.call(tabs.querySelectorAll('.mn-tab'), function (t) {
      var on = t.getAttribute('data-menu') === key;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (pdfLink) pdfLink.href = SETS[key].pdf;
  }

  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('.mn-tab');
    if (!b) return;
    setMenu(b.getAttribute('data-menu'));
    render();
  });

  chipsBox.addEventListener('click', function (e) {
    var b = e.target.closest('.mn-chip');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    openIdx = (openIdx === i && !search.value.trim()) ? null : i;   // the open chip closes its own dropdown
    search.value = '';
    render();
    var again = chipsBox.querySelector('[data-i="' + i + '"]');     // keep keyboard focus on the chip
    if (again) again.focus({ preventScroll: true });
  });

  function closeDrop(focusChip) {
    var was = openIdx;
    openIdx = null;
    search.value = '';
    render();
    if (focusChip && was !== null) {
      var c = chipsBox.querySelector('[data-i="' + was + '"]');
      if (c) c.focus({ preventScroll: true });
    }
  }
  if (dropClose) dropClose.addEventListener('click', function () { closeDrop(true); });
  drop.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrop(true); });

  search.addEventListener('input', render);

  /* Used by the ticket rail's "See in full menu": switch menu, open that category's dropdown. */
  window.MenuSection = {
    sets: SETS,
    open: function (key, catName) {
      if (!SETS[key]) return;
      if (key !== menuKey) setMenu(key);
      search.value = '';
      var cats = catsOf(key), at = null;
      cats.forEach(function (c, i) { if (c.name === catName) at = i; });
      openIdx = at;
      render();
    }
  };

  render();
})();
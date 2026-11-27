/* Language choice for the Plan an Event page: English (default), తెలుగు, हिन्दी.
   Needs i18n-core.js (the words), menu-te.js and menu-hi.js (the dish names).
   When the customer picks a language, every word on the planner (steps, dishes, plate, messages) is translated,
   and the choice (window.LANG) is sent with the quotation so the PDF and email use the same language. */
(function () {
  'use strict';
  var I = window.I18N, planner = document.getElementById('planner');
  if (!I || !planner) return;

  window.LANG = 'en';
  var texts = new WeakMap(), attrs = new WeakMap();
  var ATTRS = ['placeholder', 'aria-label', 'title'];

  function skip(node) {
    var e = node.nodeType === 3 ? node.parentNode : node;
    if (!e || !e.closest) return true;
    if (e.closest('[data-no-i18n],script,style')) return true;
    return node.nodeType === 3 && !!e.closest('textarea');      // a textarea's own text is what the customer typed; its placeholder is still translated
  }
  function text(n) {                          // one piece of text on the page
    if (skip(n)) return;
    var v = n.nodeValue, rec = texts.get(n);
    var en = rec && v === rec.out ? rec.en : v;           // our own output -> keep the English we saved; else it is new English text
    var out = window.LANG === 'en' ? en : I.tr(en, window.LANG);
    texts.set(n, { en: en, out: out });
    if (v !== out) n.nodeValue = out;
  }
  function attr(el) {                         // placeholders, aria-labels, titles
    if (!el.getAttribute || skip(el)) return;
    var map = attrs.get(el) || {};
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var v = el.getAttribute(a), rec = map[a];
      var en = rec && v === rec.out ? rec.en : v;
      var out = window.LANG === 'en' ? en : I.tr(en, window.LANG);
      map[a] = { en: en, out: out };
      if (v !== out) el.setAttribute(a, out);
    });
    attrs.set(el, map);
  }
  function tree(root) {
    if (root.nodeType === 3) { text(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    attr(root);
    Array.prototype.forEach.call(root.querySelectorAll('[placeholder],[aria-label],[title]'), attr);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(text);
  }

  var obs = new MutationObserver(function (recs) {
    recs.forEach(function (r) {
      if (r.type === 'characterData') text(r.target);
      else if (r.type === 'attributes') attr(r.target);
      else Array.prototype.forEach.call(r.addedNodes, tree);
    });
  });
  var OPTS = { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS };
  function watch(el) { if (el) obs.observe(el, OPTS); }
  watch(planner);
  watch(document.querySelector('.mf-toast'));

  /* ---- the three language buttons, at the very top of the planner ---- */
  var box = document.createElement('div');
  box.className = 'lang-pick'; box.setAttribute('data-no-i18n', ''); box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Language / భాష / भाषा');
  box.innerHTML = '<p class="lang-q">Choose your language · భాషను ఎంచుకోండి · अपनी भाषा चुनें</p><div class="lang-btns">' +
    '<button type="button" data-lang="en" aria-pressed="true">English</button>' +
    '<button type="button" data-lang="te" aria-pressed="false" lang="te">తెలుగు</button>' +
    '<button type="button" data-lang="hi" aria-pressed="false" lang="hi">हिन्दी</button></div>';
  var mf = document.getElementById('mf');
  if (mf) mf.insertBefore(box, mf.firstChild); else planner.insertBefore(box, planner.firstChild);

  function setLang(l) {
    if (['en', 'te', 'hi'].indexOf(l) < 0 || l === window.LANG) return;
    window.LANG = l;
    document.documentElement.setAttribute('data-lang', l);
    Array.prototype.forEach.call(box.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b.dataset.lang === l ? 'true' : 'false'); });
    obs.disconnect();
    tree(planner); tree(document.querySelector('.mf-toast') || planner);
    watch(planner); watch(document.querySelector('.mf-toast'));
    document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }
  window.setLang = setLang;
  box.addEventListener('click', function (e) { var b = e.target.closest('button[data-lang]'); if (b) setLang(b.dataset.lang); });
})();
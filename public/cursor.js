(function () {
  'use strict';
  var made = {};
  function collect(rules, out) {
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      if (r.cssRules && !r.selectorText) { collect(r.cssRules, out); continue; }
      if (r.selectorText && r.style && r.style.cursor === 'pointer') {
        r.selectorText.split(',').forEach(function (sel) {
          sel = sel.trim();
          if (!sel || /^(html|:root)/.test(sel) || made[sel]) return;
          made[sel] = 1; out.push('html ' + sel + ', html ' + sel + ' *');
        });
      }
    }
  }
  function run() {
    var out = [];
    for (var i = 0; i < document.styleSheets.length; i++) {
      try { collect(document.styleSheets[i].cssRules, out); } catch (e) {}
    }
    if (!out.length) return;
    var st = document.createElement('style');
    st.textContent = out.join(',\n') + ' { cursor: var(--cur-pointer) !important; }';
    document.head.appendChild(st);
  }
  if (document.readyState === 'complete') run(); else window.addEventListener('load', run);
})();
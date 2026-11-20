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

/* Phones and tablets have no mouse pointer, so the samosa / laddu cursor is drawn by hand where the finger touches */
(function () {
  'use strict';
  var touchOnly = false;
  try { touchOnly = window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches; } catch (e) {}
  if (!touchOnly) return;

  var SAMOSA = "<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='-24 -24 48 48'><g transform='rotate(-42)'><path d='M0 -21 L14 16 L-14 16 Z' fill='#e8a93c' stroke='#8c5a14' stroke-width='1.6' stroke-linejoin='round'/><path d='M0 -9 L7 9 L-7 9 Z' fill='white' opacity='.22'/><circle cx='-3' cy='4' r='1' fill='#8c5a14'/><circle cx='3' cy='7' r='1' fill='#8c5a14'/><circle cx='1' cy='-2' r='1' fill='#8c5a14'/></g></svg>";
  var LADDU = "<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='-24 -24 48 48'><circle r='22' fill='none' stroke='#ffd877' stroke-width='2'/><circle r='16' fill='#e59a2c' stroke='#a8650f' stroke-width='1.5'/><ellipse cx='-5' cy='-6' rx='6' ry='4' fill='white' opacity='.3'/></svg>";
  var CLICKABLE = 'a, button, summary, select, label, [role="button"], [role="tab"], [onclick], .plan-btn, input[type="checkbox"], input[type="radio"], input[type="date"]';

  var el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;left:0;top:0;width:44px;height:44px;pointer-events:none;z-index:99999;opacity:0;'
    + 'transition:opacity .35s ease;will-change:transform,opacity;';
  document.body.appendChild(el);

  var hideTimer = 0;
  function show(x, y, target) {
    var laddu = !!(target && target.closest && target.closest(CLICKABLE));
    var html = laddu ? LADDU : SAMOSA;
    if (el.dataset.kind !== (laddu ? 'l' : 's')) { el.innerHTML = html; el.dataset.kind = laddu ? 'l' : 's'; }
    el.style.transform = 'translate(' + (x - 22) + 'px,' + (y - 22) + 'px)';
    el.style.opacity = '1';
    clearTimeout(hideTimer);
  }
  function fadeSoon() { clearTimeout(hideTimer); hideTimer = setTimeout(function () { el.style.opacity = '0'; }, 450); }

  function ripple(x, y) {
    var r = document.createElement('div');
    r.style.cssText = 'position:fixed;left:' + (x - 26) + 'px;top:' + (y - 26) + 'px;width:52px;height:52px;border-radius:50%;'
      + 'border:2px solid #ffd877;pointer-events:none;z-index:99998;opacity:.9;transform:scale(.3);'
      + 'transition:transform .55s ease-out,opacity .55s ease-out;';
    document.body.appendChild(r);
    requestAnimationFrame(function () { r.style.transform = 'scale(1.6)'; r.style.opacity = '0'; });
    setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 650);
  }

  document.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; if (!t) return;
    show(t.clientX, t.clientY, e.target); ripple(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    var t = e.touches[0]; if (!t) return;
    show(t.clientX, t.clientY, e.target);
  }, { passive: true });
  document.addEventListener('touchend', fadeSoon, { passive: true });
  document.addEventListener('touchcancel', fadeSoon, { passive: true });
})();
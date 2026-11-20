/* Polish layer: nav wordmark fade, fuse letters, nav accessibility, reduced-motion video */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---- 1. nav wordmark fades out while the hero title passes under it ---- */
  var nav = document.querySelector('.nav');
  var brandText = document.querySelector('.nav .brand-text');
  var words = [document.getElementById('cin-word'), document.getElementById('cin-word2')].filter(Boolean);
  var landing = document.getElementById('landing');
  var ticking = false;

  function overlaps() {
    if (!brandText || !words.length) return false;
    if (landing && landing.hidden) return false;
    var n = brandText.getBoundingClientRect();
    if (!n.width) return false;
    for (var i = 0; i < words.length; i++) {
      var r = words[i].getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.bottom > n.top - 6 && r.top < n.bottom + 6 && r.left < n.right + 12 && r.right > n.left - 12) return true;
    }
    return false;
  }
  function checkBrand() {
    ticking = false;
    if (nav) nav.classList.toggle('brand-away', overlaps());
  }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(checkBrand); } }
  if (nav && brandText) {
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    window.addEventListener('load', queue);
    document.addEventListener('planner-open', queue);
    if ('MutationObserver' in window) {
      new MutationObserver(queue).observe(root, { attributes: true, attributeFilter: ['class'] });  // intro finishing
      if (landing) new MutationObserver(queue).observe(landing, { attributes: true, attributeFilter: ['hidden'] });
    }
    queue();
  }

  /* ---- 2. fuse hover: letters light up one after another ---- */
  var FUSE_MS = 620;
  Array.prototype.forEach.call(document.querySelectorAll('.plan-btn'), function (btn) {
    if (btn.getAttribute('data-fuse')) return;
    btn.setAttribute('data-fuse', '1');
    var label = btn.textContent.replace(/✦/g, '').replace(/\s+/g, ' ').trim();
    Array.prototype.slice.call(btn.childNodes).forEach(function (n) {
      if (n.nodeType !== 3 || !n.nodeValue.trim()) return;
      var text = n.nodeValue.replace(/\s+/g, ' ').trim();
      var wrap = document.createElement('span');
      wrap.className = 'fz-w';
      wrap.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < text.length; i++) {
        var s = document.createElement('span');
        s.className = 'fz';
        s.style.setProperty('--d', Math.round(i * FUSE_MS / text.length) + 'ms');
        s.textContent = text[i] === ' ' ? '\u00a0' : text[i];
        wrap.appendChild(s);
      }
      btn.replaceChild(wrap, n);
    });
    btn.setAttribute('aria-label', label);
  });

  /* ---- 3. phone menu: state for screen readers, Escape and outside tap close it ---- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav nav');
  if (toggle && menu) {
    menu.id = menu.id || 'site-nav';
    toggle.setAttribute('aria-controls', menu.id);
    var sync = function () {
      var open = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };
    sync();
    if ('MutationObserver' in window) new MutationObserver(sync).observe(menu, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { menu.classList.remove('open'); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !e.target.closest('.nav')) menu.classList.remove('open');
    });
  }

  /* ---- 4. reduced motion: gallery videos stay still until the visitor presses play ---- */
  if (reduce) {
    Array.prototype.forEach.call(document.querySelectorAll('.video-tile video'), function (v) {
      v.pause(); v.removeAttribute('autoplay'); v.controls = true; v.loop = false;
      v.setAttribute('aria-label', 'Catering video. Press play to watch.');
    });
  }
})();
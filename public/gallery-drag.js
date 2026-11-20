/* Gallery: drag with the mouse + prev/next arrows */
(function () {
  var rail = document.querySelector('.video-grid');
  if (!rail) return;

  var down = false, moved = false, startX = 0, startLeft = 0;

  rail.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false;
    startX = e.clientX; startLeft = rail.scrollLeft;
  });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) { moved = true; rail.classList.add('dragging'); }
    if (moved) rail.scrollLeft = startLeft - dx;
  });
  function end() {
    if (!down) return;
    down = false;
    rail.classList.remove('dragging');   // the rail snaps to the nearest tile
  }
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  rail.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // arrow buttons under the rail
  var bar = document.createElement('div');
  bar.className = 'gal-arrows';
  bar.innerHTML =
    '<button type="button" aria-label="Previous video">&#8592;</button>' +
    '<button type="button" aria-label="Next video">&#8594;</button>';
  rail.parentNode.insertBefore(bar, rail.nextSibling);

  function step(dir) {
    var tile = rail.querySelector('.video-tile');
    var w = tile ? tile.getBoundingClientRect().width + 16 : 400;
    rail.scrollBy({ left: dir * w, behavior: 'smooth' });
  }
  bar.children[0].addEventListener('click', function () { step(-1); });
  bar.children[1].addEventListener('click', function () { step(1); });
})();
/* Spice meter: keeps data-level and the screen-reader text in step with the
   native "q-spice" radios. quote-form.js still reads the checked radio. */
(function () {
  var box = document.getElementById('spice-scale');
  if (!box) return;
  var radios = Array.prototype.slice.call(box.querySelectorAll('input[name="q-spice"]'));
  var read = box.querySelector('.sp-read');

  function paint() {
    for (var i = 0; i < radios.length; i++) {
      if (!radios[i].checked) continue;
      box.setAttribute('data-level', i);
      var card = radios[i].parentNode.querySelector('.sp-card');
      if (read && card) read.textContent = card.querySelector('b').textContent + '. ' + card.querySelector('small').textContent;
    }
  }
  radios.forEach(function (r) { r.addEventListener('change', paint); });
  paint();
})();
(function () {
  var landing = document.getElementById('landing');
  var planner = document.getElementById('planner');

  function openPlanner() {
    landing.classList.add('leaving');            // front page fades out
    setTimeout(function () {
      landing.hidden = true;
      landing.classList.remove('leaving');
      planner.hidden = false;
      planner.classList.remove('enter');
      void planner.offsetWidth;                  // restarts the animation
      planner.classList.add('enter');
      document.dispatchEvent(new Event('planner-open'));  // app.js redraws the plate
      window.scrollTo(0, 0);
    }, 450);
  }

  function closePlanner() {
    planner.hidden = true;
    landing.hidden = false;
    landing.classList.add('returning');
    setTimeout(function () { landing.classList.remove('returning'); }, 600);
    window.scrollTo(0, 0);
  }

  document.querySelectorAll('.plan-btn').forEach(function (b) {
    b.addEventListener('click', function () { if (planner.hidden) openPlanner(); });
  });
  document.getElementById('back-btn').addEventListener('click', closePlanner);
  document.querySelectorAll('.nav nav a, .nav .brand').forEach(function (a) {
    a.addEventListener('click', function () { if (!planner.hidden) closePlanner(); });
  });

  // phone menu closes after a tap (same as the old site)
  document.querySelector('.nav nav').addEventListener('click', function (e) {
    if (e.target.closest('a, button')) this.classList.remove('open');
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // sections fade in as you scroll (same effect as the old site)
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .08 });
    document.querySelectorAll('.section, .hero-copy').forEach(function (x) {
      x.classList.add('reveal');
      io.observe(x);
    });
  }
})();
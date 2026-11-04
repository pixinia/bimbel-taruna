(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  var toggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (toggle && mobileMenu) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      mobileMenu.classList.toggle('hidden', !open);
      var hdr = document.getElementById('site-header');
      if (hdr) hdr.classList.toggle('is-scrolled', open || window.scrollY > 24);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
    });
  }

  // Sticky header background on scroll
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24 || (toggle && toggle.getAttribute('aria-expanded') === 'true'));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Hero video: respect reduced motion, otherwise start playback (mobile-safe)
  var heroVideo = document.querySelector('[data-hero-video]');
  if (heroVideo) {
    if (reduceMotion) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    } else {
      var playing = heroVideo.play();
      if (playing && playing.catch) playing.catch(function () {});
    }
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

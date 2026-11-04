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
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  // Animated counters (static number already in HTML; JS only animates from 0)
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var runCount = function (el) {
      var raw = el.getAttribute('data-count');
      var target = parseInt(raw, 10);
      if (isNaN(target)) return;
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;
      var duration = 1400;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('id-ID') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
    };
    var cio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
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

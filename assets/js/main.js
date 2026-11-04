(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Motion gate: every hidden-before-animate state in CSS lives under html.js-anim.
  // (Head pages also set this inline to avoid a flash; this is the safety net.)
  window.__tpMotion = 1;
  if (!reduceMotion) document.documentElement.classList.add('js-anim');

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  // Mobile menu
  var toggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (toggle && mobileMenu) {
    each(mobileMenu.querySelectorAll('a'), function (a, i) { a.style.setProperty('--i', i); });
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      mobileMenu.classList.toggle('hidden', !open);
      // Re-trigger the link entrance stagger each time the menu opens.
      if (open) {
        mobileMenu.classList.remove('menu-open');
        void mobileMenu.offsetWidth;
        mobileMenu.classList.add('menu-open');
      } else {
        mobileMenu.classList.remove('menu-open');
      }
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

  /* ---------- Motion (v5) ---------- */
  var CRISP = 'cubic-bezier(.2,.7,.1,1)';

  if (!reduceMotion) {

  // Per-word masks: split text nodes only; <br> and element children stay intact.
  each(document.querySelectorAll('[data-anim="words"]'), function (el) {
    var n = 0;
    each(el.childNodes, function (node) {
      if (node.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      each(node.nodeValue.split(/(\s+)/), function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span');
        w.className = 'word';
        w.style.setProperty('--wi', n++);
        var inner = document.createElement('span');
        inner.className = 'word-i';
        inner.textContent = part;
        w.appendChild(inner);
        frag.appendChild(w);
      });
      el.replaceChild(frag, node);
    });
  });

  // Stagger index (--i) on direct children of reveal groups.
  each(document.querySelectorAll('[data-anim="rows"], [data-anim="roster"], [data-anim="dossier"], [data-anim="stagger"], [data-anim="ladder"]'), function (group) {
    var i = 0;
    each(group.children, function (child) { child.style.setProperty('--i', i++); });
  });

  // Optional per-element entrance delay, in ms.
  each(document.querySelectorAll('[data-delay]'), function (el) {
    el.style.setProperty('--d', (parseInt(el.getAttribute('data-delay'), 10) || 0) + 'ms');
  });

  // Count-up once: keeps the exact final string from HTML (prefix/suffix/separator format).
  function counterSpec(el) {
    var text = el.textContent;
    var m = text.match(/\d[\d.,]*/);
    if (!m) return null;
    var raw = m[0];
    var spec = { el: el, final: text, pre: text.slice(0, m.index), post: text.slice(m.index + raw.length), target: 0 };
    if (/^\d{1,3}([.,]\d{3})+$/.test(raw)) {
      spec.group = raw.charAt(3);
      spec.target = parseInt(raw.replace(/[.,]/g, ''), 10);
    } else {
      var dm = raw.match(/^(\d+)([.,])(\d+)$/);
      if (dm) { spec.sep = dm[2]; spec.prec = dm[3].length; spec.target = parseFloat(dm[1] + '.' + dm[3]); }
      else { spec.target = parseInt(raw, 10); }
    }
    return spec;
  }
  function counterSet(spec, v) {
    var s;
    if (spec.group) s = String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, spec.group);
    else if (spec.prec) s = v.toFixed(spec.prec).replace('.', spec.sep);
    else s = String(Math.round(v));
    spec.el.textContent = spec.pre + s + spec.post;
  }
  function runCount(el) {
    var spec = counterSpec(el);
    if (!spec) return;
    // Lock the width to the final value so neighbours never shift while ticking.
    el.style.minWidth = el.getBoundingClientRect().width + 'px';
    var t0 = null, dur = 1200;
    requestAnimationFrame(function frame(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      k = 1 - Math.pow(1 - k, 3); // easeOutCubic
      counterSet(spec, spec.target * k);
      if (k < 1) requestAnimationFrame(frame);
      else el.textContent = spec.final;
    });
  }

  // Reveal on enter, once. No IO support: show everything immediately.
  var revealTargets = document.querySelectorAll('[data-anim], [data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      each(entries, function (en) {
        if (!en.isIntersecting) return;
        // Clip-path targets are observed through their parent (a fully clipped
        // element never reports as intersecting).
        var t = en.target.__animChild || en.target;
        t.classList.add('is-in');
        if (t.hasAttribute('data-count')) runCount(t);
        io.unobserve(en.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
    each(revealTargets, function (el) {
      var a = el.getAttribute('data-anim');
      if ((a === 'unit' || a === 'clip') && el.parentElement) {
        el.parentElement.__animChild = el;
        io.observe(el.parentElement);
      } else {
        io.observe(el);
      }
    });
  } else {
    each(revealTargets, function (el) { el.classList.add('is-in'); });
  }

  // Parallax ([data-parallax="0.15"], optional data-parallax-scale / data-parallax-max),
  // ladder line draw, WhatsApp float reveal — one rAF-locked passive scroll loop.
  var para = [];
  each(document.querySelectorAll('[data-parallax]'), function (el) {
    para.push({
      el: el,
      speed: parseFloat(el.getAttribute('data-parallax')) || 0.15,
      max: parseFloat(el.getAttribute('data-parallax-max') || '') || 40
    });
    if (el.getAttribute('data-parallax-scale')) {
      el.style.setProperty('--ps', el.getAttribute('data-parallax-scale'));
    }
  });
  var ladder = document.querySelector('[data-anim="ladder"]');
  var ladderLine = ladder ? ladder.querySelector('.ladder-line') : null;
  var ladderItems = ladder ? ladder.querySelectorAll('li') : [];
  var waFloat = document.querySelector('[data-wa-float]');
  var heroSection = document.querySelector('[data-hero-video]') ? document.querySelector('main section') : null;
  var waShown = false;

  function frameScroll() {
    var vh = window.innerHeight, mid = vh * 0.5, i, r, y;
    for (i = 0; i < para.length; i++) {
      r = para[i].el.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) continue;
      y = -(r.top + r.height / 2 - mid) * para[i].speed;
      y = Math.max(-para[i].max, Math.min(para[i].max, y));
      para[i].el.style.setProperty('--py', y.toFixed(1) + 'px');
    }
    if (ladder) {
      r = ladder.getBoundingClientRect();
      if (ladderLine) {
        ladderLine.style.setProperty('--lp', Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height))).toFixed(4));
      }
      each(ladderItems, function (li) {
        if (li.getBoundingClientRect().top < vh * 0.72) li.classList.add('is-reached');
      });
    }
    if (waFloat && !waShown && (!heroSection || window.scrollY > heroSection.offsetHeight * 0.4)) {
      waShown = true;
      waFloat.classList.add('is-shown');
    }
  }
  var ticking = false;
  function requestFrame() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { frameScroll(); ticking = false; });
  }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame, { passive: true });
  frameScroll();

  // FAQ: wrap content at runtime and animate height with WAAPI (user-initiated, so OK).
  // Without this JS (or with reduced motion) the native details behavior is untouched.
  each(document.querySelectorAll('.faq-item'), function (d) {
    var sum = d.querySelector('summary');
    if (!sum || !sum.animate) return;
    var wrap = document.createElement('div');
    wrap.className = 'faq-content';
    while (d.lastChild !== sum) { wrap.insertBefore(d.lastChild, wrap.firstChild); }
    d.appendChild(wrap);
    var busy = false;
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (busy) return;
      busy = true;
      wrap.style.overflow = 'hidden';
      var anim;
      if (!d.open) {
        d.open = true;
        anim = wrap.animate([{ height: '0px' }, { height: wrap.scrollHeight + 'px' }], { duration: 300, easing: CRISP });
        anim.onfinish = function () { wrap.style.overflow = ''; busy = false; };
      } else {
        anim = wrap.animate([{ height: wrap.scrollHeight + 'px' }, { height: '0px' }], { duration: 250, easing: CRISP });
        anim.onfinish = function () { d.open = false; wrap.style.overflow = ''; busy = false; };
      }
      anim.oncancel = function () { wrap.style.overflow = ''; busy = false; };
    });
  });

  }

  /* ---------- Program carousel (v6) ---------- */
  each(document.querySelectorAll('[data-carousel]'), function (root) {
    var track = root.querySelector('[data-carousel-track]');
    if (!track) return;
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    var current = root.querySelector('[data-carousel-current]');
    var bar = root.querySelector('[data-carousel-bar]');
    var slides = track.children;
    var count = slides.length;
    if (!count) return;

    function stepWidth() {
      var cs = window.getComputedStyle(track);
      var gap = parseFloat(cs.columnGap || cs.gap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function currentIndex() {
      var step = stepWidth();
      if (!step) return 0;
      // At the far end every remaining slide is in view, so report the last one.
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) return count - 1;
      return Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / step)));
    }
    function update() {
      var i = currentIndex();
      var label = pad(i + 1);
      if (current && current.textContent !== label) current.textContent = label;
      if (bar) bar.style.transform = 'scaleX(' + ((i + 1) / count).toFixed(4) + ')';
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    }
    var ticking = false;
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }

    function go(dir) {
      var step = stepWidth();
      if (!step) return;
      var left = dir * step;
      if (track.scrollBy) {
        track.scrollBy({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
      } else {
        track.scrollLeft += left;
      }
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    // Arrow keys while the track itself has focus.
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });

    // Mouse drag to scroll. Touch keeps native scrolling.
    var dragging = false, startX = 0, startLeft = 0, moved = 0, suppressClick = false;
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
      var step = stepWidth();
      if (!step) return;
      var i = Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / step)));
      var target = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, i * step));
      if (reduceMotion) track.scrollLeft = target;
      else if (track.scrollTo) track.scrollTo({ left: target, behavior: 'smooth' });
      else track.scrollLeft = target;
      suppressClick = moved > 5;
      setTimeout(function () { suppressClick = false; }, 0);
    }
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    // Window-level move/up (no pointer capture: capture would retarget clicks
    // away from the slide links).
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > moved) moved = Math.abs(dx);
      if (moved > 5) {
        e.preventDefault();
        track.scrollLeft = startLeft - dx;
      }
    }, { passive: false });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    track.addEventListener('click', function (e) {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    }, true);

    update();
  });

  // Roster logos: on touch screens (no hover) light up the logos crossing the
  // middle band of the viewport; tapping (focus) also lights one up.
  var roster = document.querySelector('.roster');
  if (roster && 'IntersectionObserver' in window && window.matchMedia('(hover: none)').matches) {
    var lit = new IntersectionObserver(function (entries) {
      each(entries, function (en) { en.target.classList.toggle('is-lit', en.isIntersecting); });
    }, { rootMargin: '-44% 0px -44% 0px' });
    each(roster.children, function (li) { lit.observe(li); });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

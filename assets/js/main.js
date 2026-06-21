(() => {
  'use strict';

  /* ---------- nav scroll + mobile ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (toggle) {
    toggle.addEventListener('click', () => mobile.classList.toggle('is-open'));
    mobile.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobile.classList.remove('is-open')));
  }

  /* ---------- carousel: combined slide + crossfade, 3s auto ---------- */
  const IMAGES = Array.from({ length: 10 }, (_, i) => `assets/img/carousel/c${i + 1}.jpg`);
  const AUTO_MS = 3000;

  function buildCarousel(root) {
    const track = root.querySelector('.carousel__track');
    const dotsWrap = root.querySelector('.carousel__dots');

    IMAGES.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel__slide' + (i === 0 ? ' is-active' : '');
      const img = new Image();
      img.src = src;
      img.alt = 'Wright Media residential photography';
      img.loading = i < 2 ? 'eager' : 'lazy';
      slide.append(img);
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => go(i, true));
      dotsWrap.appendChild(dot);
    });

    const slides = Array.from(track.querySelectorAll('.carousel__slide'));
    const dots = Array.from(dotsWrap.children);
    let idx = 0, timer = null;

    function go(n, user) {
      const prev = idx;
      idx = (n + slides.length) % slides.length;
      if (idx === prev) return;
      slides.forEach((s, i) => {
        s.classList.toggle('is-active', i === idx);
        s.classList.toggle('is-exit', i === prev);
      });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      if (user) restart();
    }
    function start() { timer = setInterval(() => go(idx + 1), AUTO_MS); }
    function restart() { clearInterval(timer); start(); }

    root.querySelector('.carousel__arrow--next').addEventListener('click', () => go(idx + 1, true));
    root.querySelector('.carousel__arrow--prev').addEventListener('click', () => go(idx - 1, true));
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', restart);
    start();
  }

  document.querySelectorAll('.carousel').forEach(buildCarousel);

  /* ---------- marquee: duplicate for seamless loop ---------- */
  const mt = document.getElementById('marqueeTrack');
  if (mt) mt.innerHTML += mt.innerHTML;

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(
    '.band, .reel__copy, .reel__phone, .tcard, .about__img, .about__copy, .services__grid li, .section-title');
  reveals.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));

  /* ---------- contact form (prototype: no backend) ---------- */
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('contactStatus');
    if (!form.checkValidity()) { status.textContent = 'Please complete the required fields.'; return; }
    status.textContent = 'Thank you — we’ll be in touch shortly. Have a blessed day.';
    form.reset();
  });
})();

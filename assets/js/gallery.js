(() => {
  'use strict';

  /* nav scroll + mobile toggle (gallery page) */
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (toggle) {
    toggle.addEventListener('click', () => mobile.classList.toggle('is-open'));
    mobile.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobile.classList.remove('is-open')));
  }
  const mpl = document.querySelector('.nav__mobile-label');
  if (mpl) mpl.addEventListener('click', () => mpl.parentElement.classList.toggle('show-portfolio'));

  /* nav Portfolio: click dropdown */
  document.querySelectorAll('.nav__drop .nav__drop-btn').forEach(btn =>
    btn.addEventListener('click', (e) => { e.preventDefault(); btn.parentElement.classList.toggle('is-open'); }));
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav__drop.is-open').forEach(d => {
      if (!d.contains(e.target)) d.classList.remove('is-open');
    });
  });

  /* preview carousel (slide + crossfade, 3s auto) */
  const pv = document.getElementById('pvCarousel');
  if (pv) {
    const imgs = pv.dataset.images.split(',');
    const track = pv.querySelector('.carousel__track');
    const dotsWrap = pv.querySelector('.carousel__dots');
    imgs.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel__slide' + (i === 0 ? ' is-active' : '');
      const img = new Image();
      img.src = src;
      img.alt = 'Wright Media portfolio preview';
      img.loading = i < 2 ? 'eager' : 'lazy';
      slide.appendChild(img);
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
      slides.forEach((s, i) => { s.classList.toggle('is-active', i === idx); s.classList.toggle('is-exit', i === prev); });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      if (user) restart();
    }
    function start() { timer = setInterval(() => go(idx + 1), 3000); }
    function restart() { clearInterval(timer); start(); }
    pv.querySelector('.carousel__arrow--next').addEventListener('click', () => go(idx + 1, true));
    pv.querySelector('.carousel__arrow--prev').addEventListener('click', () => go(idx - 1, true));
    pv.addEventListener('mouseenter', () => clearInterval(timer));
    pv.addEventListener('mouseleave', restart);
    start();
  }

  /* view full gallery */
  const vfb = document.getElementById('viewFullBtn');
  if (vfb) vfb.addEventListener('click', () => {
    const g = document.getElementById('fullGallery');
    if (g) {
      g.classList.remove('is-hidden');
      vfb.parentElement.style.display = 'none';
      setTimeout(() => g.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    }
  });

  /* fade tiles in as they load */
  document.querySelectorAll('.gtile img').forEach(img => {
    if (img.complete) img.classList.add('is-loaded');
    else img.addEventListener('load', () => img.classList.add('is-loaded'));
  });

  /* lightbox */
  const tiles = Array.from(document.querySelectorAll('.gtile'));
  const sources = tiles.map(t => t.getAttribute('href'));
  const box = document.getElementById('lightbox');
  const boxImg = document.getElementById('lightboxImg');
  let cur = 0;

  function open(i) {
    cur = i;
    boxImg.src = sources[cur];
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function step(d) { cur = (cur + d + sources.length) % sources.length; boxImg.src = sources[cur]; }

  tiles.forEach((t, i) => t.addEventListener('click', e => { e.preventDefault(); open(i); }));
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__next').addEventListener('click', e => { e.stopPropagation(); step(1); });
  box.querySelector('.lightbox__prev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
})();

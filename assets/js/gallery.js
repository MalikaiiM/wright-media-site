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

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
  const mpl = document.querySelector('.nav__mobile-label');
  if (mpl) mpl.addEventListener('click', () => mpl.parentElement.classList.toggle('show-portfolio'));

  /* ---------- services carousel: coverflow (center in focus, sides behind) ---------- */
  const sc = document.getElementById('svcCarousel');
  if (sc) {
    const cards = Array.from(sc.querySelectorAll('.svc-card'));
    let active = 0, stimer = null;
    function layout() {
      const h = Math.max(...cards.map(c => c.offsetHeight));
      if (h > 40) sc.style.height = h + 'px';
    }
    function render() {
      cards.forEach((c, i) => {
        const off = (i - active + cards.length) % cards.length;
        c.classList.toggle('pos-center', off === 0);
        c.classList.toggle('pos-right', off === 1);
        c.classList.toggle('pos-left', off === 2);
      });
    }
    function sstart() { stimer = setInterval(() => { active = (active + 1) % cards.length; render(); }, 3600); }
    /* click a side card → bring it to the front; click the front card → open its page */
    cards.forEach((c, i) => c.addEventListener('click', (e) => {
      if (!c.classList.contains('pos-center')) {
        e.preventDefault();
        active = i;
        render();
        clearInterval(stimer); sstart();
      }
    }));
    sc.addEventListener('mouseenter', () => clearInterval(stimer));
    sc.addEventListener('mouseleave', sstart);
    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);
    sc.querySelectorAll('img').forEach(img => img.addEventListener('load', layout));
    render(); layout(); setTimeout(layout, 400); sstart();
  }

  /* ---------- click dropdowns (nav Portfolio + CTA buttons) ---------- */
  document.querySelectorAll('.cta-drop .cta-drop__btn').forEach(btn =>
    btn.addEventListener('click', () => btn.parentElement.classList.toggle('is-open')));
  document.querySelectorAll('.nav__drop .nav__drop-btn').forEach(btn =>
    btn.addEventListener('click', (e) => { e.preventDefault(); btn.parentElement.classList.toggle('is-open'); }));
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.cta-drop.is-open, .nav__drop.is-open').forEach(d => {
      if (!d.contains(e.target)) d.classList.remove('is-open');
    });
  });

  /* ---------- testimonials: card-block carousel ---------- */
  const tc = document.getElementById('tcarousel');
  if (tc) {
    const ttrack = tc.querySelector('.tcarousel__track');
    const cards = Array.from(ttrack.children);
    const dotsWrap = tc.querySelector('.tcarousel__dots');
    let ti = 0, ttimer = null;
    const pv = () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 1020 ? 2 : 3;
    const pages = () => Math.max(1, cards.length - pv() + 1);
    const stepW = () => cards[0].getBoundingClientRect().width + 24;
    function render(anim = true) {
      ttrack.style.transition = anim ? 'transform .7s cubic-bezier(.65,0,.2,1)' : 'none';
      ttrack.style.transform = `translateX(-${ti * stepW()}px)`;
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('is-active', i === ti));
    }
    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < pages(); i++) {
        const d = document.createElement('button');
        d.setAttribute('aria-label', 'Go to review ' + (i + 1));
        d.addEventListener('click', () => { ti = i; render(); trestart(); });
        dotsWrap.appendChild(d);
      }
    }
    function tstart() { ttimer = setInterval(() => { ti = (ti + 1) % pages(); render(); }, 3000); }
    function trestart() { clearInterval(ttimer); tstart(); }
    tc.querySelector('.tcarousel__next').addEventListener('click', () => { ti = (ti + 1) % pages(); render(); trestart(); });
    tc.querySelector('.tcarousel__prev').addEventListener('click', () => { ti = (ti - 1 + pages()) % pages(); render(); trestart(); });
    tc.addEventListener('mouseenter', () => clearInterval(ttimer));
    tc.addEventListener('mouseleave', trestart);
    window.addEventListener('resize', () => { if (ti > pages() - 1) ti = pages() - 1; buildDots(); render(false); });
    buildDots(); render(false); tstart();
  }

  /* ---------- marquee: duplicate for seamless loop ---------- */
  const mt = document.getElementById('marqueeTrack');
  if (mt) mt.innerHTML += mt.innerHTML;

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(
    '.band, .svc-carousel, .reel__copy, .reel__phone, .tcarousel, .about__img, .about__copy, .section-title');
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

/* ==============================
   AADI DIGITAL STUDIO — script.js
   ============================== */
'use strict';

/* ===== NAVBAR ===== */
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  if (navbar)  navbar.classList.toggle('scrolled', window.scrollY > 40);
  if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (navbar && !navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/* ===== BACK TO TOP ===== */
if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const offset = (document.getElementById('navbar')?.offsetHeight || 76) + 16;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (!q) return;
  q.setAttribute('tabindex', '0');
  q.setAttribute('role', 'button');
  q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
  q.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
  });
});

/* ===== CONTACT FORM ===== */
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      if (!f.value.trim()) {
        valid = false;
        f.style.borderColor = '#ef4444';
        f.addEventListener('input', () => { f.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) return;
    const orig = btn.innerHTML;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      form.reset();
      if (success) { success.style.display = 'flex'; setTimeout(() => { success.style.display = 'none'; }, 5000); }
    }, 1800);
  });
}

/* ===== YEAR ===== */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  if (isNaN(target)) return;
  const suffix = el.dataset.suffix || '';
  const isFloat = String(target).includes('.');
  const dur = 2000; const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const v = target * (1 - Math.pow(1 - p, 3));
    el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
if ('IntersectionObserver' in window) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); co.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => co.observe(el));
} else {
  document.querySelectorAll('[data-counter]').forEach(animateCounter);
}

/* ===== PORTFOLIO FILTER ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('[data-cat]').forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.style.display = show ? '' : 'none';
    });
  });
});

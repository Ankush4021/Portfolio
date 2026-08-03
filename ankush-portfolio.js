/* ─── NAV SCROLL ─── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

/* ─── SCROLL REVEAL ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08 });
document.querySelectorAll('.rv').forEach(el => observer.observe(el));

/* ─── SMOOTH ACTIVE NAV ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--electric)' : '';
  });
}, { passive: true });

/* ─── TYPED CURSOR BLINK (code card) ─── */
const cursor = document.querySelector('.cursor-blink');
if (cursor) {
  setInterval(() => { cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0'; }, 530);
}

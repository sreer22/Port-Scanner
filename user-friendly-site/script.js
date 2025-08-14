(function() {
  const html = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = theme === 'dark' ? '🌙' : '☀️';
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.textContent = icon;
  }

  const menuToggle = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const topBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 600;
    if (!topBtn) return;
    topBtn.classList.toggle('show', show);
  }, { passive: true });
  if (topBtn) {
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', evt => {
      const id = anchor.getAttribute('href');
      if (!id || id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      evt.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      if (target.id === 'main') target.focus({ preventScroll: true });
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', evt => {
      evt.preventDefault();
      const status = document.getElementById('form-status');
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const consent = document.getElementById('consent');

      let valid = true;
      clearError('name');
      clearError('email');
      clearError('message');
      clearError('consent');

      if (!name.value.trim()) { setError('name', 'Please enter your name'); valid = false; }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError('email', 'Please enter a valid email'); valid = false; }
      if (!message.value.trim()) { setError('message', 'Please enter a message'); valid = false; }
      if (!consent.checked) { setError('consent', 'You must agree before submitting'); valid = false; }

      if (!valid) return;

      simulateNetwork().then(() => {
        status.textContent = 'Thanks! Your message has been sent.';
        form.reset();
        name.focus();
      }).catch(() => {
        status.textContent = 'Something went wrong. Please try again later.';
      });
    });
  }

  function clearError(field) {
    const input = document.getElementById(field);
    const error = document.getElementById(`error-${field}`);
    if (input) input.removeAttribute('aria-invalid');
    if (error) error.textContent = '';
  }

  function setError(field, message) {
    const input = document.getElementById(field);
    const error = document.getElementById(`error-${field}`);
    if (input) input.setAttribute('aria-invalid', 'true');
    if (error) error.textContent = message;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function simulateNetwork() {
    return new Promise((resolve) => setTimeout(resolve, 800));
  }
})();
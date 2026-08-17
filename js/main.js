document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ───────────────────────────────── */
  const loader = document.getElementById('loader');
  const loaderFill = document.querySelector('.loader-bar-fill');
  let progress = 0;
  const progressTimer = setInterval(() => {
    progress = Math.min(progress + Math.random() * 22, 96);
    if (loaderFill) loaderFill.style.width = progress + '%';
  }, 140);

  window.addEventListener('load', () => {
    clearInterval(progressTimer);
    if (loaderFill) loaderFill.style.width = '100%';
    setTimeout(() => loader && loader.classList.add('hidden'), 350);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => {
    clearInterval(progressTimer);
    if (loaderFill) loaderFill.style.width = '100%';
    loader && loader.classList.add('hidden');
  }, 2500);

  /* ── FOOTER YEAR ──────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── NAVBAR SCROLL STATE ──────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE MENU ──────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');
  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', () => {
      const active = hamburger.classList.toggle('active');
      mobMenu.classList.toggle('active', active);
      hamburger.setAttribute('aria-expanded', String(active));
      document.body.style.overflow = active ? 'hidden' : '';
    });
    mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* ── REVEAL ON SCROLL ─────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ── STAT COUNTERS ────────────────────────── */
  const statEls = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val.toLocaleString('es-MX') + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && statEls.length) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(el => statIo.observe(el));
  }

  /* ── MARQUEE CONTENT ──────────────────────── */
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const items = [
      'CONTABILIDAD GENERAL',
      'ASESORÍA FISCAL',
      'PERSONAS FÍSICAS Y MORALES',
      'GESTORÍA DE CRÉDITOS',
      'SEGURIDAD SOCIAL PARA INDEPENDIENTES',
      'ATENCIÓN PERSONALIZADA'
    ];
    const buildGroup = () => {
      const span = document.createElement('span');
      items.forEach(text => {
        const t = document.createElement('span');
        t.innerHTML = text + ' <i class="fa-solid fa-circle"></i>';
        span.appendChild(t);
      });
      return span;
    };
    marquee.appendChild(buildGroup());
    marquee.appendChild(buildGroup());
  }

  /* ── HERO CANVAS — SOFT PARTICLE ORBS ─────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w, h, orbs;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const initOrbs = () => {
      const count = w < 700 ? 10 : 22;
      orbs = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.5 + 0.15
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < 0 || o.x > w) o.vx *= -1;
        if (o.y < 0 || o.y > h) o.vy *= -1;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216,188,128,${o.a})`;
        ctx.fill();
      });
      if (!prefersReduced) requestAnimationFrame(draw);
    };

    resize();
    initOrbs();
    draw();
    window.addEventListener('resize', () => { resize(); initOrbs(); }, { passive: true });
  }

  /* ── CONTACT FORM → WHATSAPP ──────────────── */
  const waForm = document.getElementById('wa-form');
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const interest = document.getElementById('f-interest').value;
      const msg = document.getElementById('f-msg').value.trim();

      if (!name || !msg) return;

      const text = `Hola, soy ${name}. Me interesa: ${interest}. ${msg}`;
      const phone = '522223804363';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

});

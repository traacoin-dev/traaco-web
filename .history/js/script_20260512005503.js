/* ============================================================
   TRAACO — script.js | All JavaScript for all pages
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     AOS INIT
  ───────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      once:     true,
      easing:   'ease-out-cubic',
      offset:   60,
      delay:    0,
    });
  }

  /* ─────────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:2px',
    'background:linear-gradient(to right,#C9A84C,#D4783A)',
    'width:0%', 'z-index:9999', 'pointer-events:none',
    'transition:width 0.1s linear',
  ].join(';');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progressBar.style.width = Math.min((scrolled / docHeight) * 100, 100) + '%';
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────
     NAVBAR — scroll effect + active link
  ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active-nav');
          const href = link.getAttribute('href');
          if (href === '#' + id || href === 'index.html#' + id) {
            link.classList.add('active-nav');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ─────────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────────── */
  const menuBtn     = document.getElementById('menu-btn');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mobile-menu .btn-gold');

  function closeMobileMenu() {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

    // Close on backdrop click (outside inner panel)
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMobileMenu();
    });
  }

  // ESC key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ─────────────────────────────────────────────
     SMOOTH SCROLL for anchor links
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 70;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────────
     HERO PARALLAX (subtle)
  ───────────────────────────────────────────── */
  const heroBgOverlay = document.querySelector('.hero-bg-overlay img, .absolute img');
  if (heroBgOverlay) {
    window.addEventListener('scroll', () => {
      heroBgOverlay.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     STAGGERED HERO ANIMATION
  ───────────────────────────────────────────── */
  document.querySelectorAll('.hero-title-line').forEach((line, i) => {
    line.style.opacity    = '0';
    line.style.transform  = 'translateY(24px)';
    line.style.transition = `opacity 0.75s ease ${0.3 + i * 0.12}s, transform 0.75s ease ${0.3 + i * 0.12}s`;
    requestAnimationFrame(() => {
      setTimeout(() => {
        line.style.opacity   = '1';
        line.style.transform = 'translateY(0)';
      }, 50);
    });
  });

  /* ─────────────────────────────────────────────
     FEATURE CHIP hover glow
  ───────────────────────────────────────────── */
  document.querySelectorAll('.feature-chip').forEach((chip) => {
    chip.addEventListener('mouseenter', () => { chip.style.boxShadow = '0 0 12px rgba(201,168,76,0.12)'; });
    chip.addEventListener('mouseleave', () => { chip.style.boxShadow = ''; });
  });

  /* ─────────────────────────────────────────────
     NICHE CARD — click ripple
  ───────────────────────────────────────────── */
  // Inject ripple keyframe once
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleAnim { to { transform:scale(3); opacity:0; } }';
  document.head.appendChild(rippleStyle);

  document.querySelectorAll('.niche-card').forEach((card) => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = [
        'position:absolute', 'width:80px', 'height:80px', 'border-radius:50%',
        'background:rgba(201,168,76,0.2)', 'pointer-events:none', 'transform:scale(0)',
        'animation:rippleAnim 0.5s ease forwards',
        `left:${e.offsetX - 40}px`, `top:${e.offsetY - 40}px`, 'z-index:20',
      ].join(';');
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ─────────────────────────────────────────────
     NICHE FILTER TABS (index page)
  ───────────────────────────────────────────── */
  const sortBtns  = document.querySelectorAll('.niche-sort-btn');
  const nicheGrid = document.getElementById('niche-grid');

  if (sortBtns.length && nicheGrid) {
    sortBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sortBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        nicheGrid.querySelectorAll('.niche-card').forEach((card) => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     PRICING CARD TILT
  ───────────────────────────────────────────── */
  document.querySelectorAll('.pricing-card, .rest-pricing-card').forEach((card) => {
    card.addEventListener('mousemove', function (e) {
      const rect  = this.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      this.style.transform  = `translateY(-4px) rotateX(${dy * -3}deg) rotateY(${dx * 3}deg)`;
      this.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform  = '';
      this.style.transition = 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });

  /* ─────────────────────────────────────────────
     SERVICE CARD GLOW on hover
  ───────────────────────────────────────────── */
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      this.style.background = `radial-gradient(200px circle at ${x}px ${y}px,
        rgba(201,168,76,0.05) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)`;
    });
    card.addEventListener('mouseleave', function () { this.style.background = ''; });
  });

  /* ─────────────────────────────────────────────
     COUNTER ANIMATION for stats
  ───────────────────────────────────────────── */
  function animateCounters() {
    document.querySelectorAll('.rest-stat-number').forEach((el) => {
      const target = el.textContent;
      const num    = parseInt(target);
      if (isNaN(num)) return;
      const suffix = target.replace(/[0-9]/g, '');
      let current  = 0;
      const step   = Math.ceil(num / 40);
      const timer  = setInterval(() => {
        current += step;
        if (current >= num) { current = num; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 35);
    });
  }

  const statsSection = document.querySelector('#rest-hero .grid');
  if (statsSection) {
    new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCounters(); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 }).observe(statsSection);
  }

  /* ─────────────────────────────────────────────
     LAZY LOAD IMAGES
  ───────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => imgObserver.observe(img));
  }

  /* ─────────────────────────────────────────────
     WHATSAPP FLOAT TOOLTIP
  ───────────────────────────────────────────── */
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Chat with us!';
    tooltip.style.cssText = [
      'position:absolute', 'right:64px', 'top:50%', 'transform:translateY(-50%)',
      'background:#1a1a1a', 'color:#F0ECE4', 'font-size:0.72rem',
      "font-family:'Poppins',sans-serif", 'white-space:nowrap',
      'padding:6px 12px', 'border-radius:8px',
      'border:1px solid rgba(255,255,255,0.1)', 'pointer-events:none',
      'opacity:0', 'transition:opacity 0.3s ease',
    ].join(';');
    waFloat.style.position = 'relative';
    waFloat.appendChild(tooltip);

    setTimeout(() => {
      tooltip.style.opacity = '1';
      setTimeout(() => { tooltip.style.opacity = '0'; }, 3500);
    }, 3000);
    waFloat.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
    waFloat.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
  }

  /* ─────────────────────────────────────────────
     FOOTER LINK HOVER UNDERLINE
  ───────────────────────────────────────────── */
  document.querySelectorAll('.footer-links a').forEach((link) => {
    link.style.display       = 'inline-block';
    link.style.position      = 'relative';
    link.style.paddingBottom = '1px';
  });

  /* ─────────────────────────────────────────────
     CONTACT FORM (contact.html only)
  ───────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // ── YOUR DEPLOYED APPS SCRIPT WEB APP URL ─────────────────────────
    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbx-4N7WnyhCQyUwJhvHYh_ty8p68y6IodqcbQkOfYj-cHZxrTchWb121zMMRv3Ad-Uz/exec';

    const nameEl      = document.getElementById('name');
    const emailEl     = document.getElementById('email');
    const phoneEl     = document.getElementById('phone');
    const phoneGroup  = document.getElementById('phoneGroup');
    const projectEl   = document.getElementById('project');
    const timelineEl  = document.getElementById('timeline');

    // ── Validators ────────────────────────────────────────────────────
    const isValidName   = (v) => v.trim().length >= 2;
    const isValidEmail  = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const isValidPhone  = (v) => /^[6-9]\d{9}$/.test(v.trim()); // 10-digit Indian mobile
    const isValidSelect = (v) => v !== '';

    // ── Set visual state ──────────────────────────────────────────────
    function setInputState(el, errorEl, isValid) {
      el.classList.toggle('valid',   isValid);
      el.classList.toggle('invalid', !isValid);
      if (errorEl) errorEl.classList.toggle('show', !isValid);
    }
    function setPhoneState(isValid) {
      if (!phoneGroup) return;
      phoneGroup.classList.toggle('valid',   isValid);
      phoneGroup.classList.toggle('invalid', !isValid);
      const err = document.getElementById('phoneError');
      if (err) err.classList.toggle('show', !isValid);
    }

    // ── Validate all ──────────────────────────────────────────────────
    function validateAll() {
      const v1 = isValidName(nameEl.value);
      const v2 = isValidEmail(emailEl.value);
      const v3 = isValidPhone(phoneEl.value);
      const v4 = isValidSelect(projectEl.value);
      const v5 = isValidSelect(timelineEl.value);

      setInputState(nameEl,     document.getElementById('nameError'),     v1);
      setInputState(emailEl,    document.getElementById('emailError'),    v2);
      setPhoneState(v3);
      setInputState(projectEl,  document.getElementById('projectError'),  v4);
      setInputState(timelineEl, document.getElementById('timelineError'), v5);

      return v1 && v2 && v3 && v4 && v5;
    }

    // ── Live validation (on blur) ─────────────────────────────────────
    if (nameEl)     nameEl.addEventListener('blur',   () => setInputState(nameEl,     document.getElementById('nameError'),     isValidName(nameEl.value)));
    if (emailEl)    emailEl.addEventListener('blur',  () => setInputState(emailEl,    document.getElementById('emailError'),    isValidEmail(emailEl.value)));
    if (phoneEl)    phoneEl.addEventListener('blur',  () => setPhoneState(isValidPhone(phoneEl.value)));
    if (projectEl)  projectEl.addEventListener('change',  () => setInputState(projectEl,  document.getElementById('projectError'),  isValidSelect(projectEl.value)));
    if (timelineEl) timelineEl.addEventListener('change', () => setInputState(timelineEl, document.getElementById('timelineError'), isValidSelect(timelineEl.value)));

    // ── Phone: digits only, max 10 ────────────────────────────────────
    if (phoneEl) {
      phoneEl.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
      });
    }

    // ── Form submit ───────────────────────────────────────────────────
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn      = document.getElementById('submitBtn');
      const successMessage = document.getElementById('successMessage');
      const errorMessage   = document.getElementById('errorMessage');

      successMessage.classList.remove('show');
      errorMessage.classList.remove('show');

      if (!validateAll()) {
        const firstInvalid = this.querySelector('.invalid, .phone-group.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const payload = {
        name:     nameEl.value.trim(),
        email:    emailEl.value.trim().toLowerCase(),
        phone:    '+91' + phoneEl.value.trim(),
        project:  projectEl.value,
        timeline: timelineEl.value,
      };

      submitBtn.disabled  = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span>Sending…';

      try {
        /*
         * NOTE: No Content-Type header — keeps it a "simple request",
         * avoiding CORS preflight with Google Apps Script.
         */
        const response = await fetch(SHEET_URL, { method: 'POST', body: JSON.stringify(payload) });
        const result   = JSON.parse(await response.text());

        if (result.status === 'success') {
          successMessage.classList.add('show');
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          this.reset();
          [nameEl, emailEl, projectEl, timelineEl].forEach((el) => el.classList.remove('valid', 'invalid'));
          phoneGroup.classList.remove('valid', 'invalid');
          this.querySelectorAll('.field-error').forEach((el) => el.classList.remove('show'));
        } else {
          console.error('Apps Script error:', result.message);
          errorMessage.classList.add('show');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        errorMessage.classList.add('show');
      } finally {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = 'Send Message ✦';
      }
    });
  }

  /* ─────────────────────────────────────────────
     CONSOLE BRAND TAG
  ───────────────────────────────────────────── */
  console.log('%cTRAACO Digital Studio', 'color:#C9A84C;font-size:1.1rem;font-weight:bold;font-family:serif;');
  console.log('%cPremium websites for hospitality & food brands.', 'color:#9A9A9A;font-size:0.8rem;');

})();
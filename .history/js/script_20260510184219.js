/* ============================================================
   TRAACO — script.js | Shared JavaScript for all pages
   ============================================================ */

(function () {
  'use strict';

  /* ─── AOS Init ─── */
  AOS.init({
    duration: 750,
    once: true,
    easing: 'ease-out-cubic',
    offset: 60,
    delay: 0,
  });

  /* ─── Navbar Scroll Effect ─── */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load

  /* ─── Active Nav Link on Scroll ─── */
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
          if (link.getAttribute('href') === '#' + id ||
              link.getAttribute('href') === 'index.html#' + id) {
            link.classList.add('active-nav');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ─── Mobile Menu ─── */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mobile-menu .btn-gold');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── Smooth Scroll for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH  = navbar ? navbar.offsetHeight : 70;
        const top   = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Hero Parallax (subtle) ─── */
  const heroBgOverlay = document.querySelector('.hero-bg-overlay img, .absolute img');

  function heroParallax() {
    if (!heroBgOverlay) return;
    const scrollY = window.scrollY;
    heroBgOverlay.style.transform = `translateY(${scrollY * 0.25}px)`;
  }

  window.addEventListener('scroll', heroParallax, { passive: true });

  /* ─── Staggered Hero Animation ─── */
  const heroLines = document.querySelectorAll('.hero-title-line');
  heroLines.forEach((line, i) => {
    line.style.opacity  = '0';
    line.style.transform = 'translateY(24px)';
    line.style.transition = `opacity 0.75s ease ${0.3 + i * 0.12}s, transform 0.75s ease ${0.3 + i * 0.12}s`;
    requestAnimationFrame(() => {
      setTimeout(() => {
        line.style.opacity   = '1';
        line.style.transform = 'translateY(0)';
      }, 50);
    });
  });

  /* ─── Feature Chip hover glow ─── */
  document.querySelectorAll('.feature-chip').forEach((chip) => {
    chip.addEventListener('mouseenter', () => {
      chip.style.boxShadow = '0 0 12px rgba(201,168,76,0.12)';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.boxShadow = '';
    });
  });

  /* ─── Niche card click ripple ─── */
  document.querySelectorAll('.niche-card').forEach((card) => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        width:80px; height:80px;
        border-radius:50%;
        background:rgba(201,168,76,0.2);
        pointer-events:none;
        transform:scale(0);
        animation:rippleAnim 0.5s ease forwards;
        left:${e.offsetX - 40}px;
        top:${e.offsetY - 40}px;
        z-index:20;
      `;
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* Inject ripple keyframe */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform:scale(3); opacity:0; }
    }
  `;
  document.head.appendChild(style);

  /* ─── Pricing card tilt effect ─── */
  const pricingCards = document.querySelectorAll('.pricing-card, .rest-pricing-card');

  pricingCards.forEach((card) => {
    card.addEventListener('mousemove', function (e) {
      const rect  = this.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -3;
      const tiltY = dx *  3;
      this.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      this.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });

  /* ─── Service card glow on hover ─── */
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', function (e) {
      const rect  = this.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      this.style.background = `
        radial-gradient(200px circle at ${x}px ${y}px,
          rgba(201,168,76,0.05) 0%,
          rgba(255,255,255,0.02) 60%,
          transparent 100%)
      `;
    });
    card.addEventListener('mouseleave', function () {
      this.style.background = '';
    });
  });

  /* ─── Counter Animation for stats ─── */
  function animateCounters() {
    const counters = document.querySelectorAll('.rest-stat-number');
    counters.forEach((el) => {
      const target = el.textContent;
      const num    = parseInt(target);
      if (isNaN(num)) return;
      let current = 0;
      const suffix = target.replace(/[0-9]/g, '');
      const step   = Math.ceil(num / 40);
      const timer  = setInterval(() => {
        current += step;
        if (current >= num) {
          current = num;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 35);
    });
  }

  // Trigger when stats come into view
  const statsSection = document.querySelector('#rest-hero .grid');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  /* ─── Lazy load images ─── */
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      imgObserver.observe(img);
    });
  }

  /* ─── WhatsApp float tooltip ─── */
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Chat with us!';
    tooltip.style.cssText = `
      position:absolute;
      right:64px; top:50%;
      transform:translateY(-50%);
      background:#1a1a1a;
      color:#F0ECE4;
      font-size:0.72rem;
      font-family:'Poppins',sans-serif;
      white-space:nowrap;
      padding:6px 12px;
      border-radius:8px;
      border:1px solid rgba(255,255,255,0.1);
      pointer-events:none;
      opacity:0;
      transition:opacity 0.3s ease;
    `;
    waFloat.style.position = 'relative';
    waFloat.appendChild(tooltip);

    // Show tooltip after 3s then fade
    setTimeout(() => {
      tooltip.style.opacity = '1';
      setTimeout(() => { tooltip.style.opacity = '0'; }, 3500);
    }, 3000);

    waFloat.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
    waFloat.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
  }

  /* ─── Scroll progress bar ─── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position:fixed;
    top:0; left:0;
    height:2px;
    background:linear-gradient(to right, #C9A84C, #D4783A);
    width:0%;
    z-index:9999;
    pointer-events:none;
    transition:width 0.1s linear;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = (scrolled / docHeight) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });

  /* ─── Keyboard accessibility: close menu on ESC ─── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      if (menuBtn) menuBtn.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ─── Footer link hover line ─── */
  document.querySelectorAll('.footer-links a').forEach((link) => {
    link.style.display = 'inline-block';
    link.style.position = 'relative';
    link.style.paddingBottom = '1px';
  });

  console.log('%cTRAACO Digital Studio', 'color:#C9A84C; font-size:1.1rem; font-weight:bold; font-family:serif;');
  console.log('%cPremium websites for hospitality & food brands.', 'color:#9A9A9A; font-size:0.8rem;');

})();
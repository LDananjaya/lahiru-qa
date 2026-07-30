(() => {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const getEffectiveTheme = () =>
      document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    const syncThemeColor = (theme) => {
      if (themeColorMeta) themeColorMeta.setAttribute('content', theme === 'light' ? '#ffffff' : '#0a0a0b');
    };

    themeToggle.setAttribute('aria-pressed', String(getEffectiveTheme() === 'light'));
    syncThemeColor(getEffectiveTheme());

    themeToggle.addEventListener('click', () => {
      const next = getEffectiveTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.setAttribute('aria-pressed', String(next === 'light'));
      syncThemeColor(next);
    });
  }

  const navLinks = document.querySelectorAll('.side-nav a[data-nav]');
  const sections = [...navLinks]
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.nav === id);
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  const statEls = document.querySelectorAll('.stat[data-count]');
  if (statEls.length) {
    const animateStat = (el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const numberEl = el.querySelector('.stat-number');
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        numberEl.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const statObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateStat(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
      );
      statEls.forEach((el) => statObserver.observe(el));
    } else {
      statEls.forEach(animateStat);
    }
  }

  const setupCarousel = (root) => {
    const track = root.querySelector('.carousel-track');
    const btns = root.querySelectorAll('.carousel-btn');
    if (!track || !btns.length) return;

    const cardStep = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return card ? card.getBoundingClientRect().width + gap : 360;
    };

    const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    const advance = (dir) => {
      if (dir > 0 && atEnd()) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: cardStep() * dir, behavior: 'smooth' });
      }
    };

    const autoplayDelay = Number(root.dataset.autoplay) || 4000;
    let autoplayTimer = null;

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(() => advance(1), autoplayDelay);
    };

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        advance(Number(btn.dataset.dir));
        startAutoplay();
      });
    });

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('focusin', stopAutoplay);
    track.addEventListener('focusout', startAutoplay);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startAutoplay();
    }
  };

  document.querySelectorAll('.carousel').forEach(setupCarousel);

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const headlineEl = document.getElementById('about-headline-text');
  if (headlineEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const phrases = [
      'I take ownership of quality, not just test cases',
      'I find the bugs that would have cost you customers',
      'Testing built around real user journeys, not checklists',
      "I help teams ship with confidence, not chaos",
    ];

    const TYPE_SPEED = 45;
    const DELETE_SPEED = 25;
    const HOLD_DELAY = 2200;

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = false;

    const tick = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        if (charIndex >= current.length) {
          headlineEl.textContent = current;
          deleting = true;
          setTimeout(tick, HOLD_DELAY);
          return;
        }
      } else {
        charIndex -= 1;
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          headlineEl.textContent = '';
          setTimeout(tick, TYPE_SPEED);
          return;
        }
      }

      headlineEl.textContent = current.slice(0, charIndex);
      setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
    };

    setTimeout(() => {
      deleting = true;
      tick();
    }, HOLD_DELAY);
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(contactForm);
      const subject = `QA project inquiry from ${form.get('name')}`;
      const body = [
        `Name: ${form.get('name')}`,
        `Email: ${form.get('email')}`,
        `Project type: ${form.get('projectType')}`,
        '',
        'Message:',
        form.get('message'),
      ].join('\n');
      window.location.href = `mailto:dananjaya703@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();

(() => {
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const drawer = q('[data-package-drawer]');
  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', String(!open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) q('.package-drawer__close', drawer)?.focus();
  };
  qa('[data-open-package]').forEach(el => el.addEventListener('click', () => setDrawer(true)));
  qa('[data-close-package]').forEach(el => el.addEventListener('click', () => setDrawer(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') { setDrawer(false); setGrowthDrawer(false); } });


  const growthDrawer = q('[data-growth-drawer]');
  const setGrowthDrawer = (open) => {
    if (!growthDrawer) return;
    growthDrawer.setAttribute('aria-hidden', String(!open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) q('.growth-drawer__close', growthDrawer)?.focus();
  };
  qa('[data-open-growth]').forEach(el => el.addEventListener('click', () => setGrowthDrawer(true)));
  qa('[data-close-growth]').forEach(el => el.addEventListener('click', () => setGrowthDrawer(false)));

  const comparison = q('[data-comparison]');
  if (comparison) {
    const range = q('[data-range]', comparison);
    const before = q('[data-before]', comparison);
    const line = q('[data-line]', comparison);
    const update = () => {
      const v = range.value + '%';
      before.style.width = v;
      line.style.left = v;
    };
    range.addEventListener('input', update);
    update();
  }

  const toggle = q('.menu-toggle');
  const menu = q('[data-mobile-menu]');
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  qa('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  qa('.service-details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      qa('.service-details').forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });

  const form = q('[data-lead-form]');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = q('.form-status', form);
    const fields = qa('[required]', form);
    fields.forEach(f => f.classList.remove('is-error'));
    const bad = fields.filter(f => !String(f.value).trim());
    const phone = q('[name="phone"]', form);
    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10 && !bad.includes(phone)) bad.push(phone);
    bad.forEach(f => f.classList.add('is-error'));
    if (bad.length) {
      status.textContent = 'Проверьте имя и телефон.';
      bad[0].focus();
      return;
    }
    status.textContent = 'Демо: форма заполнена корректно. В рабочем сайте заявка уйдёт в Telegram или MAX.';
    form.querySelector('button[type="submit"]').textContent = 'Заявка готова ✓';
  });
})();

// Process cards: restrained reveal animation, preserving reduced-motion preferences.
(() => {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const cards = [...timeline.querySelectorAll('article')];
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  timeline.classList.add('process-animated');
  cards.forEach((card, index) => card.style.setProperty('--process-delay', `${index * 90}ms`));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  cards.forEach(card => observer.observe(card));
})();

// Case cards: soft interactivity for hover + click/tap expand.
(() => {
  const cards = [...document.querySelectorAll('[data-case-card]')];
  if (!cards.length) return;

  const openCard = (card) => {
    cards.forEach((item) => item.classList.toggle('is-open', item === card));
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openCard(card));
    card.addEventListener('mouseenter', () => openCard(card));
    card.addEventListener('focus', () => openCard(card), true);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCard(card);
      }
    });
  });
})();

// Premium case lightbox: image zoom, keyboard navigation and mobile-friendly controls.
(() => {
  const cards = [...document.querySelectorAll('[data-case-card]')];
  const lightbox = document.querySelector('[data-case-lightbox]');
  if (!cards.length || !lightbox) return;

  const image = lightbox.querySelector('[data-case-lightbox-image]');
  const title = lightbox.querySelector('[data-case-lightbox-title]');
  const service = lightbox.querySelector('[data-case-lightbox-service]');
  const time = lightbox.querySelector('[data-case-lightbox-time]');
  const price = lightbox.querySelector('[data-case-lightbox-price]');
  const counter = lightbox.querySelector('[data-case-lightbox-counter]');
  const closeBtn = lightbox.querySelector('.case-lightbox__close');
  let activeIndex = 0;
  let returnFocus = null;

  const render = (index) => {
    activeIndex = (index + cards.length) % cards.length;
    const card = cards[activeIndex];
    image.src = card.dataset.caseImage;
    image.alt = `${card.dataset.caseTitle}: ${card.dataset.caseService}`;
    title.textContent = card.dataset.caseTitle;
    service.textContent = card.dataset.caseService;
    time.textContent = card.dataset.caseTime;
    price.textContent = card.dataset.casePrice;
    counter.textContent = `${String(activeIndex + 1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  };

  const open = (index, trigger) => {
    returnFocus = trigger || document.activeElement;
    render(index);
    lightbox.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => closeBtn?.focus());
  };

  const close = () => {
    if (lightbox.getAttribute('aria-hidden') === 'true') return;
    lightbox.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow = '';
    returnFocus?.focus?.();
  };

  cards.forEach((card,index) => {
    const trigger = card.querySelector('[data-open-case-lightbox]');
    trigger?.addEventListener('click',(e) => {
      e.stopPropagation();
      open(index,trigger);
    });
  });

  lightbox.querySelectorAll('[data-close-case-lightbox]').forEach(el => el.addEventListener('click',close));
  lightbox.querySelector('[data-case-prev]')?.addEventListener('click',() => render(activeIndex - 1));
  lightbox.querySelector('[data-case-next]')?.addEventListener('click',() => render(activeIndex + 1));

  window.addEventListener('keydown',(e) => {
    if (lightbox.getAttribute('aria-hidden') !== 'false') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') render(activeIndex - 1);
    if (e.key === 'ArrowRight') render(activeIndex + 1);
  });
})();

// v1.3 transition block: cursor-driven 3D tilt + section reveal.
(() => {
  const section = document.querySelector('.kb-next-tier--3d');
  if (!section) return;

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia?.('(pointer: fine)').matches;
  const tiltItems = [...section.querySelectorAll('[data-growth-tilt]')];

  const activate = () => section.classList.add('is-active');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activate();
        observer.disconnect();
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' });
    observer.observe(section);
  } else {
    activate();
  }

  if (!reduceMotion && finePointer) {
    section.addEventListener('pointermove', (e) => {
      const r = section.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      section.style.setProperty('--growth-mx', `${x}%`);
      section.style.setProperty('--growth-my', `${y}%`);
    });

    tiltItems.forEach((item) => {
      const soft = item.dataset.growthTilt === 'soft';
      const maxTilt = soft ? 3.2 : 5.2;
      item.addEventListener('pointermove', (e) => {
        const r = item.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - .5) * maxTilt * 2;
        const rx = (.5 - py) * maxTilt * 2;
        item.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
        item.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
        item.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        item.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      });
      item.addEventListener('pointerleave', () => {
        item.style.setProperty('--rx', '0deg');
        item.style.setProperty('--ry', '0deg');
        item.style.setProperty('--mx', '50%');
        item.style.setProperty('--my', '50%');
      });
    });
  }
})();

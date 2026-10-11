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
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('is-mobile-nav-open', open);
    document.body.classList.toggle('is-mobile-nav-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  qa('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 1051px)').matches) setMenu(false);
  });

  qa('.service-details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      qa('.service-details').forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });

  const form = q('[data-lead-form]');
  const phoneInput = q('[name="phone"]', form);

  const phoneDigits = (value) => {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
    if (digits.length === 10 && digits.startsWith('9')) digits = `7${digits}`;
    return digits.slice(0, 11);
  };

  const formatPhone = (value) => {
    const digits = phoneDigits(value);
    if (!digits) return '';
    const rest = digits.slice(1);
    let out = '+7';
    if (rest.length) out += ` (${rest.slice(0, 3)}`;
    if (rest.length >= 3) out += ')';
    if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
    if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
    if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
    return out;
  };

  if (phoneInput) {
    phoneInput.dataset.prev = phoneInput.value || '';
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value.trim()) {
        phoneInput.value = '+7 (';
        phoneInput.dataset.prev = phoneInput.value;
        const end = phoneInput.value.length;
        phoneInput.setSelectionRange(end, end);
      }
    });
    phoneInput.addEventListener('input', () => {
      const prev = phoneInput.dataset.prev || '';
      let digits = phoneInput.value.replace(/\D/g, '');
      const prevDigits = prev.replace(/\D/g, '');
      // Если стёрли скобку/пробел/дефис — убираем и цифру, чтобы маска редактировалась
      if (phoneInput.value.length < prev.length && digits.length === prevDigits.length && digits.length) {
        digits = digits.slice(0, -1);
      }
      if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
      if (digits.length === 10 && digits.startsWith('9')) digits = `7${digits}`;
      digits = digits.slice(0, 11);
      // Полностью стёрли код — оставляем поле пустым
      if (!digits || digits === '7') {
        phoneInput.value = '';
        phoneInput.dataset.prev = '';
        return;
      }
      phoneInput.value = formatPhone(digits);
      phoneInput.dataset.prev = phoneInput.value;
    });
    phoneInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;
      const start = phoneInput.selectionStart ?? 0;
      const end = phoneInput.selectionEnd ?? 0;
      if (start !== end) return;
      // Backspace на символе маски — удаляем предыдущую цифру явно
      if (event.key === 'Backspace' && start > 0 && /\D/.test(phoneInput.value[start - 1])) {
        event.preventDefault();
        const digits = phoneDigits(phoneInput.value).slice(0, -1);
        phoneInput.value = digits && digits !== '7' ? formatPhone(digits) : '';
        phoneInput.dataset.prev = phoneInput.value;
        const pos = phoneInput.value.length;
        phoneInput.setSelectionRange(pos, pos);
      }
    });
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = q('.form-status', form);
    const fields = qa('[required]', form);
    fields.forEach(f => f.classList.remove('is-error'));
    const bad = fields.filter(f => !String(f.value).trim());
    const phone = q('[name="phone"]', form);
    const digits = phoneDigits(phone?.value || '');
    if (digits.length !== 11 && phone && !bad.includes(phone)) bad.push(phone);
    bad.forEach(f => f.classList.add('is-error'));
    if (bad.length) {
      status.textContent = 'Проверьте имя и телефон в формате +7 (999) 000-00-00.';
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

  const mobileMq = window.matchMedia('(max-width: 760px)');
  const openAll = () => cards.forEach((item) => item.classList.add('is-open'));
  const openCard = (card) => {
    // На мобильном все кейсы раскрыты сразу
    if (mobileMq.matches) {
      openAll();
      return;
    }
    cards.forEach((item) => item.classList.toggle('is-open', item === card));
  };

  if (mobileMq.matches) openAll();
  mobileMq.addEventListener('change', () => {
    if (mobileMq.matches) openAll();
  });

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

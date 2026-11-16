/* alisac.it v2 — interactions
   Keep it small: nav state, mobile sheet, scroll reveal,
   counters, contact-form channels + submit. */

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // copy for the contact form, per language
  const isRu = (document.documentElement.lang || 'en').toLowerCase().startsWith('ru');
  const L = isRu ? {
    name: 'имя', reason: 'тему запроса', message: 'сообщение не короче 10 символов',
    consent: 'согласие на обработку данных', email: 'корректный e-mail',
    phone: 'корректный номер WhatsApp', telegram: 'корректный ник в Telegram',
    prefix: 'Добавьте: ', suffix: '.',
    sending: 'Отправляем…',
    ok: 'Спасибо — сообщение отправлено. Обычно отвечаю в течение одного рабочего дня.',
    fail: ' Не удалось отправить. Можно написать на alisa.1chebotarenko@gmail.com.'
  } : {
    name: 'your name', reason: 'what this is about', message: 'a message of at least 10 characters',
    consent: 'privacy consent', email: 'a valid email',
    phone: 'a valid WhatsApp number', telegram: 'a valid Telegram username',
    prefix: 'Please add ', suffix: '.',
    sending: 'Sending…',
    ok: 'Thank you — your message is on its way. I usually reply within one business day.',
    fail: ' You can also write to alisa.1chebotarenko@gmail.com.'
  };
  const nav = document.getElementById('nav');
  const sheet = document.getElementById('sheet');
  const toggle = document.getElementById('navToggle');

  /* ---------- nav stuck state ---------- */
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile sheet ---------- */
  const setSheet = open => {
    if (!sheet || !toggle) return;
    sheet.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      const first = sheet.querySelector('a');
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    }
  };
  if (toggle) toggle.addEventListener('click', () => setSheet(!sheet.classList.contains('is-open')));
  if (sheet) sheet.addEventListener('click', e => { if (e.target.closest('a')) setSheet(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setSheet(false); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 900) setSheet(false); });

  /* ---------- reveal on scroll ---------- */
  const revealEls = [...document.querySelectorAll('[data-reveal]')];
  if (!reduce) {
    revealEls.forEach(el => {
      const i = Number(el.style.getPropertyValue('--i') || 0);
      el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
    });
    let ticking = false;
    const checkReveals = () => {
      ticking = false;
      const vh = window.innerHeight || 800;
      for (const el of revealEls) {
        if (el.classList.contains('is-in')) continue;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('is-in');
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkReveals);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', checkReveals);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
      revealEls.forEach(el => io.observe(el));
    }
    requestAnimationFrame(checkReveals);
    setTimeout(checkReveals, 400);

    // safety net: keep checking until everything has been revealed
    const poll = setInterval(() => {
      checkReveals();
      if (revealEls.every(el => el.classList.contains('is-in'))) clearInterval(poll);
    }, 700);
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- counters ---------- */
  const counters = [...document.querySelectorAll('[data-count]')];
  const runCounter = el => {
    const target = Number(el.dataset.count || 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    const dur = 1300;
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if ('IntersectionObserver' in window && !reduce) {
      const cio = new IntersectionObserver(es => {
        es.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
          runCounter(el);
          cio.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(c => cio.observe(c));
    } else counters.forEach(runCounter);
  }

  /* ---------- active nav link ---------- */
  const links = [...document.querySelectorAll('.nav__link')];
  const sections = links
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => sio.observe(s));
  }

  /* ---------- contact form ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  const setStatus = (msg, kind = '') => {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove('is-error', 'is-ok');
    if (kind) status.classList.add(kind);
  };

  const channelFields = [...document.querySelectorAll('[data-channel]')];
  const syncChannels = () => {
    const chosen = form?.querySelector('input[name="preferred_contact"]:checked')?.value || 'email';
    channelFields.forEach(f => { f.hidden = f.dataset.channel !== chosen; });
    channelFields.forEach(f => {
      f.querySelectorAll('input').forEach(i => { i.required = f.dataset.channel === chosen; });
    });
  };
  form?.addEventListener('change', e => {
    if (e.target.name === 'preferred_contact') syncChannels();
  });
  syncChannels();

  // prefill the "what is this about" field from a service CTA
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const reason = document.getElementById('request_reason');
      if (reason) reason.value = btn.dataset.service + ' — ';
      const telegram = form?.querySelector('input[value="telegram"]');
      if (telegram && window.innerWidth < 900) telegram.checked = false;
    });
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.privacy_consent = fd.get('privacy_consent') === 'on' || fd.get('privacy_consent') === 'true';

    const honey = String(data.company_website || '').trim();
    delete data.company_website;
    if (honey) return; // honeypot filled: silently drop

    const errors = [];
    if (!data.name || data.name.trim().length < 2) errors.push(L.name);
    if (!data.request_reason) errors.push(L.reason);
    if (!data.message || data.message.trim().length < 10) errors.push(L.message);
    if (!data.privacy_consent) errors.push(L.consent);
    if (data.preferred_contact === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) errors.push(L.email);
    if (data.preferred_contact === 'whatsapp' && !/^[0-9\s()+-]{6,20}$/.test(data.phone || '')) errors.push(L.phone);
    if (data.preferred_contact === 'telegram' && !/^@?[A-Za-z0-9_]{5,32}$/.test(data.telegram_username || '')) errors.push(L.telegram);

    if (errors.length) {
      setStatus(L.prefix + errors.join(', ') + L.suffix, 'is-error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '.6';
    setStatus(L.sending);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || 'Something went wrong.');
      setStatus(L.ok, 'is-ok');
      form.reset();
      syncChannels();
    } catch (err) {
      setStatus(err.message + L.fail, 'is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
    }
  });

  /* ---------- service category tabs ---------- */
  const tabs = [...document.querySelectorAll('.svc-tab')];
  const panels = [...document.querySelectorAll('.svc-panel')];
  const activateTab = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(p => {
      const on = p.id === tab.getAttribute('aria-controls');
      p.classList.toggle('is-active', on);
      p.hidden = !on;
      if (on) {
        // re-trigger reveal for cards that were hidden
        p.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
      }
    });
  };
  tabs.forEach((tab, i) => {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      let idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') idx = (idx + 1) % tabs.length;
      if (e.key === 'ArrowLeft') idx = (idx - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') idx = 0;
      if (e.key === 'End') idx = tabs.length - 1;
      tabs[idx].focus();
      activateTab(tabs[idx]);
    });
  });

  /* ---------- mindset: word-by-word scroll-scrubbed reveal ---------- */
  const mindsetWords = [];
  document.querySelectorAll('[data-words]').forEach(el => {
    if (reduce) { el.classList.add('is-in'); return; }
    let i = 0;
    const wrapWords = (parent) => {
      [...parent.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok.trim()) { frag.appendChild(document.createTextNode(' ')); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = tok;
            span.style.setProperty('--d', (i++ * 18) + 'ms');
            span.style.setProperty('--w-op', '0.18');
            span.style.setProperty('--w-y', '8px');
            span.style.setProperty('--w-blur', '2.5px');
            mindsetWords.push(span);
            frag.appendChild(span);
            frag.appendChild(document.createTextNode(' '));
          });
          parent.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          wrapWords(node);
        }
      });
    };
    wrapWords(el);
  });

  /* ---------- fluid inertial scroll + parallax + scroll-scrubbing ---------- */
  if (!reduce) {
    const heroPhoto = document.querySelector('.hero__photo img');
    const heroGlow = document.querySelector('.hero__glow');
    const mindsetBox = document.querySelector('.mindset');
    const mindsetLine = document.querySelector('.mindset__line');

    const updateScrollScene = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 800;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const progress = Math.min(1, Math.max(0, y / maxScroll));
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));

      // Hero parallax
      if (y < vh * 1.4) {
        if (heroPhoto && window.innerWidth >= 900) {
          heroPhoto.style.transform = `translate3d(0, ${(y * 0.08).toFixed(1)}px, 0) scale(1.04)`;
        } else if (heroPhoto) {
          heroPhoto.style.transform = '';
        }
        if (heroGlow) {
          heroGlow.style.transform = `translate3d(0, ${(y * -0.12).toFixed(1)}px, 0)`;
        }
      }

      // Mindset word-by-word scroll-scrubbing + subtle scale
      if (mindsetBox && mindsetWords.length) {
        const rect = mindsetBox.getBoundingClientRect();
        // Progress from when top enters at 88% vh to when it reaches 32% vh
        const start = vh * 0.88;
        const end = vh * 0.28;
        const raw = (start - rect.top) / Math.max(1, start - end);
        const p = Math.min(1, Math.max(0, raw));
        const total = mindsetWords.length;

        mindsetWords.forEach((w, idx) => {
          const threshold = idx / total;
          const local = Math.min(1, Math.max(0, (p - threshold * 0.78) / 0.22));
          const op = 0.16 + local * 0.84;
          const wy = (1 - local) * 8;
          const blur = (1 - local) * 2.5;
          w.style.setProperty('--w-op', op.toFixed(3));
          w.style.setProperty('--w-y', `${wy.toFixed(1)}px`);
          w.style.setProperty('--w-blur', `${blur.toFixed(2)}px`);
        });

        const boxScale = 0.965 + Math.min(1, p * 1.15) * 0.035;
        mindsetBox.style.transform = `scale(${boxScale.toFixed(4)})`;
        if (mindsetLine) {
          mindsetLine.style.setProperty('--mindset-line', Math.min(1, Math.max(0.15, p)).toFixed(3));
        }
      }
    };

    // Inertial smooth scroll engine (Lenis-style momentum on fine pointers)
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (finePointer) {
      document.documentElement.classList.add('has-smooth-scroll');
      let targetY = window.scrollY || 0;
      let currentY = targetY;
      let rafId = null;

      const clampY = val => {
        const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        return Math.min(max, Math.max(0, val));
      };

      const step = () => {
        const diff = targetY - currentY;
        if (Math.abs(diff) > 0.35) {
          currentY += diff * 0.105;
          window.scrollTo(0, currentY);
          updateScrollScene();
          rafId = requestAnimationFrame(step);
        } else {
          currentY = targetY;
          window.scrollTo(0, currentY);
          updateScrollScene();
          rafId = null;
        }
      };

      const kick = () => {
        if (!rafId) rafId = requestAnimationFrame(step);
      };

      window.addEventListener('wheel', e => {
        if (document.body.classList.contains('is-locked')) return;
        if (e.ctrlKey || e.metaKey) return;
        const ta = e.target.closest('textarea');
        if (ta && ta.scrollHeight > ta.clientHeight) return;
        e.preventDefault();
        const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
        targetY = clampY(targetY + delta * 0.95);
        kick();
      }, { passive: false });

      window.addEventListener('scroll', () => {
        if (!rafId) {
          currentY = window.scrollY || 0;
          targetY = currentY;
          updateScrollScene();
        }
      }, { passive: true });

      // Smooth inertial anchor navigation
      document.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        const dest = hash === '#top' ? document.body : document.querySelector(hash);
        if (!dest) return;
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 72;
        const top = hash === '#top' ? 0 : dest.getBoundingClientRect().top + (window.scrollY || 0) - navH + 8;
        targetY = clampY(top);
        kick();
        history.pushState(null, '', hash);
      });
    } else {
      window.addEventListener('scroll', () => requestAnimationFrame(updateScrollScene), { passive: true });
    }

    window.addEventListener('resize', updateScrollScene);
    requestAnimationFrame(updateScrollScene);

    // Interactive card spotlight on pointer move
    document.querySelectorAll('.focus__card, .case, .svc').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
        card.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
      });
    });
  }

  /* ---------- tier switch (Standard / Growth) ---------- */
  document.querySelectorAll('.svc').forEach(card => {
    const tabs = [...card.querySelectorAll('.tier-tab')];
    const panels = [...card.querySelectorAll('.tier-panel')];
    if (!tabs.length) return;
    const cta = card.querySelector('[data-service]');
    const pill = card.querySelector('[data-tier-pill]');
    const price = card.querySelector('[data-tier-price]');
    const title = card.querySelector('.svc__title')?.textContent?.trim() || (isRu ? 'Аудит операционной эффективности' : 'Operational Efficiency Scan');
    const activate = tab => {
      const tier = tab.dataset.tier;
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.tierPanel === tier));
      if (cta) {
        const label = tier === 'growth' ? 'Growth' : 'Standard';
        cta.dataset.service = title + ' — ' + label;
      }
      if (pill) {
        pill.textContent = isRu
          ? (tier === 'growth' ? 'До 20 рабочих дней' : 'До 10 рабочих дней')
          : (tier === 'growth' ? 'Up to 20 business days' : 'Up to 10 business days');
      }
      if (price) {
        price.textContent = isRu
          ? (tier === 'growth' ? '€1 900' : '€950')
          : (tier === 'growth' ? '€1,900' : '€950');
      }
    };
    tabs.forEach(tab => tab.addEventListener('click', () => activate(tab)));
  });

  /* ---------- selected work carousel ---------- */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const cards = [...carousel.querySelectorAll('.work-card')];
    const current = carousel.querySelector('[data-current]');
    const n = cards.length;
    let active = 0;

    const render = () => {
      const isDesktop = window.innerWidth >= 900;
      cards.forEach((card, i) => {
        let d = i - active;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        card.dataset.pos = String(d);
        if (isDesktop) {
          card.removeAttribute('aria-hidden');
          card.removeAttribute('tabindex');
        } else {
          card.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
          card.tabIndex = d === 0 ? 0 : -1;
        }
      });
      if (current) current.textContent = String(active + 1);
    };

    const go = dir => { active = (active + dir + n) % n; render(); };

    carousel.querySelector('[data-next]')?.addEventListener('click', () => go(1));
    carousel.querySelector('[data-prev]')?.addEventListener('click', () => go(-1));

    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (window.innerWidth < 900 && i !== active) { active = i; render(); }
      });
      card.addEventListener('keydown', e => {
        if (window.innerWidth < 900 && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); active = i; render(); }
      });
    });

    carousel.addEventListener('keydown', e => {
      if (window.innerWidth >= 900) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    window.addEventListener('resize', render);

    // touch swipe
    let startX = null;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      startX = null;
    }, { passive: true });

    render();
  }

  /* ---------- footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* alisac.it v2 — interactions
   Keep it small: nav state, mobile sheet, scroll reveal,
   counters, contact-form channels + submit. */

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (!data.name || data.name.trim().length < 2) errors.push('your name');
    if (!data.request_reason) errors.push('what this is about');
    if (!data.message || data.message.trim().length < 10) errors.push('a message of at least 10 characters');
    if (!data.privacy_consent) errors.push('privacy consent');
    if (data.preferred_contact === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) errors.push('a valid email');
    if (data.preferred_contact === 'whatsapp' && !/^[0-9\s()+-]{6,20}$/.test(data.phone || '')) errors.push('a valid WhatsApp number');
    if (data.preferred_contact === 'telegram' && !/^@?[A-Za-z0-9_]{5,32}$/.test(data.telegram_username || '')) errors.push('a valid Telegram username');

    if (errors.length) {
      setStatus('Please add ' + errors.join(', ') + '.', 'is-error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '.6';
    setStatus('Sending…');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || 'Something went wrong.');
      setStatus('Thank you — your message is on its way. I usually reply within one business day.', 'is-ok');
      form.reset();
      syncChannels();
    } catch (err) {
      setStatus(err.message + ' You can also write to alisa.1chebotarenko@gmail.com.', 'is-error');
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

  /* ---------- mindset: word-by-word reveal ---------- */
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

  /* ---------- tier switch (Standard / Growth) ---------- */
  document.querySelectorAll('.svc').forEach(card => {
    const tabs = [...card.querySelectorAll('.tier-tab')];
    const panels = [...card.querySelectorAll('.tier-panel')];
    if (!tabs.length) return;
    const cta = card.querySelector('[data-service]');
    const pill = card.querySelector('[data-tier-pill]');
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
        cta.dataset.service = 'Operational efficiency scan — ' + label;
      }
      if (pill) pill.textContent = tier === 'growth' ? 'Up to 20 business days' : 'Up to 10 business days';
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
      cards.forEach((card, i) => {
        let d = i - active;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        card.dataset.pos = String(d);
        card.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        card.tabIndex = d === 0 ? 0 : -1;
      });
      if (current) current.textContent = String(active + 1);
    };

    const go = dir => { active = (active + dir + n) % n; render(); };

    carousel.querySelector('[data-next]')?.addEventListener('click', () => go(1));
    carousel.querySelector('[data-prev]')?.addEventListener('click', () => go(-1));

    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (i !== active) { active = i; render(); }
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); active = i; render(); }
      });
    });

    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

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

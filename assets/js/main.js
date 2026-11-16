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

  /* ---------- Alisa's Assistant (Multilingual Smart Intake + Guardrails) ---------- */
  const assistantEl = document.getElementById('alisaAssistant');
  const assistantLog = document.getElementById('assistantLog');
  const assistantChips = document.getElementById('assistantChips');
  const assistantBar = document.getElementById('assistantBar');
  const assistantInput = document.getElementById('assistantInput');
  const assistantConfirm = document.getElementById('assistantConfirm');
  const assistantConsent = document.getElementById('assistantConsent');
  const assistantConsentText = document.getElementById('assistantConsentText');
  const assistantSendBtn = document.getElementById('assistantSendBtn');
  const assistantResetBtn = document.getElementById('assistantResetBtn');
  const assistantStatus = document.getElementById('assistantStatus');
  const toClassicBtn = document.getElementById('toClassicForm');
  const toAssistantBtn = document.getElementById('toAssistant');

  const COPY = {
    en: {
      welcome: "Hi — I'm **Alisa's Assistant**. What would you like to discuss with Alisa?",
      topicChips: ['New project / Go-No-Go', 'AI Adoption & Efficiency', 'Investor / Startup Review', 'AI Act & Governance'],
      serviceIntro: svc => `Got it — we'll focus on **${svc}**. How may I address you (your name)?`,
      askName: "Understood. What is your **name**?",
      invalidName: "Please share your first name (or full name) so Alisa knows who is writing.",
      askMessage: name => `Nice to meet you, **${name}**. Briefly describe your context, goal or the decision on the table (at least 10 characters):`,
      invalidMessage: "Could you add a bit more context (at least 10 characters) so Alisa can prepare before replying?",
      askChannel: "How do you prefer Alisa to contact you?",
      channelChips: [
        { label: 'Email', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Telegram', value: 'telegram' }
      ],
      askEmail: "What is your **email address**?",
      invalidContact: "To forward your request to Alisa, I need a valid **email address**, **Telegram username** (@username) or **phone number** (e.g. +39 333 1234567).",
      askWhatsapp: "What is your **WhatsApp number** (including country code, e.g. +39 333 1234567)?",
      askTelegram: "What is your **Telegram username** (e.g. @username)?",
      summaryIntro: "Thank you. Here is the summary of your request for Alisa — please tick the privacy consent below and click **Send to Alisa**:",
      labels: { name: 'Name', reason: 'Topic', message: 'Context', channel: 'Channel', contact: 'Contact' },
      consentHtml: 'I agree to the processing of my personal data for the purpose of being contacted about this request. See the <a href="/privacy.html" style="text-decoration:underline">Privacy Policy</a>.',
      sendBtn: 'Send to Alisa →',
      resetBtn: 'Start over',
      needConsent: 'Please tick the privacy consent checkbox before sending.',
      sending: 'Sending to Alisa…',
      sentOk: "Thank you — your request has been sent to Alisa! She usually replies within one business day.",
      guardOffTopic: "🔒 **Guardrail active:** I am Alisa's intake assistant and can only handle project, AI adoption, governance and advisory inquiries for Alisa. I cannot answer unrelated questions or perform general tasks.",
      guardFaqPricing: "Alisa's focused engagements start from **€750** (*Critical Decision Review*), **€950** (*Project Go/No-Go*, *Efficiency Scan*, *Deal Risk Screening*), **€1,500** (*Execution Reviews*), **€2,000/month** (*Delivery Leadership*) and **€2,500** (*100-Day Plan* / *Operations Setup*) — always tailored individually to your case."
    },
    it: {
      welcome: "Ciao! Sono **Alisa's Assistant**. Parlo italiano, inglese e russo. Di quale progetto o esigenza vorresti parlare con Alisa?",
      topicChips: ['Nuovo progetto / Go-No-Go', 'Adozione AI & Efficienza', 'Valutazione Investor / Startup', 'AI Act & Governance'],
      serviceIntro: svc => `Perfetto — impostiamo la richiesta su **${svc}**. Come ti chiami?`,
      askName: "Ricevuto. Come ti chiami?",
      invalidName: "Indicami il tuo nome (anche solo il nome proprio) così Alisa sa con chi sta parlando.",
      askMessage: name => `Piacere **${name}**. Raccontami in breve il contesto, l'obiettivo o i dubbi su cui vuoi confrontarti con Alisa (almeno 10 caratteri):`,
      invalidMessage: "Aggiungi qualche dettaglio in più (almeno 10 caratteri) per permettere ad Alisa di inquadrare il caso.",
      askChannel: "Come preferisci essere ricontattato/a da Alisa?",
      channelChips: [
        { label: 'Email', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Telegram', value: 'telegram' }
      ],
      askEmail: "Qual è il tuo **indirizzo email**?",
      invalidContact: "Per inoltrare la richiesta ad Alisa mi serve un **indirizzo email**, un **nickname Telegram** (@username) o un **numero di telefono** valido (es. +39 333 1234567).",
      askWhatsapp: "Qual è il tuo **numero WhatsApp** (con prefisso internazionale, es. +39 333 1234567)?",
      askTelegram: "Qual è il tuo **username Telegram** (es. @username)?",
      summaryIntro: "Grazie! Ecco il riepilogo della richiesta per Alisa — spunta il consenso privacy qui sotto e clicca **Invia ad Alisa**:",
      labels: { name: 'Nome', reason: 'Oggetto', message: 'Contesto', channel: 'Canale', contact: 'Recapito' },
      consentHtml: 'Acconsento al trattamento dei miei dati personali per essere ricontattato/a in merito a questa richiesta. Vedi la <a href="/privacy.html" style="text-decoration:underline">Privacy Policy</a>.',
      sendBtn: 'Invia ad Alisa →',
      resetBtn: 'Ricomincia',
      needConsent: 'Spunta la casella del consenso privacy prima di inviare.',
      sending: 'Invio in corso…',
      sentOk: "Grazie! La tua richiesta è stata inviata ad Alisa. Di solito risponde entro un giorno lavorativo.",
      guardOffTopic: "🔒 **Guardrail attivo:** Sono l'assistente di Alisa e posso occuparmi esclusivamente di raccogliere richieste di progetto, AI adoption, governance o consulenza per Alisa. Non rispondo a domande fuori tema o richieste generiche.",
      guardFaqPricing: "I servizi di Alisa partono da **€750** (*Critical Decision Review*), **€950** (*Go/No-Go*, *Efficiency Scan*, *Deal Risk Screening*), **€1.500** (*Execution Review*), **€2.000/mese** (*Delivery Leadership*) e **€2.500** (*100-Day Plan* / *Operations Setup*) — sempre personalizzati sul singolo caso."
    },
    ru: {
      welcome: "Здравствуйте! Я **Ассистент Алисы**. Какой проект или задачу вы хотите обсудить с Алисой?",
      topicChips: ['Новый проект / Go-No-Go', 'Внедрение ИИ и эффективность', 'Оценка для инвестора / стартапа', 'AI Act и Governance'],
      serviceIntro: svc => `Отлично — фиксируем тему **${svc}**. Подскажите, как к вам обращаться (ваше имя)?`,
      askName: "Поняла. Как вас зовут?",
      invalidName: "Пожалуйста, укажите ваше имя (минимум 2 символа).",
      askMessage: name => `Приятно познакомиться, **${name}**. Кратко опишите контекст, задачу или решение, которое нужно обсудить (минимум 10 символов):`,
      invalidMessage: "Пожалуйста, добавьте чуть больше контекста (не менее 10 символов), чтобы Алиса могла подготовиться к разговору.",
      askChannel: "Как вам удобнее получить ответ от Алисы?",
      channelChips: [
        { label: 'Эл. почта', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Telegram', value: 'telegram' }
      ],
      askEmail: "Укажите ваш **e-mail**:",
      invalidContact: "Чтобы передать запрос Алисе, мне нужен корректный **e-mail**, **ник в Telegram** (@username) или **номер телефона** (например, +39 333 1234567).",
      askWhatsapp: "Укажите ваш **номер WhatsApp** (с кодом страны, например +39 333 1234567):",
      askTelegram: "Укажите ваш **ник в Telegram** (например, @username):",
      summaryIntro: "Спасибо! Вот сводка вашего запроса для Алисы — отметьте согласие ниже и нажмите **Отправить Алисе**:",
      labels: { name: 'Имя', reason: 'Тема', message: 'Сообщение', channel: 'Канал связи', contact: 'Контакт' },
      consentHtml: 'Согласен(-на) на обработку персональных данных для связи по этому запросу. См. <a href="/privacy.html" style="text-decoration:underline">Privacy Policy</a>.',
      sendBtn: 'Отправить Алисе →',
      resetBtn: 'Начать заново',
      needConsent: 'Пожалуйста, отметьте согласие на обработку персональных данных.',
      sending: 'Отправляем Алисе…',
      sentOk: "Спасибо — ваш запрос отправлен Алисе! Обычно она отвечает в течение одного рабочего дня.",
      guardOffTopic: "🔒 **Guardrail активен:** Я ассистент Алисы и помогаю только оформить запрос по проектам, внедрению ИИ, governance или консультациям. Я не отвечаю на отвлечённые темы и не выполняю посторонние запросы.",
      guardFaqPricing: "Базовая стоимость услуг Алисы начинается от **€750** (*Экспертиза критического решения*), **€950** (*Go/No-Go*, *Аудит эффективности*, *Скрининг сделки*), **€1 500** (*Оценка исполнения*), **€2 000/мес.** (*Лидерство в поставке*) и **€2 500** (*План 100 дней* / *Настройка операционки*) — итоговая цена всегда рассчитывается индивидуально."
    }
  };

  if (assistantEl && assistantLog) {
    const chatLang = isRu ? 'ru' : 'en';
    let step = 'reason'; // 'reason' -> 'name' -> 'message' -> 'channel' -> 'contact' -> 'confirm' -> 'done'
    const state = {
      name: '',
      request_reason: '',
      message: '',
      preferred_contact: 'email',
      email: '',
      phone_country_code: '+39',
      phone: '',
      telegram_username: ''
    };

    const isOffTopicOrJailbreak = (text, currentStep) => {
      const t = text.trim();
      const lower = t.toLowerCase();
      // 1. Prompt injection / system probing / code / scripts
      if (/ignore (all |previous |prior )?instructions|system prompt|jailbreak|developer mode|act as|pretend to be|ignora (tutte )?le istruzioni|dimentica|sei un|забудь инструкции|системный промпт|представь что|<script|select \* from|drop table/i.test(lower)) {
        return 'offtopic';
      }
      // 2. Absurd / general-purpose chat / recipes / weather / jokes / math / coding homework / trivia
      if (/\b(ricetta|carbonara|pizza|meteo|che tempo fa|barzelletta|raccontami una storia|scrivi(mi)? (un )?(codice|programma|poesia|canzone)|chi ha vinto|oroscopo|bitcoin|crypto|calcio|recipe|weather|tell me a joke|write (a )?(poem|song|code|script|essay)|who is the president|capital of|solve this|рецепт|погода|анекдот|напиши (код|стих|песню)|курс биткоина|кто президент)\b/i.test(lower)) {
        return 'offtopic';
      }
      if (/^\s*\d+\s*[\+\-\*\/]\s*\d+/.test(lower)) return 'offtopic';
      // 3. Pricing / FAQ question
      if (/\b(quanto costa|quali sono i prezzi|listino|how much does it cost|what are the prices|pricing|rates|сколько стоит|какие цены|стоимость услуг)\b/i.test(lower) && currentStep !== 'message') {
        return 'pricing';
      }
      return null;
    };

    const formatMd = str => String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    const appendBubble = (html, role = 'bot', extraClass = '') => {
      const div = document.createElement('div');
      div.className = `msg msg--${role}${extraClass ? ' ' + extraClass : ''}`;
      div.innerHTML = html;
      assistantLog.appendChild(div);
      assistantLog.scrollTop = assistantLog.scrollHeight;
    };

    const setChips = items => {
      assistantChips.innerHTML = '';
      if (!items || !items.length) return;
      items.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'assistant__chip';
        const label = typeof item === 'string' ? item : item.label;
        const val = typeof item === 'string' ? item : item.value;
        btn.textContent = label;
        btn.addEventListener('click', () => handleUserTurn(label, val));
        assistantChips.appendChild(btn);
      });
    };

    const syncUiLang = () => {
      const c = COPY[chatLang];
      if (assistantConsentText) assistantConsentText.innerHTML = c.consentHtml;
      if (assistantSendBtn) assistantSendBtn.innerHTML = `${c.sendBtn}`;
      if (assistantResetBtn) assistantResetBtn.textContent = c.resetBtn;
    };

    const getCurrentPromptReminder = () => {
      const c = COPY[chatLang];
      if (step === 'reason') return c.welcome;
      if (step === 'name') return c.askName;
      if (step === 'message') return c.askMessage(state.name || '');
      if (step === 'channel') return c.askChannel;
      if (step === 'contact') {
        if (state.preferred_contact === 'whatsapp') return c.askWhatsapp;
        if (state.preferred_contact === 'telegram') return c.askTelegram;
        return c.askEmail;
      }
      return '';
    };

    const showSummaryStep = () => {
      step = 'confirm';
      setChips([]);
      if (assistantBar) assistantBar.hidden = true;
      if (assistantConfirm) assistantConfirm.hidden = false;
      syncUiLang();
      const c = COPY[chatLang];
      const contactVal = state.preferred_contact === 'email'
        ? state.email
        : state.preferred_contact === 'whatsapp'
          ? `${state.phone_country_code} ${state.phone}`
          : state.telegram_username;
      const summaryHtml =
        `<div>${formatMd(c.summaryIntro)}</div>` +
        `<div class="msg__summary">` +
        `<div><span>${c.labels.name}</span><b>${formatMd(state.name)}</b></div>` +
        `<div><span>${c.labels.reason}</span><b>${formatMd(state.request_reason)}</b></div>` +
        `<div><span>${c.labels.channel}</span><b>${formatMd(state.preferred_contact)} (${formatMd(contactVal)})</b></div>` +
        `<div><span>${c.labels.message}</span><b>${formatMd(state.message)}</b></div>` +
        `</div>`;
      appendBubble(summaryHtml, 'bot');
    };

    const cleanExtractedName = raw => {
      return raw
        .replace(/^(hi|hello|hey|ciao|salve|buongiorno|buonasera|привет|здравствуйте)[,\s!]*/i, '')
        .replace(/^(my name is|i am|i'm|mi chiamo|sono|меня зовут|я)\s+/i, '')
        .replace(/[.,!?;:]+$/, '')
        .trim();
    };

    const handleUserTurn = (displayText, chipValue = null) => {
      const raw = String(displayText || '').trim();
      if (!raw) return;

      const c = COPY[chatLang];

      appendBubble(formatMd(raw), 'user');
      if (assistantInput) assistantInput.value = '';

      // Guardrail check first
      const guard = chipValue ? null : isOffTopicOrJailbreak(raw, step);
      if (guard === 'offtopic') {
        appendBubble(`${formatMd(c.guardOffTopic)}<br><br>${formatMd(getCurrentPromptReminder())}`, 'bot', 'msg--guard');
        return;
      }
      if (guard === 'pricing') {
        appendBubble(`${formatMd(c.guardFaqPricing)}<br><br>${formatMd(getCurrentPromptReminder())}`, 'bot');
        return;
      }

      if (step === 'reason') {
        state.request_reason = raw.slice(0, 180);
        step = 'name';
        setChips([]);
        appendBubble(formatMd(c.askName), 'bot');
        return;
      }

      if (step === 'name') {
        const cleaned = cleanExtractedName(raw);
        if (cleaned.length < 2 || cleaned.length > 70 || /[0-9@#<>=$%^&*]/.test(cleaned) || cleaned.split(/\s+/).length > 5) {
          appendBubble(formatMd(c.invalidName), 'bot', 'msg--guard');
          return;
        }
        state.name = cleaned;
        step = 'message';
        setChips([]);
        appendBubble(formatMd(c.askMessage(state.name)), 'bot');
        return;
      }

      if (step === 'message') {
        if (raw.length < 10) {
          appendBubble(formatMd(c.invalidMessage), 'bot', 'msg--guard');
          return;
        }
        state.message = raw.slice(0, 4000);
        // Check if user already included an email in their message
        const emailMatch = raw.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
        if (emailMatch) {
          state.preferred_contact = 'email';
          state.email = emailMatch[0];
          showSummaryStep();
          return;
        }
        step = 'channel';
        appendBubble(formatMd(c.askChannel), 'bot');
        setChips(c.channelChips);
        return;
      }

      if (step === 'channel') {
        const lower = (chipValue || raw).toLowerCase();
        // Accept direct email, @telegram or phone number if provided right away
        const directEmail = raw.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        if (directEmail) {
          state.preferred_contact = 'email';
          state.email = directEmail[0];
          showSummaryStep();
          return;
        }
        if (/^@[A-Za-z0-9_]{5,32}$/.test(raw)) {
          state.preferred_contact = 'telegram';
          state.telegram_username = raw;
          showSummaryStep();
          return;
        }
        if (/^\+?[0-9\s()-]{7,20}$/.test(raw)) {
          const m = raw.replace(/[^\d+()\s-]/g, '').trim().match(/^(\+\d{1,4})?\s*(.+)$/);
          if (m && /^[0-9\s()+-]{6,20}$/.test(m[2] || '')) {
            state.preferred_contact = 'whatsapp';
            state.phone_country_code = m[1] || '+39';
            state.phone = m[2].trim();
            showSummaryStep();
            return;
          }
        }
        if (lower.includes('whats') || lower.includes('ватсап') || lower === 'whatsapp') {
          state.preferred_contact = 'whatsapp';
          step = 'contact';
          setChips([]);
          appendBubble(formatMd(c.askWhatsapp), 'bot');
          return;
        }
        if (lower.includes('tele') || lower.includes('телег') || lower === 'tg' || lower === 'telegram') {
          state.preferred_contact = 'telegram';
          step = 'contact';
          setChips([]);
          appendBubble(formatMd(c.askTelegram), 'bot');
          return;
        }
        if (lower.includes('mail') || lower.includes('почт') || lower === 'email') {
          state.preferred_contact = 'email';
          step = 'contact';
          setChips([]);
          appendBubble(formatMd(c.askEmail), 'bot');
          return;
        }
        appendBubble(formatMd(c.invalidContact), 'bot', 'msg--guard');
        return;
      }

      if (step === 'contact') {
        // Also allow switching channel if user provides a valid email, @telegram or phone directly
        const emailMatch = raw.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
        if (emailMatch && (state.preferred_contact === 'email' || !raw.startsWith('@'))) {
          state.preferred_contact = 'email';
          state.email = emailMatch[0];
          showSummaryStep();
          return;
        }
        const tgClean = raw.trim().replace(/^https?:\/\/t\.me\//i, '@');
        if ((state.preferred_contact === 'telegram' && /^@?[A-Za-z0-9_]{5,32}$/.test(tgClean)) || /^@[A-Za-z0-9_]{5,32}$/.test(tgClean)) {
          state.preferred_contact = 'telegram';
          state.telegram_username = tgClean.startsWith('@') ? tgClean : '@' + tgClean;
          showSummaryStep();
          return;
        }
        const phoneDigits = raw.replace(/[^\d]/g, '');
        if ((state.preferred_contact === 'whatsapp' || /^\+?\d[\d\s()-]{6,19}$/.test(raw)) && phoneDigits.length >= 6 && phoneDigits.length <= 16) {
          const cleanedPhone = raw.replace(/[^\d+()\s-]/g, '').trim();
          const m = cleanedPhone.match(/^(\+\d{1,4})?\s*(.+)$/);
          if (m && /^[0-9\s()+-]{6,20}$/.test(m[2] || '')) {
            state.preferred_contact = 'whatsapp';
            state.phone_country_code = m[1] || '+39';
            state.phone = m[2].trim();
            showSummaryStep();
            return;
          }
        }
        appendBubble(formatMd(c.invalidContact), 'bot', 'msg--guard');
        return;
      }
    };

    const resetAssistant = (prefilledService = '') => {
      assistantLog.innerHTML = '';
      state.name = '';
      state.request_reason = prefilledService || '';
      state.message = '';
      state.preferred_contact = 'email';
      state.email = '';
      state.phone_country_code = '+39';
      state.phone = '';
      state.telegram_username = '';
      if (assistantConsent) assistantConsent.checked = false;
      if (assistantStatus) {
        assistantStatus.textContent = '';
        assistantStatus.className = 'form__status';
      }
      if (assistantConfirm) assistantConfirm.hidden = true;
      if (assistantBar) assistantBar.hidden = false;
      syncUiLang();

      const c = COPY[chatLang];
      if (prefilledService) {
        step = 'name';
        setChips([]);
        appendBubble(formatMd(c.serviceIntro(prefilledService)), 'bot');
      } else {
        step = 'reason';
        appendBubble(formatMd(c.welcome), 'bot');
        setChips(c.topicChips);
      }
    };

    assistantBar?.addEventListener('submit', e => {
      e.preventDefault();
      handleUserTurn(assistantInput?.value || '');
    });

    assistantResetBtn?.addEventListener('click', () => resetAssistant());

    assistantSendBtn?.addEventListener('click', async () => {
      const c = COPY[chatLang];
      if (!assistantConsent?.checked) {
        if (assistantStatus) {
          assistantStatus.textContent = c.needConsent;
          assistantStatus.className = 'form__status is-error';
        }
        return;
      }
      assistantSendBtn.disabled = true;
      if (assistantStatus) {
        assistantStatus.textContent = c.sending;
        assistantStatus.className = 'form__status';
      }
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: state.name,
            request_reason: state.request_reason,
            preferred_contact: state.preferred_contact,
            email: state.email,
            phone_country_code: state.phone_country_code,
            phone: state.phone,
            telegram_username: state.telegram_username,
            message: state.message,
            privacy_consent: true
          })
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.error || 'Request could not be sent.');
        if (assistantConfirm) assistantConfirm.hidden = true;
        appendBubble(formatMd(c.sentOk), 'bot');
      } catch (err) {
        if (assistantStatus) {
          assistantStatus.textContent = err.message + L.fail;
          assistantStatus.className = 'form__status is-error';
        }
      } finally {
        assistantSendBtn.disabled = false;
      }
    });

    // Toggle between Alisa's Assistant and Classic Form
    toClassicBtn?.addEventListener('click', () => {
      assistantEl.hidden = true;
      if (form) {
        form.hidden = false;
        if (state.name) { const el = document.getElementById('name'); if (el) el.value = state.name; }
        if (state.request_reason) { const el = document.getElementById('request_reason'); if (el) el.value = state.request_reason; }
        if (state.message) { const el = document.getElementById('message'); if (el) el.value = state.message; }
      }
    });
    toAssistantBtn?.addEventListener('click', () => {
      if (form) form.hidden = true;
      assistantEl.hidden = false;
    });

    // Hook service "Request a quote" buttons into Alisa's Assistant
    document.querySelectorAll('[data-service]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (form && !form.hidden) return;
        resetAssistant(btn.dataset.service || '');
        setTimeout(() => assistantInput?.focus({ preventScroll: true }), 450);
      });
    });

    resetAssistant();
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
        const scrollable = e.target.closest('textarea, .assistant__log');
        if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) return;
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

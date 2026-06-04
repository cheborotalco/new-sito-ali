(() => {
  const STORAGE_KEY = 'alisa_lang';
  const DEFAULT_LANG = 'en';
  const textOriginals = new WeakMap();
  const attrOriginals = new WeakMap();
  let applying = false;
  let scheduled = false;

  const it = new Map([
    ['Back to site', 'Torna al sito'],
    ['Legal', 'Legale'],
    ['Index', 'Indice'],
    ['About', 'Chi sono'],
    ['Focus Areas', 'Aree di focus'],
    ['Achievements', 'Risultati'],
    ['Mindset', 'Approccio'],
    ['Expertise', 'Servizi'],
    ['Contact', 'Contatti'],
    ['NAVIGATION', 'NAVIGAZIONE'],
    ['Privacy Policy', 'Privacy Policy'],
    ['Cookie Policy', 'Cookie Policy'],
    ['IMPLEMENTING AI IN', 'IMPLEMENTARE AI NEL'],
    ['TRADITIONAL', 'BUSINESS'],
    ['BUSINESS', 'TRADIZIONALE'],
    ['Tech background.', 'Background tecnico.'],
    ['International projects.', 'Progetti internazionali.'],
    ['Italian, English & Russian speaking.', 'Parlo italiano, inglese e russo.'],
    ['IT PROJECT MANAGER', 'IT PROJECT MANAGER'],
    ["Let's Talk →", 'Parliamone'],
    ["LET'S TALK →", 'PARLIAMONE'],
    ['Explore packages', 'Esplora pacchetti'],
    ['EXPLORE PACKAGES', 'ESPLORA PACCHETTI'],
    ['INTRODUCTION', 'INTRODUZIONE'],
    ['ABOUT', 'CHI'],
    ['ME', 'SONO'],
    ['Successful projects are rarely about technology alone.', 'I progetti di successo raramente riguardano solo la tecnologia.'],
    ['01 // EDUCATION', '01 // FORMAZIONE'],
    ['02 // EXPERIENCE', '02 // ESPERIENZA'],
    ['03 // FOCUS', '03 // FOCUS'],
    ['My first qualification is in software development. I also hold a project management education with a specialization in AI implementation and am a certified PMP (Project Management Professional). Combining a technical background, project management expertise, and internationally recognized best practices enables me to work effectively.', 'La mia prima formazione e in sviluppo software. Ho anche una formazione in project management con specializzazione nell implementazione dell AI e sono certificata PMP (Project Management Professional). La combinazione tra background tecnico, competenze di project management e best practice riconosciute a livello internazionale mi permette di lavorare in modo efficace.'],
    ['For more than five years, I have managed IT projects and AI-related initiatives, guiding products from initial concept and requirements analysis through launch and continuous development. I coordinated collaboration between business stakeholders, clients, and technical teams, ensuring transparency, alignment, and successful project delivery.', 'Da oltre cinque anni gestisco progetti IT e iniziative legate all AI, accompagnando prodotti dall idea iniziale e dall analisi dei requisiti fino al lancio e allo sviluppo continuo. Ho coordinato la collaborazione tra stakeholder business, clienti e team tecnici, garantendo trasparenza, allineamento e delivery efficace.'],
    ['I create structure, bring order to complexity, and align people around key priorities. My focus is on creating the conditions that allow teams to collaborate effectively, make sound decisions, and achieve meaningful results.', 'Creo struttura, porto ordine nella complessita e allineo le persone intorno alle priorita chiave. Il mio focus e creare le condizioni che permettono ai team di collaborare in modo efficace, prendere decisioni solide e raggiungere risultati concreti.'],
    ['HOW I DELIVER RESULTS', 'COME PORTO RISULTATI'],
    ['PROJECTS DELIVERED ON TIME', 'PROGETTI CONSEGNATI IN TEMPO'],
    ['Turning complex initiatives into structured execution plans that keep delivery on schedule.', 'Trasformo iniziative complesse in piani di esecuzione strutturati che mantengono la delivery nei tempi.'],
    ['PREDICTABLE BUDGETS', 'BUDGET PREVEDIBILI'],
    ['Maintaining control over resources and costs to prevent budget overruns and financial surprises.', 'Mantengo controllo su risorse e costi per evitare sforamenti di budget e sorprese finanziarie.'],
    ['ALIGNED TEAMS & STAKEHOLDERS', 'TEAM E STAKEHOLDER ALLINEATI'],
    ['Bringing business leaders, technical teams, and stakeholders together around shared goals.', 'Allineo leader business, team tecnici e stakeholder intorno a obiettivi condivisi.'],
    ['RISKS MITIGATED EARLY', 'RISCHI MITIGATI IN ANTICIPO'],
    ['Identifying potential issues before they become costly obstacles to project success.', 'Individuo i problemi potenziali prima che diventino ostacoli costosi per il successo del progetto.'],
    ['COMPLETE EXECUTIVE VISIBILITY', 'VISIBILITA EXECUTIVE COMPLETA'],
    ['Providing clear insights into progress, priorities, timelines, and business outcomes.', 'Fornisco visibilita chiara su avanzamento, priorita, tempi e risultati business.'],
    ['SCALABLE DELIVERY OPERATIONS', 'OPERATIONS DI DELIVERY SCALABILI'],
    ['Building processes that support sustainable growth without creating operational chaos.', 'Costruisco processi che supportano crescita sostenibile senza creare caos operativo.'],
    ['CURRENT ACHIEVEMENTS', 'RISULTATI ATTUALI'],
    ['PROJECTS', 'PROGETTI'],
    ['COUNTRIES', 'PAESI'],
    ['BUDGET', 'BUDGET'],
    ['MARKETS', 'MERCATI'],
    ['Circular Economy Product Development', 'Sviluppo prodotto per economia circolare'],
    ['Luxury Air Quality Product Repositioning', 'Riposizionamento luxury di un prodotto per la qualita dell aria'],
    ['AI-Powered Hospitality Innovation', 'Innovazione hospitality basata su AI'],
    ['AND MORE..', 'E ALTRO..'],
    ['/// THE MINDSET', '/// L APPROCCIO'],
    ['I create structure from complexity, align people around key priorities, and turn projects into clear, actionable plans.', 'Creo struttura dalla complessita, allineo le persone sulle priorita chiave e trasformo i progetti in piani chiari e azionabili.'],
    ["IT'S ALL ABOUT", 'E TUTTO QUESTIONE DI'],
    ['PEOPLE', 'PERSONE'],
    ['TIME', 'TEMPO'],
    ['MY EXPERTISE', 'LA MIA EXPERTISE'],
    ['PRIVATE CLIENT', 'CLIENTE PRIVATO'],
    ['INVESTOR', 'INVESTITORE'],
    ['STARTUP', 'STARTUP'],
    ['Critical Decision Review', 'Revisione di decisioni critiche'],
    ['Project Go / No-Go Decision', 'Decisione Go / No-Go di progetto'],
    ['Operational Efficiency Scan', 'Analisi dell efficienza operativa'],
    ['Deal Risk Screening', 'Screening del rischio dell operazione'],
    ['Execution Risk Review', 'Revisione del rischio di execution'],
    ['Post-Investment 100-Day Plan', 'Piano 100 giorni post-investimento'],
    ['Founder & Team Execution Review', 'Revisione execution founder e team'],
    ['Delivery & Execution Leadership', 'Leadership su delivery ed execution'],
    ['Startup Operations Setup', 'Setup operations startup'],
    ['Get a quote', 'Richiedi preventivo'],
    ['GET A QUOTE', 'RICHIEDI PREVENTIVO'],
    ['from', 'da'],
    ["What's included:", 'Cosa include:'],
    ['Duration:', 'Durata:'],
    ['Not included:', 'Non incluso:'],
    ['DISCUSS YOUR', 'PARLIAMO DEL'],
    ['PROJECT', 'PROGETTO'],
    ["LET'S TALK", 'PARLIAMONE'],
    ['Email', 'Email'],
    ['WhatsApp', 'WhatsApp'],
    ['Telegram', 'Telegram'],
    ['Name', 'Nome'],
    ['How do you prefer to be contacted?', 'Come preferisci essere contattato/a?'],
    ['Email address', 'Indirizzo email'],
    ['Tell me about your project', 'Parlami del tuo progetto'],
    ['I agree to the processing of my personal data for the purpose of being contacted about this request.', 'Acconsento al trattamento dei miei dati personali per essere ricontattato/a in merito a questa richiesta.'],
    ['Send message ->', 'Invia messaggio'],
    ['Something went wrong. Please try again or email me directly.', 'Qualcosa e andato storto. Riprova o scrivimi direttamente via email.'],
    ['Thank you for contacting me.', 'Grazie per avermi contattata.'],
    ['I will get back to you as soon as possible.', 'Ti ricontattero il prima possibile.'],
    ['QUOTE REQUEST', 'RICHIESTA PREVENTIVO'],
    ['CHOOSE SERVICES', 'SCEGLI I SERVIZI'],
    ['Add a note', 'Aggiungi una nota'],
    ['Send quote request ->', 'Invia richiesta'],
    ['Privacy', 'Privacy'],
    ['Policy', 'Policy'],
    ['Information on the processing of personal data under Articles 13 and 14 of Regulation (EU) 2016/679 for the website alisac.it.', 'Informativa sul trattamento dei dati personali ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 per il sito alisac.it.'],
    ['Controller', 'Titolare'],
    ['Data processed', 'Dati trattati'],
    ['Purposes', 'Finalita'],
    ['External services', 'Servizi esterni'],
    ['Retention', 'Conservazione'],
    ['Rights', 'Diritti'],
    ['Contacts', 'Contatti'],
    ['Data Controller', 'Titolare del trattamento'],
    ['Personal Data Processed', 'Dati personali trattati'],
    ['Purposes and Legal Bases', 'Finalita e basi giuridiche'],
    ['Recipients and External Services', 'Destinatari e servizi esterni'],
    ['Retention Periods', 'Periodi di conservazione'],
    ['User Rights', 'Diritti dell utente'],
    ['Privacy Contact', 'Contatto privacy'],
    ['Cookie', 'Cookie'],
    ['Information about the use of cookies and similar technologies on alisac.it.', 'Informazioni sull uso di cookie e tecnologie simili su alisac.it.'],
    ['What cookies are', 'Cosa sono i cookie'],
    ['Cookies used', 'Cookie utilizzati'],
    ['Third parties', 'Terze parti'],
    ['Browser settings', 'Impostazioni browser'],
    ['Updates', 'Aggiornamenti'],
    ['What Cookies Are', 'Cosa sono i cookie'],
    ['Cookies Used by alisac.it', 'Cookie utilizzati da alisac.it'],
    ['Third-Party Services', 'Servizi di terze parti'],
    ['Browser Settings', 'Impostazioni browser']
  ]);

  const attrIt = new Map([
    ['Name', 'Nome'],
    ['Email address', 'Indirizzo email'],
    ['Tell me about your project', 'Parlami del tuo progetto'],
    ['Add a note', 'Aggiungi una nota'],
    ['Reason for your request', 'Motivo della richiesta'],
    ['Open menu', 'Apri menu'],
    ['Close menu', 'Chiudi menu'],
    ['Open WeChat QR code', 'Apri QR code WeChat'],
    ['Back to top', 'Torna in alto'],
    ['Footer navigation', 'Navigazione footer'],
    ['Legal links', 'Link legali'],
    ['Implementing AI in traditional business', 'Implementare AI nel business tradizionale']
  ]);

  const normalize = value => (value || '').replace(/s+/g, ' ').trim();
  const preserve = (original, translated) => {
    const lead = (original.match(/^s*/) || [''])[0];
    const trail = (original.match(/s*$/) || [''])[0];
    return lead + translated + trail;
  };
  const getLang = () => localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  const setTitle = lang => {
    const title = document.title;
    if (!document.documentElement.dataset.originalTitle) document.documentElement.dataset.originalTitle = title;
    if (lang === 'en') {
      document.title = document.documentElement.dataset.originalTitle;
    } else if (title.includes('Privacy Policy')) {
      document.title = 'Privacy Policy | Alisa Chebotarenko';
    } else if (title.includes('Cookie Policy')) {
      document.title = 'Cookie Policy | Alisa Chebotarenko';
    } else {
      document.title = 'Alisa Chebotarenko | Project Manager PMP';
    }
  };
  const shouldSkip = node => {
    const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    return !el || el.closest('script,style,svg,noscript,.language-switcher');
  };
  const translateTextNode = (node, lang) => {
    if (shouldSkip(node)) return;
    if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue);
    const original = textOriginals.get(node);
    if (!normalize(original)) return;
    if (lang === 'en') {
      if (node.nodeValue !== original) node.nodeValue = original;
      return;
    }
    const translated = it.get(normalize(original));
    if (translated) {
      const next = preserve(original, translated);
      if (node.nodeValue !== next) node.nodeValue = next;
    }
  };
  const translateAttrs = (el, lang) => {
    if (shouldSkip(el)) return;
    ['placeholder', 'aria-label', 'title', 'value'].forEach(attr => {
      if (!el.hasAttribute || !el.hasAttribute(attr)) return;
      if (attr === 'value' && !/^(submit|button)$/i.test(el.type || '')) return;
      let store = attrOriginals.get(el);
      if (!store) {
        store = {};
        attrOriginals.set(el, store);
      }
      if (!(attr in store)) store[attr] = el.getAttribute(attr);
      const original = store[attr];
      if (lang === 'en') {
        if (el.getAttribute(attr) !== original) el.setAttribute(attr, original);
        return;
      }
      const translated = attrIt.get(normalize(original)) || it.get(normalize(original));
      if (translated && el.getAttribute(attr) !== translated) el.setAttribute(attr, translated);
    });
  };
  const applyTranslations = () => {
    if (applying) return;
    applying = true;
    const lang = getLang();
    document.documentElement.lang = lang;
    setTitle(lang);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return shouldSkip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => translateTextNode(node, lang));
    document.querySelectorAll('[placeholder],[aria-label],[title],input[type="submit"],input[type="button"]').forEach(el => translateAttrs(el, lang));
    document.querySelectorAll('.language-switcher button').forEach(button => {
      button.classList.toggle('is-active', button.dataset.lang === lang);
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
    window.dispatchEvent(new CustomEvent('alisa:language-change', { detail: { lang } }));
    applying = false;
  };
  const scheduleApply = () => {
    if (scheduled || applying) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensureSwitcher();
      applyTranslations();
    });
  };
  const createSwitcher = () => {
    const wrap = document.createElement('div');
    wrap.className = 'language-switcher';
    wrap.setAttribute('aria-label', 'Language selector');
    wrap.innerHTML = '<button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="it" aria-pressed="false">IT</button>';
    wrap.addEventListener('click', event => {
      const button = event.target.closest('button[data-lang]');
      if (!button) return;
      localStorage.setItem(STORAGE_KEY, button.dataset.lang);
      applyTranslations();
    });
    return wrap;
  };
  function ensureSwitcher() {
    const host = document.querySelector('.navbar-tech-inner') || document.querySelector('.legal-nav-inner');
    if (!host || host.querySelector('.language-switcher')) return;
    const switcher = createSwitcher();
    const target = host.querySelector('.nav-toggle-tech') || host.querySelector('.legal-back') || host.querySelector('.btn-tech');
    host.insertBefore(switcher, target || null);
  }
  window.addEventListener('DOMContentLoaded', scheduleApply);
  window.addEventListener('load', scheduleApply);
  setTimeout(scheduleApply, 100);
  setTimeout(scheduleApply, 600);
  new MutationObserver(scheduleApply).observe(document.documentElement, { childList: true, subtree: true });
})();

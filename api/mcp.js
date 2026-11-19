const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'alisa.1chebotarenko@gmail.com';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_INQUIRIES = 3;
const inquiryBuckets = new Map();

function isInquiryRateLimited(ip) {
  const now = Date.now();
  for (const [k, v] of inquiryBuckets.entries()) {
    if (now - v.start > RATE_WINDOW_MS) inquiryBuckets.delete(k);
  }
  const entry = inquiryBuckets.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    inquiryBuckets.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX_INQUIRIES;
}

const PROFILE = {
  en: {
    name: 'Alisa Chebotarenko',
    role: 'Independent AI & IT Specialist · Strategic Partner · Fractional Delivery Lead',
    equivalentRoles: [
      'Fractional Delivery Lead',
      'Technical Project Manager (PMP)',
      'Agile Product Owner (PSPO I)',
      'Applied AI & RAG Consultant',
      'EU AI Act & AI Governance Specialist',
      'Cloud & AWS FinOps Auditor',
      'Pre-Investment Execution Risk Advisor'
    ],
    location: 'Bordighera, Italy',
    serviceRegions: ['Europe', 'Asia'],
    availability: 'Available for select engagements across Europe and Asia (remote & cross-border)',
    languages: ['English', 'Russian', 'Italian'],
    certifications: [
      { name: 'PMP® — Project Management Professional', issuer: 'PMI', verify: 'https://www.credly.com/badges/7eca0a20-0cdd-4bc0-acaa-88f90435f921/public_url' },
      { name: 'PSPO I — Professional Scrum Product Owner I', issuer: 'Scrum.org', verify: 'https://www.credly.com/badges/5ab0bd35-0288-4f58-88f1-1152033aafde/public_url' },
      { name: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services', verify: 'https://www.credly.com/badges/95926ab1-686f-4fd0-8215-da076b8ab4ec/public_url' }
    ],
    focusAreas: [
      'Agile Delivery & Product Ownership: Delivery Audit, Value-Driven Backlog Management, Flow Metrics (Velocity, Lead Time), Business-Engineering Alignment, Pragmatic Hybrid Models',
      'Applied AI & Model Evaluation: Learning Paradigms, Applied ML Families, Foundation Models & LLMs, Business Data Adaptation (prompt engineering, RAG, fine-tuning), Production Metrics & Hallucination Control',
      'Cloud Infrastructure & Architecture: Core AWS Services, Security & Shared Responsibility, High Availability & Multi-Region, FinOps & Cloud Economics, Enterprise Cloud Migration',
      'AI Regulation & Risk Management: EU AI Act Classification & Audit, AI Governance & Human-in-the-Loop Architecture, External Audit Readiness, Risk & Budget Management, Independent Contractor Oversight'
    ],
    stats: { projectsDelivered: '10+', countries: 8, countriesList: ['Italy', 'France', 'Switzerland', 'Spain', 'UAE', 'Turkey', 'China', 'Russia'], budgetManaged: '€550K+', markets: 9, marketsList: ['MedTech', 'CleanTech', 'IoT', 'Retail', 'B2B', 'B2C', 'Smart Home', 'Manufacturing', 'HoReCa'] },
    contact: {
      email: 'alisa.1chebotarenko@gmail.com',
      telegram: 'https://t.me/alichebo',
      linkedin: 'https://linkedin.com/in/alisachebotarenko',
      website: 'https://alisac.it/',
      mcpEndpoint: 'https://alisac.it/api/mcp'
    }
  },
  ru: {
    name: 'Алиса Чеботаренко',
    role: 'Независимый AI и IT-специалист · Strategic Partner · Fractional Delivery Lead',
    equivalentRoles: [
      'Независимый IT/AI-менеджер проектов (PMP)',
      'Fractional Delivery Lead',
      'Product Owner (PSPO I)',
      'Консультант по прикладному ИИ, RAG и оценке моделей',
      'Специалист по EU AI Act и AI Governance',
      'Аудитор облачной архитектуры и FinOps (AWS)',
      'Независимый аудитор подрядчиков и рисков перед инвестицией'
    ],
    location: 'Бордигера, Италия',
    serviceRegions: ['Европа', 'Азия'],
    availability: 'Доступна для консалтинга и проектов по всей Европе и Азии (удалённо и международный формат)',
    languages: ['Русский', 'Английский', 'Итальянский'],
    certifications: [
      { name: 'PMP® — Project Management Professional', issuer: 'PMI', verify: 'https://www.credly.com/badges/7eca0a20-0cdd-4bc0-acaa-88f90435f921/public_url' },
      { name: 'PSPO I — Professional Scrum Product Owner I', issuer: 'Scrum.org', verify: 'https://www.credly.com/badges/5ab0bd35-0288-4f58-88f1-1152033aafde/public_url' },
      { name: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services', verify: 'https://www.credly.com/badges/95926ab1-686f-4fd0-8215-da076b8ab4ec/public_url' }
    ],
    focusAreas: [
      'Построение предсказуемых процессов и Agile-поставка: аудит процессов доставки (Delivery Audit), управление бэклогом по ценности, метрики потока (Velocity, Lead Time), синхронизация бизнеса и инженерии, прагматичные гибридные модели',
      'Практический ИИ и оценка моделей: парадигмы и классы моделей, прикладные семейства ML, фундаментальные модели и LLM, адаптация под бизнес-данные (промпт-инжиниринг, RAG, fine-tuning), production-метрики и контроль галлюцинаций',
      'Облачная инфраструктура и архитектура: Core-сервисы AWS, ИБ и модель разделённой ответственности, отказоустойчивость и мультирегиональность, FinOps и экономика облака, миграция для классического бизнеса',
      'Регулирование ИИ и управление рисками: классификация и аудит по EU AI Act, архитектура AI Governance и Human-in-the-Loop, готовность к внешнему аудиту, управление рисками и бюджетом, независимый надзор за подрядчиками'
    ],
    stats: { projectsDelivered: '10+', countries: 8, countriesList: ['Italy', 'France', 'Switzerland', 'Spain', 'UAE', 'Turkey', 'China', 'Russia'], budgetManaged: '€550K+', markets: 9, marketsList: ['MedTech', 'CleanTech', 'IoT', 'Retail', 'B2B', 'B2C', 'Smart Home', 'Manufacturing', 'HoReCa'] },
    contact: {
      email: 'alisa.1chebotarenko@gmail.com',
      telegram: 'https://t.me/alichebo',
      linkedin: 'https://linkedin.com/in/alisachebotarenko',
      website: 'https://alisac.it/ru/',
      mcpEndpoint: 'https://alisac.it/api/mcp'
    }
  }
};

const SERVICES = [
  {
    id: 'critical-decision-review',
    category: 'private',
    title: { en: 'Critical Decision Review', ru: 'Экспертиза критического решения' },
    duration: { en: 'Up to 5 business days', ru: 'До 5 рабочих дней' },
    startingPrice: '€750',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Independent expert review of a critical business decision before committing: structure information, challenge assumptions, surface risks and evaluate scenarios.',
      ru: 'Независимая экспертная оценка критического решения до начала действий: структурирование данных, проверка допущений, риски и сценарии.'
    }
  },
  {
    id: 'project-go-no-go',
    category: 'private',
    title: { en: 'Project Go / No-Go', ru: 'Решение Go / No-Go по проекту' },
    duration: { en: 'Up to 7 business days', ru: 'До 7 рабочих дней' },
    startingPrice: '€950',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Structured assessment of a project, business idea or new initiative before significant resources are committed.',
      ru: 'Структурированная оценка проекта, бизнес-идеи или инициативы до вложения значительных ресурсов.'
    }
  },
  {
    id: 'operational-efficiency-scan',
    category: 'private',
    title: { en: 'Operational Efficiency Scan (Standard / Growth)', ru: 'Аудит операционной эффективности (Standard / Growth)' },
    duration: { en: 'Up to 10 / 20 business days', ru: 'До 10 / 20 рабочих дней' },
    startingPrice: '€950 (Standard) / €1,900 (Growth)',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Focused process assessment to find bottlenecks, automation opportunities and where AI creates measurable value.',
      ru: 'Оценка бизнес-процессов: узкие места, автоматизация и области, где ИИ создаст измеримую ценность.'
    }
  },
  {
    id: 'deal-risk-screening',
    category: 'investor',
    title: { en: 'Deal Risk Screening', ru: 'Скрининг рисков сделки' },
    duration: { en: 'Up to 5 business days', ru: 'До 5 рабочих дней' },
    startingPrice: '€950',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Independent evaluation of an investment opportunity: business model, team structure, operational risks and red flags.',
      ru: 'Независимая оценка инвестиционной возможности: бизнес-модель, команда, операционные риски и тревожные сигналы.'
    }
  },
  {
    id: 'execution-risk-review',
    category: 'investor',
    title: { en: 'Execution Risk Review', ru: 'Оценка рисков исполнения' },
    duration: { en: 'Up to 7 business days', ru: 'До 7 рабочих дней' },
    startingPrice: '€1,500',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Assessment of a startup’s ability to execute its strategy and deliver on its roadmap.',
      ru: 'Оценка способности стартапа реализовать стратегию и выполнить дорожную карту.'
    }
  },
  {
    id: 'post-investment-100-day-plan',
    category: 'investor',
    title: { en: 'Post-Investment 100-Day Plan', ru: 'План первых 100 дней после инвестиции' },
    duration: { en: 'Up to 10 business days', ru: 'До 10 рабочих дней' },
    startingPrice: '€2,500',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Practical 30/60/100-day action plan, KPI and governance recommendations for investors post-investment.',
      ru: 'Практичный план действий на 30/60/100 дней, рекомендации по KPI и управлению после инвестиции.'
    }
  },
  {
    id: 'founder-team-execution-review',
    category: 'startup',
    title: { en: 'Founder & Team Execution Review', ru: 'Оценка исполнения у основателя и команды' },
    duration: { en: 'Up to 7 business days', ru: 'До 7 рабочих дней' },
    startingPrice: '€1,500',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Independent assessment of team leadership, communication, role alignment, accountability and operational readiness.',
      ru: 'Независимая оценка лидерства, коммуникации, распределения ролей и операционной готовности команды.'
    }
  },
  {
    id: 'delivery-execution-leadership',
    category: 'startup',
    title: { en: 'Delivery & Execution Leadership', ru: 'Лидерство в поставке и исполнении' },
    duration: { en: 'Monthly engagement, min 1 month', ru: 'Ежемесячно, минимум 1 месяц' },
    startingPrice: '€2,000/month',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Hands-on fractional delivery leadership: weekly coordination, execution tracking, blocker removal and team alignment.',
      ru: 'Практическое сопровождение поставки: еженедельная координация, контроль исполнения и снятие блокеров.'
    }
  },
  {
    id: 'startup-operations-setup',
    category: 'startup',
    title: { en: 'Startup Operations Setup', ru: 'Настройка операционных процессов стартапа' },
    duration: { en: 'Up to 10 business days', ru: 'До 10 рабочих дней' },
    startingPrice: '€2,500',
    pricingNote: { en: 'Base price; tailored individually to each case.', ru: 'Базовая стоимость; рассчитывается индивидуально.' },
    summary: {
      en: 'Building operational foundations for sustainable growth: clear processes, communication flows and role mapping.',
      ru: 'Создание операционной основы для роста: понятные процессы, коммуникация и карта ответственности.'
    }
  }
];

const CASE_STUDIES = [
  {
    id: 'circular-rag',
    region: { en: 'China / Russia', ru: 'Китай / Россия' },
    tags: { en: ['RAG & knowledge AI', 'R&D & concept', 'China / Russia'], ru: ['RAG и управление знаниями', 'R&D и концепция', 'Китай / Россия'] },
    title: {
      en: 'Circular Economy: Product Concept & AI Knowledge System',
      ru: 'Циклическая экономика: продуктовая концепция и AI-система знаний'
    },
    summary: {
      en: 'Researched opportunities to turn production waste into a new product line while coordinating the development of an internal RAG system for intelligent search across corporate technical documentation.',
      ru: 'Исследование возможностей превращения производственных отходов в новую продуктовую линейку и координация разработки внутренней RAG-системы для интеллектуального поиска по технической документации компании.'
    },
    details: {
      en: {
        objective: 'Explore opportunities to transform production waste into a new commercial product line and build technological solutions to improve how the company works with internal documentation.',
        role: 'End-to-end project management during the R&D phase: structuring tasks, coordinating cross-functional contributors, assessing technical feasibility, planning resources, controlling milestones, and coordinating internal RAG system development.',
        result: 'Developed the concept for a new product line built on secondary material reuse; defined technological requirements and commercialization roadmap; delivered a RAG-based solution for corporate technical documentation; provided a structured foundation for next-phase investment decisions.'
      },
      ru: {
        objective: 'Исследовать возможности превращения производственных отходов в новую продуктовую линейку и разработать технологические решения для повышения эффективности работы с внутренней документацией компании.',
        role: 'Управление проектом на этапе R&D: структурирование задач, координация участников, оценка технической реализуемости, планирование ресурсов, контроль ключевых этапов и координация разработки внутренней RAG-системы.',
        result: 'Проработана концепция новой линейки из вторичных материалов, определены технологические требования и дорожная карта коммерциализации, разработано RAG-решение для технической документации и сформирована основа для управленческих решений.'
      }
    }
  },
  {
    id: 'luxury-air-quality-iot',
    region: { en: 'Italy / Switzerland', ru: 'Италия / Швейцария' },
    tags: { en: ['Smart App', 'Smart Sanitization', 'Italy / Switzerland'], ru: ['Умное приложение', 'Умная санификация', 'Италия / Швейцария'] },
    title: {
      en: 'Premium Air Purification Product: Relaunch',
      ru: 'Премиальный продукт для очистки воздуха: перезапуск'
    },
    summary: {
      en: 'Coordinated redesign and premium repositioning alongside the development of a remote-control mobile application featuring smart sanitization based on input parameters. Post-project support in investor search and participation in product sales.',
      ru: 'Координировала редизайн и премиальное репозиционирование с разработкой мобильного приложения для удалённого управления, интеллектуальными функциями и санификации по входным параметрам. Пост-проектное сопровождение в поиске инвестора, участие в продаже продукта.'
    },
    details: {
      en: {
        before: 'A traditional hardware product in the premium air purification segment hit the ceiling of the traditional equipment market without digital value for the user and investors.',
        role: 'End-to-end guidance of product transformation, from audit and concept change to coordination of cross-functional development and market launch in Italy and Switzerland.',
        decisions: 'Transitioned the product into Smart IoT via a remote-control mobile app and intelligent sanitization algorithms based on incoming parameters.',
        result: 'The product gained digital added value, secured its position in the premium segment on European markets, and successfully attracted business angel interest.'
      },
      ru: {
        before: 'Традиционный «железный» продукт в сегменте премиальных систем очистки воздуха упирался в потолок классического рынка оборудования без цифровой ценности для пользователя и инвесторов.',
        role: 'Сквозное руководство трансформацией продукта от аудита и изменения концепции до координации кросс-функциональной разработки и вывода на рынки Италии и Швейцарии.',
        decisions: 'Перевод продукта в категорию Smart IoT за счёт мобильного приложения для удалённого управления и алгоритмов интеллектуальной санификации по входящим параметрам.',
        result: 'Продукт получил цифровую добавленную стоимость, закрепился в премиальном сегменте на европейском рынке и успешно привлёк интерес бизнес-ангелов.'
      }
    }
  },
  {
    id: 'ai-hospitality',
    region: { en: 'France', ru: 'Франция' },
    tags: { en: ['Active Noise Cancellation', 'AI Integration', 'France'], ru: ['Активное шумоподавление', 'Интеграция ИИ', 'Франция'] },
    title: {
      en: 'AI Hospitality: Smart Noise-Canceling Beds',
      ru: 'ИИ-гостеприимство: умные кровати с шумоподавлением'
    },
    summary: {
      en: 'Coordinated the development and launch of an AI-driven hospitality solution based on next-generation smart beds engineered for active external noise cancellation via advanced acoustic hardware. Aimed at enhancing comfort, privacy, and sleep quality.',
      ru: 'Координировала разработку и запуск гостиничного решения с ИИ на базе умных кроватей нового поколения, спроектированных для активного подавления внешнего шума с помощью передовых акустических устройств. С целью повышения комфорта, приватности и улучшения качества сна.'
    },
    details: {
      en: {
        objective: 'Create and bring to the French hospitality market an innovative B2B solution, namely next-generation smart beds with integrated AI algorithms and active noise cancellation (ANC) acoustic systems to enhance guest privacy and rest quality.',
        role: 'End-to-end coordination of product development and launch: synchronizing acoustic engineers, furniture technologists, and AI developers, overseeing hardware/software integration, and adapting the solution to hospitality standards.',
        decisions: 'Implemented adaptive AI algorithms analyzing external room noise in real time and generating anti-phase acoustic waves (creating an individual quiet zone around the bed without structural wall soundproofing).',
        result: 'Successful launch for the hospitality segment in France, creating a new competitive advantage for hotels (higher guest satisfaction and average check) and validating a complex hardware+AI solution in a commercial environment.'
      },
      ru: {
        objective: 'Создать и вывести на гостиничный рынок Франции инновационное B2B-решение, а именно умные кровати нового поколения с интегрированными ИИ-алгоритмами и акустическими системами активного шумоподавления (ANC) для повышения приватности и качества отдыха гостей.',
        role: 'Сквозная координация разработки и запуска продукта: синхронизация инженеров по акустике, мебельных технологов и AI-разработчиков, контроль интеграции «железа» и софта, адаптация под стандарты гостиничного бизнеса.',
        decisions: 'Внедрение адаптивных ИИ-алгоритмов, анализирующих внешний шумовой фон в реальном времени и генерирующих противофазные акустические волны (индивидуальная «тихая зона» без капитальной шумоизоляции стен).',
        result: 'Успешный запуск продукта для гостиничного сегмента во Франции, новое конкурентное преимущество для отелей (рост удовлетворённости гостей и среднего чека) и валидация hardware+AI решения в коммерческой среде.'
      }
    }
  }
];

const TOOLS = [
  {
    name: 'get_profile',
    description: 'Get Alisa Chebotarenko profile, certifications (PMP, PSPO I, AWS AI Practitioner), Europe & Asia availability, spoken languages (EN/RU/IT), equivalent roles, the 4 core domains, and direct contact details.',
    inputSchema: {
      type: 'object',
      properties: {
        lang: { type: 'string', enum: ['en', 'ru'], description: 'Preferred response language (en or ru).' }
      }
    }
  },
  {
    name: 'list_services',
    description: 'List Alisa Chebotarenko consulting & advisory services with durations and base starting prices, optionally filtered by client category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: ['all', 'private', 'investor', 'startup'], description: 'Filter by client category.' },
        lang: { type: 'string', enum: ['en', 'ru'], description: 'Preferred response language (en or ru).' }
      }
    }
  },
  {
    name: 'list_case_studies',
    description: 'List selected AI, IoT and product delivery case studies coordinated by Alisa Chebotarenko.',
    inputSchema: {
      type: 'object',
      properties: {
        lang: { type: 'string', enum: ['en', 'ru'], description: 'Preferred response language (en or ru).' }
      }
    }
  },
  {
    name: 'submit_inquiry',
    description: 'Submit a structured business or project inquiry to Alisa Chebotarenko on behalf of a user (requires explicit user confirmation and privacy consent).',
    inputSchema: {
      type: 'object',
      required: ['name', 'request_reason', 'preferred_contact', 'message', 'privacy_consent'],
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 120 },
        request_reason: { type: 'string', minLength: 2, maxLength: 200 },
        preferred_contact: { type: 'string', enum: ['email', 'whatsapp', 'telegram'] },
        email: { type: 'string' },
        phone_country_code: { type: 'string' },
        phone: { type: 'string' },
        telegram_username: { type: 'string' },
        message: { type: 'string', minLength: 10, maxLength: 5000 },
        privacy_consent: { type: 'boolean', description: 'Must be true after explicit user consent.' }
      }
    }
  }
];

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Mcp-Session-Id');
}

function normalizeBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

async function handleSubmitInquiry(args, req) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return { isError: true, text: 'Email service is not configured on the server.' };
  }
  const clientIp = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (isInquiryRateLimited(clientIp)) {
    return { isError: true, text: 'Rate limit exceeded. Please wait a few minutes before sending another inquiry.' };
  }

  const name = String(args?.name || '').trim();
  const reason = String(args?.request_reason || '').trim();
  const preferred = args?.preferred_contact;
  const message = String(args?.message || '').trim();
  const consent = args?.privacy_consent === true;

  if (name.length < 2 || name.length > 120) return { isError: true, text: 'Name must be 2–120 characters.' };
  if (!reason || reason.length > 200) return { isError: true, text: 'request_reason is required (max 200 chars).' };
  if (!['email', 'whatsapp', 'telegram'].includes(preferred)) return { isError: true, text: 'preferred_contact must be email, whatsapp, or telegram.' };
  if (message.length < 10 || message.length > 5000) return { isError: true, text: 'message must be 10–5000 characters.' };
  if (!consent) return { isError: true, text: 'privacy_consent must be true.' };

  let contactDetail = '';
  let replyTo;
  if (preferred === 'email') {
    const email = String(args?.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { isError: true, text: 'A valid email is required.' };
    contactDetail = email;
    replyTo = email;
  } else if (preferred === 'whatsapp') {
    const code = String(args?.phone_country_code || '+39').trim();
    const phone = String(args?.phone || '').trim();
    if (!code.startsWith('+') || !/^[0-9\s()+-]{6,20}$/.test(phone)) return { isError: true, text: 'A valid WhatsApp number is required.' };
    contactDetail = `${code} ${phone}`;
  } else {
    const tg = String(args?.telegram_username || '').trim();
    if (!/^@?[A-Za-z0-9_]{5,32}$/.test(tg)) return { isError: true, text: 'A valid Telegram username is required.' };
    contactDetail = tg.startsWith('@') ? tg : `@${tg}`;
  }

  const rows = [
    ['Source', 'MCP Server (alisac.it/api/mcp)'],
    ['Name', name],
    ['Preferred contact', preferred],
    ['Contact detail', contactDetail],
    ['Reason', reason],
    ['Message', message]
  ];

  const htmlRows = rows.map(([k, v]) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:700;color:#555;">${escapeHtml(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`
  ).join('');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: CONTACT_TO_EMAIL,
      reply_to: replyTo,
      subject: `[MCP] New request from alisac.it — ${reason.slice(0, 60)}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<div style="font-family:Arial,sans-serif;color:#111;"><h2 style="margin:0 0 14px;">New MCP inquiry from alisac.it</h2><table style="width:100%;border-collapse:collapse;border:1px solid #eee;">${htmlRows}</table></div>`
    })
  });

  if (!response.ok) {
    return { isError: true, text: 'Failed to forward inquiry via email service.' };
  }
  return { isError: false, text: 'Inquiry successfully delivered to Alisa Chebotarenko.' };
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const accept = String(req.headers?.accept || '').toLowerCase();
    if (accept.includes('text/event-stream')) {
      res.setHeader('Allow', 'POST, OPTIONS');
      return res.status(405).json({ error: 'SSE stream not offered; use HTTP POST for stateless JSON-RPC 2.0.' });
    }
    return res.status(200).json({
      name: 'alisac-it-mcp',
      version: '1.0.0',
      protocol: 'MCP (JSON-RPC 2.0 over HTTP POST)',
      endpoint: 'https://alisac.it/api/mcp',
      tools: TOOLS.map(t => ({ name: t.name, description: t.description }))
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const rpc = normalizeBody(req);
  if (!rpc || rpc.jsonrpc !== '2.0' || !rpc.method) {
    return res.status(400).json({ jsonrpc: '2.0', id: rpc?.id ?? null, error: { code: -32600, message: 'Invalid JSON-RPC 2.0 request.' } });
  }

  const { id, method, params } = rpc;

  // Notifications have no id
  if (method === 'notifications/initialized' || id === undefined) {
    return res.status(202).end();
  }

  if (method === 'initialize') {
    return res.status(200).json({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'alisac-it-mcp', version: '1.0.0' }
      }
    });
  }

  if (method === 'ping') {
    return res.status(200).json({ jsonrpc: '2.0', id, result: {} });
  }

  if (method === 'tools/list') {
    return res.status(200).json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};
    const lang = args.lang === 'ru' ? 'ru' : 'en';

    if (toolName === 'get_profile') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text: JSON.stringify(PROFILE[lang], null, 2) }] }
      });
    }

    if (toolName === 'list_services') {
      const cat = args.category && args.category !== 'all' ? args.category : null;
      const items = SERVICES
        .filter(s => !cat || s.category === cat)
        .map(s => ({
          id: s.id,
          category: s.category,
          title: s.title[lang],
          duration: s.duration[lang],
          startingPrice: s.startingPrice,
          pricingNote: s.pricingNote[lang],
          summary: s.summary[lang]
        }));
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text: JSON.stringify(items, null, 2) }] }
      });
    }

    if (toolName === 'list_case_studies') {
      const items = CASE_STUDIES.map(c => ({
        id: c.id,
        region: c.region[lang],
        tags: c.tags[lang],
        title: c.title[lang],
        summary: c.summary[lang],
        details: c.details[lang]
      }));
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text: JSON.stringify(items, null, 2) }] }
      });
    }

    if (toolName === 'submit_inquiry') {
      const outcome = await handleSubmitInquiry(args, req);
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: {
          isError: outcome.isError,
          content: [{ type: 'text', text: outcome.text }]
        }
      });
    }

    return res.status(200).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Unknown tool: ${toolName}` }
    });
  }

  return res.status(200).json({
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` }
  });
};

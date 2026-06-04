const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'alisa.1chebotarenko@gmail.com';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
const isPhone = value => /^[0-9\s()+-]{6,20}$/.test(value || '');
const isTelegram = value => /^@?[A-Za-z0-9_]{5,32}$/.test(value || '');

function normalizeBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

function validate(body) {
  const errors = [];
  const preferred = body.preferred_contact;

  if (!body.name || String(body.name).trim().length < 2) errors.push('Name is required.');
  if (!['email', 'whatsapp', 'telegram'].includes(preferred)) errors.push('Preferred contact method is required.');
  if (!body.request_reason) errors.push('Reason for your request is required.');
  if (!body.message || String(body.message).trim().length < 10) errors.push('Message must be at least 10 characters.');
  if (!body.privacy_consent) errors.push('Privacy consent is required.');

  if (preferred === 'email' && !isEmail(body.email)) errors.push('A valid email address is required.');
  if (preferred === 'whatsapp') {
    if (!body.phone_country_code || !String(body.phone_country_code).startsWith('+')) errors.push('A valid phone country code is required.');
    if (!isPhone(body.phone)) errors.push('A valid WhatsApp phone number is required.');
  }
  if (preferred === 'telegram' && !isTelegram(body.telegram_username)) errors.push('A valid Telegram username is required.');

  return errors;
}

function buildEmail(body) {
  const contactValue = body.preferred_contact === 'email'
    ? body.email
    : body.preferred_contact === 'whatsapp'
      ? String(body.phone_country_code || '') + ' ' + String(body.phone || '')
      : body.telegram_username;

  const rows = [
    ['Name', body.name],
    ...(body.origin_country ? [['Country of origin', body.origin_country]] : []),
    ['Preferred contact', body.preferred_contact],
    ['Contact detail', contactValue],
    ['Reason', body.request_reason],
    ['Message', body.message],
  ];

  const htmlRows = rows.map(([label, value]) =>
    '<tr>' +
    '<td style="padding:10px 14px;border-bottom:1px solid #eee;color:#555;font-weight:700;vertical-align:top;">' + escapeHtml(label) + '</td>' +
    '<td style="padding:10px 14px;border-bottom:1px solid #eee;color:#111;white-space:pre-wrap;">' + escapeHtml(value) + '</td>' +
    '</tr>'
  ).join('');

  const text = rows.map(([label, value]) => label + ': ' + (value || '')).join('\n');
  const html = '<div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">' +
    '<h1 style="font-size:24px;margin:0 0 18px;">New request from alisac.it</h1>' +
    '<table style="width:100%;border-collapse:collapse;border:1px solid #eee;">' + htmlRows + '</table>' +
    '</div>';

  return { text, html };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const body = normalizeBody(req);
  const errors = validate(body);
  if (errors.length) return res.status(400).json({ error: errors.join(' ') });

  const { text, html } = buildEmail(body);
  const replyTo = body.preferred_contact === 'email' && isEmail(body.email) ? body.email : undefined;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: CONTACT_TO_EMAIL,
      reply_to: replyTo,
      subject: 'New request from alisac.it',
      text,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    console.error('Resend error:', details);
    return res.status(502).json({ error: 'Email could not be sent.' });
  }

  return res.status(200).json({ ok: true });
};

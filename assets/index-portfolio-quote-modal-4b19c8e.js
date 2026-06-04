(() => {
  const SERVICES = [
    { group: 'PRIVATE CLIENT', items: ['Critical Decision Review', 'Project Go / No-Go Decision', 'Operational Efficiency Scan'] },
    { group: 'INVESTOR', items: ['Deal Risk Screening', 'Execution Risk Review', 'Post-Investment 100-Day Plan'] },
    { group: 'STARTUP', items: ['Founder & Team Execution Review', 'Delivery & Execution Leadership', 'Startup Operations Setup'] }
  ];

  const COUNTRY_CODES = [
    ['+39', 'IT +39'], ['+33', 'FR +33'], ['+41', 'CH +41'], ['+49', 'DE +49'], ['+34', 'ES +34'], ['+44', 'UK +44'], ['+1', 'US/CA +1'], ['+7', 'RU/KZ +7'], ['+86', 'CN +86'], ['+380', 'UA +380'], ['+48', 'PL +48'], ['+31', 'NL +31'], ['+32', 'BE +32'], ['+43', 'AT +43'], ['+351', 'PT +351'], ['+353', 'IE +353'], ['+45', 'DK +45'], ['+46', 'SE +46'], ['+47', 'NO +47'], ['+358', 'FI +358'], ['+420', 'CZ +420'], ['+421', 'SK +421'], ['+36', 'HU +36'], ['+40', 'RO +40'], ['+359', 'BG +359'], ['+30', 'GR +30'], ['+90', 'TR +90'], ['+972', 'IL +972'], ['+971', 'AE +971'], ['+966', 'SA +966'], ['+974', 'QA +974'], ['+965', 'KW +965'], ['+973', 'BH +973'], ['+968', 'OM +968'], ['+91', 'IN +91'], ['+81', 'JP +81'], ['+82', 'KR +82'], ['+65', 'SG +65'], ['+852', 'HK +852'], ['+886', 'TW +886'], ['+61', 'AU +61'], ['+55', 'BR +55'], ['+', 'OTHER +']
  ];

  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const normalize = value => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();

  function serviceOptions(selectedTitle = '') {
    const selected = normalize(selectedTitle);
    return SERVICES.map(group => {
      const items = group.items.map(item => {
        const checked = normalize(item) === selected ? ' checked' : '';
        return '<label class="quote-service-option"><input type="checkbox" name="services" value="' + escapeHtml(item) + '"' + checked + '><span>' + escapeHtml(item) + '</span></label>';
      }).join('');
      return '<div class="quote-service-group"><p>' + escapeHtml(group.group) + '</p><div>' + items + '</div></div>';
    }).join('');
  }

  function countryOptions() {
    return COUNTRY_CODES.map(([value, label]) => '<option value="' + value + '">' + label + '</option>').join('');
  }

  function contactField(type) {
    if (type === 'whatsapp') {
      return '<div class="quote-phone-row"><select name="phone_country_code" required>' + countryOptions() + '</select><input name="phone" type="tel" placeholder="WhatsApp phone number" pattern="[0-9\\s()+-]{6,20}" title="Enter a valid phone number" required></div>';
    }
    if (type === 'telegram') {
      return '<input name="telegram_username" type="text" placeholder="Telegram username, e.g. @username" pattern="@?[A-Za-z0-9_]{5,32}" title="Enter a valid Telegram username, with or without @" required>';
    }
    return '<input name="email" type="email" placeholder="Email address" required>';
  }

  function ensureModal() {
    let modal = document.querySelector('.quote-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.className = 'quote-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Get a quote');
    modal.innerHTML = '<div class="quote-modal-backdrop" data-quote-close></div><div class="quote-modal-card"><button class="quote-modal-close" type="button" aria-label="Close" data-quote-close>×</button><span class="quote-kicker">QUOTE REQUEST</span><h3>Choose services</h3><form class="quote-form-card" action="/api/contact" method="post"><div class="quote-services-list"></div><input name="name" type="text" placeholder="Name" required><fieldset class="quote-preference-group"><legend>How do you prefer to be contacted?</legend><div class="quote-preference-options"><label><input type="radio" name="preferred_contact" value="email" checked><span>Email</span></label><label><input type="radio" name="preferred_contact" value="whatsapp"><span>WhatsApp</span></label><label><input type="radio" name="preferred_contact" value="telegram"><span>Telegram</span></label></div></fieldset><div class="quote-contact-field"></div><textarea name="quote_note" rows="4" placeholder="Add a note"></textarea><label class="quote-privacy-consent"><input name="privacy_consent" type="checkbox" required><span>I agree to the processing of my personal data for the purpose of being contacted about this request.</span></label><button class="quote-submit" type="submit">Send request</button></form></div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', event => {
      if (event.target.matches('[data-quote-close]')) closeModal();
    });

    const form = modal.querySelector('.quote-form-card');
    const contactWrap = modal.querySelector('.quote-contact-field');
    form.addEventListener('change', event => {
      if (event.target.name === 'preferred_contact') {
        contactWrap.innerHTML = contactField(event.target.value);
      }
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const oldError = form.querySelector('.quote-form-error');
      if (oldError) oldError.remove();

      const selectedServices = Array.from(form.querySelectorAll('input[name="services"]:checked')).map(input => input.value);
      if (!selectedServices.length) {
        showError(form, 'Select at least one service.');
        return;
      }
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const button = form.querySelector('.quote-submit');
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'Sending...';

      const data = Object.fromEntries(new FormData(form).entries());
      const note = String(data.quote_note || '').trim();
      data.request_reason = 'Quote request';
      data.selected_services = selectedServices.join(', ');
      data.message = 'Selected services:\n- ' + selectedServices.join('\n- ') + (note ? '\n\nNote:\n' + note : '\n\nNo additional note.');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'Form submission failed');
        modal.querySelector('.quote-modal-card').innerHTML = '<button class="quote-modal-close" type="button" aria-label="Close" data-quote-close>×</button><div class="quote-thank-you"><span class="quote-kicker">QUOTE REQUEST</span><h3>Thank you.</h3><p>I received your request and will get back to you as soon as possible.</p></div>';
      } catch (error) {
        showError(form, 'Something went wrong. Please try again or email me directly.');
        button.disabled = false;
        button.textContent = originalText;
      }
    });

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    return modal;
  }

  function showError(form, text) {
    const message = document.createElement('p');
    message.className = 'quote-form-error';
    message.textContent = text;
    form.appendChild(message);
  }

  function openModal(selectedTitle) {
    const modal = ensureModal();
    modal.querySelector('.quote-services-list').innerHTML = serviceOptions(selectedTitle);
    modal.querySelector('.quote-contact-field').innerHTML = contactField('email');
    modal.querySelector('input[name="preferred_contact"][value="email"]').checked = true;
    modal.classList.add('is-open');
    document.body.classList.add('quote-modal-open');
    setTimeout(() => modal.querySelector('input[name="name"]')?.focus(), 80);
  }

  function closeModal() {
    const modal = document.querySelector('.quote-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('quote-modal-open');
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('.service-offer-book');
    if (!trigger) return;
    event.preventDefault();
    const card = trigger.closest('.service-offer-card');
    const selectedTitle = card?.querySelector('.service-offer-head h3')?.textContent || '';
    openModal(selectedTitle);
  });
})();

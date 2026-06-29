(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('.form-submit');
    const successPanel = document.getElementById('formSuccess');
    const errorAlert = document.getElementById('formError');
    const errorAlertText = errorAlert?.querySelector('.form-alert-text');

    const fields = {
        firstName: { el: form.querySelector('#firstName'), required: true, label: 'First name' },
        lastName: { el: form.querySelector('#lastName'), required: true, label: 'Last name' },
        businessName: { el: form.querySelector('#businessName'), required: true, label: 'Business name' },
        email: { el: form.querySelector('#email'), required: true, label: 'Email address', type: 'email' },
        phone: { el: form.querySelector('#phone'), required: false, label: 'Phone number' },
        industry: { el: form.querySelector('#industry'), required: true, label: 'Business industry' },
        projectType: { el: form.querySelector('#projectType'), required: true, label: 'Project type' },
        pageCount: { el: form.querySelector('#pageCount'), required: true, label: 'Estimated number of pages' },
        currentWebsite: { el: form.querySelector('#currentWebsite'), required: false, label: 'Current website' },
        budget: { el: form.querySelector('#budget'), required: false, label: 'Project budget' },
        timeline: { el: form.querySelector('#timeline'), required: true, label: 'Project timeline' },
        message: { el: form.querySelector('#message'), required: true, label: 'Project details' },
        consent: { el: form.querySelector('#consent'), required: true, label: 'Consent agreement', type: 'checkbox' }
    };

    function getErrorEl(fieldEl) {
        return form.querySelector(`[data-error-for="${fieldEl.id}"]`);
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateField(key) {
        const field = fields[key];
        const el = field.el;
        const errorEl = getErrorEl(el);
        let message = '';

        if (field.type === 'checkbox') {
            if (field.required && !el.checked) {
                message = 'Please agree to be contacted regarding your mockup request or website project.';
            }
        } else if (field.required && !el.value.trim()) {
            message = `${field.label} is required.`;
        } else if (field.type === 'email' && el.value.trim() && !isValidEmail(el.value.trim())) {
            message = 'Please enter a valid email address.';
        }

        el.classList.toggle('is-invalid', Boolean(message));
        el.setAttribute('aria-invalid', message ? 'true' : 'false');

        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.toggle('is-visible', Boolean(message));
        }

        return !message;
    }

    function validateForm() {
        return Object.keys(fields).every(validateField);
    }

    function hideGlobalError() {
        if (!errorAlert) return;
        errorAlert.classList.remove('is-visible');
    }

    function showGlobalError(message) {
        if (!errorAlert || !errorAlertText) return;
        errorAlertText.textContent = message;
        errorAlert.classList.add('is-visible');
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function buildMailtoBody(data) {
        const lines = [
            `Name: ${data.firstName} ${data.lastName}`,
            `Business: ${data.businessName}`,
            `Email: ${data.email}`,
            data.phone ? `Phone: ${data.phone}` : null,
            `Industry: ${data.industry}`,
            `Project Type: ${data.projectType}`,
            `Estimated Pages: ${data.pageCount}`,
            data.currentWebsite ? `Current Website: ${data.currentWebsite}` : null,
            data.budget ? `Budget: ${data.budget}` : null,
            `Timeline: ${data.timeline}`,
            '',
            'Project Details:',
            data.message
        ].filter(Boolean);

        return lines.join('\n');
    }

    function getFormData() {
        return {
            firstName: fields.firstName.el.value.trim(),
            lastName: fields.lastName.el.value.trim(),
            businessName: fields.businessName.el.value.trim(),
            email: fields.email.el.value.trim(),
            phone: fields.phone.el.value.trim(),
            industry: fields.industry.el.value.trim(),
            projectType: fields.projectType.el.value,
            pageCount: fields.pageCount.el.value,
            currentWebsite: fields.currentWebsite.el.value.trim(),
            budget: fields.budget.el.value,
            timeline: fields.timeline.el.value,
            message: fields.message.el.value.trim()
        };
    }

    Object.keys(fields).forEach(key => {
        const field = fields[key];
        const eventType = field.type === 'checkbox' ? 'change' : 'input';

        field.el.addEventListener(eventType, () => {
            validateField(key);
            hideGlobalError();
        });

        field.el.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideGlobalError();

        if (!validateForm()) {
            showGlobalError('Please correct the highlighted fields before submitting.');
            const firstInvalid = form.querySelector('.is-invalid');
            firstInvalid?.focus();
            return;
        }

        submitBtn.classList.add('is-loading');
        submitBtn.setAttribute('aria-busy', 'true');

        const data = getFormData();

        await new Promise(resolve => setTimeout(resolve, 900));

        const subject = encodeURIComponent(`Project Inquiry — ${data.businessName}`);
        const body = encodeURIComponent(buildMailtoBody(data));
        const mailto = `mailto:ramon@saucedawebdesign.com?subject=${subject}&body=${body}`;

        window.location.href = mailto;

        form.classList.add('is-submitted');
        successPanel?.classList.add('is-visible');
        successPanel?.setAttribute('aria-hidden', 'false');

        submitBtn.classList.remove('is-loading');
        submitBtn.setAttribute('aria-busy', 'false');

        successPanel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
})();

(function () {
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkolzkzq';

    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('.form-submit');
    const successPanel = document.getElementById('formSuccess');
    const errorAlert = document.getElementById('formError');
    const errorAlertText = errorAlert?.querySelector('.form-alert-text');

    const SUBMIT_ERROR_MESSAGE =
        'Something went wrong while submitting your request. Please try again or email me directly at ramon@saucedawebdesign.com.';

    let isSubmitting = false;

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

    function setSubmittingState(isLoading) {
        isSubmitting = isLoading;
        submitBtn.classList.toggle('is-loading', isLoading);
        submitBtn.setAttribute('aria-busy', isLoading ? 'true' : 'false');
        submitBtn.disabled = isLoading;
    }

    function showSuccessState() {
        form.classList.add('is-submitted');
        successPanel?.classList.add('is-visible');
        successPanel?.setAttribute('aria-hidden', 'false');
        successPanel?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (successPanel) {
            successPanel.setAttribute('tabindex', '-1');
            successPanel.focus({ preventScroll: true });
        }
    }

    /**
     * Builds FormData for Formspree using the live form fields.
     * Adds a readable subject line for inbox organization.
     */
    function buildFormspreePayload() {
        const formData = new FormData(form);
        const businessName = fields.businessName.el.value.trim();

        formData.set('_subject', `Project Inquiry — ${businessName}`);
        formData.set('_replyto', fields.email.el.value.trim());

        return formData;
    }

    /**
     * Sends the validated form to Formspree via fetch.
     * Returns true on success, false on failure.
     */
    async function submitToFormspree(formData) {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: formData
        });

        if (!response.ok) {
            let errorDetail = '';

            try {
                const result = await response.json();
                errorDetail = result?.error || result?.errors?.map((item) => item.message).join(' ') || '';
            } catch (parseError) {
                errorDetail = '';
            }

            console.error('Formspree submission failed:', response.status, errorDetail);
            return false;
        }

        return true;
    }

    Object.keys(fields).forEach((key) => {
        const field = fields[key];
        const eventType = field.type === 'checkbox' ? 'change' : 'input';

        field.el.addEventListener(eventType, () => {
            validateField(key);
            hideGlobalError();
        });

        field.el.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        hideGlobalError();

        if (!validateForm()) {
            showGlobalError('Please correct the highlighted fields before submitting.');
            const firstInvalid = form.querySelector('.is-invalid');
            firstInvalid?.focus();
            return;
        }

        setSubmittingState(true);

        try {
            const formData = buildFormspreePayload();
            const didSubmit = await submitToFormspree(formData);

            if (!didSubmit) {
                showGlobalError(SUBMIT_ERROR_MESSAGE);
                return;
            }

            form.reset();
            showSuccessState();
        } catch (error) {
            console.error('Form submission error:', error);
            showGlobalError(SUBMIT_ERROR_MESSAGE);
        } finally {
            setSubmittingState(false);
        }
    });
})();

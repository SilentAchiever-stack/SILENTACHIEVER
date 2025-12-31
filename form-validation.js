// Form Validation JavaScript
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.isValid = false;

        this.init();
    }

    init() {
        this.setupFields();
        this.bindEvents();
        this.setupPasswordToggles();
        this.setupCharacterCount();
    }

    setupFields() {
        const inputs = this.form.querySelectorAll('[data-validation]');
        inputs.forEach(input => {
            const validationRules = input.dataset.validation.split(',');
            this.fields[input.id] = {
                element: input,
                rules: this.parseRules(validationRules),
                isValid: false,
                errorElement: document.getElementById(`${input.id}-error`)
            };
        });
    }

    parseRules(rules) {
        const parsedRules = {};
        rules.forEach(rule => {
            if (rule.includes(':')) {
                const [key, value] = rule.split(':');
                parsedRules[key] = value;
            } else {
                parsedRules[rule] = true;
            }
        });
        return parsedRules;
    }

    bindEvents() {
        // Real-time validation on input
        Object.keys(this.fields).forEach(fieldId => {
            const field = this.fields[fieldId];

            field.element.addEventListener('input', () => {
                this.validateField(fieldId);
                this.updateFormSummary();
            });

            field.element.addEventListener('blur', () => {
                this.validateField(fieldId);
                this.updateFormSummary();
            });

            field.element.addEventListener('focus', () => {
                this.clearFieldError(fieldId);
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetForm();
        });

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on backdrop click
        document.getElementById('successModal').addEventListener('click', (e) => {
            if (e.target.id === 'successModal') {
                this.closeModal();
            }
        });
    }

    setupPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.dataset.target;
                const targetInput = document.getElementById(targetId);
                const icon = toggle.querySelector('i');

                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    targetInput.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    setupCharacterCount() {
        const bioField = document.getElementById('bio');
        const countElement = document.getElementById('bio-count');

        bioField.addEventListener('input', () => {
            const count = bioField.value.length;
            countElement.textContent = count;

            if (count > 450) {
                countElement.style.color = '#e74c3c';
            } else if (count > 400) {
                countElement.style.color = '#f39c12';
            } else {
                countElement.style.color = '#666';
            }
        });
    }

    validateField(fieldId) {
        const field = this.fields[fieldId];
        const value = field.element.value.trim();
        const rules = field.rules;

        // Clear previous validation state
        this.clearFieldError(fieldId);

        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            field.isValid = true;
            this.updateFieldUI(fieldId, true);
            return true;
        }

        // Length validations
        if (isValid && rules.minLength && value.length < parseInt(rules.minLength)) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} characters required`;
        }

        if (isValid && rules.maxLength && value.length > parseInt(rules.maxLength)) {
            isValid = false;
            errorMessage = `Maximum ${rules.maxLength} characters allowed`;
        }

        // Email validation
        if (isValid && rules.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (isValid && rules.phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // URL validation
        if (isValid && rules.url && value) {
            try {
                new URL(value);
            } catch {
                isValid = false;
                errorMessage = 'Please enter a valid URL (e.g., https://example.com)';
            }
        }

        // Name validation
        if (isValid && rules.name) {
            const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
            if (!nameRegex.test(value)) {
                isValid = false;
                errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
            }
        }

        // Username validation
        if (isValid && rules.username) {
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(value)) {
                isValid = false;
                errorMessage = 'Username can only contain letters, numbers, and underscores';
            }
        }

        // Password validation
        if (isValid && rules.password) {
            const passwordErrors = this.validatePassword(value);
            if (passwordErrors.length > 0) {
                isValid = false;
                errorMessage = passwordErrors[0];
            }
            this.updatePasswordStrength(value);
        }

        // Password match validation
        if (isValid && rules.match) {
            const matchField = document.getElementById(rules.match);
            if (value !== matchField.value) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            }
        }

        // Age validation
        if (isValid && rules.age) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < parseInt(rules.age)) {
                isValid = false;
                errorMessage = `You must be at least ${rules.age} years old`;
            }
        }

        // Update field state
        field.isValid = isValid;
        this.updateFieldUI(fieldId, isValid, errorMessage);

        return isValid;
    }

    validatePassword(password) {
        const errors = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }

        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        return errors;
    }

    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text span');

        if (!password) {
            strengthBar.className = 'strength-fill';
            strengthText.textContent = 'Weak';
            strengthText.className = 'weak';
            return;
        }

        let score = 0;

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

        // Common patterns penalty
        if (/(.)\1{2,}/.test(password)) score--; // Repeated characters
        if (/123|abc|qwe/i.test(password)) score--; // Sequential patterns

        score = Math.max(0, Math.min(4, score));

        const levels = ['weak', 'fair', 'good', 'strong'];
        const level = levels[score];

        strengthBar.className = `strength-fill ${level}`;
        strengthText.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        strengthText.className = level;
    }

    updateFieldUI(fieldId, isValid, errorMessage = '') {
        const field = this.fields[fieldId];
        const input = field.element;
        const errorElement = field.errorElement;
        const validationIcon = input.parentElement.querySelector('.validation-icon');

        // Update input classes
        input.classList.remove('valid', 'invalid');
        if (input.value.trim()) {
            input.classList.add(isValid ? 'valid' : 'invalid');
        }

        // Update validation icon
        if (validationIcon) {
            validationIcon.classList.remove('valid', 'invalid');
            if (input.value.trim()) {
                validationIcon.classList.add(isValid ? 'valid' : 'invalid');
            }
        }

        // Update error message
        if (errorElement) {
            if (!isValid && errorMessage) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            } else {
                errorElement.classList.remove('show');
            }
        }
    }

    clearFieldError(fieldId) {
        const field = this.fields[fieldId];
        const errorElement = field.errorElement;

        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    validateForm() {
        let isFormValid = true;
        const errors = [];

        Object.keys(this.fields).forEach(fieldId => {
            const isFieldValid = this.validateField(fieldId);
            if (!isFieldValid) {
                isFormValid = false;
                const field = this.fields[fieldId];
                const label = field.element.previousElementSibling.textContent.replace('*', '').trim();
                errors.push(label);
            }
        });

        this.isValid = isFormValid;
        return { isValid: isFormValid, errors };
    }

    updateFormSummary() {
        const { isValid, errors } = this.validateForm();
        const summaryElement = document.getElementById('formSummary');
        const errorList = document.getElementById('errorList');
        const submitBtn = document.getElementById('submitBtn');

        if (!isValid && errors.length > 0) {
            errorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
            summaryElement.classList.add('show');
            submitBtn.disabled = true;
        } else {
            summaryElement.classList.remove('show');
            submitBtn.disabled = false;
        }
    }

    handleSubmit() {
        const { isValid, errors } = this.validateForm();

        if (!isValid) {
            this.updateFormSummary();

            // Scroll to first error
            const firstErrorField = Object.keys(this.fields).find(fieldId => !this.fields[fieldId].isValid);
            if (firstErrorField) {
                this.fields[firstErrorField].element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                this.fields[firstErrorField].element.focus();
            }

            return;
        }

        // Simulate form submission
        this.showSuccessModal();
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        const userInfo = document.getElementById('userInfo');

        // Collect form data
        const formData = new FormData(this.form);
        const userData = {};

        for (let [key, value] of formData.entries()) {
            if (key !== 'password' && key !== 'confirmPassword') {
                userData[key] = value;
            }
        }

        // Display user information
        userInfo.innerHTML = `
            <h3>Account Details</h3>
            <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Username:</strong> ${userData.username}</p>
            <p><strong>Phone:</strong> ${userData.phone}</p>
            <p><strong>Country:</strong> ${userData.country}</p>
            ${userData.website ? `<p><strong>Website:</strong> ${userData.website}</p>` : ''}
            <p><strong>Newsletter:</strong> ${userData.newsletter ? 'Subscribed' : 'Not subscribed'}</p>
        `;

        modal.classList.add('show');

        // Reset form after showing modal
        setTimeout(() => {
            this.resetForm();
        }, 1000);
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('show');
    }

    resetForm() {
        this.form.reset();

        // Clear all validation states
        Object.keys(this.fields).forEach(fieldId => {
            const field = this.fields[fieldId];
            field.isValid = false;

            // Clear input classes
            field.element.classList.remove('valid', 'invalid');

            // Clear validation icons
            const validationIcon = field.element.parentElement.querySelector('.validation-icon');
            if (validationIcon) {
                validationIcon.classList.remove('valid', 'invalid');
            }

            // Clear error messages
            this.clearFieldError(fieldId);
        });

        // Reset password strength
        this.updatePasswordStrength('');

        // Reset character count
        document.getElementById('bio-count').textContent = '0';
        document.getElementById('bio-count').style.color = '#666';

        // Hide form summary
        document.getElementById('formSummary').classList.remove('show');

        // Enable submit button
        document.getElementById('submitBtn').disabled = false;

        // Reset password toggles
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            const targetId = toggle.dataset.target;
            const targetInput = document.getElementById(targetId);
            const icon = toggle.querySelector('i');

            targetInput.type = 'password';
            icon.className = 'fas fa-eye';
        });
    }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const validator = new FormValidator('registrationForm');

    // Add some additional enhancements

    // Smooth scrolling for form sections
    const sectionHeaders = document.querySelectorAll('.form-section h2');
    sectionHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            header.parentElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            validator.handleSubmit();
        }

        // Escape to close modal
        if (e.key === 'Escape') {
            validator.closeModal();
        }
    });

    // Add focus management for better accessibility
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Enter' && input.type !== 'textarea') {
                e.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                } else {
                    document.getElementById('submitBtn').focus();
                }
            }
        });
    });

    // Add loading state simulation
    const submitBtn = document.getElementById('submitBtn');
    const originalSubmitHandler = validator.handleSubmit.bind(validator);

    validator.handleSubmit = function () {
        const { isValid } = this.validateForm();

        if (isValid) {
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;

            // Simulate API call delay
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
                submitBtn.disabled = false;
                originalSubmitHandler();
            }, 2000);
        } else {
            originalSubmitHandler();
        }
    };
});
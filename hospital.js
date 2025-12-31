// Hospital Website JavaScript
class HospitalBookingSystem {
    constructor() {
        this.currentStep = 1;
        this.appointmentData = {};
        this.doctors = {
            cardiology: [
                { id: 'sarah_johnson', name: 'Dr. Sarah Johnson', price: 150 },
                { id: 'james_wilson', name: 'Dr. James Wilson', price: 175 }
            ],
            neurology: [
                { id: 'michael_chen', name: 'Dr. Michael Chen', price: 200 },
                { id: 'lisa_brown', name: 'Dr. Lisa Brown', price: 185 }
            ],
            orthopedics: [
                { id: 'emily_rodriguez', name: 'Dr. Emily Rodriguez', price: 120 },
                { id: 'david_kim', name: 'Dr. David Kim', price: 140 }
            ],
            ophthalmology: [
                { id: 'anna_taylor', name: 'Dr. Anna Taylor', price: 100 },
                { id: 'robert_davis', name: 'Dr. Robert Davis', price: 110 }
            ],
            pediatrics: [
                { id: 'maria_garcia', name: 'Dr. Maria Garcia', price: 80 },
                { id: 'john_smith', name: 'Dr. John Smith', price: 90 }
            ],
            general: [
                { id: 'susan_lee', name: 'Dr. Susan Lee', price: 75 },
                { id: 'thomas_white', name: 'Dr. Thomas White', price: 85 }
            ]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupFormValidation();
        this.setupPaymentMethods();
        this.setMinDate();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Form submission
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', this.formatCardNumber);
        }

        // Expiry date formatting
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', this.formatExpiryDate);
        }

        // CVV validation
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', this.formatCVV);
        }
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);

                // Close mobile menu
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    setupFormValidation() {
        // Real-time validation for form fields
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) {
                    this.validateField(field);
                }
            });
        });
    }

    setupPaymentMethods() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                this.togglePaymentDetails(method.value);
            });
        });
    }

    setMinDate() {
        const appointmentDateInput = document.getElementById('appointmentDate');
        if (appointmentDateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            appointmentDateInput.min = tomorrow.toISOString().split('T')[0];
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateSummary();
        }
    }

    prevStep() {
        this.currentStep--;
        this.showStep(this.currentStep);
    }

    showStep(step) {
        // Hide all steps
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(stepElement => {
            stepElement.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step${step}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Scroll to top of form
        const formWrapper = document.querySelector('.appointment-form-wrapper');
        if (formWrapper) {
            formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (isValid && field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (isValid && field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Date validation (must be 18+ for most appointments)
        if (isValid && field.id === 'dateOfBirth' && value) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 0) {
                isValid = false;
                errorMessage = 'Please enter a valid birth date';
            }
        }

        // Update field appearance
        field.classList.remove('valid', 'invalid');
        if (value) {
            field.classList.add(isValid ? 'valid' : 'invalid');
        }

        // Show/hide error message
        this.showFieldError(field, isValid ? '' : errorMessage);

        return isValid;
    }

    showFieldError(field, message) {
        let errorElement = field.parentElement.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }

    updateDoctors() {
        const departmentSelect = document.getElementById('department');
        const doctorSelect = document.getElementById('doctor');
        const department = departmentSelect.value;

        // Clear doctor options
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';

        if (department && this.doctors[department]) {
            this.doctors[department].forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.name;
                option.dataset.price = doctor.price;
                doctorSelect.appendChild(option);
            });
        }

        this.updateSummary();
    }

    updatePrice() {
        const doctorSelect = document.getElementById('doctor');
        const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];

        if (selectedOption && selectedOption.dataset.price) {
            const price = selectedOption.dataset.price;
            document.getElementById('summaryPrice').textContent = `$${price}`;
            document.getElementById('finalPrice').textContent = `$${price}`;
        }

        this.updateSummary();
    }

    updateTimeSlots() {
        const appointmentDate = document.getElementById('appointmentDate').value;
        const timeSelect = document.getElementById('appointmentTime');

        // Clear existing options
        timeSelect.innerHTML = '<option value="">Select Time</option>';

        if (appointmentDate) {
            const selectedDate = new Date(appointmentDate);
            const dayOfWeek = selectedDate.getDay();

            let timeSlots = [];

            // Different time slots based on day of week
            if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
                timeSlots = [
                    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
                    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
                    '19:00', '19:30'
                ];
            } else if (dayOfWeek === 6) { // Saturday
                timeSlots = [
                    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                    '17:00', '17:30'
                ];
            } else { // Sunday
                timeSlots = [
                    '10:00', '10:30', '11:00', '11:30', '14:00', '14:30',
                    '15:00', '15:30'
                ];
            }

            timeSlots.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = this.formatTime(time);
                timeSelect.appendChild(option);
            });
        }

        this.updateSummary();
    }

    formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${ampm}`;
    }

    updateSummary() {
        const department = document.getElementById('department');
        const doctor = document.getElementById('doctor');
        const appointmentDate = document.getElementById('appointmentDate');
        const appointmentTime = document.getElementById('appointmentTime');
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');

        // Update summary in step 2
        if (department.value) {
            document.getElementById('summaryDepartment').textContent =
                department.options[department.selectedIndex].textContent;
        }

        if (doctor.value) {
            document.getElementById('summaryDoctor').textContent =
                doctor.options[doctor.selectedIndex].textContent;
        }

        if (appointmentDate.value && appointmentTime.value) {
            const date = new Date(appointmentDate.value);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const formattedTime = this.formatTime(appointmentTime.value);
            document.getElementById('summaryDateTime').textContent =
                `${formattedDate} at ${formattedTime}`;
        }

        // Update final summary in step 3
        if (firstName.value && lastName.value) {
            document.getElementById('finalPatientName').textContent =
                `${firstName.value} ${lastName.value}`;
        }

        document.getElementById('finalDepartment').textContent =
            document.getElementById('summaryDepartment').textContent;
        document.getElementById('finalDoctor').textContent =
            document.getElementById('summaryDoctor').textContent;
        document.getElementById('finalDateTime').textContent =
            document.getElementById('summaryDateTime').textContent;
    }

    togglePaymentDetails(method) {
        const cardPayment = document.getElementById('cardPayment');
        const paypalPayment = document.getElementById('paypalPayment');
        const insurancePayment = document.getElementById('insurancePayment');

        // Hide all payment details
        cardPayment.style.display = 'none';
        paypalPayment.style.display = 'none';
        insurancePayment.style.display = 'none';

        // Show selected payment method details
        switch (method) {
            case 'card':
                cardPayment.style.display = 'block';
                break;
            case 'paypal':
                paypalPayment.style.display = 'block';
                break;
            case 'insurance':
                insurancePayment.style.display = 'block';
                break;
        }
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    formatCVV(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }

    handleFormSubmission() {
        if (!this.validateCurrentStep()) {
            return;
        }

        // Collect form data
        const formData = new FormData(document.getElementById('appointmentForm'));
        this.appointmentData = {};

        for (let [key, value] of formData.entries()) {
            this.appointmentData[key] = value;
        }

        // Simulate payment processing
        this.processPayment();
    }

    processPayment() {
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.showSuccessModal();
        }, 3000);
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        const confirmedDetails = document.getElementById('confirmedDetails');

        // Generate appointment ID
        const appointmentId = 'APT' + Date.now().toString().slice(-6);

        // Create appointment details HTML
        const department = document.getElementById('department');
        const doctor = document.getElementById('doctor');
        const appointmentDate = document.getElementById('appointmentDate');
        const appointmentTime = document.getElementById('appointmentTime');
        const price = document.getElementById('finalPrice').textContent;

        const detailsHTML = `
            <div class="summary-item">
                <span><strong>Appointment ID:</strong></span>
                <span>${appointmentId}</span>
            </div>
            <div class="summary-item">
                <span><strong>Patient:</strong></span>
                <span>${this.appointmentData.firstName} ${this.appointmentData.lastName}</span>
            </div>
            <div class="summary-item">
                <span><strong>Department:</strong></span>
                <span>${department.options[department.selectedIndex].textContent}</span>
            </div>
            <div class="summary-item">
                <span><strong>Doctor:</strong></span>
                <span>${doctor.options[doctor.selectedIndex].textContent}</span>
            </div>
            <div class="summary-item">
                <span><strong>Date & Time:</strong></span>
                <span>${new Date(appointmentDate.value).toLocaleDateString()} at ${this.formatTime(appointmentTime.value)}</span>
            </div>
            <div class="summary-item total">
                <span><strong>Amount Paid:</strong></span>
                <span>${price}</span>
            </div>
        `;

        confirmedDetails.innerHTML = detailsHTML;
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
        document.getElementById('appointmentForm').reset();
        this.currentStep = 1;
        this.showStep(1);

        // Clear summaries
        document.getElementById('summaryDepartment').textContent = '-';
        document.getElementById('summaryDoctor').textContent = '-';
        document.getElementById('summaryDateTime').textContent = '-';
        document.getElementById('summaryPrice').textContent = '$0';

        // Clear validation classes
        const fields = document.querySelectorAll('.form-group input, .form-group select');
        fields.forEach(field => {
            field.classList.remove('valid', 'invalid');
        });

        // Hide error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.style.display = 'none';
        });
    }

    handleContactForm() {
        const form = document.getElementById('contactForm');
        const formData = new FormData(form);

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#059669';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    }
}

// Global functions for HTML onclick events
function scrollToSection(sectionId) {
    hospitalSystem.scrollToSection(sectionId);
}

function nextStep() {
    hospitalSystem.nextStep();
}

function prevStep() {
    hospitalSystem.prevStep();
}

function updateDoctors() {
    hospitalSystem.updateDoctors();
}

function updatePrice() {
    hospitalSystem.updatePrice();
}

function updateTimeSlots() {
    hospitalSystem.updateTimeSlots();
}

function closeModal() {
    hospitalSystem.closeModal();
}

// Initialize the system when DOM is loaded
let hospitalSystem;

document.addEventListener('DOMContentLoaded', () => {
    hospitalSystem = new HospitalBookingSystem();

    // Add smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            hospitalSystem.scrollToSection(targetId);
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(30, 58, 138, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)';
            header.style.backdropFilter = 'none';
        }
    });

    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
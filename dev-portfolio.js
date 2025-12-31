// Developer Portfolio JavaScript
class DevPortfolio {
    constructor() {
        this.projects = [];
        this.typingCommands = [
            'npm install react',
            'docker build -t myapp .',
            'kubectl apply -f deployment.yaml',
            'git push origin main',
            'terraform apply',
            'npm run build',
            'docker-compose up -d',
            'aws s3 sync ./build s3://mybucket'
        ];
        this.currentCommandIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;

        this.init();
    }

    init() {
        this.createProjects();
        this.setupEventListeners();
        this.renderProjects();
        this.startTypingAnimation();
        this.setupScrollAnimations();
    }

    createProjects() {
        this.projects = [
            {
                id: 1,
                title: "E-Commerce Dashboard",
                type: "Frontend",
                description: "A comprehensive admin dashboard for managing e-commerce operations built with React and TypeScript. Features real-time analytics, inventory management, and order processing.",
                image: "🛒",
                technologies: ["React", "TypeScript", "Chart.js", "Tailwind CSS", "REST API"],
                liveUrl: "#",
                githubUrl: "#",
                featured: true
            },
            {
                id: 2,
                title: "Task Management App",
                type: "Full-Stack",
                description: "A collaborative task management application with real-time updates. Built with Vue.js frontend and Node.js backend, featuring user authentication and team collaboration.",
                image: "📋",
                technologies: ["Vue.js", "Node.js", "Socket.io", "MongoDB", "JWT"],
                liveUrl: "#",
                githubUrl: "#",
                featured: true
            },
            {
                id: 3,
                title: "Weather Forecast PWA",
                type: "Frontend",
                description: "A progressive web app providing detailed weather forecasts with offline capabilities. Responsive design with geolocation integration and push notifications.",
                image: "🌤️",
                technologies: ["JavaScript", "PWA", "Service Workers", "Weather API", "CSS Grid"],
                liveUrl: "#",
                githubUrl: "#",
                featured: false
            },
            {
                id: 4,
                title: "Dockerized Microservices",
                type: "DevOps",
                description: "A microservices architecture deployed with Docker and Kubernetes. Includes CI/CD pipeline with GitHub Actions and monitoring with Prometheus and Grafana.",
                image: "🐳",
                technologies: ["Docker", "Kubernetes", "GitHub Actions", "Prometheus", "Grafana"],
                liveUrl: "#",
                githubUrl: "#",
                featured: true
            },
            {
                id: 5,
                title: "Portfolio Website",
                type: "Frontend",
                description: "A responsive portfolio website showcasing my journey from frontend to DevOps. Built with vanilla JavaScript and modern CSS techniques.",
                image: "💼",
                technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Responsive Design"],
                liveUrl: "#",
                githubUrl: "#",
                featured: false
            },
            {
                id: 6,
                title: "Infrastructure as Code",
                type: "DevOps",
                description: "AWS infrastructure provisioning using Terraform. Includes VPC setup, EC2 instances, RDS database, and load balancers with auto-scaling groups.",
                image: "🏗️",
                technologies: ["Terraform", "AWS", "EC2", "RDS", "Load Balancer"],
                liveUrl: "#",
                githubUrl: "#",
                featured: false
            }
        ];
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.scrollToSection(target);
            });
        });

        // Contact form
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm();
        });

        // Hamburger menu
        document.querySelector('.hamburger').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Smooth scroll for hero buttons
        document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('href').substring(1);
                this.scrollToSection(target);
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
        });
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = '';

        this.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';

        card.innerHTML = `
            <div class="project-image">
                <span style="font-size: 3rem;">${project.image}</span>
            </div>
            <div class="project-content">
                <div class="project-type">${project.type}</div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.liveUrl}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                    </a>
                    <a href="${project.githubUrl}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i>
                        Code
                    </a>
                </div>
            </div>
        `;

        return card;
    }

    startTypingAnimation() {
        const typingElement = document.getElementById('typingText');
        if (!typingElement) return;

        const currentCommand = this.typingCommands[this.currentCommandIndex];

        if (!this.isDeleting) {
            // Typing
            if (this.currentCharIndex < currentCommand.length) {
                typingElement.textContent = currentCommand.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
                setTimeout(() => this.startTypingAnimation(), 100);
            } else {
                // Pause before deleting
                setTimeout(() => {
                    this.isDeleting = true;
                    this.startTypingAnimation();
                }, 2000);
            }
        } else {
            // Deleting
            if (this.currentCharIndex > 0) {
                typingElement.textContent = currentCommand.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
                setTimeout(() => this.startTypingAnimation(), 50);
            } else {
                // Move to next command
                this.isDeleting = false;
                this.currentCommandIndex = (this.currentCommandIndex + 1) % this.typingCommands.length;
                setTimeout(() => this.startTypingAnimation(), 500);
            }
        }
    }

    setupScrollAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.about-card, .skill-category, .project-card, .timeline-item, .contact-card').forEach(el => {
            observer.observe(el);
        });
    }

    handleContactForm() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !subject || !message) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // Simulate form submission
        this.showToast('Processing your message...', 'info');

        setTimeout(() => {
            // Reset form
            document.getElementById('contactForm').reset();
            this.showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        }, 2000);
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');

        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 50;

        if (scrolled) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        // Update active nav link based on scroll position
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = ['home', 'about', 'skills', 'projects', 'journey', 'contact'];
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = sectionId;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = section.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = toast.querySelector('i');

        // Set message
        toastMessage.textContent = message;

        // Set icon and color based on type
        if (type === 'success') {
            toastIcon.className = 'fas fa-check-circle';
            toast.style.background = '#4ecdc4';
        } else if (type === 'error') {
            toastIcon.className = 'fas fa-exclamation-circle';
            toast.style.background = '#ff6b6b';
        } else if (type === 'info') {
            toastIcon.className = 'fas fa-info-circle';
            toast.style.background = '#667eea';
        }

        // Show toast
        toast.classList.add('show');

        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Initialize the portfolio
const portfolio = new DevPortfolio();

// Add CSS animations
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .skill-item.expert::before { width: 90%; opacity: 0.1; }
        .skill-item.intermediate::before { width: 60%; opacity: 0.1; }
        .skill-item.beginner::before { width: 30%; opacity: 0.1; }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
// Sarah Swallow Restaurant JavaScript
class RestaurantSystem {
    constructor() {
        this.cart = [];
        this.menuItems = [
            {
                id: 1,
                name: 'Truffle Arancini',
                category: 'appetizers',
                price: 18,
                description: 'Crispy risotto balls filled with truffle and parmesan, served with saffron aioli'
            },
            {
                id: 2,
                name: 'Seared Scallops',
                category: 'appetizers',
                price: 24,
                description: 'Pan-seared scallops with cauliflower purée and crispy pancetta'
            },
            {
                id: 3,
                name: 'Burrata Caprese',
                category: 'appetizers',
                price: 16,
                description: 'Fresh burrata with heirloom tomatoes, basil oil, and aged balsamic'
            },
            {
                id: 4,
                name: 'Wagyu Beef Tenderloin',
                category: 'mains',
                price: 65,
                description: 'Premium wagyu beef with roasted vegetables and red wine reduction'
            },
            {
                id: 5,
                name: 'Chilean Sea Bass',
                category: 'mains',
                price: 42,
                description: 'Miso-glazed sea bass with jasmine rice and Asian vegetables'
            },
            {
                id: 6,
                name: 'Mushroom Wellington',
                category: 'mains',
                price: 38,
                description: 'Wild mushroom wellington with truffle sauce and seasonal vegetables'
            },
            {
                id: 7,
                name: 'Chocolate Soufflé',
                category: 'desserts',
                price: 14,
                description: 'Dark chocolate soufflé with vanilla bean ice cream and gold leaf'
            },
            {
                id: 8,
                name: 'Tarte Tatin',
                category: 'desserts',
                price: 12,
                description: 'Classic French apple tart with cinnamon ice cream and caramel sauce'
            },
            {
                id: 9,
                name: 'Crème Brûlée',
                category: 'desserts',
                price: 11,
                description: 'Vanilla bean crème brûlée with fresh berries and shortbread'
            },
            {
                id: 10,
                name: 'Château Margaux 2015',
                category: 'beverages',
                price: 180,
                description: 'Premium Bordeaux wine with notes of blackcurrant and cedar'
            },
            {
                id: 11,
                name: 'Golden Swallow',
                category: 'beverages',
                price: 16,
                description: 'Signature cocktail with premium gin, elderflower, and gold flakes'
            },
            {
                id: 12,
                name: 'Ethiopian Single Origin',
                category: 'beverages',
                price: 8,
                description: 'Premium coffee beans with notes of chocolate and citrus'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupMenuFilters();
        this.loadCartFromStorage();
        this.updateCartUI();
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

        // Cart sidebar
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('open');
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
            });
        }

        // Close cart on backdrop click
        if (cartSidebar) {
            cartSidebar.addEventListener('click', (e) => {
                if (e.target === cartSidebar) {
                    cartSidebar.classList.remove('open');
                }
            });
        }

        // Reservation form
        const reservationForm = document.getElementById('reservationForm');
        if (reservationForm) {
            reservationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleReservation();
            });
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletter();
            });
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

    setupMenuFilters() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const category = btn.dataset.category;
                this.filterMenu(category);
            });
        });
    }

    setMinDate() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = tomorrow.toISOString().split('T')[0];
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

    filterMenu(category) {
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }

    addToCart(itemId) {
        const menuItem = this.menuItems.find(item => item.id === itemId);
        if (!menuItem) return;

        const existingItem = this.cart.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...menuItem,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartUI();
        this.showAddToCartAnimation(itemId);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        this.updateCartUI();
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        // Update cart count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update cart items
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-utensils"></i>
                        <p>Your order is empty</p>
                    </div>
                `;
            } else {
                const cartHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-category">${item.category}</p>
                            <div class="cart-item-controls">
                                <button onclick="restaurantSystem.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="restaurantSystem.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="cart-item-price">
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            <button onclick="restaurantSystem.removeFromCart(${item.id})" class="remove-item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');

                cartItems.innerHTML = cartHTML;
            }
        }

        // Update cart total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2);
        }
    }

    showAddToCartAnimation(itemId) {
        // Find the add to cart button that was clicked
        const buttons = document.querySelectorAll('.add-to-cart-btn');
        const targetButton = Array.from(buttons).find(btn =>
            btn.getAttribute('onclick').includes(itemId)
        );

        if (targetButton) {
            const originalHTML = targetButton.innerHTML;
            targetButton.innerHTML = '<i class="fas fa-check"></i>';
            targetButton.style.background = '#10b981';
            targetButton.disabled = true;

            setTimeout(() => {
                targetButton.innerHTML = originalHTML;
                targetButton.style.background = '';
                targetButton.disabled = false;
            }, 1500);
        }

        // Show cart count animation
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 600);
        }
    }

    saveCartToStorage() {
        localStorage.setItem('sarahSwallowCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('sarahSwallowCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    handleReservation() {
        const form = document.getElementById('reservationForm');
        const formData = new FormData(form);

        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'guests', 'date', 'time'];
        let isValid = true;

        requiredFields.forEach(field => {
            const value = formData.get(field);
            if (!value || value.trim() === '') {
                isValid = false;
                const input = document.getElementById(field);
                if (input) {
                    input.style.borderColor = '#ff4444';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 3000);
                }
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }

        // Simulate reservation processing
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.showReservationSuccess(formData);
            form.reset();
        }, 2000);
    }

    showReservationSuccess(formData) {
        const modal = document.getElementById('successModal');
        const reservationDetails = document.getElementById('reservationDetails');

        // Format the date
        const date = new Date(formData.get('date'));
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Format the time
        const time = formData.get('time');
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        const formattedTime = `${displayHour}:${minutes} ${ampm}`;

        const detailsHTML = `
            <div class="reservation-summary">
                <h4>Reservation Details</h4>
                <div class="detail-item">
                    <span><strong>Name:</strong></span>
                    <span>${formData.get('name')}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Email:</strong></span>
                    <span>${formData.get('email')}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Phone:</strong></span>
                    <span>${formData.get('phone')}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Guests:</strong></span>
                    <span>${formData.get('guests')} ${parseInt(formData.get('guests')) === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Date:</strong></span>
                    <span>${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Time:</strong></span>
                    <span>${formattedTime}</span>
                </div>
                ${formData.get('occasion') ? `
                <div class="detail-item">
                    <span><strong>Occasion:</strong></span>
                    <span>${formData.get('occasion')}</span>
                </div>
                ` : ''}
            </div>
        `;

        reservationDetails.innerHTML = detailsHTML;
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('show');
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
            submitBtn.style.background = '#10b981';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    }

    handleNewsletter() {
        const form = document.querySelector('.newsletter-form');
        const input = form.querySelector('input');
        const button = form.querySelector('button');

        if (!input.value.trim()) {
            input.style.borderColor = '#ff4444';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 3000);
            return;
        }

        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = '#10b981';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
                button.style.background = '';
                input.value = '';
            }, 2000);
        }, 1000);
    }
}

// Global functions for HTML onclick events
function scrollToSection(sectionId) {
    restaurantSystem.scrollToSection(sectionId);
}

function addToCart(itemId) {
    restaurantSystem.addToCart(itemId);
}

function closeModal() {
    restaurantSystem.closeModal();
}

// Initialize the restaurant system when DOM is loaded
let restaurantSystem;

document.addEventListener('DOMContentLoaded', () => {
    restaurantSystem = new RestaurantSystem();

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 25px rgba(255, 215, 0, 0.4)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.boxShadow = '0 2px 20px rgba(255, 215, 0, 0.3)';
        }
    });

    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.menu-item, .stat, .contact-item, .info-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0, -8px, 0);
        }
        70% {
            transform: translate3d(0, -4px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        background: rgba(255, 215, 0, 0.05);
        border-radius: 10px;
        margin-bottom: 1rem;
        backdrop-filter: blur(5px);
    }
    
    .cart-item-info h4 {
        color: #ffd700;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        font-family: 'Georgia', serif;
    }
    
    .cart-item-category {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        margin-bottom: 0.75rem;
        text-transform: capitalize;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .cart-item-controls button {
        width: 30px;
        height: 30px;
        border: 2px solid #ffd700;
        background: transparent;
        color: #ffd700;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .cart-item-controls button:hover {
        background: #ffd700;
        color: #000;
    }
    
    .cart-item-controls span {
        color: #ffd700;
        font-weight: 600;
        font-size: 1.1rem;
        min-width: 20px;
        text-align: center;
    }
    
    .cart-item-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.75rem;
    }
    
    .cart-item-price span {
        font-weight: 700;
        color: #ffd700;
        font-size: 1.2rem;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .remove-item {
        background: rgba(255, 68, 68, 0.2);
        border: 1px solid #ff4444;
        color: #ff4444;
        padding: 6px 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .remove-item:hover {
        background: #ff4444;
        color: white;
    }
    
    .reservation-summary {
        color: rgba(255, 255, 255, 0.9);
    }
    
    .reservation-summary h4 {
        color: #ffd700;
        margin-bottom: 1rem;
        font-size: 1.3rem;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid rgba(255, 215, 0, 0.1);
    }
    
    .detail-item:last-child {
        border-bottom: none;
    }
    
    .detail-item span:first-child {
        color: rgba(255, 255, 255, 0.7);
    }
    
    .detail-item span:last-child {
        color: #ffd700;
        font-weight: 500;
    }
`;
document.head.appendChild(style);
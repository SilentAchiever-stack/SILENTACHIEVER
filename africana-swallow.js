// Africana Swallow Restaurant JavaScript
class AfricanaSwallow {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('africana-cart')) || [];
        this.menuItems = [];

        this.init();
    }

    init() {
        this.createMenuItems();
        this.setupEventListeners();
        this.renderMenu();
        this.updateCartUI();
        this.setupSmoothScrolling();
    }

    createMenuItems() {
        this.menuItems = [
            // Rice Dishes
            {
                id: 1,
                name: "Jollof Rice",
                category: "rice",
                price: 2500,
                description: "The crown jewel of West African cuisine. Perfectly seasoned rice cooked in rich tomato sauce with aromatic spices.",
                image: "🍛",
                popular: true
            },
            {
                id: 2,
                name: "Fried Rice",
                category: "rice",
                price: 2800,
                description: "Colorful mixed rice with vegetables, chicken, and prawns. A delightful fusion of flavors and textures.",
                image: "🍚",
                popular: false
            },
            {
                id: 3,
                name: "Coconut Rice",
                category: "rice",
                price: 2200,
                description: "Fragrant rice cooked in rich coconut milk with subtle spices. A creamy and aromatic delight.",
                image: "🥥",
                popular: false
            },
            {
                id: 4,
                name: "Ofada Rice",
                category: "rice",
                price: 3000,
                description: "Local Nigerian rice served with spicy ofada sauce. An authentic taste of tradition.",
                image: "🍚",
                popular: false
            },

            // Swallow
            {
                id: 5,
                name: "Pounded Yam",
                category: "swallow",
                price: 1800,
                description: "Smooth, stretchy perfection made from fresh yam. The ultimate comfort food served with your choice of soup.",
                image: "🥘",
                popular: true
            },
            {
                id: 6,
                name: "Amala",
                category: "swallow",
                price: 1500,
                description: "Traditional Yoruba delicacy made from yam flour. Dark, smooth, and incredibly satisfying.",
                image: "🍲",
                popular: true
            },
            {
                id: 7,
                name: "Eba (Garri)",
                category: "swallow",
                price: 1200,
                description: "Classic Nigerian staple made from cassava flour. Simple, filling, and perfect with any soup.",
                image: "🥣",
                popular: false
            },
            {
                id: 8,
                name: "Fufu",
                category: "swallow",
                price: 1600,
                description: "Soft and stretchy made from cassava and plantain. A beloved West African staple.",
                image: "🍽️",
                popular: false
            },
            {
                id: 9,
                name: "Wheat",
                category: "swallow",
                price: 1400,
                description: "Light and fluffy swallow made from wheat flour. A healthier alternative that's equally delicious.",
                image: "🌾",
                popular: false
            },

            // Soups
            {
                id: 10,
                name: "Egusi Soup",
                category: "soup",
                price: 3500,
                description: "Rich melon seed soup with assorted meat, fish, and vegetables. A Nigerian classic that's hearty and flavorful.",
                image: "🍲",
                popular: true
            },
            {
                id: 11,
                name: "Ewedu Soup",
                category: "soup",
                price: 2800,
                description: "Smooth jute leaf soup traditionally served with amala. Light, nutritious, and incredibly tasty.",
                image: "🥬",
                popular: true
            },
            {
                id: 12,
                name: "Okra Soup",
                category: "soup",
                price: 3200,
                description: "Thick, hearty soup made with fresh okra, assorted meat, and seafood. Comfort in a bowl.",
                image: "🥒",
                popular: false
            },
            {
                id: 13,
                name: "Bitter Leaf Soup",
                category: "soup",
                price: 3800,
                description: "Traditional soup made with bitter leaf vegetables, palm nut, and assorted protein. Rich and medicinal.",
                image: "🌿",
                popular: false
            },
            {
                id: 14,
                name: "Pepper Soup",
                category: "soup",
                price: 4000,
                description: "Spicy, aromatic soup with goat meat or fish. Perfect for cold days and special occasions.",
                image: "🌶️",
                popular: false
            },
            {
                id: 15,
                name: "Vegetable Soup",
                category: "soup",
                price: 3000,
                description: "Nutritious soup packed with fresh vegetables, palm oil, and your choice of protein.",
                image: "🥗",
                popular: false
            },

            // Sides
            {
                id: 16,
                name: "Plantain (Dodo)",
                category: "sides",
                price: 800,
                description: "Sweet fried plantain slices. The perfect side dish that complements any meal.",
                image: "🍌",
                popular: true
            },
            {
                id: 17,
                name: "Moi Moi",
                category: "sides",
                price: 1200,
                description: "Steamed bean pudding with eggs, fish, and spices. A protein-rich delicacy wrapped in leaves.",
                image: "🫘",
                popular: false
            },
            {
                id: 18,
                name: "Akara",
                category: "sides",
                price: 600,
                description: "Deep-fried bean cakes that are crispy outside and soft inside. Perfect breakfast or snack.",
                image: "🟤",
                popular: false
            },
            {
                id: 19,
                name: "Yam Porridge",
                category: "sides",
                price: 2000,
                description: "Hearty yam cooked with vegetables, palm oil, and spices. A complete meal in itself.",
                image: "🍠",
                popular: false
            },
            {
                id: 20,
                name: "Beans Porridge",
                category: "sides",
                price: 1800,
                description: "Nutritious beans cooked with plantain, palm oil, and aromatic spices.",
                image: "🫘",
                popular: false
            }
        ];
    }

    setupEventListeners() {
        // Cart functionality
        document.getElementById('cartBtn').addEventListener('click', () => this.toggleCart());
        document.getElementById('closeCart').addEventListener('click', () => this.toggleCart());
        document.getElementById('clearCart').addEventListener('click', () => this.clearCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());

        // Menu category filtering
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterMenu(e.target.dataset.category);
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.scrollToSection(target);
                this.setActiveNavLink(link);
            });
        });

        // Reservation form
        document.getElementById('reservationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReservation();
        });

        // Mobile menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleMobileMenu());

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    renderMenu(items = this.menuItems) {
        const menuGrid = document.getElementById('menuGrid');
        menuGrid.innerHTML = '';

        items.forEach(item => {
            const menuCard = this.createMenuCard(item);
            menuGrid.appendChild(menuCard);
        });
    }

    createMenuCard(item) {
        const card = document.createElement('div');
        card.className = 'menu-item';
        card.innerHTML = `
            <div class="menu-item-image">
                <span style="font-size: 4rem;">${item.image}</span>
                ${item.popular ? '<div class="popular-badge">Popular</div>' : ''}
            </div>
            <div class="menu-item-info">
                <div class="menu-item-category">${item.category}</div>
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-description">${item.description}</div>
                <div class="menu-item-footer">
                    <div class="menu-item-price">₦${item.price.toLocaleString()}</div>
                    <button class="add-to-cart" onclick="restaurant.addToCart(${item.id})">
                        <i class="fas fa-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    filterMenu(category) {
        if (category === 'all') {
            this.renderMenu();
        } else {
            const filteredItems = this.menuItems.filter(item => item.category === category);
            this.renderMenu(filteredItems);
        }
    }

    addToCart(itemId) {
        const item = this.menuItems.find(i => i.id === itemId);
        if (!item) return;

        const existingItem = this.cart.find(cartItem => cartItem.id === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast(`${item.name} added to cart!`);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(item => item.id === itemId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeFromCart(itemId);
        } else {
            this.saveCart();
            this.updateCartUI();
            this.renderCartItems();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
        this.showToast('Cart cleared!');
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        const cartTotal = document.getElementById('cartTotal');
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toLocaleString();
    }

    toggleCart() {
        const cartModal = document.getElementById('cartModal');
        cartModal.classList.toggle('show');

        if (cartModal.classList.contains('show')) {
            this.renderCartItems();
        }
    }

    renderCartItems() {
        const cartItems = document.getElementById('cartItems');

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; color: #ccc;"></i>
                    <p>Your cart is empty</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Add some delicious African dishes!</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = '';

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <span style="font-size: 1.5rem;">${item.image}</span>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="restaurant.updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span style="margin: 0 0.5rem; font-weight: 600;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="restaurant.updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="quantity-btn" onclick="restaurant.removeFromCart(${item.id})" style="color: #ff6b35;">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty!');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        // Simulate order processing
        this.showToast('Processing your order...');

        setTimeout(() => {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.toggleCart();
            this.showToast(`Order placed successfully! Total: ₦${total.toLocaleString()} for ${itemCount} items. We'll call you soon!`);
        }, 2000);
    }

    handleReservation() {
        const formData = new FormData(document.getElementById('reservationForm'));
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;

        if (!name || !email || !phone || !date || !time || !guests) {
            this.showToast('Please fill in all fields');
            return;
        }

        // Simulate reservation processing
        this.showToast('Processing your reservation...');

        setTimeout(() => {
            document.getElementById('reservationForm').reset();
            this.showToast(`Reservation confirmed for ${name} on ${date} at ${time} for ${guests} guests. We'll call you to confirm!`);
        }, 1500);
    }

    saveCart() {
        localStorage.setItem('africana-cart', JSON.stringify(this.cart));
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupSmoothScrolling() {
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            const sections = ['home', 'featured', 'menu', 'about', 'contact'];
            const headerHeight = document.querySelector('.header').offsetHeight;

            let currentSection = '';

            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop - headerHeight - 100;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                        currentSection = sectionId;
                    }
                }
            });

            if (currentSection) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSection}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    toggleMobileMenu() {
        // Mobile menu functionality can be expanded here
        this.showToast('Mobile menu - Feature coming soon!');
    }
}

// Global functions for onclick handlers
function scrollToSection(sectionId) {
    restaurant.scrollToSection(sectionId);
}

// Initialize the restaurant
const restaurant = new AfricanaSwallow();

// Add some demo functionality
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date for reservations to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Add popular badge styles
    const style = document.createElement('style');
    style.textContent = `
        .popular-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ffd700;
            color: #2c5530;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .menu-item-image {
            position: relative;
        }
    `;
    document.head.appendChild(style);
});
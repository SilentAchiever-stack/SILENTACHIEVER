// Trendverse E-commerce JavaScript
class TrendverseStore {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('trendverse-cart')) || [];
        this.filteredProducts = [];

        this.init();
    }

    init() {
        this.createSampleProducts();
        this.setupEventListeners();
        this.renderProducts();
        this.updateCartUI();
        this.setupSmoothScrolling();
    }

    createSampleProducts() {
        this.products = [
            {
                id: 1,
                name: "Premium Cotton T-Shirt",
                category: "clothing",
                price: 29.99,
                description: "Comfortable and stylish cotton t-shirt perfect for everyday wear.",
                image: "👕",
                badge: "New",
                rating: 4.5
            },
            {
                id: 2,
                name: "Wireless Bluetooth Headphones",
                category: "electronics",
                price: 89.99,
                description: "High-quality wireless headphones with noise cancellation.",
                image: "🎧",
                badge: "Popular",
                rating: 4.8
            },
            {
                id: 3,
                name: "Designer Sunglasses",
                category: "accessories",
                price: 149.99,
                description: "Stylish sunglasses with UV protection and premium frames.",
                image: "🕶️",
                badge: "Sale",
                rating: 4.3
            },
            {
                id: 4,
                name: "Running Sneakers",
                category: "shoes",
                price: 119.99,
                description: "Comfortable running shoes with advanced cushioning technology.",
                image: "👟",
                badge: "New",
                rating: 4.6
            },
            {
                id: 5,
                name: "Leather Jacket",
                category: "clothing",
                price: 199.99,
                description: "Premium leather jacket with modern design and perfect fit.",
                image: "🧥",
                badge: "Premium",
                rating: 4.7
            },
            {
                id: 6,
                name: "Smart Watch",
                category: "electronics",
                price: 299.99,
                description: "Advanced smartwatch with fitness tracking and notifications.",
                image: "⌚",
                badge: "Hot",
                rating: 4.4
            },
            {
                id: 7,
                name: "Gold Chain Necklace",
                category: "accessories",
                price: 79.99,
                description: "Elegant gold-plated chain necklace for special occasions.",
                image: "📿",
                badge: "Luxury",
                rating: 4.2
            },
            {
                id: 8,
                name: "Canvas Sneakers",
                category: "shoes",
                price: 69.99,
                description: "Classic canvas sneakers with vintage style and comfort.",
                image: "👟",
                badge: "Classic",
                rating: 4.1
            },
            {
                id: 9,
                name: "Denim Jeans",
                category: "clothing",
                price: 89.99,
                description: "High-quality denim jeans with perfect fit and durability.",
                image: "👖",
                badge: "Bestseller",
                rating: 4.5
            },
            {
                id: 10,
                name: "Wireless Mouse",
                category: "electronics",
                price: 39.99,
                description: "Ergonomic wireless mouse with precision tracking.",
                image: "🖱️",
                badge: "Tech",
                rating: 4.3
            },
            {
                id: 11,
                name: "Designer Handbag",
                category: "accessories",
                price: 159.99,
                description: "Stylish handbag with premium materials and elegant design.",
                image: "👜",
                badge: "Designer",
                rating: 4.6
            },
            {
                id: 12,
                name: "Hiking Boots",
                category: "shoes",
                price: 139.99,
                description: "Durable hiking boots with waterproof protection.",
                image: "🥾",
                badge: "Outdoor",
                rating: 4.4
            }
        ];

        this.filteredProducts = [...this.products];
    }

    setupEventListeners() {
        // Cart functionality
        document.getElementById('cartBtn').addEventListener('click', () => this.toggleCart());
        document.getElementById('closeCart').addEventListener('click', () => this.toggleCart());
        document.getElementById('clearCart').addEventListener('click', () => this.clearCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.searchProducts());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchProducts();
        });

        // Filter functionality
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterProducts());
        document.getElementById('sortFilter').addEventListener('change', () => this.sortProducts());

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                document.getElementById('categoryFilter').value = category;
                this.filterProducts();
                this.scrollToSection('products');
            });
        });

        // Mobile menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleMobileMenu());

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.scrollToSection(target);
                this.setActiveNavLink(link);
            });
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        this.filteredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <span style="font-size: 4rem;">${product.image}</span>
                <div class="product-badge">${product.badge}</div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">$${product.price}</div>
                    <button class="add-to-cart" onclick="store.addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                this.showProductDetail(product);
            }
        });

        return card;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeFromCart(productId);
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
        cartTotal.textContent = total.toFixed(2);
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
                <div style="text-align: center; padding: 2rem; color: #7f8c8d;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Your cart is empty</p>
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
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="store.updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span style="margin: 0 0.5rem; font-weight: 600;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="store.updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="quantity-btn" onclick="store.removeFromCart(${item.id})" style="color: #e74c3c;">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    showProductDetail(product) {
        const productModal = document.getElementById('productModal');
        const content = productModal.querySelector('.product-detail-content');

        content.innerHTML = `
            <div style="display: flex; gap: 2rem; align-items: center; padding: 2rem;">
                <div style="font-size: 8rem; background: #f8f9fa; padding: 2rem; border-radius: 15px;">
                    ${product.image}
                </div>
                <div style="flex: 1;">
                    <div style="color: #7f8c8d; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 0.5rem;">
                        ${product.category}
                    </div>
                    <h2 style="color: #2c3e50; margin-bottom: 1rem;">${product.name}</h2>
                    <p style="color: #7f8c8d; margin-bottom: 1.5rem; line-height: 1.6;">
                        ${product.description}
                    </p>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                        <span style="font-size: 2rem; font-weight: bold; color: #e74c3c;">$${product.price}</span>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            <span style="color: #7f8c8d; margin-left: 0.5rem;">(${product.rating})</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="store.addToCart(${product.id}); store.closeModals();" style="width: 100%; padding: 1rem;">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        productModal.classList.add('show');
    }

    searchProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

        if (searchTerm === '') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        this.renderProducts();
        this.scrollToSection('products');
    }

    filterProducts() {
        const category = document.getElementById('categoryFilter').value;

        if (category === 'all') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => product.category === category);
        }

        this.renderProducts();
    }

    sortProducts() {
        const sortBy = document.getElementById('sortFilter').value;

        switch (sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                this.filteredProducts = [...this.products];
        }

        this.renderProducts();
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty!');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        // Simulate checkout process
        this.showToast('Processing your order...');

        setTimeout(() => {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.toggleCart();
            this.showToast(`Order placed successfully! Total: $${total.toFixed(2)} for ${itemCount} items.`);
        }, 2000);
    }

    saveCart() {
        localStorage.setItem('trendverse-cart', JSON.stringify(this.cart));
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
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
            const sections = ['home', 'categories', 'products'];
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
    store.scrollToSection(sectionId);
}

// Initialize the store
const store = new TrendverseStore();

// Add some demo functionality
document.addEventListener('DOMContentLoaded', () => {
    // Newsletter subscription
    const newsletterBtn = document.querySelector('.newsletter button');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            const email = document.querySelector('.newsletter input').value;
            if (email) {
                store.showToast('Thank you for subscribing!');
                document.querySelector('.newsletter input').value = '';
            } else {
                store.showToast('Please enter your email address.');
            }
        });
    }

    // Close product modal
    document.getElementById('closeProduct').addEventListener('click', () => {
        store.closeModals();
    });
});
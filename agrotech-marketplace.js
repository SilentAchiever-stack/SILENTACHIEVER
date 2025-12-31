// AgroTech Marketplace JavaScript
class AgroTechMarketplace {
    constructor() {
        this.cart = [];
        this.products = [
            {
                id: 1,
                name: 'Organic Tomatoes',
                category: 'vegetables',
                price: 4.99,
                unit: 'per kg',
                farmer: 'John Farm',
                description: 'Fresh organic tomatoes grown without pesticides',
                badges: ['organic', 'fresh'],
                image: 'fas fa-apple-alt'
            },
            {
                id: 2,
                name: 'Free-Range Eggs',
                category: 'dairy',
                price: 6.50,
                unit: 'per dozen',
                farmer: 'Mary\'s Farm',
                description: 'Farm-fresh eggs from free-range chickens',
                badges: ['fresh', 'local'],
                image: 'fas fa-egg'
            },
            {
                id: 3,
                name: 'Fresh Milk',
                category: 'dairy',
                price: 3.25,
                unit: 'per liter',
                farmer: 'Green Valley',
                description: 'Pure fresh milk from grass-fed cows',
                badges: ['fresh', 'organic'],
                image: 'fas fa-glass-whiskey'
            },
            {
                id: 4,
                name: 'Organic Carrots',
                category: 'vegetables',
                price: 2.99,
                unit: 'per kg',
                farmer: 'Sunny Acres',
                description: 'Sweet organic carrots perfect for cooking',
                badges: ['organic'],
                image: 'fas fa-carrot'
            },
            {
                id: 5,
                name: 'Fresh Apples',
                category: 'fruits',
                price: 5.99,
                unit: 'per kg',
                farmer: 'Orchard Hills',
                description: 'Crisp and juicy apples straight from the orchard',
                badges: ['fresh', 'local'],
                image: 'fas fa-apple-alt'
            },
            {
                id: 6,
                name: 'Organic Spinach',
                category: 'vegetables',
                price: 3.75,
                unit: 'per bunch',
                farmer: 'Green Leaf Farm',
                description: 'Nutrient-rich organic spinach leaves',
                badges: ['organic', 'fresh'],
                image: 'fas fa-leaf'
            },
            {
                id: 7,
                name: 'Farm Honey',
                category: 'pantry',
                price: 12.99,
                unit: 'per jar',
                farmer: 'Bee Happy Farm',
                description: 'Pure raw honey from local beehives',
                badges: ['organic', 'local'],
                image: 'fas fa-honey-pot'
            },
            {
                id: 8,
                name: 'Fresh Strawberries',
                category: 'fruits',
                price: 7.50,
                unit: 'per basket',
                farmer: 'Berry Fields',
                description: 'Sweet and juicy strawberries picked fresh',
                badges: ['fresh'],
                image: 'fas fa-strawberry'
            },
            {
                id: 9,
                name: 'Organic Potatoes',
                category: 'vegetables',
                price: 2.50,
                unit: 'per kg',
                farmer: 'Earth Harvest',
                description: 'Versatile organic potatoes for all your cooking needs',
                badges: ['organic'],
                image: 'fas fa-seedling'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupFilters();
        this.loadCartFromStorage();
        this.updateCartUI();
        this.renderProducts();
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

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                this.filterProducts(filter);
            });
        });
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

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const productsHTML = this.products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <i class="${product.image}"></i>
                    <div class="product-badges">
                        ${product.badges.map(badge => `<span class="badge ${badge}">${badge}</span>`).join('')}
                    </div>
                    <div class="farmer-info">
                        <i class="fas fa-user-tie"></i> ${product.farmer}
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        <span class="unit">${product.unit}</span>
                    </div>
                    <button class="btn btn-primary add-to-cart" onclick="agroMarketplace.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        productsGrid.innerHTML = productsHTML;
    }

    filterProducts(category) {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
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

        this.saveCartToStorage();
        this.updateCartUI();
        this.showAddToCartAnimation(productId);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartUI();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
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
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <p>Add some fresh products from our farmers!</p>
                    </div>
                `;
            } else {
                const cartHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-farmer">by ${item.farmer}</p>
                            <p class="cart-item-price">$${item.price} ${item.unit}</p>
                            <div class="cart-item-controls">
                                <button onclick="agroMarketplace.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="agroMarketplace.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="cart-item-actions">
                            <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                            <button onclick="agroMarketplace.removeFromCart(${item.id})" class="remove-item">
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

    showAddToCartAnimation(productId) {
        // Find the add to cart button that was clicked
        const buttons = document.querySelectorAll('.add-to-cart');
        const targetButton = Array.from(buttons).find(btn =>
            btn.getAttribute('onclick').includes(productId)
        );

        if (targetButton) {
            const originalText = targetButton.innerHTML;
            targetButton.innerHTML = '<i class="fas fa-check"></i> Added!';
            targetButton.style.background = '#10b981';
            targetButton.disabled = true;

            setTimeout(() => {
                targetButton.innerHTML = originalText;
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
        localStorage.setItem('agroTechCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('agroTechCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    handleNewsletter() {
        const form = document.querySelector('.newsletter-form');
        const input = form.querySelector('input');
        const button = form.querySelector('button');

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

    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        alert(`Thank you for your order!\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nYour fresh products will be delivered soon!`);

        // Clear cart
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartUI();

        // Close cart sidebar
        document.getElementById('cartSidebar').classList.remove('open');
    }
}

// Global functions for HTML onclick events
function scrollToSection(sectionId) {
    agroMarketplace.scrollToSection(sectionId);
}

function exploreCategory(category) {
    agroMarketplace.scrollToSection('products');

    // Wait for scroll to complete, then filter
    setTimeout(() => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });
        agroMarketplace.filterProducts(category);
    }, 500);
}

// Initialize the marketplace when DOM is loaded
let agroMarketplace;

document.addEventListener('DOMContentLoaded', () => {
    agroMarketplace = new AgroTechMarketplace();

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        }
    });

    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';

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
    const animateElements = document.querySelectorAll('.category-card, .product-card, .feature');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Add checkout functionality
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            agroMarketplace.checkout();
        });
    }
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
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid rgba(236, 72, 153, 0.1);
        background: rgba(252, 231, 243, 0.3);
        border-radius: 10px;
        margin-bottom: 0.5rem;
    }
    
    .cart-item-info h4 {
        color: #1a1a1a;
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }
    
    .cart-item-farmer {
        color: #ec4899;
        font-size: 0.8rem;
        margin-bottom: 0.25rem;
        font-weight: 500;
    }
    
    .cart-item-price {
        color: #4a5568;
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .cart-item-controls button {
        width: 25px;
        height: 25px;
        border: 1px solid #ec4899;
        background: white;
        color: #ec4899;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    }
    
    .cart-item-controls button:hover {
        background: #ec4899;
        color: white;
    }
    
    .cart-item-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
    }
    
    .item-total {
        font-weight: 600;
        color: #1a1a1a;
        font-size: 1.1rem;
    }
    
    .remove-item {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 5px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .remove-item:hover {
        background: #ef4444;
        color: white;
    }
`;
document.head.appendChild(style);
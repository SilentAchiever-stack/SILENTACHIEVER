// ADE'S Collection Cosmetics JavaScript
class CosmeticsStore {
    constructor() {
        this.cart = [];
        this.wishlist = [];
        this.products = [
            {
                id: 1,
                name: 'Hydrating Serum',
                category: 'skincare',
                price: 45.99,
                originalPrice: 59.99,
                rating: 5,
                reviews: 127,
                badge: 'new',
                image: 'fas fa-tint'
            },
            {
                id: 2,
                name: 'Vitamin C Cream',
                category: 'skincare',
                price: 38.50,
                rating: 5,
                reviews: 89,
                image: 'fas fa-sun'
            },
            {
                id: 3,
                name: 'Gentle Cleanser',
                category: 'skincare',
                price: 28.99,
                rating: 5,
                reviews: 203,
                badge: 'bestseller',
                image: 'fas fa-seedling'
            },
            {
                id: 4,
                name: 'Matte Lipstick Set',
                category: 'makeup',
                price: 52.00,
                originalPrice: 68.00,
                rating: 5,
                reviews: 156,
                badge: 'limited',
                image: 'fas fa-paint-brush'
            },
            {
                id: 5,
                name: 'Eyeshadow Palette',
                category: 'makeup',
                price: 42.75,
                rating: 5,
                reviews: 94,
                image: 'fas fa-eye'
            },
            {
                id: 6,
                name: 'Foundation Stick',
                category: 'makeup',
                price: 35.99,
                rating: 5,
                reviews: 78,
                badge: 'new',
                image: 'fas fa-magic'
            },
            {
                id: 7,
                name: 'Midnight Essence',
                category: 'perfumes',
                price: 89.99,
                originalPrice: 110.00,
                rating: 5,
                reviews: 245,
                badge: 'bestseller',
                image: 'fas fa-spray-can'
            },
            {
                id: 8,
                name: 'Floral Dreams',
                category: 'perfumes',
                price: 75.50,
                rating: 5,
                reviews: 167,
                image: 'fas fa-flower'
            },
            {
                id: 9,
                name: 'Diamond Luxe',
                category: 'perfumes',
                price: 125.00,
                rating: 5,
                reviews: 98,
                badge: 'premium',
                image: 'fas fa-gem'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupFilters();
        this.setupSearch();
        this.loadCartFromStorage();
        this.updateCartUI();
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

        // Search modal
        const searchBtn = document.getElementById('searchBtn');
        const searchModal = document.getElementById('searchModal');
        const closeSearch = document.getElementById('closeSearch');
        const searchInput = document.getElementById('searchInput');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                searchModal.classList.add('open');
                searchInput.focus();
            });
        }

        if (closeSearch) {
            closeSearch.addEventListener('click', () => {
                searchModal.classList.remove('open');
            });
        }

        // Close modals on backdrop click
        if (searchModal) {
            searchModal.addEventListener('click', (e) => {
                if (e.target === searchModal) {
                    searchModal.classList.remove('open');
                }
            });
        }

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
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

    setupSearch() {
        // Escape key to close search
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const searchModal = document.getElementById('searchModal');
                if (searchModal.classList.contains('open')) {
                    searchModal.classList.remove('open');
                }
            }
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

    performSearch(query) {
        const searchResults = document.getElementById('searchResults');

        if (!query.trim()) {
            searchResults.innerHTML = '<p>Start typing to search products...</p>';
            return;
        }

        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            searchResults.innerHTML = '<p>No products found matching your search.</p>';
            return;
        }

        const resultsHTML = filteredProducts.map(product => `
            <div class="search-result-item" onclick="cosmeticsStore.scrollToProduct(${product.id})">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${product.category}</p>
                    <span class="price">$${product.price}</span>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;
    }

    scrollToProduct(productId) {
        // Close search modal
        document.getElementById('searchModal').classList.remove('open');

        // Scroll to products section
        this.scrollToSection('products');

        // Highlight the product (optional enhancement)
        setTimeout(() => {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });

            // Find and highlight the specific product
            const targetProduct = Array.from(productCards).find(card => {
                const addToCartBtn = card.querySelector('.add-to-cart');
                return addToCartBtn && addToCartBtn.getAttribute('onclick').includes(productId);
            });

            if (targetProduct) {
                targetProduct.style.transform = 'scale(1.05)';
                targetProduct.style.boxShadow = '0 20px 40px rgba(5, 150, 105, 0.3)';

                setTimeout(() => {
                    targetProduct.style.transform = 'scale(1)';
                    targetProduct.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }, 2000);
            }
        }, 500);
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
                        <i class="fas fa-shopping-bag"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                const cartHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-category">${item.category}</p>
                            <div class="cart-item-controls">
                                <button onclick="cosmeticsStore.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="cosmeticsStore.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="cart-item-price">
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            <button onclick="cosmeticsStore.removeFromCart(${item.id})" class="remove-item">
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

    addToWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.wishlist.find(item => item.id === productId);

        if (existingItem) {
            // Remove from wishlist
            this.wishlist = this.wishlist.filter(item => item.id !== productId);
        } else {
            // Add to wishlist
            this.wishlist.push(product);
        }

        this.updateWishlistUI(productId);
    }

    updateWishlistUI(productId) {
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            if (btn.getAttribute('onclick').includes(`addToWishlist(${productId})`)) {
                const isInWishlist = this.wishlist.some(item => item.id === productId);
                const icon = btn.querySelector('i');

                if (isInWishlist) {
                    icon.style.color = '#ef4444';
                    btn.style.background = '#fef2f2';
                } else {
                    icon.style.color = '';
                    btn.style.background = '';
                }
            }
        });
    }

    quickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Create and show quick view modal (simplified version)
        alert(`Quick View: ${product.name}\nCategory: ${product.category}\nPrice: $${product.price}\nRating: ${product.rating}/5 stars (${product.reviews} reviews)`);
    }

    saveCartToStorage() {
        localStorage.setItem('adesCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('adesCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
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
    cosmeticsStore.scrollToSection(sectionId);
}

function filterProducts(category) {
    cosmeticsStore.filterProducts(category);
}

function addToCart(productId) {
    cosmeticsStore.addToCart(productId);
}

function addToWishlist(productId) {
    cosmeticsStore.addToWishlist(productId);
}

function quickView(productId) {
    cosmeticsStore.quickView(productId);
}

// Initialize the store when DOM is loaded
let cosmeticsStore;

document.addEventListener('DOMContentLoaded', () => {
    cosmeticsStore = new CosmeticsStore();

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
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
    const animateElements = document.querySelectorAll('.collection-card, .product-card, .feature, .stat');
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
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        background: #fafafa;
        border-radius: 10px;
        margin-bottom: 0.5rem;
    }
    
    .cart-item-info h4 {
        color: #1f2937;
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }
    
    .cart-item-category {
        color: #6b7280;
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
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    }
    
    .cart-item-controls button:hover {
        background: #059669;
        color: white;
        border-color: #059669;
    }
    
    .cart-item-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
    }
    
    .cart-item-price span {
        font-weight: 600;
        color: #059669;
    }
    
    .remove-item {
        background: #fef2f2;
        border: 1px solid #fecaca;
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
    
    .search-result-item {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .search-result-item:hover {
        background: #f9fafb;
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-info h4 {
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .search-result-info p {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
        text-transform: capitalize;
    }
    
    .search-result-info .price {
        color: #059669;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
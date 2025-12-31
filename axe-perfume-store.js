// AXE Perfume Store JavaScript
class AxePerfumeStore {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('axeCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('axeWishlist')) || [];
        this.products = {
            1: {
                id: 1,
                name: 'AXE Dark Temptation',
                category: 'men',
                price: 45.99,
                originalPrice: 59.99,
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop',
                rating: 4.8,
                description: 'A seductive fragrance with notes of dark chocolate and amber. Perfect for evening wear and special occasions.',
                badge: 'Best Seller'
            },
            2: {
                id: 2,
                name: 'AXE Phoenix',
                category: 'men',
                price: 42.99,
                originalPrice: null,
                image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=500&fit=crop',
                rating: 4.6,
                description: 'Fresh and energizing fragrance with citrus and woody notes. Ideal for daily wear and active lifestyles.',
                badge: null
            },
            3: {
                id: 3,
                name: 'AXE Black',
                category: 'men',
                price: 48.99,
                originalPrice: null,
                image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=500&fit=crop',
                rating: 4.9,
                description: 'Sophisticated and mysterious fragrance with deep, rich notes. A modern classic for the confident man.',
                badge: 'New'
            },
            4: {
                id: 4,
                name: 'AXE Anarchy For Her',
                category: 'women',
                price: 52.99,
                originalPrice: 65.99,
                image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop',
                rating: 4.7,
                description: 'Bold and rebellious fragrance for women who dare to be different. Features floral and fruity notes.',
                badge: null
            },
            5: {
                id: 5,
                name: 'AXE Apollo',
                category: 'men',
                price: 44.99,
                originalPrice: null,
                image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=500&fit=crop',
                rating: 4.8,
                description: 'Fresh and clean fragrance inspired by space exploration. Light and refreshing for everyday use.',
                badge: null
            },
            6: {
                id: 6,
                name: 'AXE Unity',
                category: 'unisex',
                price: 55.99,
                originalPrice: null,
                image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=500&fit=crop',
                rating: 4.9,
                description: 'A unisex fragrance celebrating diversity and inclusion. Balanced notes suitable for everyone.',
                badge: 'Limited'
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupFilters();
        this.updateCartCount();
        this.setupSearch();
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

        // Contact form submission
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
                this.handleNewsletterForm();
            });
        }

        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeQuickView();
            }
            if (e.target.classList.contains('search-overlay')) {
                this.toggleSearch();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeQuickView();
                this.toggleSearch();
                this.toggleCart();
            }
        });
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

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
                header.style.backdropFilter = 'none';
            }
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
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        const searchSubmit = document.querySelector('.search-submit');
        if (searchSubmit) {
            searchSubmit.addEventListener('click', () => {
                this.performSearch();
            });
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

    toggleSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById('searchInput');

        searchOverlay.classList.toggle('active');

        if (searchOverlay.classList.contains('active')) {
            setTimeout(() => searchInput.focus(), 300);
        } else {
            searchInput.value = '';
            this.clearSearch();
        }
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.clearSearch();
            return;
        }

        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productCategory = product.querySelector('.product-category').textContent.toLowerCase();

            if (productName.includes(query.toLowerCase()) || productCategory.includes(query.toLowerCase())) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();

        if (query) {
            this.toggleSearch();
            this.scrollToSection('products');
            this.searchProducts(query);
        }
    }

    clearSearch() {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            product.style.display = 'block';
        });
    }

    filterProducts(filter) {
        const products = document.querySelectorAll('.product-card');

        products.forEach(product => {
            const category = product.dataset.category;

            if (filter === 'all' || category === filter) {
                product.style.display = 'block';
                product.style.animation = 'fadeInUp 0.5s ease';
            } else {
                product.style.display = 'none';
            }
        });
    }

    addToCart(productId) {
        const product = this.products[productId];
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
        this.showCartNotification(product.name);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotal.textContent = '0.00';
            return;
        }

        let total = 0;
        cartItems.innerHTML = this.cart.map(item => {
            total += item.price * item.quantity;
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="axeStore.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');

        cartTotal.textContent = total.toFixed(2);
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        cartSidebar.classList.toggle('active');

        if (cartSidebar.classList.contains('active')) {
            this.updateCartDisplay();
        }
    }

    saveCart() {
        localStorage.setItem('axeCart', JSON.stringify(this.cart));
    }

    showCartNotification(productName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart!</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #000;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 5000;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    toggleWishlist(productId) {
        const product = this.products[productId];
        if (!product) return;

        const existingIndex = this.wishlist.findIndex(item => item.id === productId);
        const wishlistBtn = document.querySelector(`[onclick="toggleWishlist(${productId})"]`);

        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            this.wishlist.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image
            });
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }

        this.saveWishlist();
    }

    saveWishlist() {
        localStorage.setItem('axeWishlist', JSON.stringify(this.wishlist));
    }

    quickView(productId) {
        const product = this.products[productId];
        if (!product) return;

        const modal = document.getElementById('quickViewModal');
        const modalProductName = document.getElementById('modalProductName');
        const modalProductImage = document.getElementById('modalProductImage');
        const modalProductCategory = document.getElementById('modalProductCategory');
        const modalProductRating = document.getElementById('modalProductRating');
        const modalProductPrice = document.getElementById('modalProductPrice');
        const modalProductDescription = document.getElementById('modalProductDescription');
        const modalAddToCart = document.getElementById('modalAddToCart');
        const modalWishlist = document.getElementById('modalWishlist');

        // Update modal content
        modalProductName.textContent = product.name;
        modalProductImage.src = product.image;
        modalProductImage.alt = product.name;
        modalProductCategory.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1) + "'s Fragrance";

        // Update rating
        const stars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 !== 0;
        modalProductRating.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            if (i < stars) {
                star.className = 'fas fa-star';
            } else if (i === stars && hasHalfStar) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            modalProductRating.appendChild(star);
        }

        const ratingSpan = document.createElement('span');
        ratingSpan.textContent = `(${product.rating})`;
        modalProductRating.appendChild(ratingSpan);

        // Update price
        modalProductPrice.innerHTML = `
            <span class="current-price">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
        `;

        modalProductDescription.textContent = product.description;

        // Update buttons
        modalAddToCart.onclick = () => {
            this.addToCart(productId);
            this.closeQuickView();
        };

        modalWishlist.onclick = () => {
            this.toggleWishlist(productId);
        };

        // Show modal
        modal.classList.add('active');
    }

    closeQuickView() {
        const modal = document.getElementById('quickViewModal');
        modal.classList.remove('active');
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
            submitBtn.style.background = '#28a745';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    }

    handleNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        const input = form.querySelector('input');
        const button = form.querySelector('button');

        if (!input.value.trim()) return;

        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = '#28a745';

            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.disabled = false;
                button.style.background = '';
                input.value = '';
            }, 2000);
        }, 1000);
    }
}

// Global functions for HTML onclick events
function scrollToSection(sectionId) {
    axeStore.scrollToSection(sectionId);
}

function toggleSearch() {
    axeStore.toggleSearch();
}

function toggleCart() {
    axeStore.toggleCart();
}

function addToCart(productId) {
    axeStore.addToCart(productId);
}

function toggleWishlist(productId) {
    axeStore.toggleWishlist(productId);
}

function quickView(productId) {
    axeStore.quickView(productId);
}

function closeQuickView() {
    axeStore.closeQuickView();
}

// Initialize the store when DOM is loaded
let axeStore;

document.addEventListener('DOMContentLoaded', () => {
    axeStore = new AxePerfumeStore();

    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .collection-card, .about-text, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .cart-notification {
            animation: slideInRight 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
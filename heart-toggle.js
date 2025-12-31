// Heart Toggle Button JavaScript
class HeartToggle {
    constructor() {
        this.hearts = new Map();
        this.counters = new Map();
        this.init();
    }

    init() {
        this.setupHeartButtons();
        this.setupControlButtons();
        this.initializeCounters();
        this.updateStatusDisplay();
        this.loadSavedStates();
    }

    setupHeartButtons() {
        const heartButtons = document.querySelectorAll('.heart-btn');

        heartButtons.forEach(button => {
            const heartId = button.dataset.heart;

            // Initialize heart state
            this.hearts.set(heartId, false);

            // Add click event listener
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleHeart(heartId, button);
            });

            // Add hover effects for better UX
            button.addEventListener('mouseenter', () => {
                this.addHoverEffect(button);
            });

            button.addEventListener('mouseleave', () => {
                this.removeHoverEffect(button);
            });
        });
    }

    setupControlButtons() {
        // Like All button
        document.getElementById('likeAllBtn').addEventListener('click', () => {
            this.likeAllHearts();
        });

        // Unlike All button
        document.getElementById('unlikeAllBtn').addEventListener('click', () => {
            this.unlikeAllHearts();
        });

        // Reset Counters button
        document.getElementById('resetCountersBtn').addEventListener('click', () => {
            this.resetCounters();
        });

        // Random Toggle button
        document.getElementById('randomToggleBtn').addEventListener('click', () => {
            this.randomToggle();
        });
    }

    initializeCounters() {
        // Initialize counters for hearts that have them
        this.counters.set('counter', 42);

        // Set initial counter display
        const counterButton = document.querySelector('[data-heart="counter"]');
        if (counterButton) {
            const countElement = counterButton.querySelector('.heart-count');
            if (countElement) {
                countElement.textContent = this.counters.get('counter');
            }
        }
    }

    toggleHeart(heartId, button) {
        const currentState = this.hearts.get(heartId);
        const newState = !currentState;

        // Update state
        this.hearts.set(heartId, newState);

        // Update button appearance
        this.updateHeartButton(button, newState);

        // Handle counter updates
        this.updateCounter(heartId, newState);

        // Create floating heart animation
        this.createFloatingHeart(button, newState);

        // Show toast notification
        this.showToast(heartId, newState);

        // Update status display
        this.updateStatusDisplay();

        // Save state to localStorage
        this.saveStates();

        // Add special effects for certain heart types
        this.addSpecialEffects(button, heartId, newState);
    }

    updateHeartButton(button, isLiked) {
        if (isLiked) {
            button.classList.add('liked');
        } else {
            button.classList.remove('liked');
        }

        // Update text for heart with text
        const textElement = button.querySelector('.heart-text');
        if (textElement) {
            textElement.textContent = isLiked ? 'Liked' : 'Like';
        }
    }

    updateCounter(heartId, isLiked) {
        if (heartId === 'counter') {
            let currentCount = this.counters.get('counter');

            if (isLiked) {
                currentCount++;
            } else {
                currentCount = Math.max(0, currentCount - 1);
            }

            this.counters.set('counter', currentCount);

            // Update display
            const counterButton = document.querySelector('[data-heart="counter"]');
            const countElement = counterButton.querySelector('.heart-count');
            if (countElement) {
                countElement.textContent = currentCount;

                // Add animation to counter
                countElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    countElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }

    createFloatingHeart(button, isLiked) {
        if (!isLiked) return;

        const rect = button.getBoundingClientRect();
        const floatingHeart = document.createElement('div');
        floatingHeart.className = 'floating-heart';
        floatingHeart.innerHTML = '<i class="fas fa-heart"></i>';

        // Position the floating heart
        floatingHeart.style.position = 'fixed';
        floatingHeart.style.left = (rect.left + rect.width / 2) + 'px';
        floatingHeart.style.top = (rect.top + rect.height / 2) + 'px';
        floatingHeart.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(floatingHeart);

        // Remove after animation
        setTimeout(() => {
            if (floatingHeart.parentNode) {
                floatingHeart.parentNode.removeChild(floatingHeart);
            }
        }, 2000);
    }

    addSpecialEffects(button, heartId, isLiked) {
        if (!isLiked) return;

        switch (heartId) {
            case 'pulse':
                // Already handled by CSS animation
                break;

            case 'bouncy':
                // Already handled by CSS animation
                break;

            case 'animated':
                // Add extra sparkle effect
                this.createSparkleEffect(button);
                break;

            case 'gradient':
                // Add color transition effect
                this.addColorTransition(button);
                break;
        }
    }

    createSparkleEffect(button) {
        const rect = button.getBoundingClientRect();
        const sparkles = ['✨', '⭐', '💫', '🌟'];

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.position = 'fixed';
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                sparkle.style.fontSize = '1rem';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'floatUp 1.5s ease-out forwards';

                document.body.appendChild(sparkle);

                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1500);
            }, i * 200);
        }
    }

    addColorTransition(button) {
        const heartIcon = button.querySelector('.heart-icon-filled');
        if (heartIcon) {
            heartIcon.style.transition = 'all 0.5s ease';
            heartIcon.style.filter = 'hue-rotate(360deg)';

            setTimeout(() => {
                heartIcon.style.filter = 'hue-rotate(0deg)';
            }, 500);
        }
    }

    addHoverEffect(button) {
        // Add subtle glow effect on hover
        button.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
    }

    removeHoverEffect(button) {
        // Remove glow effect
        button.style.boxShadow = '';
    }

    likeAllHearts() {
        const heartButtons = document.querySelectorAll('.heart-btn');

        heartButtons.forEach(button => {
            const heartId = button.dataset.heart;
            if (!this.hearts.get(heartId)) {
                this.toggleHeart(heartId, button);
            }
        });

        this.showToast('all', true, 'All hearts liked! 💕');
    }

    unlikeAllHearts() {
        const heartButtons = document.querySelectorAll('.heart-btn');

        heartButtons.forEach(button => {
            const heartId = button.dataset.heart;
            if (this.hearts.get(heartId)) {
                this.toggleHeart(heartId, button);
            }
        });

        this.showToast('all', false, 'All hearts unliked! 💔');
    }

    resetCounters() {
        this.counters.set('counter', 42);

        const counterButton = document.querySelector('[data-heart="counter"]');
        const countElement = counterButton.querySelector('.heart-count');
        if (countElement) {
            countElement.textContent = 42;

            // Add reset animation
            countElement.style.transform = 'rotate(360deg) scale(1.3)';
            setTimeout(() => {
                countElement.style.transform = 'rotate(0deg) scale(1)';
            }, 500);
        }

        this.showToast('counter', true, 'Counter reset! 🔄');
        this.saveStates();
    }

    randomToggle() {
        const heartButtons = document.querySelectorAll('.heart-btn');
        const randomButton = heartButtons[Math.floor(Math.random() * heartButtons.length)];
        const heartId = randomButton.dataset.heart;

        this.toggleHeart(heartId, randomButton);

        // Add special random effect
        randomButton.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            randomButton.style.transform = '';
        }, 500);
    }

    updateStatusDisplay() {
        const statusGrid = document.getElementById('statusGrid');
        statusGrid.innerHTML = '';

        this.hearts.forEach((isLiked, heartId) => {
            const statusItem = document.createElement('div');
            statusItem.className = `status-item ${isLiked ? 'liked' : ''}`;

            const counter = this.counters.get(heartId);
            const counterText = counter ? ` (${counter})` : '';

            statusItem.innerHTML = `
                <span class="status-name">${heartId}${counterText}</span>
                <div class="status-indicator ${isLiked ? 'liked' : 'unliked'}">
                    <i class="fas fa-heart"></i>
                    <span>${isLiked ? 'Liked' : 'Not Liked'}</span>
                </div>
            `;

            statusGrid.appendChild(statusItem);
        });
    }

    showToast(heartId, isLiked, customMessage = null) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        let message;
        if (customMessage) {
            message = customMessage;
        } else {
            const action = isLiked ? 'liked' : 'unliked';
            message = `${heartId.charAt(0).toUpperCase() + heartId.slice(1)} heart ${action}!`;
        }

        toastMessage.textContent = message;

        // Show toast
        toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    saveStates() {
        const states = {
            hearts: Object.fromEntries(this.hearts),
            counters: Object.fromEntries(this.counters)
        };
        localStorage.setItem('heart-toggle-states', JSON.stringify(states));
    }

    loadSavedStates() {
        const savedStates = localStorage.getItem('heart-toggle-states');
        if (savedStates) {
            try {
                const states = JSON.parse(savedStates);

                // Restore heart states
                if (states.hearts) {
                    Object.entries(states.hearts).forEach(([heartId, isLiked]) => {
                        this.hearts.set(heartId, isLiked);
                        const button = document.querySelector(`[data-heart="${heartId}"]`);
                        if (button) {
                            this.updateHeartButton(button, isLiked);
                        }
                    });
                }

                // Restore counter states
                if (states.counters) {
                    Object.entries(states.counters).forEach(([heartId, count]) => {
                        this.counters.set(heartId, count);
                        if (heartId === 'counter') {
                            const counterButton = document.querySelector('[data-heart="counter"]');
                            const countElement = counterButton?.querySelector('.heart-count');
                            if (countElement) {
                                countElement.textContent = count;
                            }
                        }
                    });
                }

                this.updateStatusDisplay();
            } catch (error) {
                console.error('Error loading saved states:', error);
            }
        }
    }

    // Public method to get heart state
    getHeartState(heartId) {
        return this.hearts.get(heartId) || false;
    }

    // Public method to get counter value
    getCounterValue(heartId) {
        return this.counters.get(heartId) || 0;
    }

    // Public method to programmatically toggle a heart
    programmaticallyToggle(heartId) {
        const button = document.querySelector(`[data-heart="${heartId}"]`);
        if (button) {
            this.toggleHeart(heartId, button);
        }
    }
}

// Initialize the heart toggle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.heartToggle = new HeartToggle();

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press 'L' to like all hearts
        if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.altKey) {
            window.heartToggle.likeAllHearts();
        }

        // Press 'U' to unlike all hearts
        if (e.key.toLowerCase() === 'u' && !e.ctrlKey && !e.altKey) {
            window.heartToggle.unlikeAllHearts();
        }

        // Press 'R' to random toggle
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.altKey) {
            window.heartToggle.randomToggle();
        }

        // Press numbers 1-8 to toggle specific hearts
        const num = parseInt(e.key);
        if (num >= 1 && num <= 8) {
            const heartIds = ['basic', 'counter', 'animated', 'pulse', 'gradient', 'large', 'text', 'bouncy'];
            const heartId = heartIds[num - 1];
            if (heartId) {
                window.heartToggle.programmaticallyToggle(heartId);
            }
        }
    });

    // Add welcome message
    setTimeout(() => {
        window.heartToggle.showToast('welcome', true, 'Welcome! Try clicking the hearts! 💖');
    }, 1000);

    // Add periodic random effects (optional)
    setInterval(() => {
        // Randomly add subtle animations to hearts
        const heartButtons = document.querySelectorAll('.heart-btn');
        const randomButton = heartButtons[Math.floor(Math.random() * heartButtons.length)];

        if (Math.random() < 0.1) { // 10% chance every 5 seconds
            randomButton.style.transform = 'scale(1.05)';
            setTimeout(() => {
                randomButton.style.transform = '';
            }, 200);
        }
    }, 5000);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeartToggle;
}
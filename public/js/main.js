/**
 * ============================================
 * Maraneea Shop - Main JavaScript
 * Modern E-commerce Frontend Interactions
 * ============================================
 */

// ============================================
// INITIALIZATION & SETUP
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initNavbarEffects();
    initAnimations();
    initImageLazyLoading();
    initTooltips();
    initFormHandlers();
    initProductInteractions();
    initCartFunctionality();
    initSearchFunctionality();
});

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    // Smooth scroll untuk anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// NAVBAR EFFECTS
// ============================================

function initNavbarEffects() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        // Navbar scroll effect with debouncing
        if (window.scrollY > 50) {
            navbar?.classList.add('navbar-scrolled');
        } else {
            navbar?.classList.remove('navbar-scrolled');
        }
        
        // Back to top button
        if (window.scrollY > 300) {
            backToTop?.classList.remove('opacity-0', 'invisible');
        } else {
            backToTop?.classList.add('opacity-0', 'invisible');
        }
    }, { passive: true });
    
    // Back to top click handler
    backToTop?.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// ANIMATIONS
// ============================================

function initAnimations() {
    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, [data-aos]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }, { passive: true });
    }
}

// ============================================
// IMAGE LAZY LOADING
// ============================================

function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// TOOLTIPS
// ============================================

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip absolute z-50 px-3 py-2 text-sm text-white bg-neutral-800 dark:bg-neutral-700 rounded-lg shadow-medium transform -translate-x-1/2 left-1/2';
    tooltip.textContent = e.target.dataset.tooltip;
    tooltip.style.bottom = '100%';
    tooltip.style.marginBottom = '8px';
    
    e.target.style.position = 'relative';
    e.target.appendChild(tooltip);
    
    // Add animation
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) translateY(-4px)';
    }, 10);
}

function hideTooltip(e) {
    const tooltip = e.target.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 150);
    }
}

// ============================================
// FORM HANDLERS
// ============================================

function initFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                submitButton.disabled = true;
                const originalHTML = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Memproses...';
                
                // Re-enable after 3 seconds as a fallback
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalHTML;
                }, 3000);
            }
        });
        
        // Real-time validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('border-error-500')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    if (isValid) {
        field.classList.remove('border-error-500', 'dark:border-error-400');
        field.classList.add('border-success-500', 'dark:border-success-400');
    } else {
        field.classList.remove('border-success-500', 'dark:border-success-400');
        field.classList.add('border-error-500', 'dark:border-error-400');
    }
    
    return isValid;
}

// ============================================
// PRODUCT INTERACTIONS
// ============================================

function initProductInteractions() {
    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.wishlist-btn, [data-wishlist]');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId || this.dataset.wishlist;
            toggleWishlist(productId, this);
        });
    });
    
    // Quick view modals
    const quickViewButtons = document.querySelectorAll('[data-quick-view]');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.quickView;
            openQuickView(productId);
        });
    });
    
    // Product image zoom
    const productImages = document.querySelectorAll('.product-image-zoom');
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// CART FUNCTIONALITY
// ============================================

function initCartFunctionality() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart, [data-add-to-cart]');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId || this.dataset.addToCart;
            const quantity = this.dataset.quantity || 1;
            addToCart(productId, quantity);
        });
    });
}

async function addToCart(productId, quantity = 1) {
    try {
        showToast('Menambahkan ke keranjang...', 'info');
        
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productId,
                quantity: parseInt(quantity)
            })
        });

        const result = await response.json();
        
        if (result.success) {
            showToast('✓ Produk berhasil ditambahkan ke keranjang!', 'success');
            updateCartCount(result.cartCount || result.cart?.length || 0);
            animateCartIcon();
        } else {
            showToast(result.message || 'Gagal menambahkan produk', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

async function toggleWishlist(productId, button) {
    try {
        const response = await fetch('/wishlist/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productId
            })
        });

        const result = await response.json();
        
        if (result.success) {
            const icon = button.querySelector('i');
            if (result.inWishlist) {
                icon?.classList.replace('far', 'fas');
                icon?.classList.add('text-error-500');
                showToast('♥ Ditambahkan ke wishlist!', 'success');
            } else {
                icon?.classList.replace('fas', 'far');
                icon?.classList.remove('text-error-500');
                showToast('Dihapus dari wishlist', 'info');
            }
            
            // Animate heart
            button.classList.add('animate-bounce');
            setTimeout(() => button.classList.remove('animate-bounce'), 600);
        } else {
            showToast(result.message || 'Gagal mengupdate wishlist', 'error');
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

function updateCartCount(count) {
    const cartBadges = document.querySelectorAll('[data-cart-count]');
    cartBadges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => cartIcon.classList.remove('animate-bounce'), 600);
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearchFunctionality() {
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Cari"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
        
        // Live search suggestions
        input.addEventListener('input', function() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                if (query.length >= 2) {
                    fetchSearchSuggestions(query);
                }
            }, 300);
        });
    });
}

async function fetchSearchSuggestions(query) {
    try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            const suggestions = await response.json();
            displaySearchSuggestions(suggestions);
        }
    } catch (error) {
        console.error('Error fetching search suggestions:', error);
    }
}

function displaySearchSuggestions(suggestions) {
    // Create or update suggestions dropdown
    let dropdown = document.getElementById('searchSuggestions');
    
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'searchSuggestions';
        dropdown.className = 'absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-strong max-h-96 overflow-y-auto z-50';
        
        const searchInput = document.querySelector('input[type="text"][placeholder*="Cari"]');
        searchInput?.parentElement.appendChild(dropdown);
    }
    
    if (suggestions && suggestions.length > 0) {
        dropdown.innerHTML = suggestions.map(item => `
            <a href="/products/${item.id}" class="block px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg mr-3">
                    <div>
                        <div class="font-medium text-neutral-900 dark:text-white">${item.name}</div>
                        <div class="text-sm text-primary-600 dark:text-accent-400">${formatCurrency(item.price)}</div>
                    </div>
                </div>
            </a>
        `).join('');
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast-${type} rounded-xl p-4 shadow-strong backdrop-blur-sm transform transition-all duration-300 translate-x-full opacity-0`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${icons[type] || icons.info} text-xl mr-3"></i>
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 hover:opacity-80 transition-opacity">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });
    });
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed top-24 right-4 z-50 space-y-2 max-w-md';
    document.body.appendChild(container);
    return container;
}

// Legacy function for compatibility
function showNotification(message, type = 'info') {
    showToast(message, type);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// IMAGE PREVIEW
// ============================================

function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                preview.classList.add('animate-fade-in');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ============================================
// PRODUCT QUANTITY
// ============================================

function updateQuantity(productId, change) {
    const quantityInput = document.querySelector(`input[data-product-id="${productId}"]`);
    if (quantityInput) {
        let newQuantity = parseInt(quantityInput.value) + change;
        newQuantity = Math.max(1, Math.min(99, newQuantity));
        quantityInput.value = newQuantity;
        
        // Trigger change event
        quantityInput.dispatchEvent(new Event('change'));
    }
}

// ============================================
// QUICK VIEW MODAL
// ============================================

function openQuickView(productId) {
    // Fetch product details and open modal
    showToast('Memuat detail produk...', 'info');
    
    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Create and show modal with product details
            console.log('Quick view for product:', product);
        })
        .catch(error => {
            console.error('Error loading product:', error);
            showToast('Gagal memuat detail produk', 'error');
        });
}

// ============================================
// EXPORT GLOBAL FUNCTIONS
// ============================================

window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.showToast = showToast;
window.showNotification = showNotification;
window.formatCurrency = formatCurrency;
window.previewImage = previewImage;
window.updateQuantity = updateQuantity;
window.openQuickView = openQuickView;


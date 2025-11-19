// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Game filter interaction
    const gameItems = document.querySelectorAll('.game-item');
    gameItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            gameItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you would typically filter products based on the selected game
            console.log('Selected game:', this.querySelector('span').textContent);
        });
    });
    
    // Software filter interaction
    const softwareItems = document.querySelectorAll('.software-item');
    softwareItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            softwareItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you would typically filter products based on the selected software
            console.log('Selected software:', this.querySelector('span').textContent);
        });
    });
    
    // Cart functionality
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    
    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }
    
    // Add to cart buttons (if you add them to products)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            cartCount++;
            updateCartCount();
            
            // Show a brief notification
            showNotification('Produit ajouté au panier!');
        }
    });
    
    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ff3e3e;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = prompt('Rechercher un produit:');
            if (searchTerm) {
                console.log('Searching for:', searchTerm);
                showNotification(`Recherche: "${searchTerm}"`);
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .location-card, .brand-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add CSS for active states
const style = document.createElement('style');
style.textContent = `
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        gap: 15px;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .game-item.active,
    .software-item.active {
        background-color: #ff3e3e;
        color: white;
    }
    
    .game-item.active .pc-count,
    .software-item.active span {
        color: white;
    }
`;
document.head.appendChild(style);




// ===== SLIDER =====
let index = 0;
const slides = document.querySelector(".slides");
const totalSlides = document.querySelectorAll(".slide").length;

if (slides && totalSlides > 0) {
    document.querySelector(".next")?.addEventListener("click", () => {
        index = (index + 1) % totalSlides;
        updateSlider();
    });

    document.querySelector(".prev")?.addEventListener("click", () => {
        index = (index - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    function updateSlider() {
        slides.style.transform = translateX(-${index * 100}%);
    }

    // AUTO SLIDE toutes les 3 secondes
    setInterval(() => {
        index = (index + 1) % totalSlides;
        updateSlider();
    }, 3000);
}

// ===== SYSTÈME DE PANIER =====
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
        this.initializeButtons();
    }

    // Charger le panier depuis le stockage local
    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Sauvegarder le panier
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Ajouter un produit au panier
    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: product.name,
                price: product.price,
                oldPrice: product.oldPrice,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification(${product.name} ajouté au panier!);
    }

    // Supprimer un produit du panier
    removeItem(productName) {
        this.items = this.items.filter(item => item.name !== productName);
        this.saveCart();
        this.updateCartCount();
    }

    // Mettre à jour la quantité
    updateQuantity(productName, quantity) {
        const item = this.items.find(item => item.name === productName);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartCount();
        }
    }

    // Vider le panier
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }

    // Calculer le total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Mettre à jour le compteur du panier
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Afficher notification
    showNotification(message) {
        // Supprimer l'ancienne notification si elle existe
        const oldNotif = document.querySelector('.cart-notification');
        if (oldNotif) oldNotif.remove();

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 10);

        // Retirer après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialiser les boutons "Acheter"
    initializeButtons() {
        const buyButtons = document.querySelectorAll('.buy-button');
        
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const productCard = button.closest('.product-card');
                const product = {
                    name: productCard.querySelector('h3').textContent.trim(),
                    price: parseFloat(productCard.querySelector('.new-price').textContent.replace(/[^\d.]/g, '')),
                    oldPrice: productCard.querySelector('.old-price') ? 
                             parseFloat(productCard.querySelector('.old-price').textContent.replace(/[^\d.]/g, '')) : null,
                    image: productCard.querySelector('.product-image').src
                };
                
                this.addItem(product);
            });
        });
    }

    // Afficher le panier (modal)
    showCart() {
        const modal = this.createCartModal();
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // Créer le modal du panier
    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h2>Mon Panier</h2>
                    <button class="close-cart">&times;</button>
                </div>
                <div class="cart-items">
                    ${this.items.length === 0 ? 
                        '<p class="empty-cart">Votre panier est vide</p>' :
                        this.items.map(item => `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="cart-item-info">
                                    <h4>${item.name}</h4>
                                    <p class="cart-item-price">${item.price.toFixed(2)} MAD</p>
                                    <div class="quantity-controls">
                                        <button class="qty-btn" data-action="decrease" data-name="${item.name}">-</button>
                                        <span class="quantity">${item.quantity}</span>
                                        <button class="qty-btn" data-action="increase" data-name="${item.name}">+</button>
                                    </div>
                                </div>
                                <button class="remove-item" data-name="${item.name}">🗑</button>
                            </div>
                        `).join('')
                    }
                </div>
                ${this.items.length > 0 ? `
                    <div class="cart-footer">
                        <div class="cart-total">
                            <span>Total:</span>
                            <span class="total-price">${this.getTotal().toFixed(2)} MAD</span>
                        </div>
                        <button class="btn btn-primary checkout-btn">Commander</button>
                        <button class="btn btn-secondary clear-cart-btn">Vider le panier</button>
                    </div>
                ` : ''}
            </div>
        `;

        // Event listeners
        modal.querySelector('.close-cart').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });

        // Boutons quantité
        modal.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const item = this.items.find(i => i.name === name);
                if (item) {
                    if (btn.dataset.action === 'increase') {
                        this.updateQuantity(name, item.quantity + 1);
                    } else {
                        this.updateQuantity(name, item.quantity - 1);
                    }
                    modal.remove();
                    this.showCart();
                }
            });
        });

        // Boutons supprimer
        modal.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeItem(btn.dataset.name);
                modal.remove();
                this.showCart();
            });
        });

        // Bouton vider panier
        const clearBtn = modal.querySelector('.clear-cart-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Voulez-vous vraiment vider le panier?')) {
                    this.clearCart();
                    modal.remove();
                }
            });
        }

        // Bouton commander
        const checkoutBtn = modal.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = 'payement.html';
            });
        }

        return modal;
    }
}

// Initialiser le panier
const cart = new ShoppingCart();

// Événement pour le bouton panier
document.querySelector('.cart-btn')?.addEventListener('click', () => {
    cart.showCart();
});

// Menu hamburger
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});
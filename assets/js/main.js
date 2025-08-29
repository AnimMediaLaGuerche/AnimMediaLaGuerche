// ===== GESTION DU MENU MOBILE =====
document.addEventListener('DOMContentLoaded', function() {
    // Enregistrement du Service Worker pour PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker enregistré avec succès:', registration.scope);
            })
            .catch(function(error) {
                console.log('Échec de l\'enregistrement du Service Worker:', error);
            });
    }

    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            const isOpen = navList.classList.contains('active');
            
            if (isOpen) {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '☰';
            } else {
                navList.classList.add('active');
                navToggle.setAttribute('aria-expanded', 'true');
                navToggle.innerHTML = '✕';
            }
        });
        
        // Fermer le menu lors du clic sur un lien
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '☰';
            });
        });
    }
});

// ===== ANIMATION DES ÉLÉMENTS AU SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments .card
    const cards = document.querySelectorAll('.card:not(.fade-in-up)');
    cards.forEach(card => observer.observe(card));
}

// ===== NAVIGATION ACTIVE =====
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== CHARGEMENT DES ACTUALITÉS DYNAMIQUES =====
async function loadNews() {
    try {
        // Simulation de données d'actualités (en attendant un vrai système de gestion)
        const news = [
            {
                id: 1,
                title: "Atelier crêpes du 15 septembre",
                description: "Rejoignez-nous pour un moment convivial autour de la préparation de crêpes. Ouvert à tous, gratuit sur inscription. 14h-17h à la médiathèque.",
                icon: "📅",
                link: "pages/agenda.html",
                date: "2024-09-15"
            },
            {
                id: 2,
                title: "Café numérique hebdomadaire",
                description: "Tous les mercredis de 10h à 12h, venez vous initier ou vous perfectionner au numérique dans une ambiance détendue.",
                icon: "💻",
                link: "pages/activites.html",
                recurring: true
            },
            {
                id: 3,
                title: "Spectacle jeune public",
                description: "Prochaine représentation le 22 septembre à 15h. Un spectacle interactif pour les enfants de 3 à 10 ans.",
                icon: "🎪",
                link: "pages/agenda.html",
                date: "2024-09-22"
            }
        ];
        
        return news;
    } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
        return [];
    }
}

// ===== FORMATAGE DES DATES =====
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// ===== SMOOTH SCROLL POUR LES ANCRES =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== GESTION DES FORMULAIRES =====
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Ce champ est obligatoire');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Validation email
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Veuillez saisir une adresse email valide');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// ===== GESTION DES COOKIES (RGPD) =====
function initCookieConsent() {
    // Simple gestion des cookies pour le RGPD
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        showCookieBanner();
    }
}

function showCookieBanner() {
    const banner = document.createElement('div');
    banner.innerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #2C3E50; color: white; padding: 1rem; z-index: 10000; box-shadow: 0 -2px 10px rgba(0,0,0,0.1);">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                <p style="margin: 0; flex: 1; min-width: 300px;">
                    Ce site utilise des cookies pour améliorer votre expérience. En continuant à naviguer, vous acceptez notre utilisation des cookies.
                </p>
                <button onclick="acceptCookies()" style="background: #2E8B57; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                    J'accepte
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    const banner = document.querySelector('[style*="position: fixed"][style*="bottom: 0"]');
    if (banner) {
        banner.remove();
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initForms();
    initCookieConsent();
    
    // Charger les actualités si on est sur la page d'accueil
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadNews().then(news => {
            // Les actualités sont déjà affichées en dur dans le HTML
            // Cette fonction pourrait être utilisée pour un système dynamique
        });
    }
});

// ===== UTILITAIRES =====
// Fonction pour basculer la visibilité d'un élément
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// Fonction pour faire défiler vers le haut
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Ajouter un bouton "Retour en haut" si la page est longue
function addBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    button.addEventListener('click', scrollToTop);
    document.body.appendChild(button);
    
    // Afficher/masquer le bouton selon la position de scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
        } else {
            button.style.opacity = '0';
        }
    });
}

// Initialiser le bouton "Retour en haut" après le chargement
window.addEventListener('load', addBackToTopButton);

// ===== GESTION D'ERREURS =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // En production, on pourrait envoyer l'erreur à un service de monitoring
});

// Rendre certaines fonctions globales pour l'accessibilité depuis le HTML
window.acceptCookies = acceptCookies;
window.toggleElement = toggleElement;
window.scrollToTop = scrollToTop;

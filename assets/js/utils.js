// ===== OPTIMISATIONS PERFORMANCE =====

// Lazy loading des images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback pour les navigateurs plus anciens
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Préchargement des ressources critiques
function preloadCriticalResources() {
    const criticalResources = [
        '/assets/css/main.css',
        '/assets/js/main.js',
        '/data/events.json'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        
        if (resource.endsWith('.css')) {
            link.as = 'style';
        } else if (resource.endsWith('.js')) {
            link.as = 'script';
        } else if (resource.endsWith('.json')) {
            link.as = 'fetch';
            link.crossOrigin = 'anonymous';
        }
        
        document.head.appendChild(link);
    });
}

// Compression et optimisation des données
function optimizeEventData(events) {
    return events.map(event => ({
        ...event,
        // Supprimer les champs vides ou inutiles
        description: event.description ? event.description.trim() : '',
        // Optimiser les dates
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : null,
        // Nettoyer les données
        category: event.category ? event.category.toLowerCase() : 'autre'
    })).filter(event => event.title && event.date);
}

// Gestion intelligente du cache
class SmartCache {
    constructor(name = 'anim-media-cache') {
        this.cacheName = name;
        this.version = '1.0';
    }

    async set(key, data, ttl = 3600000) { // TTL par défaut: 1 heure
        const item = {
            data,
            timestamp: Date.now(),
            ttl
        };
        
        try {
            localStorage.setItem(`${this.cacheName}_${key}`, JSON.stringify(item));
        } catch (error) {
            console.warn('Erreur de stockage en cache:', error);
        }
    }

    async get(key) {
        try {
            const item = localStorage.getItem(`${this.cacheName}_${key}`);
            if (!item) return null;

            const parsed = JSON.parse(item);
            const now = Date.now();

            if (now - parsed.timestamp > parsed.ttl) {
                localStorage.removeItem(`${this.cacheName}_${key}`);
                return null;
            }

            return parsed.data;
        } catch (error) {
            console.warn('Erreur de lecture du cache:', error);
            return null;
        }
    }

    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.cacheName)) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Analytics simple et respectueux de la vie privée
class SimpleAnalytics {
    constructor() {
        this.session = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }

    track(event, data = {}) {
        const trackingEvent = {
            event,
            data,
            timestamp: Date.now(),
            session: this.session,
            page: window.location.pathname
        };

        this.events.push(trackingEvent);
        
        // Stocker localement (pas d'envoi externe)
        this.saveToLocal();
    }

    saveToLocal() {
        try {
            const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
            analytics.push(...this.events);
            
            // Garder seulement les 1000 derniers événements
            if (analytics.length > 1000) {
                analytics.splice(0, analytics.length - 1000);
            }
            
            localStorage.setItem('analytics', JSON.stringify(analytics));
            this.events = [];
        } catch (error) {
            console.warn('Erreur de sauvegarde analytics:', error);
        }
    }

    getStats() {
        try {
            const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
            const now = Date.now();
            const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
            
            const recentEvents = analytics.filter(event => event.timestamp > oneWeekAgo);
            
            return {
                totalEvents: recentEvents.length,
                uniqueSessions: new Set(recentEvents.map(e => e.session)).size,
                mostVisitedPages: this.getMostVisited(recentEvents),
                averageTimeOnSite: this.getAverageTime(recentEvents)
            };
        } catch (error) {
            console.warn('Erreur de lecture des stats:', error);
            return null;
        }
    }

    getMostVisited(events) {
        const pageVisits = {};
        events.forEach(event => {
            pageVisits[event.page] = (pageVisits[event.page] || 0) + 1;
        });
        
        return Object.entries(pageVisits)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    getAverageTime(events) {
        const sessions = {};
        events.forEach(event => {
            if (!sessions[event.session]) {
                sessions[event.session] = { start: event.timestamp, end: event.timestamp };
            } else {
                sessions[event.session].end = Math.max(sessions[event.session].end, event.timestamp);
            }
        });

        const durations = Object.values(sessions).map(session => session.end - session.start);
        return durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    }
}

// Initialisation globale
const cache = new SmartCache();
const analytics = new SimpleAnalytics();

// Export pour utilisation dans d'autres scripts
window.AnimMediaUtils = {
    cache,
    analytics,
    initLazyLoading,
    preloadCriticalResources,
    optimizeEventData
};

// Auto-initialisation
document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalResources();
    initLazyLoading();
    
    // Tracking des vues de page
    analytics.track('page_view', {
        title: document.title,
        url: window.location.href
    });
});

// Tracking de la fermeture de la page
window.addEventListener('beforeunload', function() {
    analytics.track('page_leave', {
        timeSpent: Date.now() - analytics.startTime
    });
});

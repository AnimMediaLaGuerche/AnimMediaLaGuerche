// ===== UTILITAIRES DE DONNÉES - Anim'Média =====

/**
 * Service centralisé pour charger et gérer les données du site
 */
class DataService {
    constructor() {
        this.data = {
            activities: [],
            events: [],
            config: {},
            association: {}
        };
        this.loaded = false;
    }

    /**
     * Charge toutes les données nécessaires
     */
    async loadAll() {
        try {
            await Promise.all([
                this.loadContent(),
                this.loadConfig()
            ]);
            this.loaded = true;
            return this.data;
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            throw error;
        }
    }

    /**
     * Charge le contenu principal (activités, événements, info association)
     */
    async loadContent() {
        try {
            const response = await fetch('./data/content.json');
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const content = await response.json();
            
            this.data.activities = content.activities || [];
            this.data.events = content.events || [];
            this.data.association = content.association || {};
            
            // Enrichir les événements avec les données d'activités
            this.enrichEvents();
            
            return content;
        } catch (error) {
            console.warn('Impossible de charger content.json, utilisation des données de fallback');
            this.loadFallbackContent();
            throw error;
        }
    }

    /**
     * Charge la configuration du site
     */
    async loadConfig() {
        try {
            const response = await fetch('./data/config.json');
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const config = await response.json();
            this.data.config = config;
            
            return config;
        } catch (error) {
            console.warn('Impossible de charger config.json, utilisation de la config par défaut');
            this.loadFallbackConfig();
        }
    }

    /**
     * Enrichit les événements avec les données des activités correspondantes
     */
    enrichEvents() {
        this.data.events = this.data.events.map(event => {
            const activity = this.data.activities.find(act => act.id === event.activity_id);
            return {
                ...event,
                activity: activity || null,
                icon: activity?.icon || '📅',
                activityName: activity?.name || event.title
            };
        });
    }

    /**
     * Obtient les événements filtrés par catégorie
     */
    getEventsByCategory(category = 'all') {
        if (category === 'all') {
            return this.data.events;
        }
        return this.data.events.filter(event => event.category === category);
    }

    /**
     * Obtient les événements à venir
     */
    getUpcomingEvents(limit = null) {
        const upcoming = this.data.events
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return limit ? upcoming.slice(0, limit) : upcoming;
    }

    /**
     * Obtient une activité par son ID
     */
    getActivity(id) {
        return this.data.activities.find(activity => activity.id === id);
    }

    /**
     * Obtient un événement par son ID
     */
    getEvent(id) {
        return this.data.events.find(event => event.id === id);
    }

    /**
     * Données de fallback en cas de problème de chargement
     */
    loadFallbackContent() {
        this.data.activities = [
            {
                id: "cafe-numerique",
                name: "Café numérique",
                category: "numérique",
                description: "Accompagnement numérique personnalisé",
                icon: "💻"
            }
        ];
        
        this.data.events = [
            {
                id: 1,
                activity_id: "cafe-numerique",
                title: "Café numérique",
                description: "Venez avec vos questions numériques !",
                date: new Date().toISOString().split('T')[0],
                category: "numérique",
                icon: "💻"
            }
        ];
        
        this.data.association = {
            name: "Anim'Média",
            description: "Association culturelle et numérique"
        };
    }

    /**
     * Configuration de fallback
     */
    loadFallbackConfig() {
        this.data.config = {
            site: {
                name: "Anim'Média",
                description: "Association culturelle et numérique"
            },
            colors: {
                primary: "#2E7D32",
                secondary: "#FF7043",
                accent: "#1976D2"
            }
        };
    }
}

// Instance globale du service de données
window.dataService = new DataService();

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}

// ===== GESTION DE L'AGENDA =====
class AgendaManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentFilter = 'all';
        this.init();
    }
    
    async init() {
        await this.loadEvents();
        this.setupFilters();
        this.renderEvents();
    }
    
    async loadEvents() {
        try {
            // En production, ceci chargerait depuis le fichier JSON
            // Pour ce démo, on utilise les données directement
            const response = await fetch('../data/events.json');
            const data = await response.json();
            this.events = data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
            this.filteredEvents = [...this.events];
        } catch (error) {
            console.error('Erreur lors du chargement des événements:', error);
            this.showError();
        }
    }
    
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Retirer la classe active de tous les boutons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                e.target.classList.add('active');
                
                // Filtrer les événements
                const category = e.target.dataset.category;
                this.filterEvents(category);
            });
        });
    }
    
    filterEvents(category) {
        this.currentFilter = category;
        
        if (category === 'all') {
            this.filteredEvents = [...this.events];
        } else {
            this.filteredEvents = this.events.filter(event => event.category === category);
        }
        
        this.renderEvents();
    }
    
    renderEvents() {
        const container = document.getElementById('events-container');
        
        if (this.filteredEvents.length === 0) {
            container.innerHTML = `
                <div class="no-events">
                    <h3>Aucun événement trouvé</h3>
                    <p>Il n'y a pas d'événements pour cette catégorie actuellement.</p>
                    <a href="contact.html" class="btn btn--primary">Proposer une activité</a>
                </div>
            `;
            return;
        }
        
        const eventsHTML = this.filteredEvents.map(event => this.renderEvent(event)).join('');
        container.innerHTML = eventsHTML;
        
        // Ajouter les gestionnaires d'événements pour les boutons d'inscription
        this.setupRegistrationButtons();
    }
    
    renderEvent(event) {
        const eventDate = new Date(event.date);
        const isUpcoming = eventDate >= new Date();
        const isPast = eventDate < new Date();
        
        const dayName = eventDate.toLocaleDateString('fr-FR', { weekday: 'short' });
        const dayNumber = eventDate.getDate();
        const monthName = eventDate.toLocaleDateString('fr-FR', { month: 'short' });
        
        const registrationStatus = this.getRegistrationStatus(event);
        
        return `
            <article class="event-card ${event.category}" data-event-id="${event.id}">
                <div class="event-header">
                    <div>
                        <h3 style="color: var(--primary-color); margin: 0 0 0.5rem 0; font-size: 1.3rem;">
                            ${event.title}
                        </h3>
                        <span class="event-category" style="background: ${this.getCategoryColor(event.category)};">
                            ${this.getCategoryIcon(event.category)} ${this.getCategoryName(event.category)}
                        </span>
                    </div>
                    ${registrationStatus.html}
                </div>
                
                <div class="event-date-time">
                    <div class="event-date">
                        <div style="font-size: 0.75rem; opacity: 0.8;">${dayName.toUpperCase()}</div>
                        <div style="font-size: 1.2rem;">${dayNumber}</div>
                        <div style="font-size: 0.75rem; opacity: 0.8;">${monthName.toUpperCase()}</div>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: var(--text-color);">⏰ ${event.time}</div>
                        <div style="color: var(--text-light); font-size: 0.875rem;">📍 ${event.location}</div>
                        ${event.recurring ? `<div style="color: var(--secondary-color); font-size: 0.875rem; font-weight: 500;">🔄 ${this.getRecurrenceText(event)}</div>` : ''}
                    </div>
                </div>
                
                <p style="line-height: 1.6; color: var(--text-light); margin: 1rem 0;">
                    ${event.description}
                </p>
                
                <div class="event-info">
                    <div class="event-detail">
                        <span>💰</span>
                        <span><strong>Prix :</strong> ${event.price}</span>
                    </div>
                    <div class="event-detail">
                        <span>👥</span>
                        <span><strong>Public :</strong> ${event.age_group}</span>
                    </div>
                    <div class="event-detail">
                        <span>📊</span>
                        <span><strong>Niveau :</strong> ${event.difficulty}</span>
                    </div>
                    <div class="event-detail">
                        <span>👨‍👩‍👧‍👦</span>
                        <span><strong>Places :</strong> ${event.current_participants}/${event.max_participants}</span>
                    </div>
                </div>
                
                ${event.notes ? `
                    <div style="background: #e8f4f8; padding: 1rem; border-radius: var(--border-radius); margin: 1rem 0;">
                        <div style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.5rem;">
                            ℹ️ Informations complémentaires
                        </div>
                        <p style="margin: 0; color: var(--text-light); font-size: 0.875rem;">
                            ${event.notes}
                        </p>
                    </div>
                ` : ''}
                
                <div class="event-actions">
                    ${this.renderActionButtons(event, isUpcoming, registrationStatus)}
                </div>
            </article>
        `;
    }
    
    getRegistrationStatus(event) {
        const availableSpots = event.max_participants - event.current_participants;
        const percentage = (event.current_participants / event.max_participants) * 100;
        
        if (percentage >= 100) {
            return {
                status: 'full',
                html: '<span class="registration-status full">🚫 Complet</span>',
                canRegister: false
            };
        } else if (percentage >= 80) {
            return {
                status: 'limited',
                html: `<span class="registration-status limited">⚠️ ${availableSpots} places restantes</span>`,
                canRegister: true
            };
        } else {
            return {
                status: 'available',
                html: '<span class="registration-status available">✅ Places disponibles</span>',
                canRegister: true
            };
        }
    }
    
    renderActionButtons(event, isUpcoming, registrationStatus) {
        if (!isUpcoming) {
            return '<span style="color: var(--text-light); font-style: italic;">🕐 Événement passé</span>';
        }
        
        if (!registrationStatus.canRegister) {
            return `
                <button class="btn" disabled style="opacity: 0.5; cursor: not-allowed;">
                    Complet
                </button>
                <a href="contact.html" class="btn" style="background: var(--text-light);">
                    Liste d'attente
                </a>
            `;
        }
        
        if (event.registration_required) {
            return `
                <button class="btn btn--primary registration-btn" data-event-id="${event.id}">
                    S'inscrire
                </button>
                <a href="contact.html" class="btn" style="background: var(--text-light);">
                    Plus d'infos
                </a>
            `;
        } else {
            return `
                <span style="color: var(--primary-color); font-weight: 600;">
                    ✅ Accès libre - Pas d'inscription nécessaire
                </span>
                <a href="contact.html" class="btn" style="background: var(--text-light);">
                    Plus d'infos
                </a>
            `;
        }
    }
    
    setupRegistrationButtons() {
        const registrationButtons = document.querySelectorAll('.registration-btn');
        registrationButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = e.target.dataset.eventId;
                this.handleRegistration(eventId);
            });
        });
    }
    
    handleRegistration(eventId) {
        const event = this.events.find(e => e.id == eventId);
        if (!event) return;
        
        // Simulation d'inscription (en production, ceci enverrait une requête au serveur)
        const userConfirmed = confirm(`
Inscription à : ${event.title}
Date : ${new Date(event.date).toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
})}
Heure : ${event.time}
Lieu : ${event.location}
Prix : ${event.price}

Confirmer votre inscription ?
        `);
        
        if (userConfirmed) {
            // Mettre à jour le nombre de participants (simulation)
            event.current_participants += 1;
            
            // Re-render l'événement
            this.renderEvents();
            
            // Afficher un message de confirmation
            this.showRegistrationSuccess(event);
        }
    }
    
    showRegistrationSuccess(event) {
        // Créer un message de confirmation temporaire
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        message.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem;">✅ Inscription confirmée</div>
            <div style="font-size: 0.875rem;">
                Vous êtes inscrit(e) à "${event.title}"<br>
                Vous recevrez une confirmation par email.
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 5000);
    }
    
    getCategoryColor(category) {
        const colors = {
            'numérique': '#4682B4',
            'cuisine': '#F4A460',
            'spectacle': '#9370DB',
            'montessori': '#FF69B4',
            'écriture': '#32CD32',
            'sortie': '#FF6347'
        };
        return colors[category] + '20' || '#E8E8E8'; // 20 pour la transparence
    }
    
    getCategoryIcon(category) {
        const icons = {
            'numérique': '💻',
            'cuisine': '🥞',
            'spectacle': '🎭',
            'montessori': '🧸',
            'écriture': '✍️',
            'sortie': '🚌'
        };
        return icons[category] || '📅';
    }
    
    getCategoryName(category) {
        const names = {
            'numérique': 'Café numérique',
            'cuisine': 'Atelier cuisine',
            'spectacle': 'Spectacle',
            'montessori': 'Montessori',
            'écriture': 'Atelier écriture',
            'sortie': 'Sortie culturelle'
        };
        return names[category] || category;
    }
    
    getRecurrenceText(event) {
        if (event.recurring === 'weekly') {
            return `Tous les ${event.recurrence_day}s`;
        } else if (event.recurring === 'monthly') {
            return event.recurrence_frequency || 'Mensuel';
        }
        return 'Récurrent';
    }
    
    showError() {
        const container = document.getElementById('events-container');
        container.innerHTML = `
            <div class="no-events">
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les événements. Veuillez réessayer plus tard.</p>
                <button class="btn btn--primary" onclick="location.reload()">Actualiser</button>
            </div>
        `;
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les styles d'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialiser le gestionnaire d'agenda
    new AgendaManager();
});

// ===== FONCTIONS UTILITAIRES =====
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function isEventUpcoming(dateString) {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
}

// Fonction pour exporter l'agenda (fonctionnalité avancée)
function exportToCalendar(event) {
    const startDate = new Date(event.date + 'T' + event.time.split('-')[0]);
    const endDate = new Date(event.date + 'T' + event.time.split('-')[1]);
    
    const calendarEvent = {
        title: event.title,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        description: event.description,
        location: event.location
    };
    
    // Créer un lien de téléchargement .ics
    const icsContent = createICSContent(calendarEvent);
    downloadICS(icsContent, event.title);
}

function createICSContent(event) {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anim'Media//Events//FR
BEGIN:VEVENT
UID:${Date.now()}@anim-media.fr
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.start.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${event.end.replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
}

function downloadICS(content, filename) {
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

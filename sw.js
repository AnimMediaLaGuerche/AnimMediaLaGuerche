const CACHE_NAME = 'anim-media-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/animations.css',
  '/assets/js/main.js',
  '/assets/js/agenda.js',
  '/pages/activites.html',
  '/pages/agenda.html',
  '/pages/association.html',
  '/pages/contact.html',
  '/pages/galerie.html',
  '/pages/partenaires.html',
  '/data/events.json',
  '/data/activities.json',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache : Network First avec fallback
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Si la requête réussit, mettre en cache et retourner
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        // En cas d'échec réseau, utiliser le cache
        return caches.match(event.request).then(function(response) {
          if (response) {
            return response;
          }
          // Fallback pour les pages non mises en cache
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Gestion des notifications push (pour future utilisation)
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Nouveau contenu disponible !',
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir les nouveautés',
        icon: '/assets/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/assets/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Anim\'Média', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/pages/agenda.html')
    );
  }
});

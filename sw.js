self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v4').then((cache) => {
        return cache.addAll([
          'offline.html', // Page à afficher quand hors connexion
          'app.js',
          'api.js',
          'images/cafe.png',
          'site.manifest'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match('offline.html'); // Renvoie la page hors ligne si la requête échoue
        });
      })
    );
  });
  
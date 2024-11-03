self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v1').then((cache) => {
        return cache.addAll([
        '/',
          'index.html',
          'offline.html', // Page à afficher quand hors connexion
          'styles.css',
          'app.js',
          'api.js',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match('/offline.html'); // Renvoie la page hors ligne si la requête échoue
        });
      })
    );
  });
  

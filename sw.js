self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v11').then((cache) => {
        return cache.addAll([
          'offline.html', // Page à afficher quand hors connexion
          'app.js',
          'api.js',
          'images/cafe.png',
          'https://unpkg.com/pulltorefreshjs@0.1.22/dist/index.umd.js',
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
  
self.addEventListener('install', function (event) {
  console.log('SW Installed');
  event.waitUntil(
    caches.open('static')
      .then(function (cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/sales.html',
          '/src/css/bootstrap.min.css',
          '/src/js/bootstrap.min.js',
          '/src/css/sales.css',
          '/src/css/toast.css',
          '/src/js/toast.js',
          '/src/js/sales.js',
          '/src/js/time.js',
          '/src/js/jquery.js',
          '/src/js/app.js',
          '/src/css/app.css',
          '/src/images/favicon/apple-touch-icon.png',
          '/src/images/favicon/favicon-32x32.png',
          '/src/images/favicon/favicon-16x16.png',
          '/src/images/favicon/site.webmanifest',
          'https://fonts.googleapis.com/css?family=Oswald',
          '/src/js/kit.js',
          '/src/images/bg.avif'
        ]);
      })
  );
});

self.addEventListener('activate', function (event) {
  console.log('SW Activated');
  // Clean up old caches here if necessary
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (res) {
        return res || fetch(event.request)
          .then(function (response) {
            // Cache the fetched response for future use
            return caches.open('static')
              .then(function (cache) {
                cache.put(event.request, response.clone());
                return response;
              });
          });
      })
  );
});

let swCache = 'npri-dex';

let localAssets = [ '/',
                    '/bundle.js',
                    '/index.html',
                    '/manifest.json',
                    '/styles.css', ];

let CDNAssets = [ 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/layers.png',
                  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/layers-2x.png',
                  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-icon.png',
                  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-icon-2x.png',
                  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-shadow.png',
                  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css',
                  'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
                  'https://fonts.googleapis.com/icon?family=Material+Icons', ];

self.addEventListener( 'install',
                       ( evt ) =>
                         evt.waitUntil( caches.open( swCache )
                                        .then( ( cache ) =>
                                                 cache.addAll( localAssets ) ),
                                        CDNAssets.map( ( request ) =>
                                                         fetch( request, { mode: 'no-cors' } )
                                                         .then( ( response ) =>
                                                                  caches.open( swCache )
                                                                  .then( ( cache ) =>
                                                                           cache.put( request , response ) ) ) ) ) );

self.addEventListener( 'fetch', ( event ) =>
                                  event.respondWith( caches.match( event.request )
                                                     .then( ( response ) =>
                                                              ( response || fetch( event.request ) ) ) ) );

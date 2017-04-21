importScripts( '/cache-polyfill.js' );
self.addEventListener( 'install', function( e ) {
  e.waitUntil( caches.open( 'airhorner' ).then( function( cache ) {
    return cache.addAll( [
      '/',
      '/bundle.js',
      '/favicon.ico',
      '/index.html',
      '/manifest.json',
      '/styles.css',
      '/images/launcher-icon-0-75x.png',
      '/images/launcher-icon-1-5x.png',
      '/images/launcher-icon-1x.png',
      '/images/launcher-icon-2x.png',
      '/images/launcher-icon-3x.png',
      '/images/launcher-icon-3-5x.png',
      '/images/launcher-icon-4x.png',
      '/images/launcher-icon-8x.png',
      '/images/launcher-icon.png',
      '/images/icons/favicon-16x16.png',
      '/images/icons/favicon-32x32.png',
      '/images/icons/favicon-96x96.png',
      ] );
    } )
  );
} );
self.addEventListener( 'fetch', function( event ) {
  console.log( event.request.url );
  event.respondWith(
  caches.match( event.request ).then( function( response ) {
    return response || fetch( event.request );
  } )
  );
} );
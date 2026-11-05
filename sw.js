const CACHE='silkloop-2027-v7';
const SHELL=['./','./index.html','./app.css?v=7','./stays.js?v=7','./stays.css?v=7','./trip-tools.js?v=7','./app.js?v=7','./data.js?v=7','./private-vault.js?v=7','./preparation.js?v=7','./flight-watch.js?v=7','./planning.js?v=7','./food.js?v=7','./fruit.js?v=7','./toilets.js?v=7','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('silkloop-2027-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  // Online map tiles belong to their provider and are never prefetched here.
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});



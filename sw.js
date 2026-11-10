const CACHE='silkloop-2027-v20';
const SHELL=['./revision58.js?v=20','./revision58-reference.md','./','./fare-targets.js?v=20','./fare-reference.md','./booking-data.js?v=20','./booking-calendar.js?v=20','./booking-calendar.css?v=20','./booking-reference.md','./dining.css?v=20','./dining-data.js?v=20','./dining.js?v=20','./dining-reference.md','./index.html','./app.css?v=20','./postcards.css?v=20','./postcards.js?v=20','./postcards-reference.md','./stays.js?v=20','./stays.css?v=20','./trip-tools.js?v=20','./app.js?v=20','./data.js?v=20','./private-vault.js?v=20','./preparation.js?v=20','./flight-watch.js?v=20','./planning.js?v=20','./food.js?v=20','./fruit.js?v=20','./toilets.js?v=20','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



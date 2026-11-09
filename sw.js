const CACHE='silkloop-2027-v18';
const SHELL=['./revision58.js?v=18','./revision58-reference.md','./','./fare-targets.js?v=18','./fare-reference.md','./booking-data.js?v=18','./booking-calendar.js?v=18','./booking-calendar.css?v=18','./booking-reference.md','./dining.css?v=18','./dining-data.js?v=18','./dining.js?v=18','./dining-reference.md','./index.html','./app.css?v=18','./postcards.css?v=18','./postcards.js?v=18','./postcards-reference.md','./stays.js?v=18','./stays.css?v=18','./trip-tools.js?v=18','./app.js?v=18','./data.js?v=18','./private-vault.js?v=18','./preparation.js?v=18','./flight-watch.js?v=18','./planning.js?v=18','./food.js?v=18','./fruit.js?v=18','./toilets.js?v=18','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



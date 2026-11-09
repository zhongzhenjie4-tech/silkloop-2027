const CACHE='silkloop-2027-v17';
const SHELL=['./revision58.js?v=17','./revision58-reference.md','./','./fare-targets.js?v=17','./fare-reference.md','./booking-data.js?v=17','./booking-calendar.js?v=17','./booking-calendar.css?v=17','./booking-reference.md','./dining.css?v=17','./dining-data.js?v=17','./dining.js?v=17','./dining-reference.md','./index.html','./app.css?v=17','./postcards.css?v=17','./postcards.js?v=17','./postcards-reference.md','./stays.js?v=17','./stays.css?v=17','./trip-tools.js?v=17','./app.js?v=17','./data.js?v=17','./private-vault.js?v=17','./preparation.js?v=17','./flight-watch.js?v=17','./planning.js?v=17','./food.js?v=17','./fruit.js?v=17','./toilets.js?v=17','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



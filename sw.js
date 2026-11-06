const CACHE='silkloop-2027-v12';
const SHELL=['./','./fare-targets.js?v=12','./fare-reference.md','./booking-data.js?v=12','./booking-calendar.js?v=12','./booking-calendar.css?v=12','./booking-reference.md','./dining.css?v=12','./dining-data.js?v=12','./dining.js?v=12','./dining-reference.md','./index.html','./app.css?v=12','./postcards.css?v=12','./postcards.js?v=12','./postcards-reference.md','./stays.js?v=12','./stays.css?v=12','./trip-tools.js?v=12','./app.js?v=12','./data.js?v=12','./private-vault.js?v=12','./preparation.js?v=12','./flight-watch.js?v=12','./planning.js?v=12','./food.js?v=12','./fruit.js?v=12','./toilets.js?v=12','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



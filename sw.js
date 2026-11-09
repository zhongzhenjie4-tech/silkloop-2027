const CACHE='silkloop-2027-v16';
const SHELL=['./revision58.js?v=16','./revision58-reference.md','./','./fare-targets.js?v=16','./fare-reference.md','./booking-data.js?v=16','./booking-calendar.js?v=16','./booking-calendar.css?v=16','./booking-reference.md','./dining.css?v=16','./dining-data.js?v=16','./dining.js?v=16','./dining-reference.md','./index.html','./app.css?v=16','./postcards.css?v=16','./postcards.js?v=16','./postcards-reference.md','./stays.js?v=16','./stays.css?v=16','./trip-tools.js?v=16','./app.js?v=16','./data.js?v=16','./private-vault.js?v=16','./preparation.js?v=16','./flight-watch.js?v=16','./planning.js?v=16','./food.js?v=16','./fruit.js?v=16','./toilets.js?v=16','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



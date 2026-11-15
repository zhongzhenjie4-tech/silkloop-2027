const CACHE='silkloop-2027-v23';
const SHELL=['./ledger-rates.js?v=23','./geo-data.js?v=23','./geo.js?v=23','./geo-reference.md','./ledger-public-data.js?v=23','./ledger-store.js?v=23','./ledger-reference.md','./ledger-core.js?v=23','./ledger.js?v=23','./ledger.css?v=23','./revision58.js?v=23','./revision58-reference.md','./','./fare-targets.js?v=23','./fare-reference.md','./booking-data.js?v=23','./booking-calendar.js?v=23','./booking-calendar.css?v=23','./booking-reference.md','./dining.css?v=23','./dining-data.js?v=23','./dining.js?v=23','./dining-reference.md','./index.html','./app.css?v=23','./postcards.css?v=23','./postcards.js?v=23','./postcards-reference.md','./stays.js?v=23','./stays.css?v=23','./trip-tools.js?v=23','./app.js?v=23','./data.js?v=23','./private-vault.js?v=23','./preparation.js?v=23','./flight-watch.js?v=23','./planning.js?v=23','./food.js?v=23','./fruit.js?v=23','./toilets.js?v=23','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



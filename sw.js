const CACHE='silkloop-2027-v26';
const SHELL=['./itinerary26-central.js?v=26','./itinerary26-caucasus-balkans.js?v=26','./itinerary26-turkiye-egypt.js?v=26','./itinerary26-uae.js?v=26','./itinerary26.js?v=26','./itinerary26-reference.md','./ledger-rates.js?v=26','./geo-data.js?v=26','./geo.js?v=26','./geo-reference.md','./ledger-public-data.js?v=26','./ledger-store.js?v=26','./ledger-reference.md','./ledger-core.js?v=26','./ledger.js?v=26','./ledger.css?v=26','./revision58.js?v=26','./revision58-reference.md','./','./fare-targets.js?v=26','./fare-reference.md','./booking-data.js?v=26','./booking-calendar.js?v=26','./booking-calendar.css?v=26','./booking-reference.md','./dining.css?v=26','./dining-data.js?v=26','./dining.js?v=26','./dining-reference.md','./index.html','./app.css?v=26','./postcards.css?v=26','./postcards.js?v=26','./postcards-reference.md','./stays.js?v=26','./stays.css?v=26','./trip-tools.js?v=26','./app.js?v=26','./data.js?v=26','./private-vault.js?v=26','./preparation.js?v=26','./flight-watch.js?v=26','./planning.js?v=26','./food.js?v=26','./fruit.js?v=26','./toilets.js?v=26','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



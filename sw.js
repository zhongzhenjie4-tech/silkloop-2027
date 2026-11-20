const CACHE='silkloop-2027-v27';
const SHELL=['./itinerary26-central.js?v=27','./itinerary26-caucasus-balkans.js?v=27','./itinerary26-turkiye-egypt.js?v=27','./itinerary26-uae.js?v=27','./itinerary26.js?v=27','./itinerary27-egypt.js?v=27','./itinerary27-uae.js?v=27','./itinerary27-reference.md','./itinerary26-reference.md','./ledger-rates.js?v=27','./geo-data.js?v=27','./geo.js?v=27','./geo-reference.md','./ledger-public-data.js?v=27','./ledger-store.js?v=27','./ledger-reference.md','./ledger-core.js?v=27','./ledger.js?v=27','./ledger.css?v=27','./revision58.js?v=27','./revision58-reference.md','./','./fare-targets.js?v=27','./fare-reference.md','./booking-data.js?v=27','./booking-calendar.js?v=27','./booking-calendar.css?v=27','./booking-reference.md','./dining.css?v=27','./dining-data.js?v=27','./dining.js?v=27','./dining-reference.md','./index.html','./app.css?v=27','./postcards.css?v=27','./postcards.js?v=27','./postcards-reference.md','./stays.js?v=27','./stays.css?v=27','./trip-tools.js?v=27','./app.js?v=27','./data.js?v=27','./private-vault.js?v=27','./preparation.js?v=27','./flight-watch.js?v=27','./planning.js?v=27','./food.js?v=27','./fruit.js?v=27','./toilets.js?v=27','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



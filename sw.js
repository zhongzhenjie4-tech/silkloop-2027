const CACHE='silkloop-2027-v24';
const SHELL=['./ledger-rates.js?v=24','./geo-data.js?v=24','./geo.js?v=24','./geo-reference.md','./ledger-public-data.js?v=24','./ledger-store.js?v=24','./ledger-reference.md','./ledger-core.js?v=24','./ledger.js?v=24','./ledger.css?v=24','./revision58.js?v=24','./revision58-reference.md','./','./fare-targets.js?v=24','./fare-reference.md','./booking-data.js?v=24','./booking-calendar.js?v=24','./booking-calendar.css?v=24','./booking-reference.md','./dining.css?v=24','./dining-data.js?v=24','./dining.js?v=24','./dining-reference.md','./index.html','./app.css?v=24','./postcards.css?v=24','./postcards.js?v=24','./postcards-reference.md','./stays.js?v=24','./stays.css?v=24','./trip-tools.js?v=24','./app.js?v=24','./data.js?v=24','./private-vault.js?v=24','./preparation.js?v=24','./flight-watch.js?v=24','./planning.js?v=24','./food.js?v=24','./fruit.js?v=24','./toilets.js?v=24','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



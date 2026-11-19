const CACHE='silkloop-2027-v25';
const SHELL=['./ledger-rates.js?v=25','./geo-data.js?v=25','./geo.js?v=25','./geo-reference.md','./ledger-public-data.js?v=25','./ledger-store.js?v=25','./ledger-reference.md','./ledger-core.js?v=25','./ledger.js?v=25','./ledger.css?v=25','./revision58.js?v=25','./revision58-reference.md','./','./fare-targets.js?v=25','./fare-reference.md','./booking-data.js?v=25','./booking-calendar.js?v=25','./booking-calendar.css?v=25','./booking-reference.md','./dining.css?v=25','./dining-data.js?v=25','./dining.js?v=25','./dining-reference.md','./index.html','./app.css?v=25','./postcards.css?v=25','./postcards.js?v=25','./postcards-reference.md','./stays.js?v=25','./stays.css?v=25','./trip-tools.js?v=25','./app.js?v=25','./data.js?v=25','./private-vault.js?v=25','./preparation.js?v=25','./flight-watch.js?v=25','./planning.js?v=25','./food.js?v=25','./fruit.js?v=25','./toilets.js?v=25','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



const CACHE='silkloop-2027-v21';
const SHELL=['./ledger-reference.md','./ledger-core.js?v=21','./ledger.js?v=21','./ledger.css?v=21','./revision58.js?v=21','./revision58-reference.md','./','./fare-targets.js?v=21','./fare-reference.md','./booking-data.js?v=21','./booking-calendar.js?v=21','./booking-calendar.css?v=21','./booking-reference.md','./dining.css?v=21','./dining-data.js?v=21','./dining.js?v=21','./dining-reference.md','./index.html','./app.css?v=21','./postcards.css?v=21','./postcards.js?v=21','./postcards-reference.md','./stays.js?v=21','./stays.css?v=21','./trip-tools.js?v=21','./app.js?v=21','./data.js?v=21','./private-vault.js?v=21','./preparation.js?v=21','./flight-watch.js?v=21','./planning.js?v=21','./food.js?v=21','./fruit.js?v=21','./toilets.js?v=21','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



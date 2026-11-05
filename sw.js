const CACHE='silkloop-2027-v11';
const SHELL=['./','./booking-data.js?v=11','./booking-calendar.js?v=11','./booking-calendar.css?v=11','./booking-reference.md','./dining.css?v=11','./dining-data.js?v=11','./dining.js?v=11','./dining-reference.md','./index.html','./app.css?v=11','./postcards.css?v=11','./postcards.js?v=11','./postcards-reference.md','./stays.js?v=11','./stays.css?v=11','./trip-tools.js?v=11','./app.js?v=11','./data.js?v=11','./private-vault.js?v=11','./preparation.js?v=11','./flight-watch.js?v=11','./planning.js?v=11','./food.js?v=11','./fruit.js?v=11','./toilets.js?v=11','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



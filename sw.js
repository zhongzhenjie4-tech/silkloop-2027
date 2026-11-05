const CACHE='silkloop-2027-v10';
const SHELL=['./','./dining.css?v=10','./dining-data.js?v=10','./dining.js?v=10','./dining-reference.md','./index.html','./app.css?v=10','./postcards.css?v=10','./postcards.js?v=10','./postcards-reference.md','./stays.js?v=10','./stays.css?v=10','./trip-tools.js?v=10','./app.js?v=10','./data.js?v=10','./private-vault.js?v=10','./preparation.js?v=10','./flight-watch.js?v=10','./planning.js?v=10','./food.js?v=10','./fruit.js?v=10','./toilets.js?v=10','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
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



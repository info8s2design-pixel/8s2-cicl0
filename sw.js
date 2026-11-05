const CACHE='ciclo-shell-v1.6.3-simple-20261105';
const BASE=new URL('./',self.location.href);
const SHELL=['./','./index.html','./logo-cicl0.svg','./favicon.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL.map(p=>new Request(new URL(p,BASE),{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ciclo-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 const page=event.request.mode==='navigate'&&(url.pathname===BASE.pathname||url.pathname===new URL('index.html',BASE).pathname);
 const staticAsset=SHELL.some(p=>url.pathname===new URL(p,BASE).pathname);
 if(!page&&!staticAsset)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{const response=await fetch(event.request);if(!response.ok)throw Error('Unavailable');await cache.put(event.request,response.clone());return response}
  catch(error){return await cache.match(event.request)|| (page?await cache.match(new URL('index.html',BASE)):null)||Response.error()}
 })());
});

const CACHE="comcome-a31-v1";
const CORE=["./","./index.html","./manifest.json","./logo.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 if(u.origin===self.location.origin||u.hostname==="cdnjs.cloudflare.com"){
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
   if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
   return res;
  }).catch(()=>u.origin===self.location.origin?caches.match("./index.html"):Promise.reject())));
 }
});
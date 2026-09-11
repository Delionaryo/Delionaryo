export default function handler(_req:any,res:any){
  res.setHeader('Content-Type','application/javascript; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('Service-Worker-Allowed','/start/');
  res.status(200).send(`const CACHE='delionaryo-start-live-v2';
const CORE=['/start/','/start/manifest.webmanifest','/start/icon.png'];
const AUTH_PATHS=new Set(['/login','/start/login.html']);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(AUTH_PATHS.has(url.pathname)){
    event.respondWith(fetch(new Request(request,{cache:'no-store'})));
    return;
  }
  if(request.mode==='navigate'){
    event.respondWith(fetch(new Request(request,{cache:'no-store'})).catch(()=>caches.match('/start/')));
    return;
  }
  event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request)));
});`);
}

export default function handler(_req:any,res:any){
  res.setHeader('Content-Type','application/javascript; charset=utf-8');
  res.setHeader('Cache-Control','no-cache');
  res.setHeader('Service-Worker-Allowed','/start/');
  res.status(200).send(`const CACHE='delionaryo-start-live-v1';
const CORE=['/start/','/start/manifest.webmanifest','/start/icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));return response;}).catch(()=>caches.match(request).then(hit=>hit||caches.match('/start/'))));
});`);
}

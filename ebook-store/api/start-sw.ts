export default function handler(_req:any,res:any){
  res.setHeader('Content-Type','application/javascript; charset=utf-8');
  res.setHeader('Cache-Control','no-cache, max-age=0, must-revalidate');
  res.setHeader('Service-Worker-Allowed','/start/');
  res.status(200).send(`const CACHE='delionaryo-start-live-v4';
const SHELL='/start/';
const CORE=[SHELL,'/start/manifest.webmanifest','/start/icon.png'];
const AUTH_PATHS=new Set(['/login','/start/login.html','/start/logout.html']);
const START_PATHS=new Set(['/start','/start/','/start/index.html']);

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim())
));

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  // Authentication pages are always network-only and are never cached.
  if(AUTH_PATHS.has(url.pathname)){
    event.respondWith(fetch(new Request(request,{cache:'no-store'})));
    return;
  }

  // Start navigation is stale-while-revalidate: render the cached shell first,
  // then refresh it in the background for the next navigation.
  if(request.mode==='navigate'&&START_PATHS.has(url.pathname)){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      const cached=await cache.match(SHELL);
      const refresh=fetch(request).then(response=>{
        if(response.ok)cache.put(SHELL,response.clone());
        return response;
      });
      if(cached){
        event.waitUntil(refresh.catch(()=>undefined));
        return cached;
      }
      try{return await refresh;}catch(_error){return caches.match(SHELL);}
    })());
    return;
  }

  // Public Start assets are cache-first with background refresh.
  if(url.pathname.startsWith('/start/')){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      const cached=await cache.match(request);
      const refresh=fetch(request).then(response=>{
        if(response.ok)cache.put(request,response.clone());
        return response;
      });
      if(cached){
        event.waitUntil(refresh.catch(()=>undefined));
        return cached;
      }
      return refresh;
    })());
  }
});`);
}

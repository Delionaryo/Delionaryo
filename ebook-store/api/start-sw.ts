export default function handler(_req:any,res:any){
  res.setHeader('Content-Type','application/javascript; charset=utf-8');
  res.setHeader('Cache-Control','no-cache, max-age=0, must-revalidate');
  res.setHeader('Service-Worker-Allowed','/start/');
  res.status(200).send(`
const RETIRED='delionaryo-start-retired-v5';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('delionaryo-start-')).map(key=>caches.delete(key)));
    await self.clients.claim();
    await self.registration.unregister();
  })());
});
`);
}

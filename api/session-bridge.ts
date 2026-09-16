export default function handler(_req:any,res:any){
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'unsafe-inline'; frame-ancestors https://factory.gapcreation.space https://economy.gapcreation.space https://app.gapcreation.space");
  res.status(200).send(`<!doctype html><html><head><meta charset="utf-8"><title>DELIONARYO Session Bridge</title></head><body><script>
(() => {
  const STORAGE_KEY = 'sb-haobyqmpgrtmmjotjzpd-auth-token';
  const ALLOWED = new Set(['https://factory.gapcreation.space','https://economy.gapcreation.space','https://app.gapcreation.space']);
  function readSession(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw)return null;
      const parsed=JSON.parse(raw);
      const session=parsed?.currentSession||parsed?.session||parsed;
      if(!session?.access_token)return null;
      return {access_token:session.access_token,refresh_token:session.refresh_token||null,expires_at:session.expires_at||null,expires_in:session.expires_in||null,token_type:session.token_type||'bearer',user:session.user||null};
    }catch(_){return null;}
  }
  function send(targetWindow,targetOrigin){
    if(!targetWindow||!ALLOWED.has(targetOrigin))return;
    targetWindow.postMessage({type:'DELIONARYO_CORE_SESSION',session:readSession()},targetOrigin);
  }
  window.addEventListener('message',(event)=>{
    if(!ALLOWED.has(event.origin))return;
    if(event.data?.type!=='DELIONARYO_CORE_SESSION_REQUEST')return;
    send(event.source,event.origin);
  });
  try{
    const parentOrigin=document.referrer?new URL(document.referrer).origin:'';
    if(window.parent!==window&&ALLOWED.has(parentOrigin))send(window.parent,parentOrigin);
  }catch(_){}
})();
</script></body></html>`);
}

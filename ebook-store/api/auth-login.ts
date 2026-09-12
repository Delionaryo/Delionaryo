const SUPABASE_URL='https://tordvwlrtwxlbuuzgklt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW';
const DEFAULT_RETURN='https://hub.gapcreation.space/';
const ALLOWED_RETURN_ORIGINS=new Set(['https://app.gapcreation.space','https://hub.gapcreation.space']);

function noStore(res:any){
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  res.setHeader('Pragma','no-cache');
  res.setHeader('Vary','Cookie');
}
function safeReturn(value:any){
  try{const u=new URL(String(value||DEFAULT_RETURN));if(u.protocol==='https:'&&ALLOWED_RETURN_ORIGINS.has(u.origin))return u.toString()}catch(_){ }
  return DEFAULT_RETURN;
}
function cookie(name:string,value:string,opts:{domain?:string;maxAge:number}){
  const parts=[`${name}=${encodeURIComponent(value)}`,'Path=/','HttpOnly','Secure','SameSite=Lax',`Max-Age=${opts.maxAge}`];
  if(opts.domain)parts.push(`Domain=${opts.domain}`);
  return parts.join('; ');
}
function bodyOf(req:any){
  if(typeof req.body==='string'){try{return JSON.parse(req.body)}catch(_){return {}}}
  return req.body||{};
}

export default async function handler(req:any,res:any){
  noStore(res);
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'})}
  const body=bodyOf(req);
  const email=String(body.email||'').trim().toLowerCase();
  const password=String(body.password||'');
  if(!email||!password)return res.status(400).json({ok:false,error:'EMAIL_AND_PASSWORD_REQUIRED'});
  try{
    const response=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_PUBLISHABLE_KEY},
      body:JSON.stringify({email,password})
    });
    const payload=await response.json().catch(()=>({}));
    if(!response.ok||!payload?.access_token||!payload?.refresh_token){
      return res.status(response.status===400?401:response.status).json({ok:false,error:payload?.msg||payload?.error_description||payload?.message||'INVALID_CREDENTIALS'});
    }
    const accessAge=Math.max(300,Math.min(Number(payload.expires_in)||3600,3600));
    res.setHeader('Set-Cookie',[
      cookie('dl_sso_access',payload.access_token,{domain:'.gapcreation.space',maxAge:accessAge}),
      cookie('dl_sso_refresh',payload.refresh_token,{maxAge:60*60*24*30})
    ]);
    return res.status(200).json({ok:true,returnTo:safeReturn(body.returnTo)});
  }catch(_){
    return res.status(503).json({ok:false,error:'AUTH_SERVICE_UNAVAILABLE'});
  }
}

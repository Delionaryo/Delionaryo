const SUPABASE_URL='https://tordvwlrtwxlbuuzgklt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW';

function noStore(res:any){res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('Pragma','no-cache');res.setHeader('Vary','Cookie')}
function parseCookies(req:any){const out:any={};String(req.headers?.cookie||'').split(';').forEach((part:string)=>{const i=part.indexOf('=');if(i<0)return;const k=part.slice(0,i).trim();const v=part.slice(i+1).trim();try{out[k]=decodeURIComponent(v)}catch(_){out[k]=v}});return out}
function cookie(name:string,value:string,opts:{domain?:string;maxAge:number}){const parts=[`${name}=${encodeURIComponent(value)}`,'Path=/','HttpOnly','Secure','SameSite=Lax',`Max-Age=${opts.maxAge}`];if(opts.domain)parts.push(`Domain=${opts.domain}`);return parts.join('; ')}
async function validate(access:string){
  if(!access)return null;
  const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{'apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':`Bearer ${access}`}});
  if(!r.ok)return null;
  return r.json().catch(()=>null);
}

export default async function handler(req:any,res:any){
  noStore(res);
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({authenticated:false})}
  const cookies=parseCookies(req);
  try{
    const current=await validate(cookies.dl_sso_access||'');
    if(current)return res.status(200).json({authenticated:true});
    const refresh=cookies.dl_sso_refresh||'';
    if(!refresh)return res.status(401).json({authenticated:false});
    const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_PUBLISHABLE_KEY},body:JSON.stringify({refresh_token:refresh})});
    const payload=await r.json().catch(()=>({}));
    if(!r.ok||!payload?.access_token||!payload?.refresh_token)return res.status(401).json({authenticated:false});
    const verified=await validate(payload.access_token);
    if(!verified)return res.status(401).json({authenticated:false});
    const accessAge=Math.max(300,Math.min(Number(payload.expires_in)||3600,3600));
    res.setHeader('Set-Cookie',[
      cookie('dl_sso_access',payload.access_token,{domain:'.gapcreation.space',maxAge:accessAge}),
      cookie('dl_sso_refresh',payload.refresh_token,{maxAge:60*60*24*30})
    ]);
    return res.status(200).json({authenticated:true});
  }catch(_){
    return res.status(503).json({authenticated:false,error:'AUTH_SERVICE_UNAVAILABLE'});
  }
}

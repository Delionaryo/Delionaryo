const SUPABASE_URL='https://tordvwlrtwxlbuuzgklt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW';
const DEFAULT_RETURN='https://hub.gapcreation.space/';
const PERSISTENT_REFRESH_AGE=60*60*24*400;
const ALLOWED_RETURN_ORIGINS=new Set([
  'https://app.gapcreation.space',
  'https://hub.gapcreation.space',
  'https://campus.gapcreation.space',
  'https://library.gapcreation.space',
  'https://wallet.gapcreation.space',
  'https://market.gapcreation.space',
  'https://marketplace.gapcreation.space',
  'https://nation.gapcreation.space',
  'https://moneyflow.gapcreation.space',
  'https://business.gapcreation.space',
  'https://dpbs.gapcreation.space',
  'https://tracker.gapcreation.space',
  'https://consultant.gapcreation.space',
  'https://pay.gapcreation.space',
  'https://watch.gapcreation.space'
]);

function noStore(res:any){res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('Pragma','no-cache');res.setHeader('Vary','Cookie')}
function parseCookies(req:any){const out:any={};String(req.headers?.cookie||'').split(';').forEach((part:string)=>{const i=part.indexOf('=');if(i<0)return;const k=part.slice(0,i).trim();const v=part.slice(i+1).trim();try{out[k]=decodeURIComponent(v)}catch(_){out[k]=v}});return out}
function safeReturn(value:any){try{const u=new URL(String(value||DEFAULT_RETURN));if(u.protocol==='https:'&&ALLOWED_RETURN_ORIGINS.has(u.origin))return u.toString()}catch(_){ }return DEFAULT_RETURN}
function cookie(name:string,value:string,opts:{domain?:string;maxAge:number}){const parts=[`${name}=${encodeURIComponent(value)}`,'Path=/','HttpOnly','Secure','SameSite=Lax',`Max-Age=${opts.maxAge}`];if(opts.domain)parts.push(`Domain=${opts.domain}`);return parts.join('; ')}
function clearCookies(){return [cookie('dl_sso_access','',{domain:'.gapcreation.space',maxAge:0}),cookie('dl_sso_refresh','',{maxAge:0})]}
function loginUrl(target:string){return `/start/login.html?returnTo=${encodeURIComponent(target)}`}

export default async function handler(req:any,res:any){
  noStore(res);
  if(req.method!=='GET'&&req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).end()}
  const target=safeReturn(req.query?.returnTo);
  const refresh=parseCookies(req).dl_sso_refresh||'';
  if(!refresh){res.setHeader('Set-Cookie',clearCookies());res.setHeader('Location',loginUrl(target));return res.status(302).end()}
  try{
    const response=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{
      method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_PUBLISHABLE_KEY},body:JSON.stringify({refresh_token:refresh})
    });
    const payload=await response.json().catch(()=>({}));
    if(!response.ok||!payload?.access_token||!payload?.refresh_token){res.setHeader('Set-Cookie',clearCookies());res.setHeader('Location',loginUrl(target));return res.status(302).end()}
    const accessAge=Math.max(300,Math.min(Number(payload.expires_in)||3600,3600));
    res.setHeader('Set-Cookie',[
      cookie('dl_sso_access',payload.access_token,{domain:'.gapcreation.space',maxAge:accessAge}),
      cookie('dl_sso_refresh',payload.refresh_token,{maxAge:PERSISTENT_REFRESH_AGE})
    ]);
    res.setHeader('Location',target);
    return res.status(302).end();
  }catch(_){
    res.setHeader('Location',loginUrl(target));
    return res.status(302).end();
  }
}

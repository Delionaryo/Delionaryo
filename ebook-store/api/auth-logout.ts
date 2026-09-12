function noStore(res:any){res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('Pragma','no-cache');res.setHeader('Vary','Cookie')}
function cookie(name:string,value:string,opts:{domain?:string;maxAge:number}){const parts=[`${name}=${encodeURIComponent(value)}`,'Path=/','HttpOnly','Secure','SameSite=Lax',`Max-Age=${opts.maxAge}`];if(opts.domain)parts.push(`Domain=${opts.domain}`);return parts.join('; ')}
export default function handler(req:any,res:any){
  noStore(res);
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false})}
  res.setHeader('Set-Cookie',[
    cookie('dl_sso_access','',{domain:'.gapcreation.space',maxAge:0}),
    cookie('dl_sso_refresh','',{maxAge:0})
  ]);
  return res.status(200).json({ok:true});
}

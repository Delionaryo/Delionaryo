const MARKET_ATTRIBUTION='https://market.gapcreation.space/api/reseller-attribution';
const str=(v:any,n=220)=>String(v??'').trim().slice(0,n);
export default async function handler(req:any,res:any){
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'})}
  const listing=str(req.body?.listing_id,80),product=str(req.body?.product_id,180)||null,ref=str(req.body?.ref,64),video=str(req.body?.source_video_id,180)||null;
  if(!/^[0-9a-f-]{36}$/i.test(listing)||!/^DLR-[A-F0-9]{16}$/.test(ref))return res.status(400).json({ok:false,error:'INVALID_ATTRIBUTION'});
  try{
    const r=await fetch(MARKET_ATTRIBUTION,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({source_storefront:'MARKETPLACE',listing_id:listing,product_id:product,ref,source_surface:'WATCH_EARN_PUBLIC',source_video_id:video}),cache:'no-store'});
    const data=await r.json().catch(()=>null);
    const cookie=r.headers.get('set-cookie');
    if(r.ok&&cookie&&cookie.includes('__Secure-dlr_reseller_attr='))res.setHeader('Set-Cookie',cookie);
    if(!r.ok||!data?.attribution_token)return res.status(400).json({ok:false,error:data?.error||'ATTRIBUTION_NOT_BOUND'});
    return res.status(200).json({ok:true,attribution_token:data.attribution_token});
  }catch{return res.status(503).json({ok:false,error:'ATTRIBUTION_UNAVAILABLE'})}
}

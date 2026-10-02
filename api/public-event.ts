const CORE_URL='https://haobyqmpgrtmmjotjzpd.supabase.co';
const CORE_KEY=process.env.CORE_SUPABASE_PUBLISHABLE_KEY||process.env.VITE_CORE_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_uHn6cOZGe2zQq3QHg_rEdw_M_pU0URb';
const ALLOWED=new Set([
  'VIDEO_IMPRESSION','VIDEO_PLAY','QUALIFIED_WATCH','PRODUCT_VIEW','ADD_TO_CART',
  'CHECKOUT_STARTED','ORDER_CREATED','PAYMENT_COMPLETED','ORDER_FULFILLED','ORDER_DELIVERED','VERIFIED_REVIEW'
]);
const text=(v:any,n:number)=>{const s=String(v??'').trim();return s?s.slice(0,n):null};
const plainObject=(v:any)=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};

export default async function handler(req:any,res:any){
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'})}
  if(!CORE_KEY)return res.status(503).json({ok:false,error:'CORE_NOT_CONFIGURED'});
  const b=plainObject(req.body);
  const eventType=String(b.event_type||'').trim().toUpperCase();
  const session=text(b.anonymous_session_id,120);
  if(!ALLOWED.has(eventType))return res.status(400).json({ok:false,error:'INVALID_EVENT_TYPE'});
  if(!session||session.length<8)return res.status(400).json({ok:false,error:'SESSION_REQUIRED'});
  const metadata=plainObject(b.metadata);
  let metadataJson='{}';
  try{metadataJson=JSON.stringify(metadata)}catch{}
  if(metadataJson.length>2400)return res.status(413).json({ok:false,error:'METADATA_TOO_LARGE'});
  const row={
    event_type:eventType,
    anonymous_session_id:session,
    attribution_token:text(b.attribution_token,160),
    product_id:text(b.product_id,180),
    seller_affiliate_id:text(b.seller_affiliate_id,180),
    campaign_id:text(b.campaign_id,180),
    video_id:text(b.video_id,180),
    store_id:text(b.store_id,180),
    order_id:text(b.order_id,180),
    page_path:text(b.page_path,500),
    metadata
  };
  try{
    const r=await fetch(CORE_URL+'/rest/v1/public_acquisition_events',{
      method:'POST',
      headers:{apikey:CORE_KEY,Authorization:'Bearer '+CORE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify(row),
      cache:'no-store'
    });
    if(!r.ok)return res.status(202).json({ok:false,accepted:false,error:'EVENT_NOT_RECORDED'});
    return res.status(202).json({ok:true,accepted:true});
  }catch{return res.status(202).json({ok:false,accepted:false,error:'EVENT_NOT_RECORDED'})}
}

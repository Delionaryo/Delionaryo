const WATCH_FEED='https://watch.gapcreation.space/api/core-watch';
const MARKETPLACE_LISTINGS='https://market.gapcreation.space/api/core-listings';
const MARKETPLACE_CATEGORIES='https://market.gapcreation.space/api/core-marketplace-categories';

const str=(v:any,n=500)=>String(v??'').trim().slice(0,n);
const https=(v:any)=>{try{const u=new URL(String(v||''));return u.protocol==='https:'?u.toString():''}catch{return''}};
const images=(v:any)=>Array.isArray(v)?v.map(https).filter(Boolean).slice(0,5):[];
const numberOrNull=(v:any)=>Number.isFinite(Number(v))?Number(v):null;

async function getJson(url:string,timeout=5500){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const r=await fetch(url,{headers:{Accept:'application/json'},cache:'no-store',signal:controller.signal});
    const data=await r.json().catch(()=>null);
    if(!r.ok)throw new Error('UPSTREAM_'+r.status);
    return data;
  }finally{clearTimeout(timer)}
}

function normalizeProduct(row:any){
  const imageUrls=images(row?.image_urls);
  const primaryIndex=Math.max(0,Math.min(imageUrls.length-1,Number(row?.primary_image_index||0)));
  const dlc=numberOrNull(row?.dlc_price);
  return {
    listing_id:str(row?.id,180)||null,
    product_id:str(row?.product_id,180)||null,
    product_name:str(row?.product_name,180)||'DELIONARYO Product',
    product_identity:str(row?.product_identity,40)||'physical',
    listing_type:str(row?.listing_type,60)||null,
    category:str(row?.category,120)||'Other',
    description:str(row?.description,1800)||'',
    price_label:str(row?.price_label,100)||(dlc!==null?dlc+' DLC':'View offer'),
    dlc_price:dlc,
    image_urls:imageUrls,
    primary_image:imageUrls[primaryIndex]||imageUrls[0]||'',
    store_id:str(row?.store_id,100)||null,
    store_name:str(row?.store_name,160)||null,
    seller_name:str(row?.seller_name,160)||null,
    affiliate_enabled:!!row?.affiliate_enabled,
    advertising_enabled:!!row?.advertising_enabled,
    verified_rating:null,
    verified_review_count:null,
    network_sold_count:null,
    created_at:str(row?.created_at,80)||null
  };
}

function normalizeCampaign(row:any,product:any){
  const target=numberOrNull(row?.target_qualified_views);
  const qualified=numberOrNull(row?.qualified_views_count)||0;
  return {
    campaign_id:str(row?.id,180)||null,
    video_id:str(row?.id,180)||null,
    title:str(row?.title,220)||product?.product_name||'DELIONARYO Watch & Earn',
    video_url:https(row?.video_url)||'',
    destination_type:str(row?.destination_type,40)||null,
    source_storefront:str(row?.source_storefront,80)||null,
    product_id:str(row?.product_id,180)||product?.product_id||null,
    listing_id:str(row?.listing_id,180)||product?.listing_id||null,
    reward_dlc:numberOrNull(row?.reward_dlc),
    minimum_watch_seconds:numberOrNull(row?.minimum_watch_seconds),
    remaining_views:target===null?null:Math.max(0,target-qualified),
    store_id:product?.store_id||null,
    store_name:product?.store_name||null,
    seller_name:product?.seller_name||null,
    seller_affiliate_id:null,
    product:product||null
  };
}

export default async function handler(req:any,res:any){
  res.setHeader('Cache-Control','public, max-age=15, s-maxage=45, stale-while-revalidate=120');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'})}

  const [watchResult,listingResult,categoryResult]=await Promise.allSettled([
    getJson(WATCH_FEED),
    getJson(MARKETPLACE_LISTINGS),
    getJson(MARKETPLACE_CATEGORIES)
  ]);

  const rawListings=listingResult.status==='fulfilled'&&Array.isArray(listingResult.value?.listings)?listingResult.value.listings:[];
  const products=rawListings.map(normalizeProduct);
  const byListing=new Map(products.filter((p:any)=>p.listing_id).map((p:any)=>[String(p.listing_id),p]));
  const byProduct=new Map(products.filter((p:any)=>p.product_id).map((p:any)=>[String(p.product_id),p]));
  const rawCampaigns=watchResult.status==='fulfilled'&&Array.isArray(watchResult.value?.items)?watchResult.value.items:[];
  const campaigns=rawCampaigns.map((row:any)=>{
    const product=byListing.get(String(row?.listing_id||''))||byProduct.get(String(row?.product_id||''))||null;
    return normalizeCampaign(row,product);
  }).filter((x:any)=>x.campaign_id);

  let categories:any[]=[];
  if(categoryResult.status==='fulfilled'&&Array.isArray(categoryResult.value?.categories)){
    categories=categoryResult.value.categories
      .filter((x:any)=>x?.is_active!==false)
      .map((x:any)=>({
        id:str(x?.id,100),
        name:str(x?.name,120),
        slug:str(x?.slug,120),
        parent_category_id:str(x?.parent_category_id,100)||null,
        category_level:numberOrNull(x?.category_level),
        is_catch_all:!!x?.is_catch_all
      }))
      .filter((x:any)=>x.id&&x.name);
  }
  if(!categories.length){
    const names=[...new Set(products.map((p:any)=>p.category).filter(Boolean))];
    categories=names.map((name:any,index)=>({id:'derived-'+index,name,slug:String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),parent_category_id:null,category_level:1,is_catch_all:false}));
  }

  return res.status(200).json({
    ok:true,
    source:'live-delionaryo-bridges',
    generated_at:new Date().toISOString(),
    campaigns,
    products,
    categories,
    deals:[],
    social_proof:{
      rating_source:'verified_buyer_only',
      sales_source:'qualifying_actual_orders_only',
      metrics_available:false
    },
    upstream:{
      watch:watchResult.status==='fulfilled',
      marketplace:listingResult.status==='fulfilled',
      categories:categoryResult.status==='fulfilled'
    }
  });
}

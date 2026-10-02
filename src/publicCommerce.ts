import './publicCommerce.css';

type Product={
  listing_id:string|null;product_id:string|null;product_name:string;product_identity:string;category:string;
  description:string;price_label:string;dlc_price:number|null;image_urls:string[];primary_image:string;
  store_id:string|null;store_name:string|null;seller_name:string|null;affiliate_enabled:boolean;
  verified_rating:number|null;verified_review_count:number|null;network_sold_count:number|null;
};
type Campaign={
  campaign_id:string;video_id:string|null;title:string;video_url:string;product_id:string|null;listing_id:string|null;
  reward_dlc:number|null;minimum_watch_seconds:number|null;remaining_views:number|null;store_id:string|null;
  store_name:string|null;seller_name:string|null;seller_affiliate_id:string|null;product:Product|null;
};
type Category={id:string;name:string;slug:string;parent_category_id:string|null;category_level:number|null;is_catch_all:boolean};
type Discovery={campaigns:Campaign[];products:Product[];categories:Category[];deals:any[];upstream?:Record<string,boolean>};

const MARKET='https://market.gapcreation.space/';
const WATCH='https://watch.gapcreation.space/';
const NATION='https://nation.gapcreation.space/';
const CART_KEY='delionaryo-public-cart-v1';
const ATTR_KEY='delionaryo-public-attribution-v1';
const SESSION_KEY='delionaryo-public-session-v1';

const esc=(v:unknown)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const text=(v:unknown,n=220)=>String(v??'').trim().slice(0,n);
const safeUrl=(v:unknown)=>{try{const u=new URL(String(v||''),location.origin);return ['https:','http:'].includes(u.protocol)?u.toString():''}catch{return''}};
const uid=()=>globalThis.crypto?.randomUUID?.()||('dl-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
const read=<T,>(key:string,fallback:T):T=>{try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}};
const write=(key:string,value:unknown)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};

const existingSession=read<string|null>(SESSION_KEY,null);
const sessionId=existingSession||uid();
if(!existingSession)write(SESSION_KEY,sessionId);

type Attribution={
  attribution_token:string;seller_affiliate_id:string|null;campaign_id:string|null;video_id:string|null;product_id:string|null;ref:string|null
};

function captureAttribution():Attribution{
  const old=read<Partial<Attribution>>(ATTR_KEY,{});
  const q=new URLSearchParams(location.search);
  const from=(name:string,limit=180)=>text(q.get(name)||'',limit)||null;
  const next:Attribution={
    attribution_token:text(old.attribution_token||'',160)||uid(),
    seller_affiliate_id:from('seller_affiliate_id')||text(old.seller_affiliate_id||'',180)||null,
    campaign_id:from('campaign_id')||text(old.campaign_id||'',180)||null,
    video_id:from('video_id')||text(old.video_id||'',180)||null,
    product_id:from('product_id')||text(old.product_id||'',180)||null,
    ref:from('ref',160)||text(old.ref||'',160)||null
  };
  write(ATTR_KEY,next);
  return next;
}
const attribution=captureAttribution();

function track(eventType:string,ctx:Record<string,unknown>={}){
  const payload={
    event_type:eventType,
    anonymous_session_id:sessionId,
    attribution_token:attribution.attribution_token,
    seller_affiliate_id:ctx.seller_affiliate_id||attribution.seller_affiliate_id,
    campaign_id:ctx.campaign_id||attribution.campaign_id,
    video_id:ctx.video_id||attribution.video_id,
    product_id:ctx.product_id||attribution.product_id,
    store_id:ctx.store_id||null,
    order_id:ctx.order_id||null,
    page_path:location.pathname,
    metadata:ctx.metadata||{}
  };
  fetch('/api/public-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
}

type CartItem={
  listing_id:string|null;product_id:string|null;product_name:string;price_label:string;image:string;
  campaign_id:string|null;video_id:string|null;store_id:string|null;seller_affiliate_id:string|null;attribution_token:string
};

const state:{data:Discovery|null;query:string;category:string;cart:CartItem[];impressions:Set<string>}={
  data:null,query:'',category:'',cart:read<CartItem[]>(CART_KEY,[]),impressions:new Set()
};

function cartCount(){return state.cart.length}
function saveCart(){write(CART_KEY,state.cart);syncCartBadge()}
function syncCartBadge(){
  document.querySelectorAll<HTMLElement>('[data-public-cart-count]').forEach(n=>{n.textContent=String(cartCount());n.hidden=cartCount()===0});
}
function priceOf(p:Product|null){return p?.price_label||'View offer'}
function socialProof(p:Product|null){
  if(!p)return'';
  const parts:string[]=[];
  if(p.verified_rating!=null&&p.verified_review_count!=null)parts.push('★ '+p.verified_rating+' ('+p.verified_review_count+' verified reviews)');
  if(p.network_sold_count!=null)parts.push(p.network_sold_count+' sold across DELIONARYO');
  return parts.length?'<div class="pc-social">'+parts.map(esc).join(' · ')+'</div>':'';
}
function productImage(p:Product|null){return safeUrl(p?.primary_image||p?.image_urls?.[0]||'')}

function attributionParams(extra:Record<string,string|null|undefined>={}){
  const q=new URLSearchParams();
  const values={
    attribution_token:attribution.attribution_token,
    seller_affiliate_id:attribution.seller_affiliate_id,
    campaign_id:extra.campaign_id||attribution.campaign_id,
    video_id:extra.video_id||attribution.video_id,
    product_id:extra.product_id||attribution.product_id,
    ref:attribution.ref
  };
  Object.entries(values).forEach(([k,v])=>{if(v)q.set(k,String(v))});
  return q;
}

async function bindMarketplaceAttribution(item:Partial<CartItem>|Product){
  const listing=('listing_id'in item?item.listing_id:null)||null;
  const ref=attribution.ref||'';
  if(!listing||!/^DLR-[A-F0-9]{16}$/.test(ref))return;
  try{
    await fetch('/api/public-attribution',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({listing_id:listing,product_id:item.product_id||null,ref,source_video_id:'video_id'in item?item.video_id||attribution.video_id:attribution.video_id,campaign_id:'campaign_id'in item?item.campaign_id||attribution.campaign_id:attribution.campaign_id})});
  }catch{}
}

function marketplaceUrl(item:Partial<CartItem>|Product){
  const q=attributionParams({
    campaign_id:'campaign_id'in item?item.campaign_id||null:null,
    video_id:'video_id'in item?item.video_id||null:null,
    product_id:item.product_id||null
  });
  const listing=('listing_id'in item?item.listing_id:null)||null;
  if(listing)q.set('listing',String(listing));
  return MARKET+'?'+q.toString();
}

function addToCart(product:Product|null,campaign?:Campaign|null){
  if(!product?.listing_id&&!product?.product_id)return;
  const existing=state.cart.find(x=>(product.listing_id&&x.listing_id===product.listing_id)||(!product.listing_id&&product.product_id&&x.product_id===product.product_id));
  if(existing){openCart();return}
  state.cart.push({
    listing_id:product.listing_id||null,
    product_id:product.product_id||null,
    product_name:product.product_name,
    price_label:priceOf(product),
    image:productImage(product),
    campaign_id:campaign?.campaign_id||attribution.campaign_id,
    video_id:campaign?.video_id||attribution.video_id,
    store_id:product.store_id||null,
    seller_affiliate_id:campaign?.seller_affiliate_id||attribution.seller_affiliate_id,
    attribution_token:attribution.attribution_token
  });
  state.cart=state.cart.slice(-30);
  saveCart();
  track('ADD_TO_CART',{
    product_id:product.product_id,
    campaign_id:campaign?.campaign_id,
    video_id:campaign?.video_id,
    store_id:product.store_id,
    seller_affiliate_id:campaign?.seller_affiliate_id,
    metadata:{listing_id:product.listing_id,source_surface:'DELIONARYO_PUBLIC_WEB'}
  });
  toast('Added to cart. Sign in is not required until checkout.');
}

function toast(message:string){
  let node=document.querySelector<HTMLElement>('#publicCommerceToast');
  if(!node){node=document.createElement('div');node.id='publicCommerceToast';node.className='pc-toast';document.body.appendChild(node)}
  node.textContent=message;node.classList.add('show');
  window.clearTimeout((node as any)._t);(node as any)._t=window.setTimeout(()=>node?.classList.remove('show'),2400);
}

function renderCampaignCard(c:Campaign,index:number){
  const p=c.product;
  const image=productImage(p);
  const liveVideo=!!safeUrl(c.video_url);
  const seller=p?.store_name||p?.seller_name||c.store_name||c.seller_name||'DELIONARYO Seller Affiliate';
  const id=esc(c.campaign_id);
  return `<article class="pc-video-card" data-campaign-card="${id}">
    <button class="pc-media" type="button" data-open-campaign="${id}" aria-label="Watch ${esc(c.title)}">
      ${image?`<img src="${esc(image)}" alt="" loading="${index<2?'eager':'lazy'}" decoding="async">`:'<div class="pc-media-empty">DELIONARYO</div>'}
      <span class="pc-media-shade"></span>
      <span class="pc-play">${liveVideo?'▶':'◉'}</span>
      ${c.minimum_watch_seconds!=null?`<span class="pc-duration">${Math.max(0,Math.round(c.minimum_watch_seconds))}s</span>`:''}
    </button>
    <div class="pc-video-body">
      <small>${esc(p?.category||'WATCH & EARN')}</small>
      <h3>${esc(c.title)}</h3>
      <p>${esc(seller)}</p>
      ${socialProof(p)}
      <div class="pc-price-row"><strong>${esc(priceOf(p))}</strong>${p?'<button type="button" data-add-campaign="'+id+'">Add</button>':''}</div>
    </div>
  </article>`;
}

function renderProductCard(p:Product,index:number){
  const image=productImage(p);
  const id=esc(p.listing_id||p.product_id||String(index));
  return `<article class="pc-product-card" data-product-card="${id}">
    <button class="pc-product-image" type="button" data-open-product="${id}">
      ${image?`<img src="${esc(image)}" alt="${esc(p.product_name)}" loading="lazy" decoding="async">`:'<div class="pc-media-empty">DELIONARYO</div>'}
    </button>
    <div class="pc-product-copy"><small>${esc(p.category)}</small><h3>${esc(p.product_name)}</h3>
      ${socialProof(p)}
      <div><strong>${esc(priceOf(p))}</strong><button type="button" data-add-product="${id}">Add</button></div>
    </div>
  </article>`;
}

function filteredProducts(){
  const d=state.data;if(!d)return[];
  const q=state.query.toLowerCase();
  return d.products.filter(p=>{
    if(state.category&&p.category.toLowerCase()!==state.category.toLowerCase())return false;
    if(!q)return true;
    return [p.product_name,p.category,p.description,p.store_name,p.seller_name].some(v=>String(v||'').toLowerCase().includes(q));
  });
}
function filteredCampaigns(){
  const d=state.data;if(!d)return[];
  const q=state.query.toLowerCase();
  return d.campaigns.filter(c=>{
    if(state.category&&String(c.product?.category||'').toLowerCase()!==state.category.toLowerCase())return false;
    if(!q)return true;
    return [c.title,c.product?.product_name,c.product?.category,c.product?.store_name,c.product?.seller_name].some(v=>String(v||'').toLowerCase().includes(q));
  });
}

function renderDynamic(){
  const campaigns=document.querySelector<HTMLElement>('#pcCampaigns');
  const shop=document.querySelector<HTMLElement>('#pcShopGrid');
  const categories=document.querySelector<HTMLElement>('#pcCategoryRail');
  const deals=document.querySelector<HTMLElement>('#pcDeals');
  const d=state.data;
  if(!campaigns||!shop||!categories||!deals)return;
  if(!d){
    campaigns.innerHTML='<div class="pc-loading">Loading live Watch & Earn…</div>';
    shop.innerHTML='<div class="pc-loading">Loading published products…</div>';
    return;
  }
  const cs=filteredCampaigns();
  campaigns.innerHTML=cs.length?cs.map(renderCampaignCard).join(''):'<div class="pc-empty"><b>No matching Watch & Earn videos right now.</b><span>Only approved live campaigns appear here.</span></div>';
  const ps=filteredProducts();
  shop.innerHTML=ps.length?ps.slice(0,24).map(renderProductCard).join(''):'<div class="pc-empty"><b>No matching published products.</b><span>Try another category or search.</span></div>';
  const roots=d.categories.filter(x=>!x.parent_category_id||x.category_level===1);
  const names=[...new Set((roots.length?roots:d.categories).map(x=>x.name).filter(Boolean))];
  categories.innerHTML=['All',...names].map(name=>`<button type="button" data-category="${esc(name==='All'?'':name)}" class="${state.category===(name==='All'?'':name)?'active':''}">${esc(name)}</button>`).join('');
  deals.innerHTML=d.deals?.length?'<div class="pc-empty"><b>Verified deals available.</b><span>Deal details come only from published source data.</span></div>':'<div class="pc-empty"><b>No verified deals right now.</b><span>DELIONARYO never invents discounts, old prices, deadlines or stock urgency.</span></div>';

  cs.forEach(c=>{
    if(state.impressions.has(c.campaign_id))return;
    state.impressions.add(c.campaign_id);
    track('VIDEO_IMPRESSION',{campaign_id:c.campaign_id,video_id:c.video_id,product_id:c.product_id,store_id:c.store_id,metadata:{source_surface:'DELIONARYO_PUBLIC_WEB'}});
  });
}

function productByKey(key:string){
  return state.data?.products.find(p=>String(p.listing_id||p.product_id)===String(key))||null;
}
function campaignById(id:string){return state.data?.campaigns.find(c=>String(c.campaign_id)===String(id))||null}

function openProduct(product:Product,campaign:Campaign|null=null){
  track('PRODUCT_VIEW',{product_id:product.product_id,campaign_id:campaign?.campaign_id,video_id:campaign?.video_id,store_id:product.store_id,metadata:{listing_id:product.listing_id}});
  const image=productImage(product);
  const layer=document.createElement('section');layer.className='pc-modal';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');
  layer.innerHTML=`<div class="pc-modal-shell">
    <button class="pc-close" type="button" aria-label="Close">×</button>
    <div class="pc-detail-media">${image?`<img src="${esc(image)}" alt="${esc(product.product_name)}">`:'<div class="pc-media-empty">DELIONARYO</div>'}</div>
    <div class="pc-detail-copy"><small>${esc(product.category)}</small><h2>${esc(product.product_name)}</h2>
      <p>${esc(product.description||'Published DELIONARYO marketplace product.')}</p>
      ${socialProof(product)}
      <strong class="pc-detail-price">${esc(priceOf(product))}</strong>
      <div class="pc-detail-actions"><button type="button" class="primary" data-modal-add>Add to Cart</button><a href="${esc(marketplaceUrl(product))}" data-marketplace-buy>View in Marketplace</a></div>
      <span class="pc-truth-note">Ratings and sold counts appear only when verified data is available.</span>
    </div>
  </div>`;
  const close=()=>layer.remove();
  layer.querySelector('.pc-close')?.addEventListener('click',close);
  layer.addEventListener('mousedown',e=>{if(e.target===layer)close()});
  layer.querySelector('[data-modal-add]')?.addEventListener('click',()=>addToCart(product,campaign));
  layer.querySelector('[data-marketplace-buy]')?.addEventListener('click',async(event)=>{
    event.preventDefault();
    track('CHECKOUT_STARTED',{product_id:product.product_id,campaign_id:campaign?.campaign_id,video_id:campaign?.video_id,store_id:product.store_id,seller_affiliate_id:campaign?.seller_affiliate_id,metadata:{handoff:'MARKETPLACE',listing_id:product.listing_id}});
    await bindMarketplaceAttribution({...product,campaign_id:campaign?.campaign_id||attribution.campaign_id,video_id:campaign?.video_id||attribution.video_id} as any);
    location.href=marketplaceUrl({...product,campaign_id:campaign?.campaign_id||attribution.campaign_id,video_id:campaign?.video_id||attribution.video_id} as any);
  });
  document.body.appendChild(layer);
}

function openCampaign(campaign:Campaign,push=true){
  const product=campaign.product;
  if(push&&location.pathname!==('/watch/'+encodeURIComponent(campaign.campaign_id))){
    const q=attributionParams({campaign_id:campaign.campaign_id,video_id:campaign.video_id,product_id:campaign.product_id});
    history.pushState({watch:campaign.campaign_id},'',`/watch/${encodeURIComponent(campaign.campaign_id)}?${q.toString()}`);
  }
  const layer=document.createElement('section');layer.className='pc-modal pc-watch-modal';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');
  const video=safeUrl(campaign.video_url),image=productImage(product);
  layer.innerHTML=`<div class="pc-watch-shell">
    <header><button class="pc-close" type="button" aria-label="Back">‹</button><div><b>WATCH &amp; EARN</b><small>PUBLIC DISCOVERY</small></div></header>
    <div class="pc-watch-stage">
      ${video?`<video controls playsinline preload="metadata" poster="${esc(image)}" src="${esc(video)}"></video>`:image?`<img src="${esc(image)}" alt="">`:'<div class="pc-media-empty">Video unavailable</div>'}
    </div>
    <div class="pc-watch-copy"><small>${esc(product?.category||'WATCH & EARN')}</small><h2>${esc(campaign.title)}</h2>
      <p>${esc(product?.description||'Watch the approved promotion and discover the connected DELIONARYO product.')}</p>
      ${product?socialProof(product):''}
      ${product?`<div class="pc-watch-product"><strong>${esc(priceOf(product))}</strong><button type="button" data-watch-add>Add to Cart</button><button type="button" class="ghost" data-watch-product>View Product</button></div>`:''}
      <a class="pc-reward-link" href="${WATCH}" target="_self">Open full Watch &amp; Earn rewards experience →</a>
    </div>
  </div>`;
  let qualified=false;
  const close=()=>{layer.remove();if(location.pathname.startsWith('/watch/'))history.replaceState({},'',location.origin+'/#watch-and-earn')};
  layer.querySelector('.pc-close')?.addEventListener('click',close);
  const v=layer.querySelector<HTMLVideoElement>('video');
  v?.addEventListener('play',()=>track('VIDEO_PLAY',{campaign_id:campaign.campaign_id,video_id:campaign.video_id,product_id:campaign.product_id,store_id:campaign.store_id,metadata:{source_surface:'DELIONARYO_PUBLIC_WEB'}}),{once:true});
  v?.addEventListener('timeupdate',()=>{
    if(qualified)return;
    const threshold=Math.max(5,Number(campaign.minimum_watch_seconds||5));
    if(v.currentTime>=threshold){qualified=true;track('QUALIFIED_WATCH',{campaign_id:campaign.campaign_id,video_id:campaign.video_id,product_id:campaign.product_id,store_id:campaign.store_id,metadata:{seconds:Math.floor(v.currentTime),reward_settlement:false}})}
  });
  layer.querySelector('[data-watch-add]')?.addEventListener('click',()=>addToCart(product,campaign));
  layer.querySelector('[data-watch-product]')?.addEventListener('click',()=>product&&openProduct(product,campaign));
  document.body.appendChild(layer);
  track('PRODUCT_VIEW',{product_id:campaign.product_id,campaign_id:campaign.campaign_id,video_id:campaign.video_id,store_id:campaign.store_id,metadata:{from:'WATCH_DETAIL'}});
}

function openCart(){
  document.querySelector('.pc-cart-drawer')?.remove();
  const layer=document.createElement('section');layer.className='pc-cart-drawer';
  const items=state.cart;
  layer.innerHTML=`<div class="pc-cart-panel"><header><div><small>GUEST CART</small><h2>Your DELIONARYO cart</h2></div><button type="button" data-cart-close>×</button></header>
    <div class="pc-cart-items">${items.length?items.map((x,i)=>`<article>
      ${x.image?`<img src="${esc(x.image)}" alt="">`:'<div class="pc-cart-thumb">D</div>'}
      <div><b>${esc(x.product_name)}</b><span>${esc(x.price_label)}</span></div>
      <button type="button" data-remove-cart="${i}">Remove</button>
    </article>`).join(''):'<div class="pc-empty"><b>Your cart is empty.</b><span>Add a published product without signing in.</span></div>'}</div>
    ${items.length?`<a class="pc-checkout" href="${esc(marketplaceUrl(items[0]))}" data-cart-checkout>Continue to Marketplace Checkout →</a><p class="pc-cart-note">Guest discovery stays public. Marketplace/account verification is requested only when the protected checkout flow needs it.</p>`:''}
  </div>`;
  layer.querySelector('[data-cart-close]')?.addEventListener('click',()=>layer.remove());
  layer.addEventListener('mousedown',e=>{if(e.target===layer)layer.remove()});
  layer.querySelectorAll<HTMLElement>('[data-remove-cart]').forEach(btn=>btn.addEventListener('click',()=>{
    const i=Number(btn.dataset.removeCart);state.cart.splice(i,1);saveCart();openCart();
  }));
  layer.querySelector('[data-cart-checkout]')?.addEventListener('click',async(event)=>{
    event.preventDefault();
    const first=state.cart[0];if(!first)return;
    track('CHECKOUT_STARTED',{product_id:first.product_id,campaign_id:first.campaign_id,video_id:first.video_id,store_id:first.store_id,seller_affiliate_id:first.seller_affiliate_id,metadata:{handoff:'MARKETPLACE',cart_items:state.cart.length,listing_id:first.listing_id}});
    await bindMarketplaceAttribution(first);
    location.href=marketplaceUrl(first);
  });
  document.body.appendChild(layer);
}

function wire(){
  document.addEventListener('click',event=>{
    const target=event.target as HTMLElement|null;
    const openC=target?.closest<HTMLElement>('[data-open-campaign]');if(openC){const c=campaignById(openC.dataset.openCampaign||'');if(c)openCampaign(c);return}
    const addC=target?.closest<HTMLElement>('[data-add-campaign]');if(addC){event.stopPropagation();const c=campaignById(addC.dataset.addCampaign||'');if(c?.product)addToCart(c.product,c);return}
    const openP=target?.closest<HTMLElement>('[data-open-product]');if(openP){const p=productByKey(openP.dataset.openProduct||'');if(p)openProduct(p);return}
    const addP=target?.closest<HTMLElement>('[data-add-product]');if(addP){event.stopPropagation();const p=productByKey(addP.dataset.addProduct||'');if(p)addToCart(p);return}
    const cat=target?.closest<HTMLElement>('[data-category]');if(cat){state.category=cat.dataset.category||'';renderDynamic();document.querySelector('#public-shop')?.scrollIntoView({behavior:'smooth'});return}
    if(target?.closest('[data-public-cart]')){openCart();return}
  });
  const search=document.querySelector<HTMLInputElement>('#pcSearch');
  search?.addEventListener('input',()=>{state.query=search.value.trim();renderDynamic()});
  addEventListener('popstate',()=>{
    const m=location.pathname.match(/^\/watch\/([^/]+)/);
    if(m){const c=campaignById(decodeURIComponent(m[1]));if(c)openCampaign(c,false)}
  });
}

function updateNav(){
  const navLinks=document.querySelector<HTMLElement>('nav > div > div');
  if(!navLinks)return;
  navLinks.innerHTML=`<a href="#watch-and-earn">WATCH &amp; EARN</a><a href="#public-shop">SHOP</a><a href="#public-categories">CATEGORIES</a><a href="#public-deals">DEALS</a><a href="#learning">LEARN</a><a href="${NATION}">NATION</a>`;
}

async function load(){
  try{
    const r=await fetch('/api/public-discovery',{headers:{Accept:'application/json'},cache:'no-store'});
    const d=await r.json();
    if(!r.ok||!d?.ok)throw new Error(d?.error||'PUBLIC_DISCOVERY_UNAVAILABLE');
    state.data={campaigns:Array.isArray(d.campaigns)?d.campaigns:[],products:Array.isArray(d.products)?d.products:[],categories:Array.isArray(d.categories)?d.categories:[],deals:Array.isArray(d.deals)?d.deals:[],upstream:d.upstream};
    renderDynamic();
    const deep=location.pathname.match(/^\/watch\/([^/]+)/);
    if(deep){const c=campaignById(decodeURIComponent(deep[1]));if(c)openCampaign(c,false)}
  }catch{
    const campaigns=document.querySelector<HTMLElement>('#pcCampaigns');if(campaigns)campaigns.innerHTML='<div class="pc-empty"><b>Live Watch & Earn is temporarily unavailable.</b><span>No fallback products or fake campaign data are shown.</span></div>';
    const shop=document.querySelector<HTMLElement>('#pcShopGrid');if(shop)shop.innerHTML='<div class="pc-empty"><b>Published Shop feed is temporarily unavailable.</b><span>Please retry shortly.</span></div>';
  }
}

export function mountPublicCommerce(){
  const main=document.querySelector<HTMLElement>('main');
  const legacyHero=document.querySelector<HTMLElement>('#top');
  if(!main||!legacyHero||document.querySelector('#watch-and-earn'))return;
  updateNav();
  legacyHero.dataset.secondaryAcquisition='true';
  const section=document.createElement('section');
  section.id='watch-and-earn';section.className='pc-shell';
  section.innerHTML=`<div class="pc-topline">
      <div><span class="pc-crown">D</span><div><b>DELIONARYO</b><small>WATCH · DISCOVER · BUY · EARN</small></div></div>
      <button type="button" class="pc-cart-button" data-public-cart>🛒 <span>Cart</span><i data-public-cart-count hidden>0</i></button>
    </div>
    <div class="pc-hero">
      <div class="pc-hero-copy"><span>SECOND ACQUISITION PORTAL</span><h1>Watch &amp; Earn.<br><em>Real Products. Real Opportunities.</em></h1>
      <p>Discover approved videos and published DELIONARYO products without a login wall. Account verification appears only when a protected action needs it.</p>
      <div class="pc-hero-actions"><a href="#pcCampaigns">Start Watching →</a><a class="ghost" href="#public-shop">Browse Shop</a></div></div>
      <div class="pc-hero-flow"><b>DELIONARYO → WATCH → DISCOVER → BUY</b><span>Seller Affiliate traffic stays connected to Product ID and Campaign ID where supplied.</span></div>
    </div>
    <div class="pc-search"><span>⌕</span><input id="pcSearch" placeholder="Search live videos, products or categories…" autocomplete="off"></div>
    <section id="public-categories" class="pc-section"><header><div><small>DISCOVER</small><h2>Categories</h2></div></header><div id="pcCategoryRail" class="pc-category-rail"><span class="pc-loading">Loading categories…</span></div></section>
    <section class="pc-section"><header><div><small>WATCH &amp; EARN</small><h2>Approved videos</h2></div><a href="${WATCH}">Full rewards experience ↗</a></header><div id="pcCampaigns" class="pc-video-rail"><div class="pc-loading">Loading live Watch &amp; Earn…</div></div></section>
    <section id="public-shop" class="pc-section"><header><div><small>SHOP</small><h2>Published products</h2></div><a href="${MARKET}">Open Marketplace ↗</a></header><div id="pcShopGrid" class="pc-shop-grid"><div class="pc-loading">Loading published products…</div></div></section>
    <section id="public-deals" class="pc-section"><header><div><small>DEALS</small><h2>Verified offers only</h2></div></header><div id="pcDeals"></div></section>
    <div class="pc-trust"><span>✓ Published products only</span><span>✓ Verified buyer metrics only</span><span>✓ No fabricated demand</span><span>✓ No login for discovery</span></div>`;
  legacyHero.before(section);
  syncCartBadge();
  wire();
  load();
}

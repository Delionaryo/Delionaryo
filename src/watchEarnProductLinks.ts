import { createClient } from '@supabase/supabase-js';

const supabase=createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');

const esc=(s:any)=>String(s??'').replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]||m));

async function rpc(name:string,args:any={}){
  const {data,error}=await supabase.rpc(name,args);
  if(error) throw error;
  return data;
}

function toast(message:string,kind:'ok'|'err'='ok'){
  const el=document.querySelector<HTMLDivElement>('#we-flash');
  if(!el)return;
  el.textContent=message;
  el.className=`rounded-xl px-4 py-3 text-sm font-bold ${kind==='ok'?'border border-emerald-400/30 bg-emerald-400/10 text-emerald-200':'border border-red-400/30 bg-red-400/10 text-red-200'}`;
  el.hidden=false;
}

function campaignIdFromCard(card:HTMLElement){
  return card.querySelector<HTMLElement>('[data-id]')?.dataset.id||null;
}

async function installViewerLinks(){
  const host=document.querySelector('#we-viewer-list');
  if(!host)return;
  const cards=[...host.querySelectorAll<HTMLElement>('article')];
  const ids=cards.map(c=>campaignIdFromCard(c)).filter(Boolean) as string[];
  if(!ids.length)return;
  const {data,error}=await supabase.from('ad_campaigns').select('id,destination_url,listing_id,product_id').in('id',ids);
  if(error)return;
  const byId=new Map((data||[]).map((x:any)=>[x.id,x]));
  cards.forEach(card=>{
    if(card.querySelector('[data-we-product-link]'))return;
    const id=campaignIdFromCard(card);if(!id)return;
    const campaign:any=byId.get(id);if(!campaign?.destination_url)return;
    const video=card.querySelector<HTMLVideoElement>('video');
    if(!video)return;
    const wrap=document.createElement('div');
    wrap.className='relative mt-4';
    video.parentNode?.insertBefore(wrap,video);
    video.classList.remove('mt-4');
    wrap.appendChild(video);
    const a=document.createElement('a');
    a.dataset.weProductLink='1';
    a.href=campaign.destination_url;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.className='absolute bottom-3 right-3 rounded-xl border border-amber-300/40 bg-stone-950/90 px-4 py-3 text-xs font-black text-amber-300 shadow-xl backdrop-blur';
    a.textContent='VIEW PRODUCT / SERVICE ↗';
    a.title='Open product or service while the ad continues in this tab';
    wrap.appendChild(a);
  });
}

async function installAdvertiserDestinationControls(){
  const host=document.querySelector('#we-advertiser-list');
  if(!host)return;
  const cards=[...host.querySelectorAll<HTMLElement>('article')];
  const ids=cards.map(c=>campaignIdFromCard(c)).filter(Boolean) as string[];
  if(!ids.length)return;
  const {data,error}=await supabase.from('ad_campaigns').select('id,status,destination_url').in('id',ids);
  if(error)return;
  const byId=new Map((data||[]).map((x:any)=>[x.id,x]));
  cards.forEach(card=>{
    if(card.querySelector('[data-we-destination-editor]'))return;
    const id=campaignIdFromCard(card);if(!id)return;
    const campaign:any=byId.get(id);if(!campaign||campaign.status!=='DRAFT')return;
    const editor=document.createElement('div');
    editor.dataset.weDestinationEditor='1';
    editor.className='mt-4 grid gap-2 sm:grid-cols-[1fr_auto]';
    editor.innerHTML=`<input data-we-destination-input type="url" value="${esc(campaign.destination_url||'')}" placeholder="Product / service link (https://...)" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm"><button data-we-save-destination class="rounded-xl border border-amber-400/30 px-4 py-3 text-xs font-black text-amber-300">SAVE PRODUCT LINK</button>`;
    const actions=card.querySelector('.mt-4.flex.flex-wrap.gap-2');
    actions?.parentNode?.insertBefore(editor,actions);
    editor.querySelector<HTMLButtonElement>('[data-we-save-destination]')?.addEventListener('click',async()=>{
      const url=editor.querySelector<HTMLInputElement>('[data-we-destination-input]')?.value.trim()||'';
      try{
        await rpc('configure_my_ad_campaign_destination',{p_campaign_id:id,p_destination_url:url||null});
        toast(url?'Product/service link saved.':'Product/service link removed.');
      }catch(e:any){toast(e.message||'Unable to save product link.','err');}
    });
  });
}

let busy=false;
async function enhance(){
  if(busy)return;busy=true;
  try{await Promise.all([installViewerLinks(),installAdvertiserDestinationControls()]);}
  finally{busy=false;}
}

function boot(){
  enhance();
  const mo=new MutationObserver(()=>setTimeout(enhance,0));
  mo.observe(document.body,{childList:true,subtree:true});
  supabase.auth.onAuthStateChange(()=>setTimeout(enhance,0));
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();

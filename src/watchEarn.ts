import { createClient } from '@supabase/supabase-js';

const supabase=createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');

type Campaign={
  id:string; title:string; objective:string; budget_dlc:number; reserved_dlc:number; spent_dlc:number;
  reward_per_qualified_view_dlc:number; platform_per_qualified_view_dlc:number; minimum_watch_seconds:number;
  status:string; moderation_status?:string; video_url?:string|null; video_duration_seconds?:number|null;
};

const money=(n:any)=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2});
const esc=(s:any)=>String(s??'').replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]||m));

async function rpc(name:string,args:any={}){
  const {data,error}=await supabase.rpc(name,args);
  if(error) throw error;
  return data;
}

function flash(message:string,kind:'ok'|'err'='ok'){
  const el=document.querySelector<HTMLDivElement>('#we-flash');
  if(!el)return;
  el.textContent=message;
  el.className=`rounded-xl px-4 py-3 text-sm font-bold ${kind==='ok'?'border border-emerald-400/30 bg-emerald-400/10 text-emerald-200':'border border-red-400/30 bg-red-400/10 text-red-200'}`;
  el.hidden=false;
}

async function loadViewer(){
  const summaryEl=document.querySelector<HTMLDivElement>('#we-viewer-summary');
  const listEl=document.querySelector<HTMLDivElement>('#we-viewer-list');
  if(!summaryEl||!listEl)return;
  const {data:userData}=await supabase.auth.getUser();
  if(!userData.user){
    summaryEl.innerHTML='<p class="text-stone-400">Sign in to use Watch & Earn.</p>';
    listEl.innerHTML='';
    return;
  }
  try{
    const summary=await rpc('my_watch_earn_summary');
    summaryEl.innerHTML=`<div class="grid gap-3 sm:grid-cols-3"><div class="we-metric"><span>WATCH BALANCE</span><b>${money(summary?.watch_earn_balance_dlc)} DLC</b></div><div class="we-metric"><span>LIFETIME EARNED</span><b>${money(summary?.lifetime_watch_earn_dlc)} DLC</b></div><div class="we-metric"><span>TRANSFERRED</span><b>${money(summary?.transferred_to_wallet_dlc)} DLC</b></div></div><div class="mt-4 flex flex-wrap gap-2"><input id="we-transfer-amount" type="number" min="0.01" step="0.01" placeholder="Amount to Wallet" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm"><button id="we-transfer" class="rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-stone-950">TRANSFER TO WALLET</button></div>`;
    document.querySelector<HTMLButtonElement>('#we-transfer')?.addEventListener('click',async()=>{
      const amount=Number((document.querySelector<HTMLInputElement>('#we-transfer-amount')?.value)||0);
      try{await rpc('transfer_my_watch_earn_to_wallet',{p_amount:amount,p_note:'Watch & Earn UI transfer'});flash('Watch & Earn transferred to Wallet.');await loadViewer();}
      catch(e:any){flash(e.message||'Transfer failed','err');}
    });
  }catch(e:any){summaryEl.innerHTML=`<p class="text-red-300">${esc(e.message)}</p>`;}

  const {data,error}=await supabase.from('ad_campaigns').select('id,title,objective,budget_dlc,reserved_dlc,spent_dlc,reward_per_qualified_view_dlc,platform_per_qualified_view_dlc,minimum_watch_seconds,status,moderation_status,video_url,video_duration_seconds').eq('status','ACTIVE').eq('moderation_status','APPROVED').order('created_at',{ascending:false}).limit(20);
  if(error){listEl.innerHTML=`<p class="text-red-300">${esc(error.message)}</p>`;return;}
  const campaigns=(data||[]) as Campaign[];
  listEl.innerHTML=campaigns.length?campaigns.map(c=>`<article class="rounded-2xl border border-white/10 bg-stone-950 p-5"><div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-xs font-black tracking-widest text-amber-400">ACTIVE AD</p><h3 class="mt-2 text-xl font-black">${esc(c.title)}</h3><p class="mt-2 text-sm text-stone-400">Watch ${money(c.minimum_watch_seconds)}s · Earn ${money(c.reward_per_qualified_view_dlc)} DLC</p></div><span class="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">APPROVED</span></div>${c.video_url?`<video class="mt-4 w-full rounded-2xl border border-white/10 bg-black" controls playsinline preload="metadata" src="${esc(c.video_url)}"></video>`:''}<div class="mt-4 flex flex-wrap gap-2"><button class="we-start rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-stone-950" data-id="${c.id}">START WATCH</button><button class="we-complete rounded-xl border border-white/15 px-4 py-3 text-sm font-black" data-id="${c.id}">COMPLETE & CHECK</button></div><p class="we-state mt-3 text-sm text-stone-400" data-state="${c.id}">Not started</p></article>`).join(''):'<p class="text-stone-400">No approved active ads right now.</p>';

  document.querySelectorAll<HTMLButtonElement>('.we-start').forEach(btn=>btn.addEventListener('click',async()=>{
    try{const id=await rpc('start_my_ad_view',{p_campaign_id:btn.dataset.id,p_evidence:{source:'delionaryo_watch_earn_ui'}});localStorage.setItem(`we-evidence-${btn.dataset.id}`,id);const state=document.querySelector(`[data-state="${btn.dataset.id}"]`);if(state)state.textContent='Watching started. Finish the required watch time before checking.';flash('Watch session started.');}
    catch(e:any){flash(e.message||'Unable to start watch','err');}
  }));
  document.querySelectorAll<HTMLButtonElement>('.we-complete').forEach(btn=>btn.addEventListener('click',async()=>{
    const evidence=localStorage.getItem(`we-evidence-${btn.dataset.id}`);
    if(!evidence){flash('Start the watch first.','err');return;}
    try{
      const result:any=await rpc('complete_my_ad_view',{p_evidence_id:evidence});
      const row=Array.isArray(result)?result[0]:result;
      if(!row?.qualified){flash(`Not qualified yet. Watched ${money(row?.watched_seconds)}s.`,'err');return;}
      const settlement=await rpc('settle_my_qualified_ad_view',{p_evidence_id:evidence});
      flash(`Qualified. ${money(settlement?.viewer_reward_dlc)} DLC added to Watch & Earn.`);
      localStorage.removeItem(`we-evidence-${btn.dataset.id}`);
      await loadViewer();
    }catch(e:any){flash(e.message||'Watch settlement failed','err');}
  }));
}

async function loadAdvertiser(){
  const el=document.querySelector<HTMLDivElement>('#we-advertiser-list');
  if(!el)return;
  const {data:userData}=await supabase.auth.getUser();
  if(!userData.user){el.innerHTML='<p class="text-stone-400">Sign in to create advertiser campaigns.</p>';return;}
  const {data,error}=await supabase.from('ad_campaigns').select('id,title,objective,budget_dlc,reserved_dlc,spent_dlc,reward_per_qualified_view_dlc,platform_per_qualified_view_dlc,minimum_watch_seconds,status,moderation_status,video_url,video_duration_seconds').eq('advertiser_id',userData.user.id).order('created_at',{ascending:false}).limit(30);
  if(error){el.innerHTML=`<p class="text-red-300">${esc(error.message)}</p>`;return;}
  const campaigns=(data||[]) as Campaign[];
  el.innerHTML=campaigns.length?campaigns.map(c=>{const remaining=Math.max(Number(c.reserved_dlc||0)-Number(c.spent_dlc||0),0);return `<article class="rounded-2xl border border-white/10 bg-stone-950 p-5"><div class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="text-lg font-black">${esc(c.title)}</h3><p class="mt-1 text-sm text-stone-400">${esc(c.status)} · Moderation ${esc(c.moderation_status||'NOT_SUBMITTED')}</p></div><b class="text-amber-300">${money(remaining)} DLC left</b></div><div class="mt-4 grid gap-2 text-sm text-stone-400 sm:grid-cols-3"><span>Budget ${money(c.budget_dlc)}</span><span>Spent ${money(c.spent_dlc)}</span><span>Reward ${money(c.reward_per_qualified_view_dlc)}/view</span></div><div class="mt-4 flex flex-wrap gap-2">${c.status==='DRAFT'?`<button class="we-submit rounded-lg border border-white/15 px-3 py-2 text-xs font-black" data-id="${c.id}">SUBMIT REVIEW</button>${c.moderation_status==='APPROVED'?`<button class="we-activate rounded-lg bg-amber-400 px-3 py-2 text-xs font-black text-stone-950" data-id="${c.id}">ACTIVATE</button>`:''}`:''}${c.status==='ACTIVE'?`<button class="we-pause rounded-lg border border-white/15 px-3 py-2 text-xs font-black" data-id="${c.id}">PAUSE</button>`:''}${c.status==='PAUSED'?`<button class="we-resume rounded-lg bg-amber-400 px-3 py-2 text-xs font-black text-stone-950" data-id="${c.id}">RESUME</button>`:''}${['DRAFT','ACTIVE','PAUSED'].includes(c.status)?`<button class="we-cancel rounded-lg border border-red-400/30 px-3 py-2 text-xs font-black text-red-300" data-id="${c.id}">CANCEL</button>`:''}</div></article>`}).join(''):'<p class="text-stone-400">No advertiser campaigns yet.</p>';
  const bind=(cls:string,fn:string,args=(id:string)=>any)=>document.querySelectorAll<HTMLButtonElement>(cls).forEach(btn=>btn.addEventListener('click',async()=>{try{await rpc(fn,args(btn.dataset.id!));flash('Campaign updated.');await loadAdvertiser();}catch(e:any){flash(e.message||'Campaign action failed','err');}}));
  bind('.we-submit','submit_my_ad_campaign_for_review',id=>({p_campaign_id:id}));
  bind('.we-activate','activate_my_ad_campaign',id=>({p_campaign_id:id}));
  bind('.we-pause','pause_my_ad_campaign',id=>({p_campaign_id:id}));
  bind('.we-resume','resume_my_ad_campaign',id=>({p_campaign_id:id}));
  bind('.we-cancel','cancel_my_ad_campaign',id=>({p_campaign_id:id}));
}

async function createCampaign(){
  const f=(id:string)=>document.querySelector<HTMLInputElement>(id)?.value||'';
  try{
    await rpc('create_my_ad_campaign',{
      p_title:f('#we-title').trim(),
      p_budget_dlc:Number(f('#we-budget')),
      p_reward_per_qualified_view_dlc:Number(f('#we-reward')),
      p_platform_per_qualified_view_dlc:Number(f('#we-platform')),
      p_minimum_watch_seconds:Number(f('#we-min-watch')),
      p_objective:'PRODUCT_DISCOVERY',
      p_listing_id:null,
      p_product_id:null,
      p_video_url:f('#we-video-url').trim(),
      p_video_path:null,
      p_video_duration_seconds:Number(f('#we-video-duration'))
    });
    flash('Campaign created as DRAFT. Submit it for owner review before activation.');
    await loadAdvertiser();
  }catch(e:any){flash(e.message||'Campaign creation failed','err');}
}

export async function mountWatchEarn(){
  if(document.querySelector('#watch-earn'))return;
  const store=document.querySelector('#store');
  if(!store)return;
  const section=document.createElement('section');
  section.id='watch-earn';
  section.className='border-y border-white/10 bg-stone-900/40';
  section.innerHTML=`<div class="mx-auto max-w-6xl px-5 py-20"><p class="text-xs font-black tracking-[.25em] text-amber-400">DELIONARYO WATCH & EARN</p><h2 class="mt-4 text-4xl font-black">Advertising That Circulates Value.</h2><p class="mt-4 max-w-3xl text-stone-300">Advertisers fund campaigns with DLC. Qualified viewers earn DLC. Platform income is recorded separately. Rewards can move to the Wallet and circulate through real purchases.</p><div id="we-flash" hidden class="mt-6"></div><div class="mt-10 grid gap-8 lg:grid-cols-2"><div><div class="rounded-3xl border border-white/10 bg-stone-950/70 p-6"><p class="text-xs font-black tracking-widest text-amber-400">VIEWER</p><h3 class="mt-2 text-2xl font-black">Watch & Earn Wallet</h3><div id="we-viewer-summary" class="mt-5"></div></div><div id="we-viewer-list" class="mt-5 space-y-4"></div></div><div><div class="rounded-3xl border border-white/10 bg-stone-950/70 p-6"><p class="text-xs font-black tracking-widest text-amber-400">ADVERTISER</p><h3 class="mt-2 text-2xl font-black">Create Campaign</h3><div class="mt-5 grid gap-3 sm:grid-cols-2"><input id="we-title" placeholder="Campaign title" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm sm:col-span-2"><input id="we-budget" type="number" value="100" min="10" placeholder="Budget DLC" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm"><input id="we-reward" type="number" value="5" min="0.01" step="0.01" placeholder="Viewer reward" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm"><input id="we-platform" type="number" value="1" min="0" step="0.01" placeholder="Platform share" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm"><input id="we-min-watch" type="number" value="15" min="5" max="600" placeholder="Min watch seconds" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm"><input id="we-video-url" placeholder="Video URL" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm sm:col-span-2"><input id="we-video-duration" type="number" value="30" min="1" max="60" placeholder="Video duration seconds" class="rounded-xl border border-white/10 bg-stone-950 px-4 py-3 text-sm"><button id="we-create" class="rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-stone-950">CREATE DRAFT</button></div><p class="mt-3 text-xs text-stone-500">Campaigns require owner moderation approval before funding and activation.</p></div><div id="we-advertiser-list" class="mt-5 space-y-4"></div></div></div></div>`;
  store.parentNode?.insertBefore(section,store);
  document.querySelector<HTMLButtonElement>('#we-create')?.addEventListener('click',createCampaign);
  const nav=document.querySelector('nav .md\\:flex');
  if(nav&&!nav.querySelector('a[href="#watch-earn"]')){const a=document.createElement('a');a.href='#watch-earn';a.textContent='WATCH & EARN';nav.appendChild(a);}
  await Promise.all([loadViewer(),loadAdvertiser()]);
  supabase.auth.onAuthStateChange(()=>{loadViewer();loadAdvertiser();});
}

document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>mountWatchEarn(),0);});
if(document.readyState!=='loading')setTimeout(()=>mountWatchEarn(),0);

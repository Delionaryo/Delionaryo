import { createClient } from '@supabase/supabase-js';

const supabase=createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');
const esc=(s:any)=>String(s??'').replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]||m));
const num=(v:any)=>Number(v||0);

async function loadDrafts(){
  const host=document.querySelector<HTMLDivElement>('#we-advertiser-list');
  if(!host)return;
  const {data:userData}=await supabase.auth.getUser();
  if(!userData.user){document.querySelector('#we-draft-editor')?.remove();return;}
  const {data,error}=await supabase.from('ad_campaigns')
    .select('id,title,objective,budget_dlc,reward_per_qualified_view_dlc,platform_per_qualified_view_dlc,minimum_watch_seconds,video_url,video_path,video_duration_seconds,moderation_status')
    .eq('advertiser_id',userData.user.id).eq('status','DRAFT').order('created_at',{ascending:false});
  if(error)return;

  let panel=document.querySelector<HTMLDivElement>('#we-draft-editor');
  if(!panel){panel=document.createElement('div');panel.id='we-draft-editor';panel.className='mt-6 rounded-3xl border border-white/10 bg-stone-950/70 p-6';host.parentElement?.appendChild(panel);}
  const rows=(data||[]) as any[];
  panel.innerHTML=`<div class="flex items-center justify-between gap-3"><div><p class="text-xs font-black tracking-widest text-amber-400">DRAFT EDITOR</p><h3 class="mt-2 text-xl font-black">Edit Before Submission</h3></div><span class="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-stone-400">${rows.length} DRAFT${rows.length===1?'':'S'}</span></div><div class="mt-5 space-y-4">${rows.length?rows.map(c=>`<article class="rounded-2xl border border-white/10 bg-stone-900 p-5" data-draft-card="${c.id}"><div class="grid gap-3 sm:grid-cols-2"><input data-f="title" value="${esc(c.title)}" class="rounded-xl border border-white/10 bg-stone-950 px-3 py-2 text-sm sm:col-span-2"><input data-f="budget" type="number" value="${num(c.budget_dlc)}" min="10" class="rounded-xl border border-white/10 bg-stone-950 px-3 py-2 text-sm"><input data-f="reward" type="number" step="0.01" value="${num(c.reward_per_qualified_view_dlc)}" min="0.01" class="rounded-xl border border-white/10 bg-stone-950 px-3 py-2 text-sm"><input data-f="platform" type="number" step="0.01" value="${num(c.platform_per_qualified_view_dlc)}" min="0" class="rounded-xl border border-white/10 bg-stone-950 px-3 py-2 text-sm"><input data-f="watch" type="number" value="${num(c.minimum_watch_seconds)}" min="5" max="600" class="rounded-xl border border-white/10 bg-stone-950 px-3 py-2 text-sm"><input data-f="video" value="${esc(c.video_url||'')}" placeholder="Video URL" class="rounded-xl border border-white/10 bg-stone-950 px-3 py-2 text-sm sm:col-span-2"><input data-f="duration" type="number" value="${num(c.video_duration_seconds)}" min="1" max="60" class="rounded-xl border border-white/10 bg-stone-950 px-3 py-2 text-sm"><button class="we-save-draft rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-stone-950" data-id="${c.id}">SAVE DRAFT</button></div><p class="mt-3 text-xs text-stone-500">Saving changes resets moderation and requires a fresh owner review before activation.</p></article>`).join(''):'<p class="text-sm text-stone-400">No editable draft campaigns.</p>'}</div>`;

  panel.querySelectorAll<HTMLButtonElement>('.we-save-draft').forEach(btn=>btn.addEventListener('click',async()=>{
    const card=panel?.querySelector<HTMLElement>(`[data-draft-card="${btn.dataset.id}"]`);if(!card)return;
    const value=(f:string)=>(card.querySelector<HTMLInputElement>(`[data-f="${f}"]`)?.value||'').trim();
    btn.disabled=true;btn.textContent='SAVING…';
    const {error}=await supabase.rpc('update_my_draft_ad_campaign',{
      p_campaign_id:btn.dataset.id,
      p_title:value('title'),
      p_budget_dlc:Number(value('budget')),
      p_reward_per_qualified_view_dlc:Number(value('reward')),
      p_platform_per_qualified_view_dlc:Number(value('platform')),
      p_minimum_watch_seconds:Number(value('watch')),
      p_objective:'PRODUCT_DISCOVERY',
      p_listing_id:null,
      p_product_id:null,
      p_video_url:value('video'),
      p_video_path:null,
      p_video_duration_seconds:Number(value('duration'))
    });
    btn.disabled=false;btn.textContent=error?'SAVE FAILED':'SAVED';
    if(!error)setTimeout(()=>loadDrafts(),500);
  }));
}

function boot(){
  const wait=()=>{if(document.querySelector('#watch-earn'))loadDrafts();else setTimeout(wait,200)};wait();
  supabase.auth.onAuthStateChange(()=>setTimeout(loadDrafts,0));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

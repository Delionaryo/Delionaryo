import { createClient } from '@supabase/supabase-js';

const supabase=createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');

const esc=(s:any)=>String(s??'').replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]||m));
const money=(n:any)=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2});

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

async function loadOwnerMonitor(){
  const host=document.querySelector<HTMLElement>('#watch-earn .mx-auto');
  if(!host)return;
  try{
    const [reserve,income,recon,risk]=await Promise.all([
      rpc('owner_dlc_reserve_monitor'),
      rpc('owner_real_income_monitor'),
      rpc('owner_reserve_income_reconciliation'),
      rpc('owner_watch_earn_risk_report')
    ]);
    let panel=document.querySelector<HTMLDivElement>('#we-owner-finance-monitor');
    if(!panel){
      panel=document.createElement('div');
      panel.id='we-owner-finance-monitor';
      panel.className='mt-10 rounded-3xl border border-emerald-400/20 bg-stone-950/80 p-6';
      host.appendChild(panel);
    }
    const healthy=recon?.status==='PASS'&&risk?.status==='PASS';
    panel.innerHTML=`<div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-xs font-black tracking-widest text-emerald-400">OWNER CONTROL MONITOR</p><h3 class="mt-2 text-2xl font-black">Reserve, Real Income & Watch Risk</h3><p class="mt-2 text-sm text-stone-400">Reserve and real income are monitored separately. Buy DLC reduces reserve; Sell DLC returns to reserve.</p></div><span class="rounded-full border ${healthy?'border-emerald-400/30 bg-emerald-400/10 text-emerald-300':'border-red-400/30 bg-red-400/10 text-red-300'} px-3 py-1 text-xs font-black">${healthy?'CONTROL PASS':'REVIEW REQUIRED'}</span></div>
    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="we-metric"><span>INITIAL RESERVE</span><b>${money(reserve?.initial_reserve_dlc)} DLC</b></div>
      <div class="we-metric"><span>BUY DLC OUT</span><b>${money(reserve?.buy_dlc_reserve_out_dlc)} DLC</b></div>
      <div class="we-metric"><span>SELL DLC IN</span><b>${money(reserve?.sell_dlc_reserve_in_dlc)} DLC</b></div>
      <div class="we-metric"><span>RESERVE BALANCE</span><b>${money(reserve?.reserve_balance_dlc)} DLC</b></div>
    </div>
    <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="we-metric"><span>REAL INCOME</span><b>${money(income?.real_income_balance_dlc)} DLC</b></div>
      <div class="we-metric"><span>PRODUCT / SERVICE</span><b>${money(income?.product_service_income_dlc)} DLC</b></div>
      <div class="we-metric"><span>AD PLATFORM INCOME</span><b>${money(income?.advertising_platform_income_dlc)} DLC</b></div>
      <div class="we-metric"><span>WITHDRAWAL FEES</span><b>${money(income?.withdrawal_fee_income_dlc)} DLC</b></div>
    </div>
    <div class="mt-5 grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-white/10 bg-stone-900 p-4"><p class="text-xs font-black text-stone-400">RECONCILIATION</p><p class="mt-2 text-lg font-black ${recon?.status==='PASS'?'text-emerald-300':'text-red-300'}">${esc(recon?.status||'UNKNOWN')}</p><p class="mt-1 text-sm text-stone-400">Gap ${money(recon?.reconciliation_gap_dlc)} DLC · Controlled ${money(recon?.expected_controlled_balance_dlc)} DLC</p></div><div class="rounded-2xl border border-white/10 bg-stone-900 p-4"><p class="text-xs font-black text-stone-400">WATCH & EARN RISK</p><p class="mt-2 text-lg font-black ${risk?.status==='PASS'?'text-emerald-300':'text-red-300'}">${esc(risk?.status||'UNKNOWN')}</p><p class="mt-1 text-sm text-stone-400">Self-view ${money(risk?.issues?.self_view_evidence)} · Duplicate groups ${money(risk?.issues?.daily_duplicate_reward_groups)} · Budget mismatch ${money(risk?.issues?.campaign_budget_mismatches)} · Negative reserve ${money(risk?.issues?.negative_reserved_balances)}</p></div></div>
    <div class="mt-5 flex flex-wrap items-center justify-between gap-3"><p class="text-xs text-stone-500">Rule: INITIAL RESERVE − BUY DLC + SELL DLC. Conversion movement is not real income.</p><button id="we-owner-monitor-refresh" class="rounded-xl border border-white/15 px-4 py-2 text-xs font-black">REFRESH CONTROL MONITOR</button></div>`;
    panel.querySelector<HTMLButtonElement>('#we-owner-monitor-refresh')?.addEventListener('click',()=>loadOwnerMonitor());
  }catch{
    document.querySelector('#we-owner-finance-monitor')?.remove();
  }
}

async function loadOwnerQueue(){
  const host=document.querySelector<HTMLElement>('#watch-earn .mx-auto');
  if(!host)return;

  let queue:any[]=[];
  try{
    const data=await rpc('owner_pending_ad_campaigns');
    queue=Array.isArray(data)?data:[];
  }catch{
    document.querySelector('#we-owner-moderation')?.remove();
    return;
  }

  let panel=document.querySelector<HTMLDivElement>('#we-owner-moderation');
  if(!panel){
    panel=document.createElement('div');
    panel.id='we-owner-moderation';
    panel.className='mt-10 rounded-3xl border border-amber-400/20 bg-stone-950/80 p-6';
    host.appendChild(panel);
  }

  panel.innerHTML=`<div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs font-black tracking-widest text-amber-400">OWNER MODERATION</p><h3 class="mt-2 text-2xl font-black">Ad Review Queue</h3><p class="mt-2 text-sm text-stone-400">Only approved campaigns can be funded and activated.</p></div><span class="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-stone-300">${queue.length} PENDING</span></div><div id="we-owner-list" class="mt-5 space-y-4"></div>`;

  const list=panel.querySelector<HTMLDivElement>('#we-owner-list')!;
  list.innerHTML=queue.length?queue.map(c=>`<article class="rounded-2xl border border-white/10 bg-stone-900 p-5"><div class="flex flex-wrap items-start justify-between gap-3"><div><h4 class="text-lg font-black">${esc(c.title)}</h4><p class="mt-1 text-sm text-stone-400">Budget ${money(c.budget_dlc)} DLC · Viewer ${money(c.reward_per_qualified_view_dlc)} DLC · Platform ${money(c.platform_per_qualified_view_dlc)} DLC · Watch ${money(c.minimum_watch_seconds)}s</p></div><span class="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-black text-amber-300">PENDING REVIEW</span></div>${c.video_url?`<video class="mt-4 w-full rounded-xl border border-white/10 bg-black" controls playsinline preload="metadata" src="${esc(c.video_url)}"></video>`:''}<div class="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]"><input class="we-owner-note rounded-xl border border-white/10 bg-stone-950 px-3 py-2 text-sm" data-note="${c.id}" placeholder="Review note (optional)"><button class="we-owner-approve rounded-xl bg-emerald-400 px-4 py-2 text-xs font-black text-stone-950" data-id="${c.id}">APPROVE</button><button class="we-owner-reject rounded-xl border border-red-400/30 px-4 py-2 text-xs font-black text-red-300" data-id="${c.id}">REJECT</button></div></article>`).join(''):'<p class="text-stone-400">No campaigns waiting for review.</p>';

  const decide=async(id:string,decision:'APPROVE'|'REJECT')=>{
    const note=(panel?.querySelector<HTMLInputElement>(`[data-note="${id}"]`)?.value||'').trim();
    try{
      await rpc('owner_review_ad_campaign',{p_campaign_id:id,p_decision:decision,p_note:note||null});
      flash(`Campaign ${decision==='APPROVE'?'approved':'rejected'}.`);
      await Promise.all([loadOwnerQueue(),loadOwnerMonitor()]);
    }catch(e:any){flash(e.message||'Moderation action failed','err');}
  };

  panel.querySelectorAll<HTMLButtonElement>('.we-owner-approve').forEach(b=>b.addEventListener('click',()=>decide(b.dataset.id!,'APPROVE')));
  panel.querySelectorAll<HTMLButtonElement>('.we-owner-reject').forEach(b=>b.addEventListener('click',()=>decide(b.dataset.id!,'REJECT')));
}

function boot(){
  const tryMount=()=>{
    if(document.querySelector('#watch-earn')) Promise.all([loadOwnerQueue(),loadOwnerMonitor()]);
    else setTimeout(tryMount,150);
  };
  tryMount();
  supabase.auth.onAuthStateChange(()=>setTimeout(()=>Promise.all([loadOwnerQueue(),loadOwnerMonitor()]),0));
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();

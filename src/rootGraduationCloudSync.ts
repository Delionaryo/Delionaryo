import { createClient } from '@supabase/supabase-js';

const supabase=createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');
const keys={
 baseline:'delionaryo-layer1-root-assessment',
 evidence:'delionaryo-layer1-evidence',
 reassessment:'delionaryo-layer1-root-reassessment',
 stability_plan:'delionaryo-layer1-stability-plan',
 review_record:'delionaryo-layer1-completion-record',
 started_at:'delionaryo-layer1-started'
};
let lastPayload='';
let syncing=false;

const parse=(key:string)=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}};

function buildPayload(userId:string){
 const baseline=parse(keys.baseline),evidence=parse(keys.evidence),reassessment=parse(keys.reassessment),stability_plan=parse(keys.stability_plan),review_record=parse(keys.review_record);
 const evidenceCount=Object.values(evidence as Record<string,any>).filter((x:any)=>x?.completed&&x?.note).length;
 const baselineKeys=Object.keys(baseline),reassessKeys=Object.keys(reassessment);
 const improved=baselineKeys.filter(k=>typeof baseline[k]==='number'&&typeof reassessment[k]==='number'&&reassessment[k]>baseline[k]).length;
 const noCritical=reassessKeys.length>=6&&reassessKeys.every(k=>reassessment[k]>=1);
 const planReady=!!stability_plan?.acknowledged;
 const status=(evidenceCount>=1&&improved>=1&&noCritical&&planReady)?'ready_for_review':'in_progress';
 return {user_id:userId,baseline,evidence,reassessment,stability_plan,review_record,status,started_at:localStorage.getItem(keys.started_at)||null,submitted_for_review_at:status==='ready_for_review'?new Date().toISOString():null};
}

async function sync(){
 if(syncing)return;
 syncing=true;
 try{
  const {data:{session}}=await supabase.auth.getSession();
  const user=session?.user;
  updateBadge(user?'Cloud protected':'Device only');
  if(!user)return;
  const payload=buildPayload(user.id);
  const signature=JSON.stringify(payload);
  if(signature===lastPayload)return;
  const {error}=await supabase.from('layer1_graduation_records').upsert(payload,{onConflict:'user_id'});
  if(error){console.warn('Layer 1 cloud sync:',error.message);updateBadge('Cloud sync pending');return;}
  lastPayload=signature;
  updateBadge(payload.status==='ready_for_review'?'Saved · Review ready':'Saved to account');
 }finally{syncing=false;}
}

function updateBadge(text:string){
 const host=document.querySelector<HTMLElement>('#root-transformation .root-shell');
 if(!host)return;
 let badge=host.querySelector<HTMLElement>('#layer1-sync-status');
 if(!badge){badge=document.createElement('div');badge.id='layer1-sync-status';badge.style.cssText='margin:0 0 14px;padding:9px 12px;border:1px solid rgba(251,191,36,.25);border-radius:10px;color:#fbbf24;font-size:11px;font-weight:800;background:rgba(251,191,36,.05)';host.insertBefore(badge,host.children[1]||null);}
 badge.textContent=`RECORD STATUS · ${text}`;
}

async function hydrate(){
 const {data:{session}}=await supabase.auth.getSession();
 const user=session?.user;if(!user)return;
 const {data,error}=await supabase.from('layer1_graduation_records').select('baseline,evidence,reassessment,stability_plan,review_record,started_at').eq('user_id',user.id).maybeSingle();
 if(error||!data)return;
 const pairs:[[string,any],[string,any],[string,any],[string,any],[string,any]]=[[keys.baseline,data.baseline],[keys.evidence,data.evidence],[keys.reassessment,data.reassessment],[keys.stability_plan,data.stability_plan],[keys.review_record,data.review_record]];
 let changed=false;
 for(const [key,value] of pairs){if(!localStorage.getItem(key)&&value&&Object.keys(value).length){localStorage.setItem(key,JSON.stringify(value));changed=true;}}
 if(!localStorage.getItem(keys.started_at)&&data.started_at){localStorage.setItem(keys.started_at,data.started_at);changed=true;}
 if(changed)location.reload();
}

setTimeout(async()=>{await hydrate();await sync();},1200);
setInterval(sync,12000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')sync();});
window.addEventListener('beforeunload',()=>{sync();});

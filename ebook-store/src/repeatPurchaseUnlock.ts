const SUPABASE_URL='https://tordvwlrtwxlbuuzgklt.supabase.co';
const SUPABASE_KEY='sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW';

type SbClient={auth:{getSession:()=>Promise<any>},rpc:(name:string,args?:Record<string,unknown>)=>Promise<any>};

async function getClient():Promise<SbClient|null>{
  const w=window as any;
  if(!w.supabase){
    await new Promise<void>((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=()=>resolve();s.onerror=()=>reject(new Error('Supabase failed to load'));document.head.appendChild(s)});
  }
  return w.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY)??null;
}

async function mountRepeatPurchaseUnlock(){
  const sb=await getClient(); if(!sb)return;
  const {data:{session}}=await sb.auth.getSession(); if(!session)return;
  if(document.querySelector('#repeat-purchase-unlock'))return;
  const anchor=document.querySelector('#membership')||document.querySelector('#books'); if(!anchor)return;
  const section=document.createElement('section');
  section.id='repeat-purchase-unlock';
  section.className='border-y border-amber-500/20 bg-stone-950';
  section.innerHTML=`<div class="max-w-4xl mx-auto px-5 py-14"><div class="rounded-3xl border border-amber-500/30 bg-stone-900 p-6 md:p-8"><p class="text-amber-400 font-black tracking-widest text-sm">EXISTING MEMBER · NEW PURCHASE</p><h2 class="mt-2 text-3xl font-black">Unlock your new purchase.</h2><p class="mt-3 text-stone-400 leading-7">Already have a DELIONARYO account? Stay logged in and enter the 6-digit verification code sent after your new payment is approved. The code unlocks only the product connected to that purchase.</p><div class="mt-6 flex flex-col sm:flex-row gap-3"><input id="repeat-code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" class="flex-1 rounded-xl border border-stone-700 bg-stone-950 px-5 py-4 text-xl tracking-[.35em] text-center font-black outline-none focus:border-amber-400" placeholder="000000"><button id="repeat-unlock-btn" class="rounded-xl bg-amber-400 px-7 py-4 font-black text-stone-950">UNLOCK NEW PURCHASE</button></div><p id="repeat-unlock-msg" class="mt-4 text-sm text-stone-400" aria-live="polite">Use the code for your latest approved purchase.</p><div id="repeat-code-activity" class="mt-5 text-sm text-stone-500"></div></div></div>`;
  anchor.parentElement?.insertBefore(section,anchor);
  const input=section.querySelector<HTMLInputElement>('#repeat-code')!,btn=section.querySelector<HTMLButtonElement>('#repeat-unlock-btn')!,msg=section.querySelector<HTMLParagraphElement>('#repeat-unlock-msg')!,activity=section.querySelector<HTMLDivElement>('#repeat-code-activity')!;
  input.addEventListener('input',()=>input.value=input.value.replace(/\D/g,'').slice(0,6));
  async function loadActivity(){const {data}=await sb.rpc('get_my_code_activity');if(!data?.length){activity.textContent='No verification-code activity yet.';return}const latest=data[0];activity.innerHTML=`Latest code status: <b class="text-amber-300">${latest.code_status}</b> · Order ${latest.order_id} · Product ${latest.product_id}${latest.code_last2?` · Code ending ••${latest.code_last2}`:''}`}
  await loadActivity();
  btn.onclick=async()=>{const code=input.value.trim();if(!/^\d{6}$/.test(code)){msg.textContent='Enter the complete 6-digit verification code.';return}btn.disabled=true;msg.textContent='Verifying your purchase…';try{const {data,error}=await sb.rpc('unlock_new_purchase_with_code',{p_code:code});if(error)throw error;if(!data?.length){msg.textContent='Code not found, expired, already used, or it does not belong to this account.';return}msg.innerHTML=`✓ <b>${data[0].product_id}</b> is now unlocked on this account.`;input.value='';await loadActivity();window.dispatchEvent(new CustomEvent('delionaryo:purchase-unlocked',{detail:data[0]}));}catch(e:any){msg.textContent=e?.message||'Unable to unlock this purchase.'}finally{btn.disabled=false}};
}

mountRepeatPurchaseUnlock().catch(console.error);

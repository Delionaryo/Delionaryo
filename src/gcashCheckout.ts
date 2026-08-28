import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');

function mountCheckout() {
  if (document.querySelector('#gcash-checkout-modal')) return;
  const modal=document.createElement('div');
  modal.id='gcash-checkout-modal';
  modal.className='fixed inset-0 z-[120] hidden items-start justify-center overflow-y-auto bg-black/90 p-4 py-8 backdrop-blur-sm';
  modal.innerHTML=`<div class="w-full max-w-xl rounded-3xl border border-amber-400/30 bg-stone-950 p-6 shadow-2xl md:p-8">
    <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-black tracking-[.22em] text-amber-400">DELIONARYO ENROLLMENT</p><h2 class="mt-2 text-3xl font-black">Create Account + Pay</h2><p class="mt-2 text-sm text-stone-400">AI Content Creation Tutorial · Founding Access</p></div><button id="gcash-close" class="rounded-lg border border-white/10 px-3 py-2 text-stone-400">✕</button></div>
    <div class="mt-6 rounded-2xl border border-amber-400/20 bg-stone-900 p-5"><div class="flex items-end justify-between gap-4"><div><p class="text-xs font-black tracking-widest text-stone-400">ONE-TIME PAYMENT</p><p class="mt-1 text-4xl font-black text-amber-400">₱499</p></div><b>GCash</b></div><div class="mt-4 border-t border-white/10 pt-4"><p class="font-black">Rodelio Legaspi</p><p class="mt-1 text-2xl font-black tracking-wide">0951 941 6959</p></div></div>
    <form id="gcash-form" class="mt-7 space-y-4">
      <div><p class="mb-4 text-xs font-black tracking-[.18em] text-amber-400">ACCOUNT INFORMATION</p>
      <label class="block text-sm font-bold">Full Name *<input id="gcash-name" required autocomplete="name" class="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"></label>
      <label class="mt-4 block text-sm font-bold">Email *<input id="gcash-email" type="email" required autocomplete="email" class="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"></label>
      <label class="mt-4 block text-sm font-bold">Mobile Number *<input id="gcash-mobile" type="tel" required autocomplete="tel" placeholder="09XXXXXXXXX" class="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"></label>
      <label id="gcash-password-wrap" class="mt-4 block text-sm font-bold">Create Password *<input id="gcash-password" type="password" minlength="6" autocomplete="new-password" class="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"><span class="mt-2 block text-xs font-normal text-stone-500">At least 6 characters. If you already have an account, login first and this field will disappear.</span></label></div>
      <div class="border-t border-white/10 pt-5"><p class="mb-4 text-xs font-black tracking-[.18em] text-amber-400">PAYMENT INFORMATION</p><label class="block text-sm font-bold">GCash Reference Number *<input id="gcash-reference" required minlength="6" inputmode="numeric" class="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400"></label></div>
      <label class="flex items-start gap-3 rounded-xl border border-white/10 bg-stone-900 p-4 text-sm leading-6"><input id="gcash-terms" type="checkbox" required class="mt-1 h-4 w-4"><span>I confirm that the information and GCash reference are correct, and I agree that course access is activated only after payment verification.</span></label>
      <div id="gcash-message" class="hidden rounded-xl border border-white/10 bg-stone-900 p-4 text-sm leading-6"></div>
      <button id="gcash-submit" type="submit" class="w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-stone-950">CREATE ACCOUNT & SUBMIT PAYMENT →</button>
    </form>
    <p class="mt-5 text-center text-xs leading-5 text-stone-500">Already registered? Login from the DELIONARYO header, then return here. After approval: Login → My Learning → AI Content Creation Tutorial.</p>
  </div>`;
  document.body.appendChild(modal);
  const close=()=>{modal.classList.add('hidden');modal.classList.remove('flex');};
  document.querySelector('#gcash-close')?.addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close();});

  async function syncAccountState(){
    const {data}=await supabase.auth.getUser(); const user=data.user;
    const email=document.querySelector<HTMLInputElement>('#gcash-email'); const passwordWrap=document.querySelector<HTMLElement>('#gcash-password-wrap'); const password=document.querySelector<HTMLInputElement>('#gcash-password'); const submit=document.querySelector<HTMLButtonElement>('#gcash-submit');
    if(user?.email){if(email){email.value=user.email;email.readOnly=true;}passwordWrap?.classList.add('hidden');if(password)password.required=false;if(submit)submit.textContent='SUBMIT PAYMENT FOR VERIFICATION →';}
    else{if(email)email.readOnly=false;passwordWrap?.classList.remove('hidden');if(password)password.required=true;if(submit)submit.textContent='CREATE ACCOUNT & SUBMIT PAYMENT →';}
  }
  window.addEventListener('delionaryo:gcash-checkout',async()=>{await syncAccountState();modal.classList.remove('hidden');modal.classList.add('flex');});

  document.querySelector<HTMLFormElement>('#gcash-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const name=document.querySelector<HTMLInputElement>('#gcash-name')?.value.trim()||'';
    const email=document.querySelector<HTMLInputElement>('#gcash-email')?.value.trim().toLowerCase()||'';
    const mobile=document.querySelector<HTMLInputElement>('#gcash-mobile')?.value.trim()||'';
    const password=document.querySelector<HTMLInputElement>('#gcash-password')?.value||'';
    const reference=document.querySelector<HTMLInputElement>('#gcash-reference')?.value.trim()||'';
    const message=document.querySelector<HTMLElement>('#gcash-message'); const button=document.querySelector<HTMLButtonElement>('#gcash-submit');
    if(!name||!email||!mobile||!reference||!message||!button)return;
    if(!/^09\d{9}$/.test(mobile.replace(/\s/g,''))){message.textContent='Enter a valid Philippine mobile number, for example 09XXXXXXXXX.';message.classList.remove('hidden');return;}
    button.disabled=true;button.textContent='PROCESSING…';message.classList.add('hidden');
    try{
      let {data:auth}=await supabase.auth.getUser();
      if(!auth.user){
        if(password.length<6)throw new Error('Create a password with at least 6 characters.');
        const signup=await supabase.auth.signUp({email,password,options:{data:{full_name:name,mobile}}});
        if(signup.error)throw signup.error;
        if(!signup.data.session)throw new Error('Account created. Please confirm your email, then LOGIN and submit the GCash reference again. Your payment has not been activated yet.');
        auth={user:signup.data.user};
      }
      if(!auth.user)throw new Error('Please login to continue.');
      if((auth.user.email||'').toLowerCase()!==email)throw new Error('Use the email connected to your logged-in DELIONARYO account.');
      const orderId=`DLY-AI-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
      const {error}=await supabase.from('course_orders').insert({order_id:orderId,user_id:auth.user.id,buyer_name:name,buyer_email:email,course_id:'ai-content-creation-tutorial',course_title:'AI Content Creation Tutorial',amount:499,payment_method:'GCASH',gcash_reference:reference,status:'FOR_VERIFICATION',submitted_at:new Date().toISOString(),notes:`Mobile: ${mobile}`});
      if(error)throw error;
      message.innerHTML=`<b class="text-amber-400">ENROLLMENT SUBMITTED</b><br>Order: <b>${orderId}</b><br>Payment status: <b>FOR VERIFICATION</b><br><br>After approval, login and open <b>My Learning</b>. Your AI Content Creation Tutorial will be available there.`;
      message.classList.remove('hidden');
      button.textContent='SUBMITTED ✓';
    }catch(error){message.textContent=error instanceof Error?error.message:'Unable to submit enrollment.';message.classList.remove('hidden');button.disabled=false;await syncAccountState();}
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountCheckout,{once:true});else mountCheckout();
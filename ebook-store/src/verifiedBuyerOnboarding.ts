import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

const params = new URLSearchParams(location.search);
const handoffMode = params.get('buyer_login') === '1';
const handoffEmail = (params.get('buyer_email') || sessionStorage.getItem('del_email') || '').trim().toLowerCase();
const handoffName = (params.get('buyer_name') || sessionStorage.getItem('del_buyer_name') || '').trim();
const handoffOrder = sessionStorage.getItem('del_verified_order') || '';

function addActivationFields() {
  const form = document.querySelector<HTMLFormElement>('#auth-form');
  const passwordWrap = document.querySelector<HTMLElement>('#auth-password-wrap');
  if (!form || !passwordWrap) return false;
  if (document.querySelector('#paid-buyer-activation-fields')) return true;
  const block = document.createElement('div');
  block.id = 'paid-buyer-activation-fields';
  block.className = 'space-y-4';
  block.innerHTML = `
    <label id="paid-buyer-name-wrap" class="block"><span class="text-sm font-bold text-stone-300">Full name</span><input id="paid-buyer-name" type="text" autocomplete="name" placeholder="Your full name" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"></label>
    <label class="block"><span class="text-sm font-bold text-stone-300">6-Digit Activation Code</span><input id="paid-buyer-code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="Enter your 6-digit code" class="mt-2 w-full rounded-xl border border-amber-500/40 bg-stone-900 px-4 py-3 text-center text-xl font-black tracking-[.35em] text-stone-100 outline-none focus:border-amber-400"><small class="mt-2 block text-xs text-stone-500">Already paid? Enter the code sent after DELIONARYO payment approval.</small></label>`;
  form.insertBefore(block, passwordWrap);
  return true;
}

function configureRegisterForm() {
  const modal = document.querySelector<HTMLElement>('#learning-auth-modal');
  if (!modal || modal.dataset.mode !== 'register') return;
  if (!addActivationFields()) return;
  const email = document.querySelector<HTMLInputElement>('#auth-email');
  const name = document.querySelector<HTMLInputElement>('#paid-buyer-name');
  const title = document.querySelector<HTMLElement>('#auth-title');
  const help = document.querySelector<HTMLElement>('#auth-help');
  const submit = document.querySelector<HTMLButtonElement>('#auth-submit');
  if (title) title.textContent = handoffName ? handoffName.toUpperCase() : 'Create Account & Activate';
  if (help) help.textContent = 'Already paid? Create your password and enter your 6-digit activation code. Your verified purchase will be connected to this account.';
  if (submit) submit.textContent = 'CREATE ACCOUNT & ACTIVATE ACCESS';
  if (handoffEmail && email) { email.value = handoffEmail; email.readOnly = true; email.classList.add('opacity-80'); }
  if (handoffName && name) { name.value = handoffName; name.readOnly = true; name.classList.add('opacity-80'); }
}

async function activatePaidBuyer(event: Event) {
  const modal = document.querySelector<HTMLElement>('#learning-auth-modal');
  if (modal?.dataset.mode !== 'register') return;
  const code = (document.querySelector<HTMLInputElement>('#paid-buyer-code')?.value || '').replace(/\D/g, '');
  if (!code) return; // no activation code: preserve ordinary account registration
  event.preventDefault();
  event.stopImmediatePropagation();

  const email = (document.querySelector<HTMLInputElement>('#auth-email')?.value || '').trim().toLowerCase();
  const fullName = (document.querySelector<HTMLInputElement>('#paid-buyer-name')?.value || '').trim();
  const password = document.querySelector<HTMLInputElement>('#auth-password')?.value || '';
  const confirm = document.querySelector<HTMLInputElement>('#auth-confirm')?.value || '';
  const message = document.querySelector<HTMLElement>('#auth-message');
  const submit = document.querySelector<HTMLButtonElement>('#auth-submit');
  const say=(text:string,ok=false)=>{if(message){message.textContent=text;message.classList.remove('hidden','text-red-300','text-emerald-300');message.classList.add(ok?'text-emerald-300':'text-red-300')}};
  if (!email) return say('Enter the same email address used for your payment.');
  if (!fullName) return say('Enter your full name.');
  if (password.length < 6) return say('Password must have at least 6 characters.');
  if (password !== confirm) return say('Passwords do not match.');
  if (code.length !== 6) return say('Enter the complete 6-digit activation code.');
  if (!handoffOrder) return say('Your payment order is not connected to this browser yet. Open the account setup from the Payment Center after payment verification so the order can be securely matched.');

  if(submit){submit.disabled=true;submit.textContent='CREATING & ACTIVATING…'}
  try {
    await supabase.auth.signOut();
    const signup=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName},emailRedirectTo:'https://delionaryo.vercel.app/'}});
    if(signup.error) throw signup.error;
    let session=signup.data.session;
    if(!session){
      const login=await supabase.auth.signInWithPassword({email,password});
      if(login.error) return say('Account created. Confirm your email, then login with this password to finish activation.');
      session=login.data.session;
    }
    if(!session) return say('Account created. Login to finish activation.');
    const activation=await supabase.rpc('activate_verified_buyer_account',{p_order_id:handoffOrder,p_buyer_email:email,p_code:code});
    if(activation.error||!activation.data) throw activation.error||new Error('Activation code could not be verified.');
    ['del_verified_order','del_email','del_access_active','del_product_id','del_buyer_name'].forEach(k=>sessionStorage.removeItem(k));
    say('Account created. Purchase activated. Opening your Learning Campus…',true);
    const clean=new URL(location.href);['buyer_login','buyer_email','buyer_name'].forEach(k=>clean.searchParams.delete(k));history.replaceState({},'',clean);
    setTimeout(()=>location.reload(),700);
  } catch(err:any){ say(err?.message||'Unable to activate the account. Please try again.'); }
  finally{if(submit){submit.disabled=false;submit.textContent='CREATE ACCOUNT & ACTIVATE ACCESS'}}
}

function bind() {
  const form=document.querySelector<HTMLFormElement>('#auth-form');
  if(!form) return false;
  if(form.dataset.paidActivationBound!=='1'){
    form.dataset.paidActivationBound='1';
    form.addEventListener('submit',activatePaidBuyer,true);
  }
  const observer=new MutationObserver(()=>configureRegisterForm());
  const modal=document.querySelector<HTMLElement>('#learning-auth-modal');
  if(modal) observer.observe(modal,{attributes:true,attributeFilter:['data-mode','class']});
  document.querySelector('#auth-switch')?.addEventListener('click',()=>setTimeout(configureRegisterForm,0));
  document.querySelector('#learning-login-top')?.addEventListener('click',()=>setTimeout(configureRegisterForm,0));
  configureRegisterForm();
  return true;
}

function start(){if(!bind())setTimeout(start,120);}
start();

if(handoffMode&&handoffEmail){
  (async()=>{
    await supabase.auth.signOut();
    const open=()=>{
      const sw=document.querySelector<HTMLButtonElement>('#auth-switch');
      const modal=document.querySelector<HTMLElement>('#learning-auth-modal');
      if(!sw||!modal)return setTimeout(open,120);
      if(modal.dataset.mode!=='register') sw.click();
      setTimeout(configureRegisterForm,0);
    };
    open();
  })();
}

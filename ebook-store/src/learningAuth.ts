import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

const SITE_URL = 'https://app.gapcreation.space';
const PUBLIC_CAMPUS_URL = 'https://campus.gapcreation.space/';
const MEMBER_CAMPUS_URL = 'https://campus.gapcreation.space/?member=1';
let currentUser: any = null;

function goToPublicCampus(){ window.location.href=PUBLIC_CAMPUS_URL; }
function goToMemberCampus(){ window.location.href=MEMBER_CAMPUS_URL; }

function initAuth() {
  const headerRow = document.querySelector<HTMLElement>('header > div');
  const books = document.querySelector<HTMLElement>('#books');
  if (!headerRow || !books || document.querySelector('#learning-login-top')) return false;

  const button = document.createElement('button');
  button.id = 'learning-login-top';
  button.className = 'rounded-xl border border-amber-400 px-4 py-2 text-sm font-black text-amber-400';
  button.textContent = 'OPEN CAMPUS';
  button.addEventListener('click', goToPublicCampus);
  headerRow.querySelector('div:last-child')?.appendChild(button);

  const section = document.createElement('section');
  section.id = 'my-learning';
  section.className = 'border-y border-amber-500/20 bg-stone-900';
  section.innerHTML = `<div class="max-w-7xl mx-auto px-5 py-14"><p class="text-amber-400 font-black tracking-widest text-sm">DELIONARYO MEMBER LEARNING</p><div class="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-5"><div><h2 class="text-4xl md:text-5xl font-black">My Learning Access</h2><p id="learning-copy" class="mt-3 text-stone-400">The public Campus is open to everyone. Sign in only to access your purchased learning, saved progress and private member tools.</p></div><div class="flex gap-3"><button id="learning-login" class="rounded-xl bg-amber-400 px-6 py-3 font-black text-stone-950">MY LEARNING ACCESS</button></div></div><div id="learning-grid" class="mt-8 grid md:grid-cols-3 gap-4"><article class="rounded-2xl border border-stone-800 bg-stone-950 p-6"><p class="text-amber-400 font-black text-sm">PRIVATE MEMBER ACCESS</p><h3 class="mt-2 text-xl font-black">Your owned learning stays protected.</h3><p class="mt-2 text-stone-400 text-sm">Purchased courses, ebooks, workbooks, progress and member records open only through authenticated learning access.</p></article></div></div>`;
  books.parentElement?.insertBefore(section, books);
  document.querySelector('#learning-login')?.addEventListener('click', () => currentUser ? goToMemberCampus() : openModal('login'));
  createModal();
  boot();
  return true;
}

function createModal() {
  const modal = document.createElement('div');
  modal.id = 'learning-auth-modal';
  modal.className = 'fixed inset-0 z-[100] hidden items-center justify-center bg-black/85 p-4 overflow-y-auto backdrop-blur-md';
  modal.innerHTML = `<div class="auth-shell my-6 w-full max-w-md rounded-[2rem] border border-amber-500/30 bg-stone-950 p-6 shadow-2xl"><div class="flex justify-between gap-4"><div><p class="text-amber-400 font-black text-sm tracking-widest">DELIONARYO ACCOUNT</p><h2 id="auth-title" class="mt-1 text-3xl font-black">Login</h2><p id="auth-help" class="mt-2 text-sm text-stone-400">Use the email address connected to your DELIONARYO account.</p></div><button id="auth-close" type="button" class="self-start rounded-lg border border-stone-800 px-3 py-2 text-stone-400">✕</button></div>
  <form id="auth-form" class="mt-6 space-y-4" novalidate>
    <div id="auth-identity-wrap" class="hidden space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label class="block"><span class="text-sm font-bold text-stone-300">First name</span><input id="auth-first-name" type="text" autocomplete="given-name" maxlength="80" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"></label>
        <label class="block"><span class="text-sm font-bold text-stone-300">Surname</span><input id="auth-last-name" type="text" autocomplete="family-name" maxlength="80" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"></label>
      </div>
      <label class="block"><span class="text-sm font-bold text-stone-300">Mobile number</span><input id="auth-mobile" type="tel" inputmode="tel" autocomplete="tel" maxlength="18" placeholder="09XXXXXXXXX" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"><small class="mt-2 block text-xs leading-5 text-stone-500">One mobile number can be registered to only one DELIONARYO account.</small></label>
      <div class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-5 text-stone-400"><b class="text-amber-400">REGISTER ONCE SECURITY</b><br>One person, one account. Your email and mobile number are checked as unique identity fields. Names are required for account records but are not used as a unique identifier.</div>
    </div>
    <label class="block"><span class="text-sm font-bold text-stone-300">Email address</span><input id="auth-email" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"></label>
    <label id="auth-password-wrap" class="block"><span class="text-sm font-bold text-stone-300">Password</span><div class="relative mt-2"><input id="auth-password" type="password" autocomplete="current-password" placeholder="At least 10 characters" class="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 pr-20 text-stone-100 outline-none focus:border-amber-400"><button id="toggle-password" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-amber-400">SHOW</button></div></label>
    <label id="auth-confirm-wrap" class="hidden"><span class="text-sm font-bold text-stone-300">Confirm password</span><input id="auth-confirm" type="password" autocomplete="new-password" placeholder="Repeat password" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"></label>
    <p id="auth-message" class="hidden rounded-xl border border-stone-800 bg-stone-900 p-3 text-sm text-stone-300" aria-live="polite"></p>
    <button id="auth-submit" type="submit" class="w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-stone-950 disabled:opacity-60">LOGIN</button>
  </form>
  <div class="mt-4 flex flex-wrap justify-between gap-3 text-sm font-bold"><button id="auth-switch" type="button" class="text-amber-400">Create account</button><button id="auth-forgot" type="button" class="text-stone-400">Forgot password?</button></div></div>`;
  document.body.appendChild(modal);
  document.querySelector('#auth-close')?.addEventListener('click', closeModal);
  document.querySelector('#auth-switch')?.addEventListener('click', () => openModal(modal.dataset.mode === 'register' ? 'login' : 'register'));
  document.querySelector('#auth-forgot')?.addEventListener('click', () => openModal('forgot'));
  document.querySelector('#toggle-password')?.addEventListener('click', togglePassword);
  document.querySelector<HTMLFormElement>('#auth-form')?.addEventListener('submit', submitAuth);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
}

function openModal(mode: 'login'|'register'|'forgot') {
  const modal = document.querySelector<HTMLElement>('#learning-auth-modal');
  if (!modal) return;
  modal.dataset.mode = mode;
  modal.classList.remove('hidden'); modal.classList.add('flex');
  const title = document.querySelector<HTMLElement>('#auth-title');
  const help = document.querySelector<HTMLElement>('#auth-help');
  const submit = document.querySelector<HTMLButtonElement>('#auth-submit');
  const passWrap = document.querySelector<HTMLElement>('#auth-password-wrap');
  const confirmWrap = document.querySelector<HTMLElement>('#auth-confirm-wrap');
  const identityWrap = document.querySelector<HTMLElement>('#auth-identity-wrap');
  const passwordInput = document.querySelector<HTMLInputElement>('#auth-password');
  const sw = document.querySelector<HTMLButtonElement>('#auth-switch');
  const forgot = document.querySelector<HTMLButtonElement>('#auth-forgot');
  const message = document.querySelector<HTMLElement>('#auth-message');
  if (message) { message.textContent=''; message.classList.add('hidden'); message.classList.remove('text-red-300','text-emerald-300'); }
  identityWrap?.classList.toggle('hidden', mode!=='register');
  if(passwordInput) passwordInput.autocomplete=mode==='register'?'new-password':'current-password';
  if (mode === 'login') {
    if(title) title.textContent='Login'; if(help) help.textContent='Sign in to open your private learning access. The public Campus does not require login.'; if(submit) submit.textContent='LOGIN';
    passWrap?.classList.remove('hidden'); confirmWrap?.classList.add('hidden'); if(sw) sw.textContent='Create account'; forgot?.classList.remove('hidden');
  }
  if (mode === 'register') {
    if(title) title.textContent='Create Account'; if(help) help.textContent='Register once with your name, unique mobile number and email. Your verified purchases and progress will stay connected to this account.'; if(submit) submit.textContent='CREATE MY ACCOUNT';
    passWrap?.classList.remove('hidden'); confirmWrap?.classList.remove('hidden'); if(sw) sw.textContent='Already registered? Login'; forgot?.classList.add('hidden');
  }
  if (mode === 'forgot') {
    if(title) title.textContent='Reset Password'; if(help) help.textContent='Enter your registered email and we will send a secure reset link.'; if(submit) submit.textContent='SEND RESET LINK';
    passWrap?.classList.add('hidden'); confirmWrap?.classList.add('hidden'); if(sw) sw.textContent='Back to login'; forgot?.classList.add('hidden');
  }
  setTimeout(() => document.querySelector<HTMLInputElement>(mode==='register'?'#auth-first-name':'#auth-email')?.focus(), 50);
}

function closeModal(){ const m=document.querySelector<HTMLElement>('#learning-auth-modal'); m?.classList.add('hidden'); m?.classList.remove('flex'); }
function showMessage(text:string, kind:'error'|'success'='error'){ const el=document.querySelector<HTMLElement>('#auth-message'); if(el){el.textContent=text;el.classList.remove('hidden','text-red-300','text-emerald-300');el.classList.add(kind==='error'?'text-red-300':'text-emerald-300');} }
function setBusy(busy:boolean){ const button=document.querySelector<HTMLButtonElement>('#auth-submit'); if(button){ if(busy){button.dataset.label=button.textContent||'';button.disabled=true;button.textContent='PLEASE WAIT…';} else {button.disabled=false;button.textContent=button.dataset.label||'CONTINUE';} } }
function togglePassword(){ const input=document.querySelector<HTMLInputElement>('#auth-password'); const btn=document.querySelector<HTMLButtonElement>('#toggle-password'); if(!input||!btn)return; const show=input.type==='password'; input.type=show?'text':'password'; btn.textContent=show?'HIDE':'SHOW'; }
function validEmail(email:string){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function normalizePHMobile(value:string){
  const raw=value.trim();
  const digits=raw.replace(/\D/g,'');
  if(/^09\d{9}$/.test(digits)) return `+63${digits.slice(1)}`;
  if(/^9\d{9}$/.test(digits)) return `+63${digits}`;
  if(/^63\d{10}$/.test(digits)) return `+${digits}`;
  if(raw.startsWith('+') && /^[1-9]\d{7,14}$/.test(digits)) return `+${digits}`;
  return '';
}
function strongPassword(password:string){ return password.length>=10 && /[A-Za-z]/.test(password) && /\d/.test(password); }

async function submitAuth(e:SubmitEvent){
  e.preventDefault();
  const modal=document.querySelector<HTMLElement>('#learning-auth-modal');
  const firstName=document.querySelector<HTMLInputElement>('#auth-first-name')?.value.trim()||'';
  const lastName=document.querySelector<HTMLInputElement>('#auth-last-name')?.value.trim()||'';
  const mobileRaw=document.querySelector<HTMLInputElement>('#auth-mobile')?.value||'';
  const mobile=normalizePHMobile(mobileRaw);
  const email=document.querySelector<HTMLInputElement>('#auth-email')?.value.trim().toLowerCase()||'';
  const password=document.querySelector<HTMLInputElement>('#auth-password')?.value||'';
  const confirm=document.querySelector<HTMLInputElement>('#auth-confirm')?.value||'';
  const mode=modal?.dataset.mode||'login';
  if(mode==='register'){
    if(!firstName) return showMessage('Please enter your first name.');
    if(!lastName) return showMessage('Please enter your surname.');
    if(!mobile) return showMessage('Enter a valid mobile number, for example 09XXXXXXXXX.');
  }
  if(!email) return showMessage('Please enter your email address.');
  if(!validEmail(email)) return showMessage('Please enter a complete email address, for example name@gmail.com.');
  if(mode==='register' && !strongPassword(password)) return showMessage('Use at least 10 characters with at least one letter and one number.');
  if(mode==='login' && password.length<1) return showMessage('Please enter your password.');
  if(mode==='register' && password!==confirm) return showMessage('Passwords do not match. Please type the same password twice.');
  setBusy(true);
  try {
    if(mode==='forgot'){
      const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${SITE_URL}/`});
      return showMessage(error?error.message:'Reset link sent. Check your email inbox and spam folder.', error?'error':'success');
    }
    if(mode==='register'){
      const {data,error}=await supabase.auth.signUp({
        email,
        password,
        options:{
          emailRedirectTo:`${SITE_URL}/`,
          data:{
            first_name:firstName,
            last_name:lastName,
            full_name:`${firstName} ${lastName}`,
            phone:mobile,
            registration_source:'app.gapcreation.space',
            registration_version:2
          }
        }
      });
      if(error){
        console.warn('DELIONARYO registration rejected',error.message);
        return showMessage('We could not create a new account with these details. If you registered before, use Login or Forgot Password.');
      }
      if(data.session){ showMessage('Account created. Opening My Learning Access…','success'); setTimeout(()=>goToMemberCampus(),700); return; }
      showMessage('Account created. Confirm your email, then login to open My Learning Access.','success'); return;
    }
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error)return showMessage('Login failed. Check your email and password, or use Forgot Password.');
    showMessage('Login successful. Opening My Learning Access…','success');
    setTimeout(()=>goToMemberCampus(),500);
  } catch { showMessage('Unable to connect right now. Please check your internet connection and try again.'); }
  finally { setBusy(false); }
}

async function openMemberPortal(){
  const {data:{session}} = await supabase.auth.getSession();
  if(!session?.user){ openModal('login'); return; }
  goToMemberCampus();
}

async function render(user:any){
  currentUser=user;
  document.querySelector('#member-portal')?.remove();
  document.body.classList.remove('member-mode');
  const top=document.querySelector<HTMLButtonElement>('#learning-login-top');
  const copy=document.querySelector<HTMLElement>('#learning-copy');
  const entry=document.querySelector<HTMLButtonElement>('#learning-login');
  if(top) top.textContent='OPEN CAMPUS';
  if(entry) entry.textContent=user?'OPEN MY LEARNING ACCESS':'MY LEARNING ACCESS';
  if(copy) copy.textContent=user?'Your member session is active. Open your purchased learning and saved progress.':'The public Campus is open without login. Sign in only for purchased learning and private progress.';
}

async function boot(){const {data}=await supabase.auth.getSession();await render(data.session?.user||null);supabase.auth.onAuthStateChange((_e,s)=>{currentUser=s?.user||null;render(currentUser);});}
if(!initAuth()){const observer=new MutationObserver(()=>{if(initAuth())observer.disconnect();});observer.observe(document.documentElement,{childList:true,subtree:true});}

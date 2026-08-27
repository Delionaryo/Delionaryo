import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

let currentUser: any = null;

function initAuth() {
  const headerRow = document.querySelector<HTMLElement>('header > div');
  const books = document.querySelector<HTMLElement>('#books');
  if (!headerRow || !books || document.querySelector('#learning-login-top')) return false;

  const button = document.createElement('button');
  button.id = 'learning-login-top';
  button.className = 'rounded-xl border border-amber-400 px-4 py-2 text-sm font-black text-amber-400';
  button.textContent = 'LOGIN';
  button.addEventListener('click', () => currentUser ? document.querySelector('#my-learning')?.scrollIntoView({behavior:'smooth'}) : openModal('login'));
  headerRow.querySelector('div:last-child')?.appendChild(button);

  const section = document.createElement('section');
  section.id = 'my-learning';
  section.className = 'border-y border-amber-500/20 bg-stone-900';
  section.innerHTML = `<div class="max-w-7xl mx-auto px-5 py-14"><p class="text-amber-400 font-black tracking-widest text-sm">DELIONARYO E-LEARNING HUB</p><div class="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-5"><div><h2 class="text-4xl md:text-5xl font-black">My Learning</h2><p id="learning-copy" class="mt-3 text-stone-400">Login or create an account to access your paid courses.</p></div><div class="flex gap-3"><button id="learning-login" class="rounded-xl bg-amber-400 px-6 py-3 font-black text-stone-950">LOGIN / REGISTER</button><button id="learning-logout" class="hidden rounded-xl border border-stone-700 px-6 py-3 font-black">LOGOUT</button></div></div><div id="learning-grid" class="mt-8 grid md:grid-cols-3 gap-4"><article class="rounded-2xl border border-stone-800 bg-stone-950 p-6"><p class="text-amber-400 font-black text-sm">MEMBER ACCESS</p><h3 class="mt-2 text-xl font-black">Your paid courses appear here.</h3><p class="mt-2 text-stone-400 text-sm">After verified purchase or enrollment, your lessons are connected to your account.</p></article></div></div>`;
  books.parentElement?.insertBefore(section, books);
  document.querySelector('#learning-login')?.addEventListener('click', () => openModal('login'));
  document.querySelector('#learning-logout')?.addEventListener('click', () => supabase.auth.signOut());
  createModal();
  boot();
  return true;
}

function createModal() {
  const modal = document.createElement('div');
  modal.id = 'learning-auth-modal';
  modal.className = 'fixed inset-0 z-[100] hidden items-center justify-center bg-black/80 p-4 overflow-y-auto';
  modal.innerHTML = `<div class="my-6 w-full max-w-md rounded-3xl border border-amber-500/30 bg-stone-950 p-6 shadow-2xl"><div class="flex justify-between gap-4"><div><p class="text-amber-400 font-black text-sm tracking-widest">DELIONARYO ACCOUNT</p><h2 id="auth-title" class="mt-1 text-3xl font-black">Login</h2><p id="auth-help" class="mt-2 text-sm text-stone-400">Use the email address connected to your DELIONARYO account.</p></div><button id="auth-close" type="button" class="self-start rounded-lg border border-stone-800 px-3 py-2 text-stone-400">✕</button></div>
  <form id="auth-form" class="mt-6 space-y-4" novalidate>
    <label class="block"><span class="text-sm font-bold text-stone-300">Email address</span><input id="auth-email" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"></label>
    <label id="auth-password-wrap" class="block"><span class="text-sm font-bold text-stone-300">Password</span><div class="relative mt-2"><input id="auth-password" type="password" autocomplete="current-password" placeholder="At least 6 characters" class="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 pr-20 text-stone-100 outline-none focus:border-amber-400"><button id="toggle-password" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-amber-400">SHOW</button></div></label>
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
  const sw = document.querySelector<HTMLButtonElement>('#auth-switch');
  const forgot = document.querySelector<HTMLButtonElement>('#auth-forgot');
  const message = document.querySelector<HTMLElement>('#auth-message');
  if (message) { message.textContent=''; message.classList.add('hidden'); message.classList.remove('text-red-300','text-emerald-300'); }
  if (mode === 'login') {
    if(title) title.textContent='Login';
    if(help) help.textContent='Enter your email and password to open My Learning.';
    if(submit) submit.textContent='LOGIN';
    passWrap?.classList.remove('hidden'); confirmWrap?.classList.add('hidden');
    if(sw) sw.textContent='Create account'; forgot?.classList.remove('hidden');
  }
  if (mode === 'register') {
    if(title) title.textContent='Create Account';
    if(help) help.textContent='Use a complete email address. This email will be linked to your course purchases.';
    if(submit) submit.textContent='CREATE MY ACCOUNT';
    passWrap?.classList.remove('hidden'); confirmWrap?.classList.remove('hidden');
    if(sw) sw.textContent='Already registered? Login'; forgot?.classList.add('hidden');
  }
  if (mode === 'forgot') {
    if(title) title.textContent='Reset Password';
    if(help) help.textContent='Enter your registered email address and we will send a reset link.';
    if(submit) submit.textContent='SEND RESET LINK';
    passWrap?.classList.add('hidden'); confirmWrap?.classList.add('hidden');
    if(sw) sw.textContent='Back to login'; forgot?.classList.add('hidden');
  }
  setTimeout(() => document.querySelector<HTMLInputElement>('#auth-email')?.focus(), 50);
}

function closeModal(){ const m=document.querySelector<HTMLElement>('#learning-auth-modal'); m?.classList.add('hidden'); m?.classList.remove('flex'); }
function showMessage(text:string, kind:'error'|'success'='error'){ const el=document.querySelector<HTMLElement>('#auth-message'); if(el){el.textContent=text;el.classList.remove('hidden','text-red-300','text-emerald-300');el.classList.add(kind==='error'?'text-red-300':'text-emerald-300');} }
function setBusy(busy:boolean){ const button=document.querySelector<HTMLButtonElement>('#auth-submit'); if(button){button.disabled=busy; if(busy) button.dataset.label=button.textContent||''; button.textContent=busy?'PLEASE WAIT…':(button.dataset.label||button.textContent||'CONTINUE');} }
function togglePassword(){ const input=document.querySelector<HTMLInputElement>('#auth-password'); const btn=document.querySelector<HTMLButtonElement>('#toggle-password'); if(!input||!btn)return; const show=input.type==='password'; input.type=show?'text':'password'; btn.textContent=show?'HIDE':'SHOW'; }
function validEmail(email:string){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

async function submitAuth(e:SubmitEvent){
  e.preventDefault();
  const modal=document.querySelector<HTMLElement>('#learning-auth-modal');
  const email=document.querySelector<HTMLInputElement>('#auth-email')?.value.trim().toLowerCase()||'';
  const password=document.querySelector<HTMLInputElement>('#auth-password')?.value||'';
  const confirm=document.querySelector<HTMLInputElement>('#auth-confirm')?.value||'';
  const mode=modal?.dataset.mode||'login';

  if(!email) return showMessage('Please enter your email address.');
  if(!validEmail(email)) return showMessage('Please enter a complete email address, for example name@gmail.com.');
  if(mode!=='forgot' && password.length<6) return showMessage('Password must have at least 6 characters.');
  if(mode==='register' && password!==confirm) return showMessage('Passwords do not match. Please type the same password twice.');

  setBusy(true);
  try {
    if(mode==='forgot'){
      const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
      return showMessage(error?error.message:'Reset link sent. Check your email inbox and spam folder.', error?'error':'success');
    }
    if(mode==='register'){
      const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin}});
      if(error) return showMessage(error.message);
      if(data.session){ showMessage('Account created successfully. You are now signed in.','success'); setTimeout(closeModal,900); return; }
      showMessage('Account created. Check your email for the confirmation link, then come back and login.','success');
      return;
    }
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error)return showMessage(error.message);
    showMessage('Login successful. Opening My Learning…','success');
    setTimeout(()=>{closeModal();document.querySelector('#my-learning')?.scrollIntoView({behavior:'smooth'});},700);
  } catch {
    showMessage('Unable to connect right now. Please check your internet connection and try again.');
  } finally { setBusy(false); }
}

async function render(user:any){
  currentUser=user;
  const top=document.querySelector<HTMLButtonElement>('#learning-login-top');
  const login=document.querySelector<HTMLButtonElement>('#learning-login');
  const logout=document.querySelector<HTMLButtonElement>('#learning-logout');
  const copy=document.querySelector<HTMLElement>('#learning-copy');
  const grid=document.querySelector<HTMLElement>('#learning-grid');
  if(top) top.textContent=user?'MY LEARNING':'LOGIN';
  if(!user){login?.classList.remove('hidden');logout?.classList.add('hidden');if(copy)copy.textContent='Login or create an account to access your paid courses.';return;}
  login?.classList.add('hidden');logout?.classList.remove('hidden');if(copy)copy.textContent=`Signed in as ${user.email}.`;
  const {data}=await supabase.from('learning_enrollments').select('status,learning_courses(title,description)').eq('status','active');
  if(grid) grid.innerHTML=data?.length?data.map((r:any)=>`<article class="rounded-2xl border border-amber-500/30 bg-stone-950 p-6"><p class="text-amber-400 font-black text-sm">ACTIVE COURSE</p><h3 class="mt-2 text-xl font-black">${r.learning_courses?.title||'DELIONARYO Course'}</h3><p class="mt-2 text-stone-400 text-sm">${r.learning_courses?.description||'Continue learning.'}</p></article>`).join(''):`<article class="rounded-2xl border border-stone-800 bg-stone-950 p-6"><p class="text-amber-400 font-black text-sm">ACCOUNT READY</p><h3 class="mt-2 text-xl font-black">No active paid course yet.</h3><p class="mt-2 text-stone-400 text-sm">Verified purchases will appear here automatically.</p></article>`;
}

async function boot(){const {data}=await supabase.auth.getSession();await render(data.session?.user||null);supabase.auth.onAuthStateChange((_e,s)=>void render(s?.user||null));}

if(!initAuth()){const observer=new MutationObserver(()=>{if(initAuth())observer.disconnect();});observer.observe(document.documentElement,{childList:true,subtree:true});}

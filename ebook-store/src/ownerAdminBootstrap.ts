import './styles.css';
import { createClient } from '@supabase/supabase-js';

const supabase=createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');
const app=document.querySelector<HTMLDivElement>('#payment-admin')!;
const OWNER_EMAILS=new Set(['rodelrobleslegaspi@gmail.com','delionaryo@gmail.com']);

function loginScreen(message=''){
  app.innerHTML=`<main class="min-h-screen bg-[#030b13] text-slate-100 flex items-center justify-center p-5"><section class="w-full max-w-md rounded-3xl border border-amber-500/25 bg-[#07121e] p-7 shadow-2xl"><div class="text-4xl">♛</div><p class="mt-3 text-xs font-black tracking-[.25em] text-amber-400">DELIONARYO OWNER SYSTEM</p><h1 class="mt-2 text-2xl font-black text-amber-300">Income Generator Login</h1><p class="mt-2 text-sm text-slate-500">Owner authentication is required before payment approval and verification-code delivery.</p>${message?`<div class="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-300">${message}</div>`:''}<form id="owner-login" class="mt-6 space-y-3"><input id="owner-email" type="email" autocomplete="username" required placeholder="Owner email" class="w-full rounded-xl border border-slate-700 bg-[#030b13] px-4 py-3 outline-none focus:border-amber-500"><input id="owner-password" type="password" autocomplete="current-password" required placeholder="Password" class="w-full rounded-xl border border-slate-700 bg-[#030b13] px-4 py-3 outline-none focus:border-amber-500"><button class="w-full rounded-xl bg-amber-400 p-3 font-black text-black">LOGIN TO OWNER SYSTEM</button></form><p class="mt-5 text-center text-[10px] tracking-[.2em] text-slate-600">SECURE PAYMENT APPROVAL • AUTOMATIC EMAIL DELIVERY</p></section></main>`;
  document.querySelector<HTMLFormElement>('#owner-login')!.onsubmit=async e=>{e.preventDefault();const email=(document.querySelector<HTMLInputElement>('#owner-email')!.value||'').trim().toLowerCase();const password=document.querySelector<HTMLInputElement>('#owner-password')!.value;if(!OWNER_EMAILS.has(email)){loginScreen('This account is not authorized for the DELIONARYO Owner System.');return}const btn=document.querySelector<HTMLButtonElement>('#owner-login button')!;btn.disabled=true;btn.textContent='SIGNING IN…';const{error}=await supabase.auth.signInWithPassword({email,password});if(error){loginScreen(error.message);return}location.reload()};
}

const{data:{session}}=await supabase.auth.getSession();
const email=String(session?.user?.email||'').toLowerCase();
if(!session||!OWNER_EMAILS.has(email)){
  if(session) await supabase.auth.signOut();
  loginScreen();
}else{
  await import('./paymentAdminPage');
  await import('./incomeGeneratorDashboard');
  const header=document.querySelector('#dashboard');
  if(header){const box=document.createElement('div');box.className='flex items-center gap-2';box.innerHTML=`<span class="hidden text-xs text-slate-500 md:inline">${email}</span><button id="owner-logout" class="rounded-xl border border-slate-700 px-3 py-2 text-xs font-black text-slate-300">LOG OUT</button>`;header.appendChild(box);document.querySelector<HTMLButtonElement>('#owner-logout')!.onclick=async()=>{await supabase.auth.signOut();location.reload()}}
  document.addEventListener('click',async e=>{
    const btn=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-gen]');
    if(!btn)return;
    e.preventDefault();e.stopImmediatePropagation();
    const orderId=btn.dataset.gen!;const buyer=btn.dataset.email||'buyer';
    if(!confirm(`Approve verified payment and automatically email a 6-digit code to ${buyer}?`))return;
    btn.disabled=true;btn.textContent='APPROVING & SENDING EMAIL…';
    const{data,error}=await supabase.functions.invoke('send-payment-verification',{body:{order_id:orderId}});
    if(error||!data?.ok){alert(data?.error||error?.message||'Unable to send verification email.');btn.disabled=false;btn.textContent='GENERATE 6-DIGIT CODE';return}
    alert(`APPROVED ✓\nVerification code was emailed automatically to ${buyer}.`);
    location.reload();
  },true);
}

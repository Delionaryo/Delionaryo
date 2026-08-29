import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');
const esc=(v:any)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]||m));
const money=(v:any)=>'₱'+Number(v||0).toLocaleString();
const date=(v:any)=>v?new Date(v).toLocaleString():'—';
let rows:any[]=[];

function mount(){
 const host=document.querySelector('#payment-admin main > div');
 if(!host||document.querySelector('#income-sales-dashboard')) return;
 const section=document.createElement('section');
 section.id='income-sales-dashboard';
 section.className='mt-10 rounded-3xl border border-amber-500/20 bg-stone-950 p-5 text-stone-100';
 section.innerHTML=`<div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-xs font-black tracking-[.2em] text-amber-400">INCOME INTELLIGENCE</p><h2 class="mt-1 text-2xl font-black">Sales & Customers Dashboard</h2><p class="mt-1 text-sm text-stone-500">One view for customers, products, orders, revenue and access.</p></div><button id="income-refresh" class="rounded-lg border border-amber-500/40 px-3 py-2 text-sm font-black text-amber-300">REFRESH DASHBOARD</button></div>
 <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><div class="rounded-2xl border border-stone-800 p-4"><small class="text-stone-500">TOTAL ORDERS</small><p id="ig-orders" class="text-3xl font-black">0</p></div><div class="rounded-2xl border border-stone-800 p-4"><small class="text-stone-500">CUSTOMERS</small><p id="ig-customers" class="text-3xl font-black">0</p></div><div class="rounded-2xl border border-emerald-500/30 p-4"><small class="text-stone-500">VERIFIED SALES</small><p id="ig-sales" class="text-3xl font-black text-emerald-400">0</p></div><div class="rounded-2xl border border-amber-500/30 p-4"><small class="text-stone-500">PENDING</small><p id="ig-pending" class="text-3xl font-black text-amber-300">0</p></div><div class="rounded-2xl border border-emerald-500/30 p-4"><small class="text-stone-500">REVENUE</small><p id="ig-revenue" class="text-3xl font-black text-emerald-400">₱0</p></div></div>
 <div class="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]"><input id="ig-search" class="rounded-xl border border-stone-800 bg-stone-900 px-4 py-3 outline-none focus:border-amber-500" placeholder="Search customer, email, mobile, product or Order ID"><select id="ig-status" class="rounded-xl border border-stone-800 bg-stone-900 px-4 py-3"><option value="">ALL STATUS</option><option>FOR_VERIFICATION</option><option>PAYMENT_VERIFIED</option><option>PAID</option></select><select id="ig-product" class="rounded-xl border border-stone-800 bg-stone-900 px-4 py-3"><option value="">ALL PRODUCTS</option></select></div>
 <div id="ig-list" class="mt-4 space-y-3">Loading sales…</div>`;
 host.appendChild(section);
 (document.querySelector('#income-refresh') as HTMLButtonElement).onclick=load;
 (document.querySelector('#ig-search') as HTMLInputElement).oninput=render;
 (document.querySelector('#ig-status') as HTMLSelectElement).onchange=render;
 (document.querySelector('#ig-product') as HTMLSelectElement).onchange=render;
 load();
}

async function load(){
 const btn=document.querySelector('#income-refresh') as HTMLButtonElement|null;if(btn){btn.disabled=true;btn.textContent='REFRESHING…'}
 const {data,error}=await supabase.rpc('get_payment_review_queue');
 if(btn){btn.disabled=false;btn.textContent='REFRESH DASHBOARD'}
 if(error){const el=document.querySelector('#ig-list');if(el)el.textContent=error.message;return}
 rows=data||[];
 const products=[...new Set(rows.map(x=>x.course_title).filter(Boolean))].sort();
 const sel=document.querySelector('#ig-product') as HTMLSelectElement;const current=sel?.value||'';
 if(sel){sel.innerHTML='<option value="">ALL PRODUCTS</option>'+products.map(x=>`<option>${esc(x)}</option>`).join('');sel.value=current}
 render();
}

function render(){
 const verified=rows.filter(x=>['PAYMENT_VERIFIED','PAID'].includes(x.status));
 const pending=rows.filter(x=>x.status==='FOR_VERIFICATION');
 const customers=new Set(rows.map(x=>String(x.buyer_email||'').toLowerCase()).filter(Boolean));
 const set=(id:string,v:string)=>{const e=document.querySelector(id);if(e)e.textContent=v};
 set('#ig-orders',String(rows.length));set('#ig-customers',String(customers.size));set('#ig-sales',String(verified.length));set('#ig-pending',String(pending.length));set('#ig-revenue',money(verified.reduce((a,x)=>a+Number(x.amount||0),0)));
 const term=(document.querySelector('#ig-search') as HTMLInputElement)?.value.toLowerCase().trim()||'';
 const status=(document.querySelector('#ig-status') as HTMLSelectElement)?.value||'';
 const product=(document.querySelector('#ig-product') as HTMLSelectElement)?.value||'';
 const filtered=rows.filter(x=>{const hay=[x.buyer_name,x.buyer_email,x.buyer_mobile,x.course_title,x.course_id,x.order_id,x.gcash_reference].join(' ').toLowerCase();return(!term||hay.includes(term))&&(!status||x.status===status)&&(!product||x.course_title===product)});
 const list=document.querySelector('#ig-list');if(!list)return;
 list.innerHTML=filtered.length?filtered.map(x=>`<article class="rounded-2xl border ${x.status==='FOR_VERIFICATION'?'border-amber-500/40':'border-stone-800'} p-4"><div class="flex flex-wrap items-start justify-between gap-3"><div><span class="rounded-full border border-stone-700 px-2.5 py-1 text-xs font-black">${esc(x.status)}</span><h3 class="mt-3 text-lg font-black">${esc(x.buyer_name)}</h3><p class="text-sm text-stone-400">${esc(x.buyer_email)} • ${esc(x.buyer_mobile)}</p></div><div class="text-right"><p class="text-2xl font-black text-emerald-400">${money(x.amount)}</p><p class="text-xs text-stone-500">${date(x.submitted_at)}</p></div></div><div class="mt-4 grid gap-2 rounded-xl bg-stone-900/60 p-3 text-sm sm:grid-cols-2"><p><span class="text-stone-500">Product:</span> ${esc(x.course_title)}</p><p><span class="text-stone-500">Product ID:</span> ${esc(x.course_id)}</p><p class="break-all"><span class="text-stone-500">Order:</span> ${esc(x.order_id)}</p><p><span class="text-stone-500">GCash Ref:</span> ${esc(x.gcash_reference)}</p></div></article>`).join(''):'No matching sales records.';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,0));else setTimeout(mount,0);

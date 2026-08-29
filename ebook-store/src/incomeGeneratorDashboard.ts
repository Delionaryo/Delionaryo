import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');
const esc=(v:any)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]||m));
const money=(v:any)=>'₱'+Number(v||0).toLocaleString();
const date=(v:any)=>v?new Date(v).toLocaleString():'—';
let rows:any[]=[];let codes:any[]=[];

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
 const [salesResult,codeResult]=await Promise.all([supabase.rpc('get_payment_review_queue'),supabase.rpc('get_verification_code_monitor')]);
 if(btn){btn.disabled=false;btn.textContent='REFRESH DASHBOARD'}
 if(salesResult.error){const el=document.querySelector('#ig-list');if(el)el.textContent=salesResult.error.message;return}
 rows=salesResult.data||[];codes=codeResult.data||[];
 const products=[...new Set(rows.map(x=>x.course_title).filter(Boolean))].sort();
 const sel=document.querySelector('#ig-product') as HTMLSelectElement;const current=sel?.value||'';
 if(sel){sel.innerHTML='<option value="">ALL PRODUCTS</option>'+products.map(x=>`<option>${esc(x)}</option>`).join('');sel.value=current}
 render();
}

function codeFor(orderId:string){return codes.find(c=>String(c.order_id)===String(orderId));}
function codeState(c:any){
 if(!c)return null;
 const expired=!!c.expires_at&&new Date(c.expires_at).getTime()<=Date.now()&&!c.verified_at;
 const used=!!c.verified_at||['VERIFIED','USED'].includes(String(c.status||'').toUpperCase());
 if(used)return{label:'✓ CODE USED',cls:'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',detail:`Used ${date(c.verified_at)}`};
 if(expired||String(c.status||'').toUpperCase()==='EXPIRED')return{label:'⌛ 24HR EXPIRED',cls:'border-red-500/40 bg-red-500/10 text-red-300',detail:`Expired ${date(c.expires_at)}`};
 return{label:'● CODE ACTIVE',cls:'border-amber-500/40 bg-amber-500/10 text-amber-300',detail:`Expires ${date(c.expires_at)}`};
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
 list.innerHTML=filtered.length?filtered.map(x=>{const c=codeFor(x.order_id),cs=codeState(c);return `<article class="rounded-2xl border ${x.status==='FOR_VERIFICATION'?'border-amber-500/40':'border-stone-800'} p-4"><div class="flex flex-wrap items-start justify-between gap-3"><div class="min-w-0 flex-1"><span class="rounded-full border border-stone-700 px-2.5 py-1 text-xs font-black">${esc(x.status)}</span><div class="mt-3 flex flex-wrap items-center gap-2"><h3 class="text-lg font-black">${esc(x.buyer_name)}</h3>${!c&&x.status==='FOR_VERIFICATION'?`<button data-gen="${esc(x.order_id)}" data-email="${esc(x.buyer_email)}" data-mobile="${esc(x.buyer_mobile)}" class="rounded-lg bg-amber-400 px-3 py-2 text-xs font-black text-black">GENERATE CODE</button>`:''}${cs?`<span class="rounded-lg border px-3 py-2 text-xs font-black ${cs.cls}">${cs.label}</span>`:''}</div><p class="mt-1 text-sm text-stone-400">${esc(x.buyer_email)} • ${esc(x.buyer_mobile)}</p>${cs?`<p class="mt-2 text-xs ${cs.cls.includes('red')?'text-red-300':cs.cls.includes('emerald')?'text-emerald-300':'text-amber-300'}">${esc(cs.detail)}</p>`:''}</div><div class="text-right"><p class="text-2xl font-black text-emerald-400">${money(x.amount)}</p><p class="text-xs text-stone-500">${date(x.submitted_at)}</p></div></div><div class="mt-4 grid gap-2 rounded-xl bg-stone-900/60 p-3 text-sm sm:grid-cols-2"><p><span class="text-stone-500">Product:</span> ${esc(x.course_title)}</p><p><span class="text-stone-500">Product ID:</span> ${esc(x.course_id)}</p><p class="break-all"><span class="text-stone-500">Order:</span> ${esc(x.order_id)}</p><p><span class="text-stone-500">GCash Ref:</span> ${esc(x.gcash_reference)}</p></div></article>`}).join(''):'No matching sales records.';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,0));else setTimeout(mount,0);

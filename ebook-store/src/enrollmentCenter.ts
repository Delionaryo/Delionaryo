export type EnrollmentCourse={id:string;title:string;price:number};

const GCASH_NAME='Rodelio Legaspi';
const GCASH_NUMBER='0951 941 6959';

export function createPaymentCenter(course:EnrollmentCourse){
  const existing=document.querySelector('#enrollment-payment-center');
  existing?.remove();
  const panel=document.createElement('section');
  panel.id='enrollment-payment-center';
  panel.className='mt-5 rounded-2xl border border-amber-500/30 bg-stone-900 p-5';
  panel.innerHTML=`<p class="text-amber-400 font-black tracking-widest text-xs">PAYMENT CENTER</p>
  <h3 class="mt-2 text-xl font-black">${course.title}</h3>
  <div class="mt-4 flex items-center justify-between border-y border-stone-800 py-4"><span class="text-stone-400">Total Amount</span><strong class="text-2xl text-amber-400">₱${course.price.toLocaleString()}</strong></div>
  <p class="mt-5 text-sm font-black text-stone-300">SELECT PAYMENT METHOD</p>
  <div class="mt-3 space-y-3">
    <button type="button" data-pay="gcash" class="payment-method w-full rounded-xl border border-amber-400 bg-amber-400/10 p-4 text-left"><strong>GCash</strong><span class="block mt-1 text-sm text-stone-400">Available now</span></button>
    <button type="button" data-pay="maya" class="payment-method w-full rounded-xl border border-stone-700 p-4 text-left"><strong>Maya</strong><span class="block mt-1 text-sm text-stone-500">Payment details slot — coming soon</span></button>
    <button type="button" data-pay="bank" class="payment-method w-full rounded-xl border border-stone-700 p-4 text-left"><strong>Bank Transfer</strong><span class="block mt-1 text-sm text-stone-500">Bank details slot — coming soon</span></button>
  </div>
  <div id="payment-method-details" class="mt-4 rounded-xl border border-stone-800 bg-stone-950 p-4"></div>`;
  return panel;
}

export function activatePaymentCenter(panel:HTMLElement){
  const details=panel.querySelector<HTMLElement>('#payment-method-details');
  const show=(method:string)=>{
    if(!details)return;
    if(method==='gcash') details.innerHTML=`<p class="text-amber-400 font-black">GCASH PAYMENT</p><div class="mt-3 space-y-1 text-sm"><p>Account Name: <strong>${GCASH_NAME}</strong></p><p>GCash Number: <strong>${GCASH_NUMBER}</strong></p></div><p class="mt-3 text-xs text-stone-400">Send the exact course amount, then keep your GCash reference number. Proof/reference submission will be used for verification before course access is granted.</p>`;
    if(method==='maya') details.innerHTML=`<p class="font-black">MAYA</p><p class="mt-2 text-sm text-stone-400">Reserved payment slot. Account details will be added when configured.</p>`;
    if(method==='bank') details.innerHTML=`<p class="font-black">BANK TRANSFER</p><p class="mt-2 text-sm text-stone-400">Reserved payment slot. Bank name, account name and account number will be added when configured.</p>`;
  };
  panel.querySelectorAll<HTMLButtonElement>('[data-pay]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.pay||'gcash')));
  show('gcash');
}
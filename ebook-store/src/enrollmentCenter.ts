export type EnrollmentCourse={id:string;title:string;price:number};
const GCASH_NAME='Rodelio Legaspi';
const GCASH_NUMBER='0951 941 6959';

export function createPaymentCenter(course:EnrollmentCourse){
  document.querySelector('#enrollment-payment-center')?.remove();
  const panel=document.createElement('section');
  panel.id='enrollment-payment-center';
  panel.className='rounded-2xl border border-amber-500/30 bg-stone-950 p-5 md:p-6 h-full';
  panel.innerHTML=`<div class="flex items-center gap-2 text-amber-400"><span class="text-xl">▤</span><p class="font-black tracking-wide">PAYMENT CENTER</p></div>
  <p class="mt-4 text-sm text-stone-400">You are enrolling in:</p>
  <div class="mt-3 rounded-xl border border-stone-700 bg-stone-900 p-4"><p class="text-xs font-black tracking-widest text-amber-400">DELIONARYO COURSE</p><h3 class="mt-1 text-lg font-black">${course.title}</h3><p class="mt-2 text-xs text-stone-400">Practical AI content creation • One-time access</p></div>
  <div class="mt-6"><p class="font-black text-amber-400">Pricing Summary</p><div class="mt-3 flex justify-between text-sm"><span class="text-stone-400">Course Price</span><span>₱${course.price.toLocaleString()}.00</span></div><div class="mt-2 flex justify-between text-sm"><span class="text-stone-400">Discount</span><span>₱0.00</span></div><div class="mt-4 flex justify-between border-t border-stone-800 pt-4"><strong>Total Amount</strong><strong class="text-xl text-amber-400">₱${course.price.toLocaleString()}.00</strong></div></div>
  <p class="mt-6 text-sm font-black text-amber-400">Select Payment Method</p>
  <div class="mt-3 space-y-3"><button type="button" data-pay="gcash" class="w-full rounded-xl border border-amber-400 bg-amber-400/10 p-4 text-left"><strong>◉ &nbsp; GCash</strong><span class="float-right text-xs text-amber-300">AVAILABLE</span></button><button type="button" data-pay="maya" class="w-full rounded-xl border border-stone-700 p-4 text-left"><strong>○ &nbsp; Maya</strong><span class="float-right text-xs text-stone-500">SLOT</span></button><button type="button" data-pay="bank" class="w-full rounded-xl border border-stone-700 p-4 text-left"><strong>○ &nbsp; Bank Transfer</strong><span class="float-right text-xs text-stone-500">SLOT</span></button></div>
  <div id="payment-method-details" class="mt-4 rounded-xl border border-stone-800 bg-stone-900 p-4"></div>`;
  return panel;
}
export function activatePaymentCenter(panel:HTMLElement){
 const details=panel.querySelector<HTMLElement>('#payment-method-details');
 const show=(m:string)=>{if(!details)return;if(m==='gcash')details.innerHTML=`<p class="text-amber-400 font-black">GCASH PAYMENT DETAILS</p><p class="mt-2 text-sm">Account Name: <strong>${GCASH_NAME}</strong></p><p class="mt-1 text-sm">GCash Number: <strong>${GCASH_NUMBER}</strong></p><p class="mt-3 text-xs text-stone-400">After payment, keep your reference number. Payment is verified before course access is granted.</p>`;if(m==='maya')details.innerHTML='<p class="font-black">MAYA</p><p class="mt-2 text-sm text-stone-400">Reserved slot. Maya account details will be added here.</p>';if(m==='bank')details.innerHTML='<p class="font-black">BANK TRANSFER</p><p class="mt-2 text-sm text-stone-400">Reserved slot. Bank account details will be added here.</p>';};
 panel.querySelectorAll<HTMLButtonElement>('[data-pay]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.pay||'gcash')));show('gcash');
}
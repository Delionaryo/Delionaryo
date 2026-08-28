import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tordvwlrtwxlbuuzgklt.supabase.co','sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW');

function mountCheckout() {
  if (document.querySelector('#gcash-checkout-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'gcash-checkout-modal';
  modal.className = 'fixed inset-0 z-[120] hidden items-center justify-center overflow-y-auto bg-black/85 p-5 backdrop-blur-sm';
  modal.innerHTML = `<div class="my-auto w-full max-w-lg rounded-3xl border border-amber-400/30 bg-stone-950 p-7 shadow-2xl">
    <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-black tracking-[.2em] text-amber-400">GCASH CHECKOUT</p><h2 class="mt-2 text-3xl font-black">AI Content Creation Tutorial</h2></div><button id="gcash-close" class="rounded-lg border border-white/10 px-3 py-2 text-stone-400">✕</button></div>
    <div class="mt-6 rounded-2xl border border-amber-400/20 bg-stone-900 p-5"><div class="flex items-end justify-between"><div><p class="text-xs font-black tracking-widest text-stone-400">SEND EXACTLY</p><p class="mt-1 text-4xl font-black text-amber-400">₱499</p></div><b>GCash</b></div><div class="mt-5 border-t border-white/10 pt-4"><p class="font-black">Rodelio Legaspi</p><p class="mt-1 text-2xl font-black tracking-wide">0951 941 6959</p></div></div>
    <ol class="mt-6 space-y-2 text-sm leading-6 text-stone-300"><li><b class="text-amber-400">1.</b> Send ₱499 to the GCash account above.</li><li><b class="text-amber-400">2.</b> Keep the GCash reference number.</li><li><b class="text-amber-400">3.</b> Login/register using the same email you enter below.</li><li><b class="text-amber-400">4.</b> Submit payment for manual verification.</li></ol>
    <form id="gcash-form" class="mt-6 space-y-4">
      <label class="block text-sm font-bold">Full name<input id="gcash-name" required class="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400" /></label>
      <label class="block text-sm font-bold">DELIONARYO account email<input id="gcash-email" type="email" required class="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400" /></label>
      <label class="block text-sm font-bold">GCash reference number<input id="gcash-reference" required minlength="6" class="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 outline-none focus:border-amber-400" /></label>
      <div id="gcash-message" class="hidden rounded-xl border border-white/10 bg-stone-900 p-4 text-sm"></div>
      <button id="gcash-submit" type="submit" class="w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-stone-950">SUBMIT PAYMENT FOR VERIFICATION →</button>
    </form><p class="mt-4 text-xs leading-5 text-stone-500">Submitting a reference number does not activate access automatically. Course access is granted only after payment is verified.</p>
  </div>`;
  document.body.appendChild(modal);
  const close = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); };
  document.querySelector('#gcash-close')?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  window.addEventListener('delionaryo:gcash-checkout', async () => {
    const { data } = await supabase.auth.getUser();
    const email = document.querySelector<HTMLInputElement>('#gcash-email');
    if (email && data.user?.email) email.value = data.user.email;
    modal.classList.remove('hidden'); modal.classList.add('flex');
  });
  document.querySelector<HTMLFormElement>('#gcash-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.querySelector<HTMLInputElement>('#gcash-name')?.value.trim() || '';
    const email = document.querySelector<HTMLInputElement>('#gcash-email')?.value.trim().toLowerCase() || '';
    const reference = document.querySelector<HTMLInputElement>('#gcash-reference')?.value.trim() || '';
    const message = document.querySelector<HTMLElement>('#gcash-message');
    const button = document.querySelector<HTMLButtonElement>('#gcash-submit');
    if (!name || !email || !reference || !message || !button) return;
    button.disabled = true; button.textContent = 'SUBMITTING…';
    message.classList.add('hidden');
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error('Please login or register first, then submit your payment.');
      if ((auth.user.email || '').toLowerCase() !== email) throw new Error('Use the same email as your logged-in DELIONARYO account.');
      const orderId = `DLY-AI-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
      const { error } = await supabase.from('course_orders').insert({order_id:orderId,user_id:auth.user.id,buyer_name:name,buyer_email:email,course_id:'ai-content-creation-tutorial',course_title:'AI Content Creation Tutorial',amount:499,payment_method:'GCASH',gcash_reference:reference,status:'FOR_VERIFICATION',submitted_at:new Date().toISOString()});
      if (error) throw error;
      message.innerHTML = `<b class="text-amber-400">PAYMENT SUBMITTED</b><br>Order: ${orderId}<br>Your GCash payment is now for verification. Course access will appear in My Learning after approval.`;
      message.classList.remove('hidden');
      (e.currentTarget as HTMLFormElement).reset();
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Unable to submit payment.';
      message.classList.remove('hidden');
    } finally { button.disabled = false; button.textContent = 'SUBMIT PAYMENT FOR VERIFICATION →'; }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountCheckout, {once:true}); else mountCheckout();
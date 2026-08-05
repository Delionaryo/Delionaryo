const section = document.querySelector<HTMLElement>('#books');
const flagship = section?.querySelector('article');

const params = new URLSearchParams(window.location.search);
if (params.get('payment') === 'success') {
  const orderId = sessionStorage.getItem('delionaryo_order_id') || '';
  const buyerEmail = sessionStorage.getItem('delionaryo_buyer_email') || '';
  const product = sessionStorage.getItem('delionaryo_product') || '';
  const isStarterReturn = product === 'survival-to-stability-99' || orderId.startsWith('DLN99-');
  if (isStarterReturn) {
    const success = document.createElement('section');
    success.id = 'payment-success';
    success.className = 'border-b border-amber-500/20 bg-stone-900';
    success.innerHTML = `<div class="max-w-4xl mx-auto px-5 py-12 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-3xl font-black text-stone-950">✓</div>
      <p class="mt-6 text-amber-400 font-black tracking-widest text-sm">PAYMENT RECEIVED</p>
      <h2 class="mt-2 text-3xl md:text-5xl font-black">Thank you for your purchase.</h2>
      <p class="mt-4 text-lg text-stone-300">Your <strong>From Survival to Stability</strong> eBook will be delivered to your email after PayMongo confirms the payment.</p>
      ${buyerEmail ? `<p class="mt-3 text-stone-400">Delivery email: <strong class="text-stone-200">${buyerEmail.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</strong></p>` : ''}
      ${orderId ? `<p class="mt-2 text-sm text-stone-500">Order ID: ${orderId.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>` : ''}
      <div class="mt-7 rounded-2xl border border-amber-500/30 bg-stone-950 p-5 text-left">
        <p class="font-black text-amber-300">What happens next?</p>
        <p class="mt-2 text-stone-400">1. PayMongo confirms your payment.</p>
        <p class="mt-1 text-stone-400">2. DELIONARYO automatically emails your eBook.</p>
        <p class="mt-1 text-stone-400">3. Open the email and tap <strong class="text-stone-200">OPEN YOUR EBOOK</strong>.</p>
        <p class="mt-3 text-sm text-stone-500">If you do not see the email, check Spam or Junk. Keep your Order ID for support.</p>
      </div>
      <a href="#books" class="mt-7 inline-flex rounded-xl bg-amber-400 px-7 py-4 font-black text-stone-950 hover:bg-amber-300 transition">BACK TO EBOOK STORE</a>
    </div>`;
    const header = document.querySelector('header');
    header?.insertAdjacentElement('afterend', success);
    setTimeout(() => success.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    history.replaceState({}, '', `${window.location.pathname}#payment-success`);
  }
}

if (section && flagship) {
  const starter = document.createElement('article');
  starter.className = 'mt-10 overflow-hidden rounded-3xl border border-stone-700 bg-gradient-to-br from-stone-900 to-stone-950';
  starter.innerHTML = `
    <div class="p-7 md:p-10">
      <div class="text-amber-400 font-black tracking-widest text-sm">STARTER EBOOK</div>
      <h3 class="mt-5 text-4xl md:text-5xl font-black">FROM SURVIVAL<br><span class="text-amber-400">TO STABILITY</span></h3>
      <p class="mt-3 text-xl font-bold text-stone-300">A Simple Guide to Building Your Financial Foundation</p>
      <p class="mt-4 max-w-2xl text-stone-400 leading-7">A practical starting guide for moving beyond survival mode through money awareness, basic budgeting, saving habits, income opportunities, a 30-day action plan, and simple worksheets.</p>
      <div class="mt-8"><div class="text-4xl font-black text-amber-400">₱99</div><p class="mt-1 text-sm text-stone-500">Digital eBook</p></div>
      <div class="mt-5 max-w-xl rounded-2xl border border-amber-500/30 bg-stone-950 p-5">
        <p class="font-black text-amber-300">Where should we send your eBook?</p>
        <p class="mt-1 text-sm text-stone-400">Enter your name and email before proceeding to secure PayMongo payment.</p>
        <label class="mt-4 block"><span class="text-sm font-bold">Name</span><input id="starter-buyer-name" required maxlength="100" autocomplete="name" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400" placeholder="Your name"></label>
        <label class="mt-4 block"><span class="text-sm font-bold">Email Address</span><input id="starter-buyer-email" type="email" required maxlength="320" autocomplete="email" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400" placeholder="you@example.com"></label>
        <button id="starter-buy" type="button" class="mt-4 w-full rounded-xl bg-amber-400 px-7 py-4 font-black text-stone-950 hover:bg-amber-300 transition">BUY FOR ₱99 →</button>
        <p id="starter-message" class="mt-3 text-sm text-stone-400" aria-live="polite">We’ll use this email to deliver From Survival to Stability after successful payment.</p>
      </div>
    </div>`;
  flagship.parentElement?.insertBefore(starter, flagship);

  const btn = starter.querySelector<HTMLButtonElement>('#starter-buy')!;
  btn.addEventListener('click', async () => {
    const name = starter.querySelector<HTMLInputElement>('#starter-buyer-name')!;
    const email = starter.querySelector<HTMLInputElement>('#starter-buyer-email')!;
    const msg = starter.querySelector<HTMLParagraphElement>('#starter-message')!;
    if (!name.value.trim()) { name.reportValidity(); return; }
    if (!email.checkValidity()) { email.reportValidity(); return; }
    const fullName = name.value.trim();
    const buyerEmail = email.value.trim().toLowerCase();
    const orderId = 'DLN99-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomUUID().slice(0,8).toUpperCase();
    btn.disabled = true; btn.textContent = 'CREATING SECURE ORDER...'; msg.textContent = 'Creating your secure order...';
    try {
      const save = await fetch('https://tordvwlrtwxlbuuzgklt.supabase.co/functions/v1/create-pending-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({full_name:fullName,email:buyerEmail,order_id:orderId})});
      if(!save.ok) throw new Error('Unable to save order');
      msg.textContent='Creating your unique PayMongo checkout...';
      const checkout = await fetch('https://tordvwlrtwxlbuuzgklt.supabase.co/functions/v1/create-checkout-99',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({full_name:fullName,email:buyerEmail,order_id:orderId})});
      const result = await checkout.json();
      if(!checkout.ok || !result.checkout_url) throw new Error(result.error || 'Unable to create checkout');
      sessionStorage.setItem('delionaryo_buyer_name',fullName); sessionStorage.setItem('delionaryo_buyer_email',buyerEmail); sessionStorage.setItem('delionaryo_order_id',orderId); sessionStorage.setItem('delionaryo_product','survival-to-stability-99');
      btn.textContent='OPENING SECURE PAYMENT...'; msg.textContent='Opening your unique secure PayMongo checkout...'; window.location.href=result.checkout_url;
    } catch(e) {
      btn.disabled=false; btn.textContent='BUY FOR ₱99 →'; msg.textContent=e instanceof Error?e.message:'Unable to create checkout. Please try again.'; msg.className='mt-3 text-sm font-bold text-red-400';
    }
  });
}

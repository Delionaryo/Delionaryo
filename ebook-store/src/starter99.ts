const section = document.querySelector<HTMLElement>('#books');
const flagship = section?.querySelector('article');

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
  btn.addEventListener('click', () => {
    const name = starter.querySelector<HTMLInputElement>('#starter-buyer-name')!;
    const email = starter.querySelector<HTMLInputElement>('#starter-buyer-email')!;
    const msg = starter.querySelector<HTMLParagraphElement>('#starter-message')!;
    if (!name.value.trim()) { name.reportValidity(); return; }
    if (!email.checkValidity()) { email.reportValidity(); return; }

    const fullName = name.value.trim();
    const buyerEmail = email.value.trim().toLowerCase();
    sessionStorage.setItem('delionaryo_buyer_name', fullName);
    sessionStorage.setItem('delionaryo_buyer_email', buyerEmail);
    sessionStorage.setItem('delionaryo_product', 'survival-to-stability-99');

    btn.disabled = true;
    btn.textContent = 'OPENING PAYMENT...';
    msg.textContent = 'Opening secure ₱99 PayMongo payment...';
    window.location.href = 'https://pm.link/org-X97pkZ9v7uKBjxNAvYsmuL37/ttJb7q0';
  });
}

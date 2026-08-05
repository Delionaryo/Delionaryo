import './styles.css';

const pay = 'https://pm.link/org-X97pkZ9v7uKBjxNAvYsmuL37/59ILChx';
const app = document.querySelector<HTMLDivElement>('#app')!;

// Existing DELIONARYO eBook Store markup is preserved in the AppDeploy source package.
// Phase 1 checkout logic below creates a pending Supabase order before PayMongo redirect.
app.innerHTML = `<main class="min-h-screen bg-stone-950 text-stone-100"><section class="max-w-5xl mx-auto px-5 py-20"><p class="text-amber-400 font-black tracking-widest">DELIONARYO EBOOK STORE</p><h1 class="mt-4 text-5xl font-black">M.O.N.E.Y'S <span class="text-amber-400">TRANSFORMATION</span></h1><p class="mt-4 text-stone-300">The 6-Step Blueprint to Transform Your Financial Life</p><div class="mt-8 max-w-xl rounded-2xl border border-amber-500/30 bg-stone-950 p-5"><p class="font-black text-amber-300">Where should we send your eBook?</p><p class="mt-1 text-sm text-stone-400">Enter your name and email before proceeding to secure PayMongo payment.</p><label class="mt-4 block"><span class="text-sm font-bold">Name</span><input id="buyer-name" required maxlength="100" autocomplete="name" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400" placeholder="Your name"></label><label class="mt-4 block"><span class="text-sm font-bold">Email Address</span><input id="buyer-email" type="email" required maxlength="320" autocomplete="email" class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none focus:border-amber-400" placeholder="you@example.com"></label><button id="paid-buy" type="button" class="mt-4 w-full rounded-xl bg-amber-400 px-7 py-4 font-black text-stone-950 hover:bg-amber-300 transition">CONTINUE TO PAYMENT →</button><p id="paid-message" class="mt-3 text-sm text-stone-400" aria-live="polite">We’ll use this email to deliver your M.O.N.E.Y'S Transformation eBook after payment.</p></div></section></main>`;

const paidBuy = document.querySelector<HTMLButtonElement>('#paid-buy');
if (paidBuy) {
  paidBuy.addEventListener('click', () => {
    const name = document.querySelector<HTMLInputElement>('#buyer-name');
    const email = document.querySelector<HTMLInputElement>('#buyer-email');
    const msg = document.querySelector<HTMLParagraphElement>('#paid-message');
    if (!name || !email || !msg) return;
    if (!name.value.trim()) { name.reportValidity(); return; }
    if (!email.checkValidity()) { email.reportValidity(); return; }

    const orderId = 'DLN-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    paidBuy.disabled = true;
    paidBuy.textContent = 'SAVING ORDER...';
    msg.textContent = 'Creating your secure order before payment...';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://tordvwlrtwxlbuuzgklt.supabase.co/functions/v1/create-pending-order');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        sessionStorage.setItem('delionaryo_buyer_name', name.value.trim());
        sessionStorage.setItem('delionaryo_buyer_email', email.value.trim().toLowerCase());
        sessionStorage.setItem('delionaryo_order_id', orderId);
        msg.textContent = 'Order created. Redirecting to secure PayMongo checkout...';
        window.location.href = pay;
      } else {
        paidBuy.disabled = false;
        paidBuy.textContent = 'CONTINUE TO PAYMENT →';
        msg.textContent = 'Unable to create your order. Please try again.';
        msg.className = 'mt-3 text-sm font-bold text-red-400';
      }
    };
    xhr.onerror = () => {
      paidBuy.disabled = false;
      paidBuy.textContent = 'CONTINUE TO PAYMENT →';
      msg.textContent = 'Unable to create your order. Please check your connection and try again.';
      msg.className = 'mt-3 text-sm font-bold text-red-400';
    };
    xhr.send(JSON.stringify({
      full_name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      order_id: orderId,
      status: 'pending',
      created_at: new Date().toISOString()
    }));
  });
}

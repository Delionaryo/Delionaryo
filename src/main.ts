import './styles.css';

const pay = 'https://pm.link/org-X97pkZ9v7uKBjxNAvYsmuL37/ttJb7q0';
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `<main class="min-h-screen bg-stone-950 text-stone-100"><section class="max-w-5xl mx-auto px-5 py-20"><p class="text-amber-400 font-black tracking-widest">DELIONARYO EBOOK STORE</p><h1 class="mt-4 text-5xl font-black">FROM SURVIVAL TO <span class="text-amber-400">STABILITY</span></h1><p class="mt-4 text-stone-300">A practical starting guide for moving beyond survival mode.</p><p class="mt-8 text-4xl font-black text-amber-400">₱99</p><p class="text-stone-300">Digital eBook</p><div class="mt-8 max-w-xl rounded-2xl border border-amber-500/30 bg-stone-950 p-5"><p class="font-black text-amber-300">Ready to get your eBook?</p><p class="mt-1 text-sm text-stone-400">Click below to proceed directly to secure PayMongo payment.</p><button id="paid-buy" type="button" class="mt-5 w-full rounded-xl bg-amber-400 px-7 py-4 font-black text-stone-950 hover:bg-amber-300 transition">BUY FOR ₱99 →</button><p class="mt-3 text-sm text-stone-400">You’ll be redirected directly to the secure ₱99 PayMongo checkout.</p></div></section></main>`;

const paidBuy = document.querySelector<HTMLButtonElement>('#paid-buy');
paidBuy?.addEventListener('click', () => {
  window.location.href = pay;
});

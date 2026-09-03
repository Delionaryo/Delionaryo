const PAYMENT_CENTER_URL = 'https://delionaryo-payment-center.vercel.app/';

function removeOldStoreLink() {
  const header = document.querySelector('header');
  if (!header) return;

  header.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    if (link.dataset.paymentCenterStore === '1') return;
    if (link.textContent?.trim().toUpperCase() === 'STORE') link.remove();
  });
}

function ensureStorePaymentButton() {
  const header = document.querySelector('header');
  if (!header) return;

  const nav = header.querySelector('div.flex.items-center.gap-4') || header.querySelector('div.flex.items-center');
  if (!nav) return;

  const existingLive = header.querySelector<HTMLAnchorElement>('[data-payment-center-live="1"]');
  if (existingLive) {
    existingLive.dataset.paymentCenterStore = '1';
    delete existingLive.dataset.paymentCenterLive;
    existingLive.href = PAYMENT_CENTER_URL;
    existingLive.target = '_blank';
    existingLive.rel = 'noopener noreferrer';
    existingLive.textContent = 'STORE';
    existingLive.setAttribute('aria-label', 'Open DELIONARYO Store and Payment Center');
    return;
  }

  if (header.querySelector('[data-payment-center-store="1"]')) return;
  const store = document.createElement('a');
  store.dataset.paymentCenterStore = '1';
  store.href = PAYMENT_CENTER_URL;
  store.target = '_blank';
  store.rel = 'noopener noreferrer';
  store.textContent = 'STORE';
  store.setAttribute('aria-label', 'Open DELIONARYO Store and Payment Center');
  store.className = 'inline-flex items-center justify-center rounded-xl border border-amber-400 px-3 py-2 text-xs font-black tracking-wider text-amber-400 hover:bg-amber-400 hover:text-stone-950 transition';
  nav.appendChild(store);
}

function refreshHeaderRoutes() {
  ensureStorePaymentButton();
  removeOldStoreLink();
}

const headerRouteObserver = new MutationObserver(refreshHeaderRoutes);
headerRouteObserver.observe(document.documentElement, { childList: true, subtree: true });
refreshHeaderRoutes();

export {};

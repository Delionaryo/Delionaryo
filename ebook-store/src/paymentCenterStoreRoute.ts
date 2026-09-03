const PAYMENT_CENTER_URL = 'https://delionaryo-payment-center.vercel.app/';

function bindLocalStoreRoute() {
  const header = document.querySelector('header');
  if (!header) return;

  header.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    if (link.textContent?.trim().toUpperCase() !== 'STORE') return;
    if (link.dataset.localStoreBound === '1') return;

    link.dataset.localStoreBound = '1';
    link.href = '#books';
    link.removeAttribute('target');
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const store = document.querySelector<HTMLElement>('#books');
      if (store) {
        store.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#books');
      } else {
        window.location.href = '/#books';
      }
    });
  });
}

function ensureLivePaymentButton() {
  const header = document.querySelector('header');
  if (!header || header.querySelector('[data-payment-center-live="1"]')) return;

  const nav = header.querySelector('div.flex.items-center.gap-4') || header.querySelector('div.flex.items-center');
  if (!nav) return;

  const live = document.createElement('a');
  live.dataset.paymentCenterLive = '1';
  live.href = PAYMENT_CENTER_URL;
  live.target = '_blank';
  live.rel = 'noopener noreferrer';
  live.textContent = 'LIVE';
  live.setAttribute('aria-label', 'Open DELIONARYO Payment Center');
  live.className = 'inline-flex items-center justify-center rounded-xl border border-amber-400 px-3 py-2 text-xs font-black tracking-wider text-amber-400 hover:bg-amber-400 hover:text-stone-950 transition';
  nav.appendChild(live);
}

function refreshHeaderRoutes() {
  bindLocalStoreRoute();
  ensureLivePaymentButton();
}

const headerRouteObserver = new MutationObserver(refreshHeaderRoutes);
headerRouteObserver.observe(document.documentElement, { childList: true, subtree: true });
refreshHeaderRoutes();

export {};

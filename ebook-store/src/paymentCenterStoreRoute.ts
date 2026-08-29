const PAYMENT_CENTER_URL = 'https://delionaryo-payment-center.vercel.app/';

function bindPaymentCenterStoreRoute() {
  const header = document.querySelector('header');
  if (!header) return;

  header.querySelectorAll<HTMLAnchorElement>('a[href="#books"]').forEach((link) => {
    if (link.dataset.paymentCenterBound === '1') return;
    link.dataset.paymentCenterBound = '1';
    link.href = PAYMENT_CENTER_URL;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = PAYMENT_CENTER_URL;
    });
  });
}

const paymentCenterStoreObserver = new MutationObserver(bindPaymentCenterStoreRoute);
paymentCenterStoreObserver.observe(document.documentElement, { childList: true, subtree: true });
bindPaymentCenterStoreRoute();

export {};

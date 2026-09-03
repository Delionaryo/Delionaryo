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

const localStoreObserver = new MutationObserver(bindLocalStoreRoute);
localStoreObserver.observe(document.documentElement, { childList: true, subtree: true });
bindLocalStoreRoute();

export {};

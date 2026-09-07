const params = new URLSearchParams(location.search);
const handoffMode = params.get('buyer_login') === '1';
const handoffEmail = (params.get('buyer_email') || sessionStorage.getItem('del_email') || '').trim().toLowerCase();
const handoffName = (params.get('buyer_name') || sessionStorage.getItem('del_buyer_name') || '').trim();

function splitName(fullName: string) {
  const parts = fullName.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  };
}

function configureFreeRegistration() {
  const modal = document.querySelector<HTMLElement>('#learning-auth-modal');
  if (!modal || modal.dataset.mode !== 'register') return;

  const title = document.querySelector<HTMLElement>('#auth-title');
  const help = document.querySelector<HTMLElement>('#auth-help');
  const submit = document.querySelector<HTMLButtonElement>('#auth-submit');
  const email = document.querySelector<HTMLInputElement>('#auth-email');
  const firstName = document.querySelector<HTMLInputElement>('#auth-first-name');
  const lastName = document.querySelector<HTMLInputElement>('#auth-last-name');

  if (title) title.textContent = 'Create Account';
  if (help) help.textContent = 'Create your free DELIONARYO account. No activation code is required. Purchased learning will be connected to your account automatically after verification.';
  if (submit) submit.textContent = 'CREATE MY FREE ACCOUNT';

  if (handoffEmail && email && !email.value) email.value = handoffEmail;

  if (handoffName) {
    const parsed = splitName(handoffName);
    if (firstName && !firstName.value) firstName.value = parsed.firstName;
    if (lastName && !lastName.value) lastName.value = parsed.lastName;
  }
}

function bind() {
  const modal = document.querySelector<HTMLElement>('#learning-auth-modal');
  if (!modal) return false;

  new MutationObserver(() => configureFreeRegistration()).observe(modal, {
    attributes: true,
    attributeFilter: ['data-mode', 'class']
  });

  document.querySelector('#auth-switch')?.addEventListener('click', () => setTimeout(configureFreeRegistration, 0));
  configureFreeRegistration();
  return true;
}

function start() {
  if (!bind()) setTimeout(start, 120);
}

start();

if (handoffMode) {
  const open = () => {
    const modal = document.querySelector<HTMLElement>('#learning-auth-modal');
    const switchButton = document.querySelector<HTMLButtonElement>('#auth-switch');
    if (!modal || !switchButton) return setTimeout(open, 120);
    if (modal.dataset.mode !== 'register') switchButton.click();
    setTimeout(configureFreeRegistration, 0);
  };
  open();
}

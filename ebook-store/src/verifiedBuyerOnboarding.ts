import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

const params = new URLSearchParams(location.search);
const buyerMode = params.get('buyer_login') === '1';
const buyerEmail = (params.get('buyer_email') || '').trim().toLowerCase();
const buyerName = (params.get('buyer_name') || '').trim();
const orderId = sessionStorage.getItem('del_verified_order') || '';

function addBuyerFields() {
  const form = document.querySelector<HTMLFormElement>('#auth-form');
  const email = document.querySelector<HTMLInputElement>('#auth-email');
  const passwordWrap = document.querySelector<HTMLElement>('#auth-password-wrap');
  if (!form || !email || !passwordWrap || document.querySelector('#verified-buyer-fields')) return false;

  const block = document.createElement('div');
  block.id = 'verified-buyer-fields';
  block.className = 'space-y-4';
  block.innerHTML = `
    <label class="block"><span class="text-sm font-bold text-stone-300">Buyer name</span><input id="verified-buyer-name" type="text" readonly class="mt-2 w-full rounded-xl border border-amber-500/30 bg-stone-900 px-4 py-3 text-stone-100"></label>
    <label class="block"><span class="text-sm font-bold text-stone-300">6-Digit Verification Code</span><input id="verified-buyer-code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="Enter 6-digit code" class="mt-2 w-full rounded-xl border border-amber-500/30 bg-stone-900 px-4 py-3 text-center text-xl font-black tracking-[.35em] text-stone-100 outline-none focus:border-amber-400"></label>`;
  form.insertBefore(block, passwordWrap);
  return true;
}

async function prepareBuyerOnboarding() {
  if (!buyerMode || !buyerEmail) return;
  await supabase.auth.signOut();

  const ready = addBuyerFields();
  if (!ready) return setTimeout(prepareBuyerOnboarding, 120);

  const modal = document.querySelector<HTMLElement>('#learning-auth-modal');
  const email = document.querySelector<HTMLInputElement>('#auth-email');
  const name = document.querySelector<HTMLInputElement>('#verified-buyer-name');
  const title = document.querySelector<HTMLElement>('#auth-title');
  const help = document.querySelector<HTMLElement>('#auth-help');
  const submit = document.querySelector<HTMLButtonElement>('#auth-submit');
  const confirm = document.querySelector<HTMLElement>('#auth-confirm-wrap');
  const forgot = document.querySelector<HTMLElement>('#auth-forgot');
  const sw = document.querySelector<HTMLElement>('#auth-switch');

  if (modal) { modal.dataset.mode = 'verified-buyer'; modal.classList.remove('hidden'); modal.classList.add('flex'); }
  if (title) title.textContent = buyerName ? buyerName.toUpperCase() : 'CREATE YOUR ACCOUNT';
  if (help) help.textContent = 'Your verified payment information is connected. Create your password and enter the 6-digit verification code to activate your purchased access.';
  if (email) { email.value = buyerEmail; email.readOnly = true; email.classList.add('opacity-80'); }
  if (name) name.value = buyerName || 'Verified DELIONARYO Buyer';
  confirm?.classList.remove('hidden');
  forgot?.classList.add('hidden');
  sw?.classList.add('hidden');
  if (submit) submit.textContent = 'CREATE ACCOUNT & ACTIVATE ACCESS';

  const form = document.querySelector<HTMLFormElement>('#auth-form');
  if (!form || form.dataset.verifiedBuyerBound === '1') return;
  form.dataset.verifiedBuyerBound = '1';
  form.addEventListener('submit', async (event) => {
    if (modal?.dataset.mode !== 'verified-buyer') return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const password = document.querySelector<HTMLInputElement>('#auth-password')?.value || '';
    const confirmPassword = document.querySelector<HTMLInputElement>('#auth-confirm')?.value || '';
    const code = (document.querySelector<HTMLInputElement>('#verified-buyer-code')?.value || '').replace(/\D/g, '');
    const message = document.querySelector<HTMLElement>('#auth-message');
    const say = (text:string, ok=false) => { if(message){ message.textContent=text; message.classList.remove('hidden','text-red-300','text-emerald-300'); message.classList.add(ok?'text-emerald-300':'text-red-300'); } };

    if (!orderId) return say('Payment order was not found. Please reopen this account setup from your Payment Center verification flow.');
    if (password.length < 6) return say('Password must have at least 6 characters.');
    if (password !== confirmPassword) return say('Passwords do not match.');
    if (code.length !== 6) return say('Enter the complete 6-digit verification code.');

    if (submit) { submit.disabled = true; submit.textContent = 'CREATING & ACTIVATING…'; }
    try {
      const { data, error } = await supabase.auth.signUp({ email: buyerEmail, password, options: { data: { full_name: buyerName }, emailRedirectTo: 'https://delionaryo.vercel.app/' } });
      if (error) throw error;
      let session = data.session;
      if (!session) {
        const login = await supabase.auth.signInWithPassword({ email: buyerEmail, password });
        if (login.error) return say('Account created. Confirm your email first, then login to activate your purchase.');
        session = login.data.session;
      }
      if (!session) return say('Account created. Please login to continue activation.');
      const activation = await supabase.rpc('activate_verified_buyer_account', { p_order_id: orderId, p_buyer_email: buyerEmail, p_code: code });
      if (activation.error || !activation.data) throw activation.error || new Error('Verification code could not be activated.');
      sessionStorage.removeItem('del_verified_order');
      sessionStorage.removeItem('del_email');
      sessionStorage.removeItem('del_access_active');
      sessionStorage.removeItem('del_product_id');
      sessionStorage.removeItem('del_buyer_name');
      say('Account created and purchased access activated. Opening your Learning Campus…', true);
      const clean = new URL(location.href); clean.searchParams.delete('buyer_login'); clean.searchParams.delete('buyer_email'); clean.searchParams.delete('buyer_name');
      history.replaceState({}, '', clean);
      setTimeout(() => location.reload(), 800);
    } catch (err:any) {
      say(err?.message || 'Unable to create and activate the account. Please try again.');
    } finally {
      if (submit) { submit.disabled = false; submit.textContent = 'CREATE ACCOUNT & ACTIVATE ACCESS'; }
    }
  }, true);
}

if (buyerMode) void prepareBuyerOnboarding();

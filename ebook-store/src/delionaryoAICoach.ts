import { createClient } from '@supabase/supabase-js';

const coachDb = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

export async function askDelionaryoCoach(message: string, context = {}) {
  const allowance = await coachDb.rpc('get_my_ai_coach_allowance');
  if (allowance.error) throw allowance.error;

  const status = allowance.data?.[0];
  if (!status?.enabled || status.remaining_today <= 0) {
    throw new Error('AI Coach daily limit reached.');
  }

  const used = await coachDb.rpc('consume_ai_coach_message', {
    p_input_tokens: 0,
    p_output_tokens: 0,
  });

  if (used.error || !used.data?.[0]?.allowed) {
    throw new Error('AI Coach unavailable.');
  }

  return { message, context, remaining: used.data[0].remaining };
}

export function mountAICoach() {
  if (document.querySelector('#ai-coach-btn')) return;

  const campus = document.querySelector('.member-portal, #member-portal, .journey-command-center, #app');
  if (!campus) return;

  const card = document.createElement('button');
  card.id = 'ai-coach-btn';
  card.type = 'button';
  card.setAttribute('aria-label', 'Open DELIONARYO AI Coach');
  card.style.cssText = 'position:fixed;right:22px;bottom:22px;z-index:9999;border:1px solid rgba(251,191,36,.45);border-radius:18px;background:#fbbf24;color:#1c1917;padding:14px 18px;font-weight:900;box-shadow:0 16px 40px rgba(0,0,0,.35);cursor:pointer;text-align:left';
  card.innerHTML = '<span style="display:block;font-size:14px">✦ DELIONARYO AI COACH</span><small style="display:block;margin-top:3px;font-weight:700">Personal Transformation Guide</small>';

  card.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-ai-coach'));
  });

  document.body.appendChild(card);
}

function bootAICoach() {
  mountAICoach();
  const observer = new MutationObserver(() => mountAICoach());
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAICoach, { once: true });
} else {
  bootAICoach();
}

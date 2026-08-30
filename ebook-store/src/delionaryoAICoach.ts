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
export function mountAICoach(){
  const app = document.querySelector('#app');
  if(!app) return;

  const card = document.createElement('button');
  card.id = 'ai-coach-btn';
  card.className = 'p-5 rounded-xl bg-amber-400 text-stone-950';
  card.innerHTML = `
    🤖 DELIONARYO AI Coach
    <br/>
    <small>Personal Money Transformation Guide</small>
  `;

  card.onclick = () => {
    window.dispatchEvent(new CustomEvent('open-ai-coach'));
  };

  app.appendChild(card);
}

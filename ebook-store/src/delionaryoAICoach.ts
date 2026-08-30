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

export function openAICoachPanel() {
  document.querySelector('#ai-coach-panel')?.remove();

  const panel = document.createElement('section');
  panel.id = 'ai-coach-panel';
  panel.style.cssText = 'position:fixed;right:22px;bottom:90px;z-index:9999;width:min(390px,90vw);background:#1c1917;color:white;border:1px solid rgba(251,191,36,.45);border-radius:20px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.45)';
  panel.innerHTML = `
    <h2 style="font-weight:900;color:#fbbf24">🤖 DELIONARYO AI Coach</h2>
    <p style="margin-top:8px;color:#d6d3d1">Your Personal Transformation Guide</p>
    <textarea id="coach-input" style="margin-top:14px;width:100%;min-height:90px;background:#292524;color:white;border-radius:12px;padding:10px" placeholder="Ask your coach..."></textarea>
    <button id="coach-send" style="margin-top:12px;background:#fbbf24;color:#1c1917;padding:10px 16px;border-radius:12px;font-weight:900">ASK COACH</button>
    <div id="coach-response" style="margin-top:12px;color:#d6d3d1"></div>
  `;

  document.body.appendChild(panel);

  panel.querySelector('#coach-send')?.addEventListener('click', async () => {
    const input = panel.querySelector<HTMLTextAreaElement>('#coach-input');
    const response = panel.querySelector('#coach-response');
    if (!input || !response) return;

    try {
      const result = await askDelionaryoCoach(input.value, { source: 'campus' });
      response.textContent = result.message;
    } catch (e) {
      response.textContent = e instanceof Error ? e.message : 'Coach unavailable.';
    }
  });
}

export function mountAICoach() {
  if (document.querySelector('#ai-coach-btn')) return;

  const card = document.createElement('button');
  card.id = 'ai-coach-btn';
  card.type = 'button';
  card.innerHTML = '✦ DELIONARYO AI COACH<br><small>Personal Transformation Guide</small>';
  card.style.cssText = 'position:fixed;right:22px;bottom:22px;z-index:9999;border:1px solid rgba(251,191,36,.45);border-radius:18px;background:#fbbf24;color:#1c1917;padding:14px 18px;font-weight:900;cursor:pointer';

  card.onclick = openAICoachPanel;
  document.body.appendChild(card);
}

function bootAICoach() {
  mountAICoach();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAICoach, { once: true });
} else {
  bootAICoach();
}

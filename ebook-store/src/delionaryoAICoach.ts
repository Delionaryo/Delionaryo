import { createClient } from '@supabase/supabase-js';

const coachDb = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

const coachTopics = [
  'Money Mindset Coach',
  'Budget & Cash Flow Coach',
  'Debt Recovery Coach',
  'Wealth Creation Coach',
  'Purpose & Stewardship Coach'
];

const starters = [
  'Saan ako magsisimula?',
  'Bakit lagi akong kapos?',
  'Tulungan mo ako gumawa ng money plan',
  'I-check ang financial stage ko'
];

export async function askDelionaryoCoach(message:string, context={}) {
  const allowance = await coachDb.rpc('get_my_ai_coach_allowance');
  if (allowance.error) throw allowance.error;

  const status = allowance.data?.[0];
  if (!status?.enabled || status.remaining_today <= 0) {
    throw new Error('AI Coach daily limit reached.');
  }

  const used = await coachDb.rpc('consume_ai_coach_message', {
    p_input_tokens:0,
    p_output_tokens:0,
  });

  if (used.error || !used.data?.[0]?.allowed) throw new Error('AI Coach unavailable.');

  return {
    message: `Coach reflection: ${message}. Begin with awareness, create a plan, then execute one financial action today.`,
    context,
    remaining: used.data[0].remaining
  };
}

export function openAICoachPanel(){
 document.querySelector('#ai-coach-panel')?.remove();
 const panel=document.createElement('section');
 panel.id='ai-coach-panel';
 panel.style.cssText='position:fixed;right:22px;bottom:90px;z-index:9999;width:min(420px,90vw);background:#1c1917;color:white;border:1px solid #fbbf24;border-radius:20px;padding:20px';
 panel.innerHTML=`<h2 style="color:#fbbf24">🤖 DELIONARYO AI Coach</h2><p>Your Personal Transformation Guide</p><p>${coachTopics.join(' • ')}</p>${starters.map(s=>`<button class="coach-start" style="margin:4px;padding:8px;border-radius:10px">${s}</button>`).join('')}<textarea id="coach-input" placeholder="Ask your coach..." style="width:100%;margin-top:10px"></textarea><button id="coach-send">ASK COACH</button><div id="coach-response"></div>`;
 document.body.appendChild(panel);
 panel.querySelectorAll('.coach-start').forEach(b=>b.addEventListener('click',()=>{(panel.querySelector('#coach-input') as HTMLTextAreaElement).value=(b as HTMLElement).innerText;}));
 panel.querySelector('#coach-send')?.addEventListener('click',async()=>{
 const input=panel.querySelector<HTMLTextAreaElement>('#coach-input');
 const response=panel.querySelector('#coach-response');
 if(!input||!response)return;
 try{const result=await askDelionaryoCoach(input.value,{source:'campus'});response.textContent=result.message;}catch(e){response.textContent=e instanceof Error?e.message:'Coach unavailable.';}
 });
}

export function mountAICoach(){
 if(document.querySelector('#ai-coach-btn'))return;
 const btn=document.createElement('button');
 btn.id='ai-coach-btn';btn.innerHTML='✦ DELIONARYO AI COACH<br><small>Personal Transformation Guide</small>';
 btn.style.cssText='position:fixed;right:22px;bottom:22px;z-index:9999;background:#fbbf24;padding:14px;border-radius:18px;font-weight:900';
 btn.onclick=openAICoachPanel;document.body.appendChild(btn);
}

mountAICoach();

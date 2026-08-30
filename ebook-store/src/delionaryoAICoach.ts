import { createClient } from '@supabase/supabase-js';

const coachDb = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

const knowledge = {
  mindset: 'Your transformation starts with awareness. Money problems are not solved only by earning more; they require better beliefs, decisions and systems.',
  cashflow: 'Start by understanding your money flow: income, expenses, priorities and leaks. A clear picture creates a better plan.',
  debt: 'Debt recovery begins with facing the numbers, creating a repayment strategy and rebuilding financial discipline.',
  wealth: 'Wealth creation is built through skills, assets, consistent execution and wise stewardship.',
  stewardship: 'Money is a responsibility. Growth comes from managing resources with purpose and integrity.'
};

const starters = [
  'Saan ako magsisimula?',
  'Bakit lagi akong kapos?',
  'Tulungan mo ako gumawa ng money plan',
  'I-check ang financial stage ko'
];

function generateCoachResponse(message:string){
  const text = message.toLowerCase();
  if(text.includes('kapos') || text.includes('budget') || text.includes('pera')) return knowledge.cashflow;
  if(text.includes('utang') || text.includes('debt')) return knowledge.debt;
  if(text.includes('yaman') || text.includes('wealth')) return knowledge.wealth;
  if(text.includes('purpose') || text.includes('steward')) return knowledge.stewardship;
  return knowledge.mindset;
}

export async function askDelionaryoCoach(message:string, context={}) {
  const allowance = await coachDb.rpc('get_my_ai_coach_allowance');
  if (allowance.error) throw allowance.error;
  const status = allowance.data?.[0];
  if (!status?.enabled || status.remaining_today <= 0) throw new Error('AI Coach daily limit reached.');

  const used = await coachDb.rpc('consume_ai_coach_message', {p_input_tokens:0,p_output_tokens:0});
  if (used.error || !used.data?.[0]?.allowed) throw new Error('AI Coach unavailable.');

  return { message: generateCoachResponse(message), context, remaining: used.data[0].remaining };
}

export function openAICoachPanel(){
 document.querySelector('#ai-coach-panel')?.remove();
 const panel=document.createElement('section');
 panel.id='ai-coach-panel';
 panel.style.cssText='position:fixed;right:22px;bottom:90px;z-index:9999;width:min(420px,90vw);background:#1c1917;color:white;border:1px solid #fbbf24;border-radius:20px;padding:20px';
 panel.innerHTML=`<h2 style="color:#fbbf24">🤖 DELIONARYO AI Coach</h2><p>Your Personal Transformation Guide</p><div>${starters.map(s=>`<button class="coach-start">${s}</button>`).join('')}</div><textarea id="coach-input" placeholder="Ask your coach..."></textarea><button id="coach-send">ASK COACH</button><div id="coach-response"></div>`;
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
 btn.id='ai-coach-btn';
 btn.innerHTML='✦ DELIONARYO AI COACH<br><small>Personal Transformation Guide</small>';
 btn.style.cssText='position:fixed;right:22px;bottom:22px;z-index:9999;background:#fbbf24;padding:14px;border-radius:18px;font-weight:900';
 btn.onclick=openAICoachPanel;
 document.body.appendChild(btn);
}

mountAICoach();

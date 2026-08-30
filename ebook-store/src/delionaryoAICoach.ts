import { createClient } from '@supabase/supabase-js';

const coachDb = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

const starters = [
  'Saan ako magsisimula?',
  'Bakit lagi akong kapos?',
  'Tulungan mo ako gumawa ng money plan',
  'I-check ang financial stage ko'
];

export async function askDelionaryoCoach(message:string) {
  const question=message.trim();
  if(!question) throw new Error('Type your question first.');
  const { data, error } = await coachDb.functions.invoke('delionaryo-ai-coach', { body:{message:question} });
  if(error) throw error;
  if(data?.error) throw new Error(data.error);
  return data as {message:string;remaining:number};
}

export function openAICoachPanel(){
 document.querySelector('#ai-coach-panel')?.remove();
 const panel=document.createElement('section');
 panel.id='ai-coach-panel';
 panel.style.cssText='position:fixed;right:22px;bottom:90px;z-index:9999;width:min(420px,90vw);background:#1c1917;color:white;border:1px solid #fbbf24;border-radius:20px;padding:20px;box-shadow:0 24px 70px #0008';
 panel.innerHTML=`<div style="display:flex;justify-content:space-between;gap:12px"><div><h2 style="color:#fbbf24;margin:0">✦ DELIONARYO AI Coach</h2><p style="opacity:.75">Your 24/7 Personal Transformation Guide</p></div><button id="coach-close" aria-label="Close">×</button></div><div>${starters.map(s=>`<button class="coach-start" style="margin:3px">${s}</button>`).join('')}</div><textarea id="coach-input" maxlength="2000" rows="4" style="width:100%;margin-top:12px" placeholder="Ask your coach..."></textarea><button id="coach-send" style="margin-top:8px;font-weight:900">ASK COACH</button><div id="coach-response" style="white-space:pre-wrap;line-height:1.55;margin-top:14px"></div><small id="coach-usage" style="display:block;margin-top:10px;opacity:.65"></small>`;
 document.body.appendChild(panel);
 panel.querySelector('#coach-close')?.addEventListener('click',()=>panel.remove());
 panel.querySelectorAll('.coach-start').forEach(b=>b.addEventListener('click',()=>{(panel.querySelector('#coach-input') as HTMLTextAreaElement).value=(b as HTMLElement).innerText;}));
 panel.querySelector('#coach-send')?.addEventListener('click',async()=>{
  const input=panel.querySelector<HTMLTextAreaElement>('#coach-input');const response=panel.querySelector<HTMLElement>('#coach-response');const usage=panel.querySelector<HTMLElement>('#coach-usage');const send=panel.querySelector<HTMLButtonElement>('#coach-send');if(!input||!response||!send)return;
  try{send.disabled=true;send.textContent='COACH IS THINKING…';response.textContent='';const result=await askDelionaryoCoach(input.value);response.textContent=result.message;if(usage)usage.textContent=`${result.remaining} AI Coach messages remaining today`;}catch(e){response.textContent=e instanceof Error?e.message:'Coach unavailable.';}finally{send.disabled=false;send.textContent='ASK COACH';}
 });
}

export function mountAICoach(){
 if(document.querySelector('#ai-coach-btn'))return;
 const btn=document.createElement('button');btn.id='ai-coach-btn';btn.innerHTML='✦ DELIONARYO AI COACH<br><small>24/7 Transformation Guide</small>';btn.style.cssText='position:fixed;right:22px;bottom:22px;z-index:9999;background:#fbbf24;color:#1c1917;padding:14px;border-radius:18px;font-weight:900;box-shadow:0 12px 35px #0005';btn.onclick=openAICoachPanel;document.body.appendChild(btn);
}

mountAICoach();

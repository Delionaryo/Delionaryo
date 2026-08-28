import {createClient} from '@supabase/supabase-js';

const supabase=createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

const INTENT='delionaryo_enrollment_intent';

function continueEnrollment(){
  if(localStorage.getItem(INTENT)!=='1')return;
  window.dispatchEvent(new CustomEvent('delionaryo:account-created'));
}

export function markEnrollmentIntent(){localStorage.setItem(INTENT,'1');}
export function clearEnrollmentIntent(){localStorage.removeItem(INTENT);}

supabase.auth.getSession().then(({data})=>{if(data.session?.user)continueEnrollment();});
supabase.auth.onAuthStateChange((event,session)=>{
  if(session?.user&&(event==='SIGNED_IN'||event==='INITIAL_SESSION'||event==='USER_UPDATED')){
    setTimeout(continueEnrollment,100);
  }
});
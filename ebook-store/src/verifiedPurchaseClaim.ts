import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tordvwlrtwxlbuuzgklt.supabase.co',
  'sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW'
);

let claimInFlight = false;
let claimedForUser = '';

async function claimVerifiedPurchases() {
  if (claimInFlight) return;
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || '';
  if (!userId || claimedForUser === userId) return;

  claimInFlight = true;
  try {
    const { error } = await supabase.rpc('claim_verified_purchases');
    if (!error) claimedForUser = userId;
  } finally {
    claimInFlight = false;
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    claimedForUser = '';
    return;
  }
  if (session?.user) void claimVerifiedPurchases();
});

void claimVerifiedPurchases();

export { claimVerifiedPurchases };

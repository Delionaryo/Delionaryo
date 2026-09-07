export default function handler(_req:any,res:any){
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=60, s-maxage=120');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.status(200).send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="theme-color" content="#071015"/>
<meta name="robots" content="noindex,nofollow"/>
<title>DELIONARYO Official Product Promotion</title>
<meta name="description" content="Official DELIONARYO product promotion page."/>
<style>
:root{color-scheme:dark;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:#061014;color:#f7f4ec;--gold:#d9aa3c;--muted:#9fb0b3;--line:rgba(217,170,60,.28);--card:#0a171c}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 20% 0,rgba(217,170,60,.13),transparent 34rem),linear-gradient(180deg,#061014,#08141a 60%,#050a0d)}a{text-decoration:none}.wrap{width:min(780px,calc(100% - 28px));margin:auto;padding:26px 0 42px}.brand{display:flex;align-items:center;gap:12px;margin-bottom:24px}.mark{width:46px;height:46px;border:1px solid #b68a31;border-radius:14px;display:grid;place-items:center;color:#e0b75c;font-weight:950;font-size:21px}.brandText b{display:block;letter-spacing:.13em}.brandText small{color:var(--muted)}.trust{border:1px solid rgba(69,165,127,.35);background:rgba(45,118,97,.10);border-radius:14px;padding:13px 15px;color:#c9e9dd;font-size:13px;line-height:1.55;margin-bottom:18px}.card{border:1px solid var(--line);background:rgba(10,23,28,.94);border-radius:22px;padding:clamp(22px,5vw,38px);box-shadow:0 22px 70px rgba(0,0,0,.28)}.eyebrow{color:var(--gold);font-size:12px;font-weight:900;letter-spacing:.16em}.type{display:inline-block;border:1px solid rgba(217,170,60,.35);border-radius:999px;padding:7px 10px;color:#e7c97f;font-size:12px;font-weight:850;margin-top:16px}h1{font-size:clamp(32px,7vw,52px);line-height:1.04;margin:14px 0 12px;letter-spacing:-.03em}.sub{color:#b9c6c8;line-height:1.7;font-size:16px}.price{font-size:clamp(30px,7vw,44px);font-weight:950;color:#f2c65d;margin:22px 0 4px}.priceNote{color:#84979b;font-size:13px}.steps{display:grid;gap:10px;margin:25px 0}.step{display:grid;grid-template-columns:34px 1fr;gap:11px;align-items:start;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.025);border-radius:13px;padding:12px}.num{width:31px;height:31px;border-radius:9px;background:#12242a;color:#e0b75c;display:grid;place-items:center;font-weight:950}.step b{display:block}.step span{display:block;margin-top:3px;color:#93a5a8;font-size:13px;line-height:1.45}.cta{display:block;width:100%;text-align:center;background:var(--gold);color:#11161a;padding:15px 18px;border-radius:12px;font-weight:950;margin-top:20px}.cta[aria-disabled="true"]{pointer-events:none;opacity:.45}.safe{margin-top:18px;padding-top:17px;border-top:1px solid rgba(255,255,255,.07);color:#8fa1a4;font-size:12px;line-height:1.65}.safe b{color:#cbd6d7}.error{display:none;border:1px solid rgba(204,95,95,.35);background:rgba(122,42,42,.12);padding:14px;border-radius:12px;color:#f0c8c8;line-height:1.5;margin-top:16px}.footer{margin-top:22px;text-align:center;color:#728589;font-size:12px;line-height:1.6}@media(max-width:520px){.wrap{padding-top:18px}.card{border-radius:18px}}
</style>
</head>
<body>
<div class="wrap">
  <div class="brand"><div class="mark">D</div><div class="brandText"><b>DELIONARYO</b><small>Official Product Promotion</small></div></div>
  <div class="trust"><b>Official DELIONARYO page:</b> app.gapcreation.space<br/>This promotion can lead only to the official checkout at pay.gapcreation.space.</div>
  <main class="card">
    <div class="eyebrow">AFFILIATE PRODUCT PROMOTION</div>
    <div class="type" id="productType">LOADING PRODUCT</div>
    <h1 id="productTitle">Loading official product details...</h1>
    <p class="sub">The product, price and checkout destination are verified from the DELIONARYO system before you continue.</p>
    <div class="price" id="productPrice">PHP --</div>
    <div class="priceNote">Official DELIONARYO price. Affiliates cannot change the checkout amount.</div>
    <div class="steps">
      <div class="step"><div class="num">1</div><div><b>Review the official product</b><span>Confirm the product name and price shown on this page.</span></div></div>
      <div class="step"><div class="num">2</div><div><b>Continue to secure checkout</b><span>You will be transferred to pay.gapcreation.space for payment submission.</span></div></div>
      <div class="step"><div class="num">3</div><div><b>Payment verification</b><span>DELIONARYO verifies the submitted payment before product access is released.</span></div></div>
    </div>
    <a class="cta" id="checkoutBtn" href="#" aria-disabled="true">CONTINUE TO SECURE CHECKOUT</a>
    <div class="error" id="errorBox"></div>
    <div class="safe"><b>Anti-phishing reminder:</b> DELIONARYO will never ask for your GCash MPIN or GCash OTP on this promotion page or the official payment page. Check the domain before continuing.</div>
  </main>
  <div class="footer">Affiliate links are used for referral attribution only. Product price, payment verification, access approval and commission calculation remain controlled by the DELIONARYO system.</div>
</div>
<script>
(()=>{
  const SB='https://tordvwlrtwxlbuuzgklt.supabase.co';
  const KEY='sb_publishable_s_trbtJvrqcTxDBs_7yyTg_57wHs3sW';
  const q=new URLSearchParams(location.search);
  const product=(q.get('product_id')||'').trim();
  const ref=(q.get('ref')||'').trim();
  const tokenOk=/^[A-Za-z0-9]{8,64}$/.test(ref);
  const productOk=/^[A-Za-z0-9][A-Za-z0-9_-]{1,99}$/.test(product);
  const title=document.getElementById('productTitle');
  const type=document.getElementById('productType');
  const price=document.getElementById('productPrice');
  const btn=document.getElementById('checkoutBtn');
  const err=document.getElementById('errorBox');
  const fail=(message)=>{title.textContent='Promotion link unavailable';type.textContent='LINK CHECK';price.textContent='PHP --';err.style.display='block';err.textContent=message;btn.setAttribute('aria-disabled','true');btn.href='https://app.gapcreation.space/start'};
  if(!tokenOk||!productOk){fail('This affiliate promotion link is invalid or incomplete. Please request a fresh official DELIONARYO promotion link.');return;}
  fetch(SB+'/rest/v1/rpc/get_payment_product',{
    method:'POST',
    headers:{'apikey':KEY,'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({p_product_id:product})
  }).then(async r=>{if(!r.ok)throw new Error('product lookup failed');return r.json()}).then(rows=>{
    const p=Array.isArray(rows)?rows[0]:null;
    if(!p)throw new Error('inactive product');
    title.textContent=String(p.product_title||'DELIONARYO Product');
    type.textContent='DELIONARYO '+String(p.product_type||'PRODUCT').toUpperCase();
    price.textContent='PHP '+Number(p.amount||0).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
    const u=new URL('https://pay.gapcreation.space/affiliate.html');
    u.searchParams.set('product_id',String(p.product_id));
    u.searchParams.set('ref',ref);
    u.searchParams.set('src','affiliate_promo');
    btn.href=u.toString();
    btn.removeAttribute('aria-disabled');
  }).catch(()=>fail('We could not verify this product right now. Please refresh or request a fresh official promotion link.'));
})();
</script>
</body>
</html>`);
}

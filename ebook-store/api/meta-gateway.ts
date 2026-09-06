export default function handler(_req:any,res:any){
  const appUrl='https://app.gapcreation.space/start';
  const chromeIntent='intent://app.gapcreation.space/start#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https%3A%2F%2Fapp.gapcreation.space%2Fstart;end';
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  res.status(200).send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="#071015"/>
<title>Open DELIONARYO</title>
<meta name="description" content="Open and install the official DELIONARYO app on your phone."/>
<meta property="og:title" content="DELIONARYO — From Mind to Steward"/>
<meta property="og:description" content="Open and install the official DELIONARYO app. Learn, execute, transform and steward."/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="https://app.gapcreation.space/open"/>
<meta property="og:image" content="https://app.gapcreation.space/start/icon.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="DELIONARYO — From Mind to Steward"/>
<meta name="twitter:description" content="Open and install the official DELIONARYO app."/>
<link rel="icon" href="/start/icon.png"/>
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:dark;background:#071015;color:#f7f4ec}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:22px;background:radial-gradient(circle at 50% 0,rgba(217,170,60,.16),transparent 30rem),linear-gradient(180deg,#071015,#050b0e)}
.card{width:min(540px,100%);border:1px solid rgba(217,170,60,.32);background:rgba(9,24,29,.96);border-radius:26px;padding:28px;box-shadow:0 28px 80px rgba(0,0,0,.35);text-align:center}.logo{width:92px;height:92px;border-radius:24px;object-fit:cover;border:1px solid rgba(217,170,60,.45);box-shadow:0 12px 34px rgba(0,0,0,.3)}
.eyebrow{margin:18px 0 8px;color:#d9aa3c;font-size:11px;font-weight:900;letter-spacing:.18em}.card h1{margin:8px 0 12px;font-size:34px;line-height:1.08}.lead{margin:0 auto 18px;color:#b9c6c8;line-height:1.65;max-width:440px}.notice,.guide{margin:16px 0;padding:15px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.035);color:#aab9bb;font-size:14px;line-height:1.55;text-align:left}.guide{border-color:rgba(217,170,60,.3);background:rgba(217,170,60,.055)}.guide h2{margin:0 0 10px;color:#f4d99e;font-size:15px;letter-spacing:.08em}.steps{display:grid;gap:10px}.step{display:grid;grid-template-columns:31px 1fr;gap:10px;align-items:start}.num{width:29px;height:29px;border-radius:9px;background:#d9aa3c;color:#0d1215;display:grid;place-items:center;font-weight:950}.step b{color:#f7f4ec}.actions{display:grid;gap:11px;margin-top:18px}.btn{display:block;width:100%;padding:15px 16px;border-radius:13px;text-decoration:none;font-weight:950;border:1px solid rgba(217,170,60,.42);cursor:pointer;font-size:15px}.primary{background:#d9aa3c;color:#0d1215;border-color:#d9aa3c}.secondary{background:transparent;color:#f4d99e}.copy{background:#0d1c21;color:#dfe7e8}.small{margin:16px 0 0;color:#728589;font-size:12px;line-height:1.5}.status{min-height:18px;margin-top:8px;color:#d9aa3c;font-size:12px}
</style>
</head>
<body>
<main class="card">
<img class="logo" src="/start/icon.png" alt="DELIONARYO logo"/>
<div class="eyebrow">OFFICIAL DELIONARYO ACCESS</div>
<h1>Open & Install DELIONARYO</h1>
<p class="lead">For the best experience and app installation, open DELIONARYO in Google Chrome.</p>
<div class="notice"><b>Facebook / Messenger user?</b><br/>Tap <b>OPEN IN CHROME</b>. If your phone keeps this page inside Facebook or Messenger, tap the <b>⋮</b> menu above and choose <b>Open in external browser</b>.</div>
<div class="guide" id="androidGuide">
<h2>INSTALL IN 3 STEPS</h2>
<div class="steps">
<div class="step"><span class="num">1</span><div><b>Open in Google Chrome</b><br/>Tap the gold OPEN IN CHROME button below.</div></div>
<div class="step"><span class="num">2</span><div><b>Tap the Chrome ⋮ menu</b><br/>Look at the upper-right corner of Chrome.</div></div>
<div class="step"><span class="num">3</span><div><b>Choose “Add to Home screen” or “Install app”</b><br/>Then confirm <b>Install</b>. The DELIONARYO icon will appear on your phone.</div></div>
</div>
</div>
<div class="guide" id="iosGuide" hidden>
<h2>INSTALL ON IPHONE</h2>
<div class="steps">
<div class="step"><span class="num">1</span><div><b>Open DELIONARYO in Safari</b>.</div></div>
<div class="step"><span class="num">2</span><div><b>Tap Share</b> at the bottom of Safari.</div></div>
<div class="step"><span class="num">3</span><div><b>Tap “Add to Home Screen”</b>, then tap <b>Add</b>.</div></div>
</div>
</div>
<div class="actions">
<a class="btn primary" id="openChrome" href="${chromeIntent}">OPEN IN CHROME</a>
<a class="btn secondary" href="${appUrl}">CONTINUE HERE</a>
<button class="btn copy" id="copyLink" type="button">COPY DELIONARYO LINK</button>
</div>
<div class="status" id="status"></div>
<p class="small">Official app: app.gapcreation.space/start</p>
</main>
<script>
(function(){
  var target='${appUrl}';
  var ua=navigator.userAgent||'';
  var isAndroid=/Android/i.test(ua);
  var isIOS=/iPhone|iPad|iPod/i.test(ua);
  var chrome=document.getElementById('openChrome');
  var androidGuide=document.getElementById('androidGuide');
  var iosGuide=document.getElementById('iosGuide');
  if(isIOS){androidGuide.hidden=true;iosGuide.hidden=false;chrome.href=target;chrome.textContent='OPEN DELIONARYO';}
  else if(!isAndroid){chrome.href=target;chrome.textContent='OPEN DELIONARYO';}
  document.getElementById('copyLink').addEventListener('click',async function(){
    var status=document.getElementById('status');
    try{await navigator.clipboard.writeText(target);status.textContent='Link copied. Paste it into Chrome.';}
    catch(e){status.textContent='Copy this link: '+target;}
  });
})();
</script>
</body>
</html>`);
}

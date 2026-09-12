import startHandler from './start.js';

export default function handler(req:any,res:any){
  const originalSetHeader=res.setHeader.bind(res);
  const originalSend=res.send.bind(res);

  res.setHeader=(name:any,value:any)=>{
    if(String(name).toLowerCase()==='cache-control'){
      return originalSetHeader('Cache-Control','public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
    }
    return originalSetHeader(name,value);
  };

  res.send=(body:any)=>{
    if(typeof body!=='string'||!body.includes('</head>')||!body.includes('</body>')){
      return originalSend(body);
    }

    const pwaHead=`
<link rel="manifest" href="/start/manifest.webmanifest" />
<link rel="icon" type="image/png" href="/start/icon.png" />
<link rel="apple-touch-icon" href="/start/icon.png" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="DELIONARYO" />
<style>
.mark{overflow:hidden}.mark img{width:100%;height:100%;object-fit:cover;display:block}.appNavActions{display:flex;align-items:center;justify-content:flex-end;gap:9px;flex-wrap:wrap}.installAppBtn{color:#0e1215;background:#d9aa3c;border:1px solid #d9aa3c;padding:11px 15px;border-radius:11px;font-weight:900;cursor:pointer}.installAppBtn[hidden]{display:none}.memberLoginBtn{color:#f7f4ec;text-decoration:none;border:1px solid rgba(217,170,60,.35);padding:11px 15px;border-radius:11px;font-weight:900}@media(max-width:700px){.appNavActions{max-width:72%}.installAppBtn,.memberLoginBtn{font-size:12px;padding:10px 12px}}
.installGuideModal{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:rgba(2,8,10,.86);backdrop-filter:blur(8px)}.installGuideModal[hidden]{display:none}.installGuideCard{width:min(480px,100%);position:relative;border:1px solid rgba(217,170,60,.38);border-radius:22px;background:#09181d;padding:24px;color:#f7f4ec;box-shadow:0 28px 80px rgba(0,0,0,.5)}.installGuideCard h2{margin:4px 0 8px;font-size:27px}.installGuideCard p{color:#aebdc0;line-height:1.55}.installGuideSteps{display:grid;gap:10px;margin:17px 0}.installGuideStep{display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:start;padding:11px;border:1px solid rgba(255,255,255,.07);border-radius:12px;background:rgba(255,255,255,.025)}.installGuideNum{width:29px;height:29px;border-radius:8px;background:#d9aa3c;color:#101518;display:grid;place-items:center;font-weight:950}.installGuideStep b{display:block}.installGuideStep span{color:#9eafb2;font-size:13px;line-height:1.45}.installGuideClose{position:absolute;right:13px;top:11px;border:0;background:transparent;color:#c7d1d2;font-size:28px;cursor:pointer}.installGuideDone{width:100%;padding:13px;border:0;border-radius:11px;background:#d9aa3c;color:#101518;font-weight:950;cursor:pointer}
</style>`;

    const pwaBoot=`
<script>
(function(){
  var icon='/start/icon.png';
  var mark=document.querySelector('.mark');
  if(mark)mark.innerHTML='<img src="'+icon+'" alt="DELIONARYO Start">';
  var nav=document.querySelector('.nav');
  var button=document.createElement('button');
  button.id='installApp';button.className='installAppBtn';button.type='button';button.textContent='INSTALL DELIONARYO';button.hidden=false;
  var member=document.createElement('a');
  member.className='memberLoginBtn';member.href='/start/login.html';member.textContent='MEMBER LOGIN';
  if(nav){var actions=document.createElement('div');actions.className='appNavActions';nav.appendChild(actions);actions.appendChild(button);actions.appendChild(member);}
  var guide=document.createElement('div');
  guide.id='installGuide';guide.className='installGuideModal';guide.hidden=true;
  guide.innerHTML='<div class="installGuideCard"><button class="installGuideClose" type="button" aria-label="Close">×</button><div style="color:#d9aa3c;font-size:11px;font-weight:900;letter-spacing:.16em">INSTALL DELIONARYO</div><h2>Add DELIONARYO to your phone</h2><p id="installGuideIntro">Use Google Chrome for the best install experience.</p><div class="installGuideSteps" id="installGuideSteps"></div><button class="installGuideDone" type="button">GOT IT</button></div>';
  document.body.appendChild(guide);
  var steps=document.getElementById('installGuideSteps');
  var intro=document.getElementById('installGuideIntro');
  var ua=navigator.userAgent||'';
  var isIOS=/iPhone|iPad|iPod/i.test(ua);
  var isMeta=/FBAN|FBAV|Instagram|Messenger/i.test(ua);
  function setGuide(){
    if(isIOS){intro.textContent='Install from Safari using Add to Home Screen.';steps.innerHTML='<div class="installGuideStep"><div class="installGuideNum">1</div><div><b>Open in Safari</b><span>Use Safari for installation.</span></div></div><div class="installGuideStep"><div class="installGuideNum">2</div><div><b>Tap Share</b><span>Tap the Share icon in Safari.</span></div></div><div class="installGuideStep"><div class="installGuideNum">3</div><div><b>Add to Home Screen</b><span>Choose Add to Home Screen, then tap Add.</span></div></div>';return;}
    if(isMeta){intro.textContent='Facebook and Messenger cannot reliably install the app directly. Open this page in Chrome first.';steps.innerHTML='<div class="installGuideStep"><div class="installGuideNum">1</div><div><b>Open in external browser</b><span>Tap the ⋮ menu in Facebook or Messenger and choose Open in external browser / Chrome.</span></div></div><div class="installGuideStep"><div class="installGuideNum">2</div><div><b>Tap Chrome ⋮</b><span>Use the menu in the upper-right corner.</span></div></div><div class="installGuideStep"><div class="installGuideNum">3</div><div><b>Install app</b><span>Choose Add to Home screen or Install app, then confirm Install.</span></div></div>';return;}
    intro.textContent='If Chrome does not show the automatic install prompt, use these steps.';steps.innerHTML='<div class="installGuideStep"><div class="installGuideNum">1</div><div><b>Tap Chrome ⋮</b><span>Open the menu in the upper-right corner.</span></div></div><div class="installGuideStep"><div class="installGuideNum">2</div><div><b>Choose Add to Home screen / Install app</b><span>Chrome may use either label.</span></div></div><div class="installGuideStep"><div class="installGuideNum">3</div><div><b>Confirm Install</b><span>The DELIONARYO icon will appear on your home screen.</span></div></div>';}
  setGuide();
  var deferred=null;
  window.addEventListener('beforeinstallprompt',function(event){event.preventDefault();deferred=event;button.hidden=false;});
  button.addEventListener('click',async function(){if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;return;}guide.hidden=false;});
  guide.querySelector('.installGuideClose').addEventListener('click',function(){guide.hidden=true;});
  guide.querySelector('.installGuideDone').addEventListener('click',function(){guide.hidden=true;});
  guide.addEventListener('click',function(event){if(event.target===guide)guide.hidden=true;});
  window.addEventListener('appinstalled',function(){deferred=null;button.hidden=true;guide.hidden=true;});
  if(window.matchMedia('(display-mode: standalone)').matches)button.hidden=true;
  if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/start/sw.js',{scope:'/start/'}).catch(console.error);});}
})();
</script>`;

    let html=body.replace('</head>',pwaHead+'\n</head>').replace('</body>',pwaBoot+'\n</body>');

    // Phase 1 isolation: Start owns the only visible login. Existing direct
    // Hub links in legacy Start markup are suppressed; the injected login
    // button above always routes through /start/login.html.
    html=html
      .replace('<a href="https://hub.gapcreation.space/">MEMBER LOGIN</a>','')
      .replace('<p>Already registered? <a href="https://hub.gapcreation.space/" style="color:#f2cf7b;font-weight:900">Go to Member Login →</a></p>','<p>Already registered? Use the secure Member Login at the top of this Start page.</p>')
      .replace('<b>Member Login</b><span>The Hub is for member sign-in and private ecosystem access.</span>','<b>Secure Member Access</b><span>Sign in only through DELIONARYO Start. Private apps remain isolated during Phase 1.</span>')
      .replace("setMsg('Account created. Use Member Login to enter your DELIONARYO Hub.','success');","setMsg('Account created successfully. Use Member Login on DELIONARYO Start when you are ready.','success');")
      .replace("setTimeout(function(){window.location.href='https://hub.gapcreation.space/';},1200);",'')
      .split('https://hub.gapcreation.space/').join('#');

    return originalSend(html);
  };

  return startHandler(req,res);
}

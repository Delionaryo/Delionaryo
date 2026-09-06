export default async function handler(req:any,res:any){
  try{
    const proto=String(req.headers['x-forwarded-proto']||'https').split(',')[0].trim();
    const host=String(req.headers.host||'app.gapcreation.space');
    const upstream=await fetch(`${proto}://${host}/api/start`);
    let html=await upstream.text();
    const pwaHead=`
<link rel="manifest" href="/start/manifest.webmanifest" />
<link rel="icon" type="image/png" href="/start/icon.png" />
<link rel="apple-touch-icon" href="/start/icon.png" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="DELIONARYO" />
<style>
.mark{overflow:hidden}.mark img{width:100%;height:100%;object-fit:cover;display:block}.appNavActions{display:flex;align-items:center;justify-content:flex-end;gap:9px;flex-wrap:wrap}.installAppBtn{color:#0e1215;background:#d9aa3c;border:1px solid #d9aa3c;padding:11px 15px;border-radius:11px;font-weight:900;cursor:pointer}.installAppBtn[hidden]{display:none}@media(max-width:700px){.appNavActions{max-width:58%}.installAppBtn{font-size:12px;padding:10px 12px}}
</style>`;
    const pwaBoot=`
<script>
(function(){
  var icon='/start/icon.png';
  var mark=document.querySelector('.mark');
  if(mark)mark.innerHTML='<img src="'+icon+'" alt="DELIONARYO Start">';
  var nav=document.querySelector('.nav');
  var member=nav?nav.querySelector('a'):null;
  var button=document.createElement('button');
  button.id='installApp';button.className='installAppBtn';button.type='button';button.textContent='INSTALL APP';button.hidden=true;
  if(nav&&member){var actions=document.createElement('div');actions.className='appNavActions';nav.appendChild(actions);actions.appendChild(button);actions.appendChild(member);} 
  var deferred=null;
  window.addEventListener('beforeinstallprompt',function(event){event.preventDefault();deferred=event;button.hidden=false;});
  button.addEventListener('click',async function(){if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;button.hidden=true;});
  window.addEventListener('appinstalled',function(){deferred=null;button.hidden=true;});
  if(window.matchMedia('(display-mode: standalone)').matches)button.hidden=true;
  if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/start/sw.js',{scope:'/start/'}).catch(console.error);});}
})();
</script>`;
    html=html.replace('</head>',pwaHead+'\n</head>').replace('</body>',pwaBoot+'\n</body>');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=120, s-maxage=300');
    res.status(upstream.ok?200:upstream.status).send(html);
  }catch(error:any){
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.status(500).send(error?.message||'Unable to load DELIONARYO Start');
  }
}

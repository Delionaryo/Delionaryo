import './rootGraduationCloudSync';

const HUB='https://hub.gapcreation.space';
const CAMPUS='https://campus.gapcreation.space';
const LIBRARY='https://library.gapcreation.space';

let initialized=false;

function mountPublicMemberGateway(){
  if(initialized)return true;
  const navInner=document.querySelector<HTMLElement>('nav > div');
  const store=document.querySelector<HTMLElement>('#store');
  if(!navInner||!store)return false;
  initialized=true;

  const login=document.createElement('a');
  login.id='learning-account-button';
  login.href=HUB;
  login.className='rounded-lg border border-amber-400/50 px-4 py-2 text-sm font-black text-amber-300';
  login.textContent='LOGIN';
  login.setAttribute('aria-label','Login to DELIONARYO member hub');
  navInner.insertBefore(login,navInner.lastElementChild);

  const section=document.createElement('section');
  section.id='my-learning';
  section.className='border-y border-white/10 bg-stone-900/40';
  section.innerHTML=`
    <div class="mx-auto max-w-6xl px-5 py-20">
      <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-black tracking-[.25em] text-amber-400">DELIONARYO MEMBER ACCESS</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl">Your DELIONARYO ecosystem starts in the Integration Hub.</h2>
          <p class="mt-4 max-w-3xl leading-7 text-stone-400">The public DELIONARYO app is your front door. Members enter the Integration Hub, then continue to the Learning Campus, Marketplace, Wallet, Library, Nation and other connected applications.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="${HUB}" class="rounded-xl bg-amber-400 px-6 py-3 font-black text-stone-950">LOGIN / OPEN HUB →</a>
          <a href="${LIBRARY}" class="rounded-xl border border-amber-400/50 px-6 py-3 font-black text-amber-300">BROWSE STORE →</a>
        </div>
      </div>
      <div class="mt-8 rounded-2xl border border-white/10 bg-stone-950 p-5 text-sm leading-7 text-stone-300">
        <b class="text-amber-300">OFFICIAL FLOW</b><br>Public DELIONARYO App → Login → Integration Hub → Connected DELIONARYO Applications.
      </div>
    </div>`;
  store.parentElement?.insertBefore(section,store);
  return true;
}

if(!mountPublicMemberGateway()){
  const observer=new MutationObserver(()=>{if(mountPublicMemberGateway())observer.disconnect()});
  observer.observe(document.documentElement,{childList:true,subtree:true});
}

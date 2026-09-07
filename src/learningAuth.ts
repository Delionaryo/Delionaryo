import './rootGraduationCloudSync';

const LOGIN_ROUTE='/login';
const STORE_ROUTE='#store';

let initialized=false;

function mountPublicMemberGateway(){
  if(initialized)return true;
  const navInner=document.querySelector<HTMLElement>('nav > div');
  const store=document.querySelector<HTMLElement>('#store');
  if(!navInner||!store)return false;
  initialized=true;

  const login=document.createElement('a');
  login.id='learning-account-button';
  login.href=LOGIN_ROUTE;
  login.className='rounded-lg border border-amber-400/50 px-4 py-2 text-sm font-black text-amber-300';
  login.textContent='MEMBER LOGIN';
  login.setAttribute('aria-label','Login to DELIONARYO Member Portal');
  navInner.insertBefore(login,navInner.lastElementChild);

  const section=document.createElement('section');
  section.id='my-learning';
  section.className='border-y border-white/10 bg-stone-900/40';
  section.innerHTML=`
    <div class="mx-auto max-w-6xl px-5 py-20">
      <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-black tracking-[.25em] text-amber-400">FREE DELIONARYO ACCOUNT</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl">Create your account to get your free eBook.</h2>
          <p class="mt-4 max-w-3xl leading-7 text-stone-400">No activation code is required. Create your free DELIONARYO account, then visit the Learning Campus. Your welcome resource is already there under <b class="text-amber-300">Your Free eBook</b>. Verified purchases will also connect automatically to the same account.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="${LOGIN_ROUTE}" class="rounded-xl bg-amber-400 px-6 py-3 font-black text-stone-950">CREATE ACCOUNT & GET FREE EBOOK →</a>
          <a href="${STORE_ROUTE}" class="rounded-xl border border-amber-400/50 px-6 py-3 font-black text-amber-300">GO TO STORE →</a>
        </div>
      </div>
      <div class="mt-8 rounded-2xl border border-white/10 bg-stone-950 p-5 text-sm leading-7 text-stone-300">
        <b class="text-amber-300">OFFICIAL ACCESS FLOW</b><br>Landing Page → Install / Open Public DELIONARYO App → Create Free Account → Open Learning Campus → Your Free eBook → Learn / Explore Store → Verified Purchases Connect Automatically → Member Portal & Eligible Private Apps.
      </div>
    </div>`;
  store.parentElement?.insertBefore(section,store);
  return true;
}

if(!mountPublicMemberGateway()){
  const observer=new MutationObserver(()=>{if(mountPublicMemberGateway())observer.disconnect()});
  observer.observe(document.documentElement,{childList:true,subtree:true});
}

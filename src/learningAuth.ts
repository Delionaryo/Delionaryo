import './rootGraduationCloudSync';

const CAMPUS='https://delionaryo-learning-campus.vercel.app';
const LIBRARY='https://delionaryo-ebook-library.vercel.app';

let initialized=false;

function mountPublicMemberGateway(){
  if(initialized)return true;
  const navInner=document.querySelector<HTMLElement>('nav > div');
  const store=document.querySelector<HTMLElement>('#store');
  if(!navInner||!store)return false;
  initialized=true;

  const login=document.createElement('a');
  login.id='learning-account-button';
  login.href=CAMPUS;
  login.className='rounded-lg border border-amber-400/50 px-4 py-2 text-sm font-black text-amber-300';
  login.textContent='LOGIN';
  login.setAttribute('aria-label','Login to DELIONARYO Learning Campus');
  navInner.insertBefore(login,navInner.lastElementChild);

  const section=document.createElement('section');
  section.id='my-learning';
  section.className='border-y border-white/10 bg-stone-900/40';
  section.innerHTML=`
    <div class="mx-auto max-w-6xl px-5 py-20">
      <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-black tracking-[.25em] text-amber-400">DELIONARYO MEMBER ACCESS</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl">Your learning lives in the Learning Campus.</h2>
          <p class="mt-4 max-w-3xl leading-7 text-stone-400">The public DELIONARYO app is your gateway. Verified purchases are delivered to the official Learning Campus, where your ebooks, courses, workbooks, journey and last-read progress are kept together.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="${CAMPUS}" class="rounded-xl bg-amber-400 px-6 py-3 font-black text-stone-950">LOGIN / OPEN CAMPUS →</a>
          <a href="${LIBRARY}" class="rounded-xl border border-amber-400/50 px-6 py-3 font-black text-amber-300">BROWSE STORE →</a>
        </div>
      </div>
      <div class="mt-8 rounded-2xl border border-white/10 bg-stone-950 p-5 text-sm leading-7 text-stone-300">
        <b class="text-amber-300">OFFICIAL FLOW</b><br>Digital Library → Purchase Verification → Learning Campus Delivery → Read / Continue Reading.
      </div>
    </div>`;
  store.parentElement?.insertBefore(section,store);
  return true;
}

if(!mountPublicMemberGateway()){
  const observer=new MutationObserver(()=>{if(mountPublicMemberGateway())observer.disconnect()});
  observer.observe(document.documentElement,{childList:true,subtree:true});
}

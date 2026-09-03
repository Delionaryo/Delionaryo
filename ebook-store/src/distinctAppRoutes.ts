type DistinctAppKey='dpbs'|'money-flow'|'expense-tracker'|'dreamer-consultant';

type RouteRegistry=Partial<Record<DistinctAppKey,string>>;

declare global { interface Window { DELIONARYO_DISTINCT_APP_ROUTES?: RouteRegistry } }

const defaults:RouteRegistry={
  'dpbs':'',
  'money-flow':'',
  'expense-tracker':'',
  'dreamer-consultant':''
};

const labels:Record<DistinctAppKey,string[]>={
  'dpbs':['DPBS'],
  'money-flow':['Money Flow Calculator','Money Flow'],
  'expense-tracker':['Expense Tracker','Spend Tracker'],
  'dreamer-consultant':['Dreamer Consultant']
};

function normalized(v:string){return v.replace(/\s+/g,' ').trim().toLowerCase()}
function registry():RouteRegistry{return {...defaults,...(window.DELIONARYO_DISTINCT_APP_ROUTES||{})}}
function targetFor(key:DistinctAppKey){const value=registry()[key]?.trim();return value||''}

function wireButton(button:HTMLButtonElement,key:DistinctAppKey){
  if(button.dataset.distinctRouteWired==='1')return;
  button.dataset.distinctRouteWired='1';
  const fallback=button.onclick;
  button.onclick=(event)=>{
    const target=targetFor(key);
    if(target){
      event?.preventDefault?.();
      window.location.assign(target);
      return;
    }
    if(typeof fallback==='function')fallback.call(button,event as any);
  };
}

function scan(){
  document.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{
    const text=normalized(button.textContent||'');
    (Object.keys(labels) as DistinctAppKey[]).forEach(key=>{
      if(labels[key].some(label=>text.includes(normalized(label))))wireButton(button,key);
    });
  });
}

export function setDistinctAppRoute(key:DistinctAppKey,url:string){
  window.DELIONARYO_DISTINCT_APP_ROUTES={...(window.DELIONARYO_DISTINCT_APP_ROUTES||{}),[key]:url};
  scan();
}

const observer=new MutationObserver(scan);
observer.observe(document.documentElement,{childList:true,subtree:true});
scan();

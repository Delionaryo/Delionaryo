const MONEY_FLOW_ID='money-flow-view';
function clarifyDPBSAllocation(){
  const view=document.querySelector<HTMLElement>(`#${MONEY_FLOW_ID}`);
  const form=view?.querySelector<HTMLFormElement>('#money-flow-form');
  if(!view||!form||view.dataset.dpbsLabel==='1')return;
  view.dataset.dpbsLabel='1';
  const title=form.querySelector('h3');
  if(title)title.textContent='INCOME − OBLIGATIONS − HOUSEHOLD EXPENSES − DPBS RESOURCES';
  const input=form.querySelector<HTMLInputElement>('input[name="future"]');
  if(input){
    input.placeholder='DPBS resources for multiplication';
    input.setAttribute('aria-label','DPBS resources for multiplication');
    const note=document.createElement('div');
    note.className='dpbs-allocation-note';
    note.innerHTML=`<strong>DPBS RESOURCES FOR MULTIPLICATION</strong><p>This allocation is not emergency savings and not spending money. It is controlled capital reserved for the DELIONARYO Personal Banking System and its disciplined accumulation, borrowing, repayment + internal interest, and compounding cycle.</p><small>Keep emergency funds separate from DPBS resources.</small>`;
    input.insertAdjacentElement('afterend',note);
  }
}
const observer=new MutationObserver(()=>clarifyDPBSAllocation());
observer.observe(document.documentElement,{childList:true,subtree:true});
clarifyDPBSAllocation();

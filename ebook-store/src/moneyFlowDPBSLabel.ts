const MONEY_FLOW_ID='money-flow-view';
function clarifyDPBSAllocation(){
  const view=document.querySelector<HTMLElement>(`#${MONEY_FLOW_ID}`);
  const form=view?.querySelector<HTMLFormElement>('#money-flow-form');
  if(!view||!form)return;
  if(view.dataset.dpbsLabel!=='1'){
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
  if(!view.querySelector('.money-flow-seed-message')){
    const message=document.createElement('aside');
    message.className='money-flow-seed-message';
    message.innerHTML=`
      <div class="money-flow-seed-kicker">MONEY FLOW · KINGDOM STEWARDSHIP</div>
      <h2>HUWAG UBUSIN ANG BUNGA. MAGTABI NG BINHI.</h2>
      <div class="money-flow-header-wisdom"><strong>PLAN DILIGENTLY · PROTECT WITH WISDOM</strong><span>PROVERBS 21:5 · ECCLESIASTES 7:12</span></div>
      <p class="money-flow-seed-lead">Sa DELIONARYO framework, treat your income like a fruit: may bahagi para sa obligations, household needs at protection, at may <strong>seed portion</strong> na pinipreserve para magkaroon ng resources for future responsible multiplication.</p>
      <div class="money-flow-seed-flow"><span>WORK</span><b>→</b><span>FRUIT</span><b>→</b><span>PRESERVE SEED</span><b>→</b><span>PLAN</span><b>→</b><span>SOW</span><b>→</b><span>HARVEST</span><b>→</b><span>MULTIPLY</span></div>
      <div class="money-flow-scriptures">
        <article><b>GENESIS 1:11–12</b><p>The creation pattern shows fruit carrying seed—the capacity to reproduce and continue.</p></article>
        <article><b>GENESIS 1:28</b><p>Fruitfulness and multiplication remind us that stewardship should move beyond consumption toward productive responsibility.</p></article>
        <article><b>PSALM 126:5–6</b><p>Sowing comes before harvest. Preserve seed so there is something meaningful to sow.</p></article>
        <article><b>ECCLESIASTES 11:1–6</b><p>Act with wisdom despite uncertainty. Do not wait forever for perfect conditions; sow diligently and diversify prudently.</p></article>
        <article><b>PROVERBS 21:5</b><p>Diligent planning leads toward abundance; haste leads toward lack. Preserve the seed, then plan before you deploy it.</p></article>
        <article><b>ECCLESIASTES 7:12</b><p>Wisdom is a protection, just as money can provide protection; the advantage of knowledge is that wisdom preserves the life of the one who has it.</p></article>
      </div>
      <blockquote>“You cannot continually multiply what you continually consume. Preserve the seed. Plan before you sow. Steward it with wisdom.”</blockquote>
      <div class="money-flow-seed-rule"><strong>DPBS SEED PORTION</strong><p>Kapag kaya ng cash flow, magsimula kahit 5% bilang disciplined DPBS allocation. Hindi ito emergency fund at hindi ito guaranteed investment return. Ang 5% ay DELIONARYO practical starting framework—not a percentage commanded by these Bible passages.</p></div>
    `;
    form.insertAdjacentElement('afterend',message);
  }
}
const observer=new MutationObserver(()=>clarifyDPBSAllocation());
observer.observe(document.documentElement,{childList:true,subtree:true});
clarifyDPBSAllocation();

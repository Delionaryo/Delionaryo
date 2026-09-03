const campus=document.createElement('section');
campus.id='campus';
campus.className='campus-shell';

const learningCampus='https://delionaryo-learning-campus.vercel.app';
const digitalLibrary='https://delionaryo-ebook-library.vercel.app';
const marketplace='https://delionaryo-marketplace.vercel.app';
const businessCalculator='https://delionaryo-business-calculator.vercel.app';

campus.innerHTML=`
  <div class="campus-topbar">
    <div><span class="campus-mark">D</span><div><b>DELIONARYO</b><small>LEARNING CAMPUS</small></div></div>
    <a href="${learningCampus}">OPEN OFFICIAL CAMPUS</a>
  </div>
  <div class="campus-layout">
    <aside class="campus-sidebar">
      <p>DELIONARYO ACCESS</p>
      <a href="${learningCampus}">⌂ <span>Learning Campus</span></a>
      <a href="${digitalLibrary}">▤ <span>Digital Library Store</span></a>
      <a href="${businessCalculator}">⌘ <span>Business Calculator</span></a>
      <a href="${marketplace}">◈ <span>Marketplace</span></a>
    </aside>
    <div class="campus-main">
      <section id="campus-home" class="campus-hero">
        <p>OFFICIAL MEMBER LEARNING ENVIRONMENT</p>
        <h2>Learn with direction.<br><span>Continue where you left off.</span></h2>
        <p class="campus-copy">Verified purchases are delivered to the standalone DELIONARYO Learning Campus. Your ebooks, courses, workbooks, journey and last-read progress stay there—not inside this public landing app.</p>
        <div class="campus-path"><span>LEARN</span><i>→</i><span>EXECUTE</span><i>→</i><span>EARN</span><i>→</i><span>MULTIPLY</span><i>→</i><span>STEWARD</span></div>
        <p style="margin-top:24px"><a class="rounded-xl bg-amber-400 px-6 py-4 font-black text-stone-950" href="${learningCampus}">LOGIN / ENTER LEARNING CAMPUS →</a></p>
      </section>
      <section class="campus-stats">
        <div><small>DELIVERY</small><b>Verified Purchases</b><span>All owned learning products appear in one access hub.</span></div>
        <div><small>READING</small><b>Last Read</b><span>Continue each ebook from its own saved position.</span></div>
        <div><small>EXECUTION</small><b>Connected Tools</b><span>Move from learning into calculation and marketplace execution.</span></div>
      </section>
      <section id="campus-tools" class="campus-tools">
        <div class="campus-section-head"><div><p>FROM LEARNING TO EXECUTION</p><h3>Connected DELIONARYO Tools</h3></div><span>ECOSYSTEM</span></div>
        <div class="campus-tool-grid">
          <a class="campus-tool" href="${businessCalculator}"><div class="tool-icon">∑</div><small>MANAGE · MULTIPLY</small><h4>Business Calculator</h4><p>Practice business management and test decisions before committing resources.</p><b>OPEN CALCULATOR →</b></a>
          <a class="campus-tool" href="${marketplace}"><div class="tool-icon">◈</div><small>EXECUTE · EARN</small><h4>DELIONARYO Marketplace</h4><p>Apply learning in a real product-based execution environment.</p><b>OPEN MARKETPLACE →</b></a>
        </div>
      </section>
      <section class="campus-principle"><span>ONE CAMPUS · ONE SOURCE OF TRUTH</span><h3>No duplicate learning system.</h3><p>The public app introduces the ecosystem. The official Learning Campus owns member access, delivery, reading and progress.</p></section>
    </div>
  </div>`;

export const mountCampus=()=>{
  const app=document.querySelector<HTMLDivElement>('#app');
  if(!app||document.querySelector('#campus'))return;
  const learning=app.querySelector('#learning');
  if(learning)learning.before(campus);else app.appendChild(campus);

  document.addEventListener('click',event=>{
    const target=event.target as HTMLElement;
    const anchor=target.closest<HTMLAnchorElement>('a[href="#campus"]');
    if(anchor){event.preventDefault();location.href=learningCampus;return}
    const buy=target.closest<HTMLButtonElement>('#paid-buy');
    if(buy){event.preventDefault();event.stopImmediatePropagation();location.href=digitalLibrary}
  },true);
};

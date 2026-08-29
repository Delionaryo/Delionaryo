const JOURNEY_ID='delionaryo-journey-campus';

function buildJourneyCampus(){
  const portal=document.querySelector<HTMLElement>('#member-portal');
  const main=portal?.querySelector<HTMLElement>('.campus-main');
  const nav=portal?.querySelector<HTMLElement>('.campus-nav');
  if(!portal||!main||!nav||document.querySelector(`#${JOURNEY_ID}`)) return false;

  const firstSection=main.querySelector('.campus-hero,.campus-stats,.campus-section');
  const journey=document.createElement('section');
  journey.id=JOURNEY_ID;
  journey.className='journey-command-center';
  journey.innerHTML=`
    <div class="journey-hero">
      <div class="journey-hero-copy"><p class="journey-kicker">DELIONARYO PRIVATE TRANSFORMATION CAMPUS</p><h1>Journey to <span>1,000,000</span> Graduates</h1><p>Learn the system. Execute the plan. Measure real progress. Build financial stability and advance toward verified graduation.</p><div class="journey-actions"><button data-journey-scroll="journey-path">CONTINUE MY JOURNEY →</button><button class="secondary" data-journey-scroll="dpbs-panel">OPEN DPBS</button></div></div>
      <div class="mission-orbit"><small>MISSION</small><strong>1M</strong><span>VERIFIED GRADUATES</span><i>Progress is earned through verified completion—not registration alone.</i></div>
    </div>
    <div class="journey-metrics"><article><small>MY JOURNEY</small><strong>START</strong><span>Build your first verified milestone</span></article><article><small>DPBS STATUS</small><strong>READY</strong><span>Your personal banking execution system</span></article><article><small>GRADUATE STATUS</small><strong>IN PROGRESS</strong><span>Complete learning + execution evidence</span></article></div>
    <div id="journey-path" class="journey-panel"><div class="journey-heading"><div><p class="journey-kicker">YOUR TRANSFORMATION PATH</p><h2>Learn → Apply → Measure → Build → Graduate</h2></div><span class="journey-badge">VERIFIED JOURNEY</span></div><div class="journey-steps"><article><b>01</b><h3>Learn</h3><p>Complete your enrolled financial education and core lessons.</p></article><article><b>02</b><h3>Apply</h3><p>Turn lessons into actions through DPBS and execution tools.</p></article><article><b>03</b><h3>Measure</h3><p>Track cash flow, habits, milestones and evidence of progress.</p></article><article><b>04</b><h3>Build</h3><p>Strengthen buffer, savings, income capacity and stewardship.</p></article><article><b>05</b><h3>Graduate</h3><p>Meet defined completion criteria before entering the mission count.</p></article></div></div>
    <div id="dpbs-panel" class="dpbs-panel"><div><p class="journey-kicker">DELIONARYO PERSONAL BANKING SYSTEM</p><h2>Your financial execution engine.</h2><p>DPBS turns financial education into a repeatable operating system for income, allocation, spending, reserves, goals and review.</p></div><div class="dpbs-grid"><article><span>01</span><b>Income</b><small>Know what enters your system.</small></article><article><span>02</span><b>Allocation</b><small>Give every peso a purpose.</small></article><article><span>03</span><b>Expenses</b><small>Control and review outflow.</small></article><article><span>04</span><b>Buffer</b><small>Build financial resilience.</small></article><article><span>05</span><b>Growth</b><small>Track savings, capital and goals.</small></article><article><span>06</span><b>Review</b><small>Measure weekly and monthly progress.</small></article></div><button class="dpbs-launch" type="button">DPBS FOUNDATION · READY FOR SETUP</button></div>
    <div class="graduate-panel"><div><p class="journey-kicker">GRADUATION STANDARD</p><h2>Progress before prestige.</h2><p>A DELIONARYO graduate should represent completed learning plus verified execution milestones. Purchases, registrations and logins alone do not count as graduation.</p></div><div class="graduate-checks"><span>✓ Learning completion</span><span>✓ DPBS execution</span><span>✓ Progress evidence</span><span>✓ Defined milestone review</span></div></div>`;
  if(firstSection) main.insertBefore(journey,firstSection); else main.appendChild(journey);

  nav.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
  const myJourney=document.createElement('button');myJourney.className='active';myJourney.innerHTML='◎ <span>My Journey</span>';myJourney.onclick=()=>journey.scrollIntoView({behavior:'smooth'});nav.prepend(myJourney);
  const dpbs=document.createElement('button');dpbs.innerHTML='◈ <span>DPBS</span>';dpbs.onclick=()=>document.querySelector('#dpbs-panel')?.scrollIntoView({behavior:'smooth'});myJourney.insertAdjacentElement('afterend',dpbs);
  const graduate=document.createElement('button');graduate.innerHTML='✦ <span>Graduate Status</span>';graduate.onclick=()=>journey.querySelector('.graduate-panel')?.scrollIntoView({behavior:'smooth'});nav.appendChild(graduate);
  journey.querySelectorAll<HTMLElement>('[data-journey-scroll]').forEach(btn=>btn.onclick=()=>document.querySelector(`#${btn.dataset.journeyScroll}`)?.scrollIntoView({behavior:'smooth'}));
  return true;
}

const observer=new MutationObserver(()=>{if(buildJourneyCampus()) observer.disconnect()});
observer.observe(document.documentElement,{childList:true,subtree:true});
buildJourneyCampus();

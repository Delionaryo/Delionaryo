export function openMyJourneyDashboard(){
  const portal=document.querySelector<HTMLElement>('#member-portal');
  if(!portal)return;
  document.querySelector('#my-journey-dashboard')?.remove();

  const box=document.createElement('section');
  box.id='my-journey-dashboard';
  box.className='journey-dashboard';
  box.innerHTML=`
    <div class="dpbs-private-shell">
      <p class="journey-kicker">MY JOURNEY DASHBOARD</p>
      <h2>Transformation Progress Center</h2>
      <p>Track learning, financial tools, milestones, and your personal transformation journey.</p>

      <div class="dashboard-grid">
        <article>
          <small>MISSION</small>
          <h3>1M Graduate Journey</h3>
          <p>Your progress toward financial transformation.</p>
        </article>

        <article>
          <small>LEARNING</small>
          <h3>Learning Hub</h3>
          <p>Access your available courses and resources.</p>
        </article>

        <article>
          <small>PROGRESS</small>
          <h3>Personal Milestones</h3>
          <p>Track completed actions and growth stages.</p>
        </article>
      </div>

      <div class="dashboard-actions">
        <button id="journey-progress-btn">VIEW PROGRESS</button>
        <button id="journey-learning-btn">LEARNING HUB</button>
      </div>
    </div>`;

  portal.appendChild(box);

  box.querySelector('#journey-progress-btn')?.addEventListener('click',()=>{
    alert('Progress tracker module ready for connection.');
  });

  box.querySelector('#journey-learning-btn')?.addEventListener('click',()=>{
    window.open('https://delionaryo-ebook-library.vercel.app/','_blank');
  });
}

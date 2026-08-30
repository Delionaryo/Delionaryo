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
      <p>Track learning, financial tools, and personal milestones.</p>
      <div class="dashboard-actions">
        <button>VIEW PROGRESS</button>
        <button>LEARNING HUB</button>
      </div>
    </div>`;
  portal.appendChild(box);
}

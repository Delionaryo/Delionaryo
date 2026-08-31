const campus = document.createElement('section');
campus.id = 'campus';
campus.className = 'campus-shell';

const marketplace = 'https://delionaryo-marketplace-rodelrobleslegaspi-5066s-projects.vercel.app';
const businessCalculator = 'https://delionaryo-business-calculator.vercel.app';

campus.innerHTML = `
  <div class="campus-topbar">
    <div><span class="campus-mark">D</span><div><b>DELIONARYO</b><small>LEARNING CAMPUS</small></div></div>
    <a href="#top">EXIT CAMPUS</a>
  </div>
  <div class="campus-layout">
    <aside class="campus-sidebar">
      <p>CAMPUS NAVIGATION</p>
      <a href="#campus-home">⌂ <span>Campus Home</span></a>
      <a href="#learning">▣ <span>My Courses</span></a>
      <a href="#journey">◫ <span>My Journey</span></a>
      <a href="#ai-portal">✦ <span>AI Coach & Tools</span></a>
      <a href="#campus-tools">⌘ <span>Execution Tools</span></a>
      <a href="#store">▤ <span>Learning Library</span></a>
    </aside>
    <div class="campus-main">
      <section id="campus-home" class="campus-hero">
        <p>MEMBER LEARNING ENVIRONMENT</p>
        <h2>Learn with direction.<br><span>Execute with purpose.</span></h2>
        <p class="campus-copy">Your transformation does not end after a lesson. Continue from knowledge into action, evidence, resource multiplication, and stewardship.</p>
        <div class="campus-path"><span>LEARN</span><i>→</i><span>EXECUTE</span><i>→</i><span>EARN</span><i>→</i><span>MULTIPLY</span><i>→</i><span>STEWARD</span></div>
      </section>
      <section class="campus-stats">
        <div><small>LEARNING</small><b>My Courses</b><span>Continue your enrolled programs</span></div>
        <div><small>JOURNEY</small><b>Transformation Progress</b><span>Turn lessons into completed actions</span></div>
        <div><small>GUIDANCE</small><b>AI Coach</b><span>Get help with your next move</span></div>
      </section>
      <section id="campus-tools" class="campus-tools">
        <div class="campus-section-head"><div><p>FROM LEARNING TO EXECUTION</p><h3>Campus Execution Tools</h3></div><span>MEMBER TOOLS</span></div>
        <div class="campus-tool-grid">
          <a class="campus-tool" href="${businessCalculator}" target="_blank" rel="noopener noreferrer"><div class="tool-icon">∑</div><small>MANAGE · MULTIPLY</small><h4>Business Calculator</h4><p>Practice business management, understand resources, and make better multiplication decisions.</p><b>OPEN CALCULATOR →</b></a>
          <a class="campus-tool" href="${marketplace}" target="_blank" rel="noopener noreferrer"><div class="tool-icon">◈</div><small>EXECUTE · EARN</small><h4>DELIONARYO Marketplace</h4><p>Promote opportunities, build a member storefront, and apply what you learn in the real market.</p><b>OPEN MARKETPLACE →</b></a>
        </div>
      </section>
      <section class="campus-principle"><span>THE CAMPUS BRIDGE</span><h3>Education should lead somewhere.</h3><p>DELIONARYO Learning Campus connects learning to tools and a real execution environment so members can practice, measure, improve, and grow.</p></section>
    </div>
  </div>
`;

export const mountCampus = () => {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app || document.querySelector('#campus')) return;
  const learning = app.querySelector('#learning');
  if (learning) learning.before(campus); else app.appendChild(campus);
  const nav = app.querySelector('nav div div');
  if (nav && !nav.querySelector('[href="#campus"]')) {
    const link = document.createElement('a'); link.href='#campus'; link.textContent='CAMPUS'; nav.prepend(link);
  }
};

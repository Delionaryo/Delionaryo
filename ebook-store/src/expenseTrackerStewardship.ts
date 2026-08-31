const PANEL_ID = 'expense-stewardship-message';

function mountExpenseStewardshipMessage() {
  const view = document.querySelector<HTMLElement>('#expense-tracker-view');
  if (!view || view.querySelector(`#${PANEL_ID}`)) return;

  const formArea = view.querySelector<HTMLElement>('.dpbs-form-area');
  if (!formArea) return;

  const panel = document.createElement('section');
  panel.id = PANEL_ID;
  panel.className = 'dpbs-reading-guide expense-wisdom-panel';
  panel.innerHTML = `
    <div class="dpbs-guide-head">
      <p class="journey-kicker">MONEY TRACKER · LABOR TO STEWARDSHIP</p>
      <h2>DON'T LET THE FRUIT OF YOUR LABOR DISAPPEAR WITHOUT A RECORD.</h2>
      <p>You worked for it. Track it. Understand it. Control it. Give it an assignment.</p>
    </div>

    <div class="dpbs-kingdom-message">
      <p class="journey-kicker">PROVERBS 14:23 · ECCLESIASTES 10:19</p>
      <h3>YOUR LABOR PRODUCES. YOUR MONEY RESPONDS. YOUR WISDOM DIRECTS.</h3>
      <p><b>Proverbs 14:23</b> teaches that diligent labor produces profit, while words without productive action lead toward lack. <b>Ecclesiastes 10:19</b> recognizes money's broad practical usefulness in material life. The DELIONARYO application is stewardship: the fruit of your labor needs visibility and direction.</p>
      <div class="dpbs-kingdom-flow"><span>LABOR</span><b>→</b><span>INCOME</span><b>→</b><span>TRACK</span><b>→</b><span>ASSIGN</span><b>→</b><span>CONTROL</span><b>→</b><span>BUILD</span></div>
    </div>

    <div class="dpbs-reading-grid">
      <article><span>VISION</span><h3>Proverbs 29:18</h3><p>Use clear direction so money decisions serve a defined purpose rather than drift.</p></article>
      <article><span>PRUDENCE</span><h3>Proverbs 22:3</h3><p>See financial danger early. Tracking exposes patterns while there is still time to correct them.</p></article>
      <article><span>DEBT AWARENESS</span><h3>Proverbs 22:7</h3><p>Borrowing creates obligation. Control spending before repeated shortfalls become unnecessary debt dependence.</p></article>
      <article><span>RESOURCE STRENGTH</span><h3>Proverbs 10:15</h3><p>Resources can provide practical financial protection, while lack increases vulnerability.</p></article>
    </div>

    <div class="dpbs-purpose-box">
      <p class="journey-kicker">DELIONARYO MONEY TRACKER PRINCIPLE</p>
      <h3>WHAT YOU DON'T TRACK, YOU CAN'T INTENTIONALLY CONTROL.</h3>
      <p>The Money Tracker is more than an expense record. It is an evidence system for stewardship—showing whether the fruit of your labor is moving toward your purpose or disappearing through uncontrolled consumption.</p>
    </div>

    <p class="dpbs-warning">These passages provide wisdom and stewardship principles. DELIONARYO applies them as practical financial education; they are not promises of guaranteed wealth or a claim that money solves every area of life.</p>
  `;

  formArea.insertAdjacentElement('afterend', panel);
}

const observer = new MutationObserver(() => mountExpenseStewardshipMessage());
observer.observe(document.documentElement, { childList: true, subtree: true });
mountExpenseStewardshipMessage();

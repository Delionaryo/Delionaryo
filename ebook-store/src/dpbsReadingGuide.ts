import './distinctAppRoutes';
const GUIDE_ID='dpbs-reading-guide';
function mountGuide(){
  const view=document.querySelector<HTMLElement>('#dpbs-private-view');
  const ledger=view?.querySelector<HTMLElement>('.dpbs-ledger');
  if(!view||!ledger||view.querySelector(`#${GUIDE_ID}`))return;
  const guide=document.createElement('section');
  guide.id=GUIDE_ID;
  guide.className='dpbs-reading-guide';
  guide.innerHTML=`
    <div class="dpbs-guide-head">
      <div><p class="journey-kicker">READING MATERIAL · UNDERSTANDING DPBS</p><h2>Ano ang DPBS at para saan ito?</h2></div>
      <span>READ BEFORE MULTIPLYING</span>
    </div>
    <div class="dpbs-guide-intro">
      <strong>DPBS means DELIONARYO Personal Banking System.</strong>
      <p>Ang DPBS ay hindi ordinaryong savings account at hindi emergency fund. Ito ay personal resource-management system para sa controlled capital na inilalaan para sa responsible multiplication. Ang emergency savings ay para sa protection; ang DPBS resources ay para sa multiplication. Huwag paghaluin ang dalawang purpose.</p>
    </div>
    <div class="dpbs-kingdom-message">
      <p class="journey-kicker">KINGDOM ECONOMY · MULTIPLICATION PRINCIPLE</p>
      <h2>Ang binhi ay may kakayahang magbunga at magparami.</h2>
      <blockquote>“The earth brought forth vegetation, plants yielding seed according to their own kinds, and trees bearing fruit in which is their seed, each according to its kind.” <b>— Genesis 1:11–12</b></blockquote>
      <p>Sa DELIONARYO Kingdom Economy teaching, ginagamit natin ang seed principle ng Genesis 1:11–12 bilang larawan ng stewardship at multiplication: ang resource ay hindi basta inuubos; ito ay pinamamahalaan upang maging productive, magbunga, at magkaroon ng panibagong seed para sa susunod na cycle.</p>
      <div class="dpbs-kingdom-flow"><span>SEED</span><b>→</b><span>STEWARD</span><b>→</b><span>PRODUCE</span><b>→</b><span>FRUIT</span><b>→</b><span>SEED AGAIN</span><b>→</b><span>MULTIPLY</span></div>
      <p><strong>DPBS application:</strong> Accumulate controlled resources → protect their purpose → deploy only for responsible productive use → return principal + internal interest → compound the resource base → repeat with greater stewardship capacity.</p>
      <small>Genesis 1:11–12 describes creation's seed-and-fruit pattern; applying that pattern to personal finance is a DELIONARYO stewardship framework, not a promise of guaranteed financial returns.</small>
    </div>
    <div class="dpbs-reading-grid">
      <article><b>01 · ACCUMULATE</b><h3>Build your resource base.</h3><p>Magsimula sa consistent allocation mula sa income. Ang unang layunin ay bumuo ng sariling controlled resources bago isipin ang multiplication.</p></article>
      <article><b>02 · CONTROL</b><h3>Separate it from spending and emergency money.</h3><p>Ang DPBS resources ay hindi extra cash para gastusin at hindi emergency fund. May sariling multiplication purpose, record at discipline ito.</p></article>
      <article><b>03 · PREPARE</b><h3>Build discipline before borrowing.</h3><p>Ang unang mga buwan ay accumulation at control phase. Sa DELIONARYO system, ang target ay magkaroon muna ng humigit-kumulang anim na buwang discipline history bago gamitin ang borrow-and-return cycle.</p></article>
      <article><b>04 · MULTIPLY</b><h3>Borrow with a productive purpose.</h3><p>Kapag handa na ang system, maaaring humiram mula sa sariling reserve para sa malinaw at responsible na purpose—lalo na sa activity na may kakayahang lumikha o magpalago ng resources.</p></article>
      <article><b>05 · RETURN</b><h3>Pay principal + internal interest.</h3><p>Ang hiniram ay ibinabalik kasama ang napagkasunduang internal interest. Sa halip na lumabas ang growth sa system, bumabalik ito sa sariling resource base.</p></article>
      <article><b>06 · COMPOUND</b><h3>Repeat with greater capacity.</h3><p>Kapag naibalik ang principal at interest, lumalaki ang controlled capital. Ang goal ay hindi mabilisang pera kundi mas matibay na capacity sa bawat responsible cycle.</p></article>
    </div>
    <div class="dpbs-purpose-box">
      <div><small>THE PURPOSE OF DPBS</small><h3>From income dependence to resource stewardship.</h3></div>
      <p>Income → Allocate → Accumulate → Control → Productive Use → Return + Interest → Compound → Repeat. Ang sukatan ng progreso ay hindi lang laki ng balance, kundi discipline, control, productive use at kakayahang mag-steward ng mas malaking resources.</p>
    </div>
    <div class="dpbs-warning"><strong>Important:</strong> Ang DPBS ay educational personal resource-management framework. Hindi ito bangko, deposit product, investment product, emergency fund, o garantiya ng financial return. Panatilihing hiwalay ang emergency savings at huwag humiram mula sa DPBS para lamang sa consumption.</div>`;
  ledger.insertAdjacentElement('afterend',guide);
}
const observer=new MutationObserver(()=>mountGuide());
observer.observe(document.documentElement,{childList:true,subtree:true});
mountGuide();

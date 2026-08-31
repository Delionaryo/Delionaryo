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
      <p>Ang DPBS ay hindi ordinaryong savings account. Ito ay personal resource-management system na nagtuturo kung paano mag-ipon ng controlled capital, protektahan ito, gamitin nang may malinaw na purpose, at unti-unting palaguin sa pamamagitan ng responsible multiplication.</p>
    </div>
    <div class="dpbs-reading-grid">
      <article><b>01 · ACCUMULATE</b><h3>Build your resource base.</h3><p>Magsimula sa consistent allocation mula sa income. Ang unang layunin ay bumuo ng sariling controlled resources bago isipin ang multiplication.</p></article>
      <article><b>02 · CONTROL</b><h3>Separate it from spending money.</h3><p>Ang DPBS resources ay hindi extra cash para gastusin. May sariling purpose, record at discipline ito upang hindi bumalik sa uncontrolled money flow.</p></article>
      <article><b>03 · PREPARE</b><h3>Build discipline before borrowing.</h3><p>Ang unang mga buwan ay accumulation at control phase. Sa DELIONARYO system, ang target ay magkaroon muna ng humigit-kumulang anim na buwang discipline history bago gamitin ang borrow-and-return cycle.</p></article>
      <article><b>04 · MULTIPLY</b><h3>Borrow with a productive purpose.</h3><p>Kapag handa na ang system, maaaring humiram mula sa sariling reserve para sa malinaw at responsible na purpose—lalo na sa activity na may kakayahang lumikha o magpalago ng resources.</p></article>
      <article><b>05 · RETURN</b><h3>Pay principal + internal interest.</h3><p>Ang hiniram ay ibinabalik kasama ang napagkasunduang internal interest. Sa halip na lumabas ang growth sa system, bumabalik ito sa sariling resource base.</p></article>
      <article><b>06 · COMPOUND</b><h3>Repeat with greater capacity.</h3><p>Kapag naibalik ang principal at interest, lumalaki ang controlled capital. Ang goal ay hindi mabilisang pera kundi mas matibay na capacity sa bawat responsible cycle.</p></article>
    </div>
    <div class="dpbs-purpose-box">
      <div><small>THE PURPOSE OF DPBS</small><h3>From income dependence to resource stewardship.</h3></div>
      <p>Income → Allocate → Accumulate → Control → Productive Use → Return + Interest → Compound → Repeat. Ang sukatan ng progreso ay hindi lang laki ng balance, kundi discipline, control, productive use at kakayahang mag-steward ng mas malaking resources.</p>
    </div>
    <div class="dpbs-warning"><strong>Important:</strong> Ang DPBS ay educational personal resource-management framework. Hindi ito bangko, deposit product, investment product, o garantiya ng financial return. Huwag humiram para lamang sa consumption o para piliting kumita ang pera.</div>`;
  ledger.insertAdjacentElement('afterend',guide);
}
const observer=new MutationObserver(()=>mountGuide());
observer.observe(document.documentElement,{childList:true,subtree:true});
mountGuide();

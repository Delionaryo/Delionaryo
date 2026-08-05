type JourneyDay = {
  day: string;
  pillar: string;
  focus: string;
  action: string;
  reflection: string;
};

const journey: JourneyDay[] = [
  { day: 'Sunday', pillar: "FULL M.O.N.E.Y'S TRANSFORMATION", focus: 'Connect the complete journey from Mind to Stewardship.', action: 'Review the week and choose one measurable financial improvement for the next seven days.', reflection: 'Which pillar needs the most attention this week?' },
  { day: 'Monday', pillar: 'MIND', focus: 'Financial awareness, thinking and beliefs.', action: 'Identify one money belief that is keeping you in survival mode and rewrite it into a useful principle.', reflection: 'What belief about money must change first?' },
  { day: 'Tuesday', pillar: 'ORIENTATION / HEART', focus: 'Values, priorities and financial direction.', action: 'Choose your top three financial priorities and remove one expense or habit that conflicts with them.', reflection: 'Does your spending reflect what you say matters most?' },
  { day: 'Wednesday', pillar: 'NARRATIVE / WORD', focus: 'Financial language, identity and your money story.', action: 'Replace one limiting money statement with a specific action statement you can execute today.', reflection: 'What financial story are your words reinforcing?' },
  { day: 'Thursday', pillar: 'EXECUTION', focus: 'Turn financial knowledge into consistent action.', action: 'Complete one concrete money task today: budget, save, pay debt, create an offer or pursue an income opportunity.', reflection: 'What did you actually execute—not just learn?' },
  { day: 'Friday', pillar: 'YIELD / RESULTS', focus: 'Measure outcomes, progress and financial results.', action: 'Record one number that matters: savings, debt reduction, income, expenses or capital created this week.', reflection: 'What measurable result did your actions produce?' },
  { day: 'Saturday', pillar: 'STEWARDSHIP', focus: 'Manage, protect and grow what you produce.', action: 'Review where your money went this week and intentionally assign the next peso before spending it.', reflection: 'Are you controlling your resources or are they controlling you?' },
];

const today = journey[new Date().getDay()];
const host = document.querySelector<HTMLElement>('#today');

if (host) {
  const card = document.createElement('div');
  card.className = 'mt-8 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-stone-900 p-6 md:p-8';
  card.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div><p class="text-amber-400 font-black tracking-widest text-sm">TODAY • ${today.day.toUpperCase()}</p><h3 class="mt-2 text-3xl md:text-4xl font-black">${today.pillar}</h3></div>
      <span id="daily-status" class="rounded-full border border-stone-700 px-4 py-2 text-sm font-bold text-stone-400">NOT COMPLETED</span>
    </div>
    <p class="mt-4 text-lg text-stone-300">${today.focus}</p>
    <div class="mt-6 grid md:grid-cols-2 gap-4">
      <div class="rounded-2xl bg-stone-950 p-5"><p class="text-sm font-black text-amber-400">TODAY'S EXECUTION</p><p class="mt-2 text-stone-300 leading-7">${today.action}</p></div>
      <div class="rounded-2xl bg-stone-950 p-5"><p class="text-sm font-black text-amber-400">REFLECTION</p><p class="mt-2 text-stone-300 leading-7">${today.reflection}</p></div>
    </div>
    <button id="complete-daily" class="mt-6 rounded-xl bg-amber-400 px-6 py-4 font-black text-stone-950 hover:bg-amber-300 transition">MARK TODAY COMPLETE ✓</button>
  `;
  const intro = host.querySelector('p.mt-4');
  intro?.insertAdjacentElement('afterend', card);

  const dateKey = new Date().toISOString().slice(0, 10);
  const storageKey = `delionaryo_progress_${dateKey}`;
  const button = card.querySelector<HTMLButtonElement>('#complete-daily')!;
  const status = card.querySelector<HTMLElement>('#daily-status')!;

  const renderComplete = () => {
    status.textContent = 'COMPLETED ✓';
    status.className = 'rounded-full border border-amber-500/40 bg-amber-400/10 px-4 py-2 text-sm font-black text-amber-300';
    button.textContent = 'TODAY COMPLETED ✓';
    button.disabled = true;
    button.className = 'mt-6 rounded-xl border border-amber-500/30 bg-stone-800 px-6 py-4 font-black text-amber-300';
  };

  if (localStorage.getItem(storageKey) === 'complete') renderComplete();
  button.addEventListener('click', () => {
    localStorage.setItem(storageKey, 'complete');
    const total = Number(localStorage.getItem('delionaryo_total_completed') || '0') + 1;
    localStorage.setItem('delionaryo_total_completed', String(total));
    renderComplete();
  });

  const progress = document.createElement('div');
  progress.className = 'mt-5 rounded-2xl border border-stone-800 bg-stone-950 p-5 flex flex-wrap items-center justify-between gap-3';
  const total = Number(localStorage.getItem('delionaryo_total_completed') || '0');
  progress.innerHTML = `<div><p class="text-sm font-black text-stone-500 tracking-widest">MY PROGRESS</p><p class="mt-1 text-xl font-black">${total} daily transformation${total === 1 ? '' : 's'} completed</p></div><p class="text-sm text-stone-500">Progress is saved on this device. Account-based progress is coming next.</p>`;
  card.insertAdjacentElement('afterend', progress);
}

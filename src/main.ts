import './styles.css';
const pay = 'https://pm.link/org-X97pkZ9v7uKBjxNAvYsmuL37/ttJb7q0';
const youtube = 'https://www.youtube.com/channel/UC8tBAhLFySPo7vp9cBUh4fA';
const tiktok = 'https://www.tiktok.com/@rrl6980?_r=1&_t=ZS-98clQNSR9KH';
const facebook = 'https://www.facebook.com/Delionaryo09';
const app = document.querySelector<HTMLDivElement>('#app')!;

const lessons = [
  { id:'2KNvsRzkrZE', label:'EXCLUSIVE LESSON 01', title:'DELIONARYO Transformation Lesson 1' },
  { id:'0Y22DDoZQu0', label:'EXCLUSIVE LESSON 02', title:'DELIONARYO Transformation Lesson 2' }
];

const days = [
  { day:'MONDAY', theme:'POOR', title:'See the System', learn:'Identify one money pattern keeping you in survival mode.', action:'Write one expense, habit, or decision you will change this week.' },
  { day:'TUESDAY', theme:'BLIND', title:'Gain Financial Clarity', learn:'Look clearly at where your money comes from and where it goes.', action:'Record today’s income and every expense.' },
  { day:'WEDNESDAY', theme:'SLAVE', title:'Break the Cycle', learn:'Recognize obligations and habits that control your choices.', action:'Choose one unnecessary financial obligation to reduce or remove.' },
  { day:'THURSDAY', theme:'OPPRESSED', title:'Build Capacity', learn:'Transformation grows when knowledge becomes useful skill and action.', action:'Spend 20 focused minutes improving one income-producing skill.' },
  { day:'FRIDAY', theme:'KINGDOM', title:'Practice Stewardship', learn:'Treat resources as something to manage wisely, intentionally, and responsibly.', action:'Set aside a portion of today’s resources before spending the rest.' },
  { day:'SATURDAY', theme:'ACTION', title:'Execute the Plan', learn:'Progress requires measurable execution, not information alone.', action:'Complete one financial task you have been postponing.' },
  { day:'SUNDAY', theme:'REFLECTION', title:'Measure and Improve', learn:'Review creates awareness; awareness improves the next decision.', action:'Write one win, one lesson, and one adjustment for next week.' }
];

const saved = JSON.parse(localStorage.getItem('delionaryo-week') || '{}') as Record<string, boolean>;
const journeyCards = days.map((d,i) => `<article class="journey-card ${saved[d.day] ? 'completed' : ''}" data-day="${d.day}"><div class="journey-top"><span>DAY ${i+1}</span><b>${d.day} · ${d.theme}</b></div><h3>${d.title}</h3><div class="lesson"><strong>LEARN</strong><p>${d.learn}</p></div><div class="lesson"><strong>ACTION</strong><p>${d.action}</p></div><button class="complete-btn" data-complete="${d.day}">${saved[d.day] ? '✓ COMPLETED' : 'MARK COMPLETE'}</button></article>`).join('');
const lessonButtons = lessons.map((lesson, index) => `<button data-video-index="${index}" class="video-select w-full rounded-2xl border border-white/10 bg-stone-950 p-5 text-left transition hover:border-amber-400/50"><span class="text-xs font-black tracking-widest text-amber-400">${lesson.label}</span><h3 class="mt-2 text-lg font-black">${lesson.title}</h3><p class="mt-2 text-sm text-stone-400">Play inside DELIONARYO →</p></button>`).join('');

app.innerHTML = `
<main class="min-h-screen bg-stone-950 text-stone-100">
  <nav class="sticky top-0 z-50 border-b border-white/10 bg-stone-950/90 backdrop-blur"><div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><a href="#top" class="font-black tracking-[.18em] text-amber-400">DELIONARYO</a><div class="hidden gap-6 text-sm font-bold text-stone-300 md:flex"><a href="#system">SYSTEM</a><a href="#journey">JOURNEY</a><a href="#learning">LEARN</a><a href="#mission">MISSION</a><a href="#store">EBOOK</a><a href="#social-channels">SOCIAL</a></div><a href="#journey" class="rounded-lg bg-amber-400 px-4 py-2 text-sm font-black text-stone-950">START</a></div></nav>
  <section id="top" class="hero-grid border-b border-white/10"><div class="mx-auto max-w-6xl px-5 py-24 md:py-32"><p class="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-black tracking-widest text-amber-300">DELIONARYO TRANSFORMATION PLATFORM</p><h1 class="mt-7 max-w-5xl text-5xl font-black leading-[.95] md:text-7xl">Be One in a Million.<br><span class="text-amber-400">Graduate From Poverty.</span></h1><p class="mt-7 max-w-2xl text-lg leading-8 text-stone-300">Learn, execute, measure your results, and grow in stewardship. A practical transformation platform built to help Filipinos move from survival toward stability, ownership, and sovereignty.</p><div class="mt-9 flex flex-wrap gap-3"><a href="#journey" class="rounded-xl bg-amber-400 px-6 py-4 font-black text-stone-950">START MY TRANSFORMATION →</a><a href="#mission" class="rounded-xl border border-white/20 px-6 py-4 font-black">SEE THE 1 MILLION MISSION</a></div></div></section>
  <section id="mission" class="mx-auto max-w-6xl px-5 py-20"><p class="text-xs font-black tracking-[.25em] text-amber-400">OUR NORTH STAR</p><div class="mt-5 grid gap-8 md:grid-cols-2 md:items-end"><h2 class="text-4xl font-black md:text-5xl">1,000,000 Filipinos moving toward financial transformation.</h2><p class="text-lg leading-8 text-stone-400">DELIONARYO exists to turn knowledge into disciplined action. The goal is not merely inspiration—it is measurable personal transformation.</p></div><div class="mt-12 grid gap-4 md:grid-cols-3"><div class="card"><b>LEARN</b><p>Understand the principles and systems behind transformation.</p></div><div class="card"><b>EXECUTE</b><p>Turn lessons into practical daily and weekly actions.</p></div><div class="card"><b>MEASURE</b><p>Track progress, improve decisions, and build momentum.</p></div></div></section>
  <section id="system" class="border-y border-white/10 bg-stone-900/40"><div class="mx-auto max-w-6xl px-5 py-20"><p class="text-xs font-black tracking-[.25em] text-amber-400">THE TRANSFORMATION SYSTEM</p><h2 class="mt-4 text-4xl font-black">M.O.N.E.Y Transformation</h2><div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><div class="step"><span>M</span><b>Mind</b><p>Transform how you think.</p></div><div class="step"><span>O</span><b>Orientation</b><p>Align heart and direction.</p></div><div class="step"><span>N</span><b>Narrative</b><p>Change the words and story.</p></div><div class="step"><span>E</span><b>Execution</b><p>Move through disciplined action.</p></div><div class="step"><span>Y</span><b>Yield</b><p>Measure real results.</p></div></div></div></section>
  <section id="journey" class="mx-auto max-w-6xl px-5 py-20"><div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p class="text-xs font-black tracking-[.25em] text-amber-400">7-DAY TRANSFORMATION JOURNEY</p><h2 class="mt-4 text-4xl font-black md:text-5xl">Learn. Act. Complete. Measure.</h2><p class="mt-4 max-w-2xl leading-7 text-stone-400">Complete one focused transformation lesson each day. Your progress is saved on this device.</p></div><div class="progress-box"><b id="progress-count">0 / 7 COMPLETE</b><div class="progress-track"><span id="progress-bar"></span></div></div></div><div class="journey-grid">${journeyCards}</div></section>
  <section id="learning" class="border-y border-white/10 bg-stone-900/40"><div class="mx-auto max-w-6xl px-5 py-20"><p class="text-xs font-black tracking-[.25em] text-amber-400">DELIONARYO LEARNING CENTER</p><h2 class="mt-4 text-4xl font-black md:text-5xl">Watch Inside DELIONARYO.</h2><p class="mt-4 max-w-3xl leading-7 text-stone-400">Exclusive transformation lessons play directly inside the DELIONARYO platform. Choose a lesson below and keep learning without leaving the platform.</p><div class="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]"><div class="overflow-hidden rounded-3xl border border-amber-400/20 bg-black shadow-2xl"><div class="relative w-full" style="padding-top:56.25%"><iframe id="learning-player" class="absolute inset-0 h-full w-full" src="https://www.youtube-nocookie.com/embed/${lessons[0].id}?rel=0&playsinline=1" title="DELIONARYO Exclusive Transformation Lesson" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="border-t border-white/10 p-6"><span id="lesson-label" class="text-xs font-black tracking-widest text-amber-400">${lessons[0].label}</span><h3 id="lesson-title" class="mt-2 text-2xl font-black">${lessons[0].title}</h3><p class="mt-2 text-stone-400">Watch the complete lesson here, then continue your transformation journey inside DELIONARYO.</p></div></div><div class="space-y-3">${lessonButtons}</div></div></div></section>
  <section id="store" class="mx-auto max-w-6xl px-5 py-20"><div class="overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-stone-900 to-stone-950 p-8 md:p-12"><p class="text-xs font-black tracking-[.25em] text-amber-400">DELIONARYO EBOOK STORE</p><div class="mt-5 grid gap-10 md:grid-cols-2 md:items-center"><div><h2 class="text-4xl font-black">From Survival to <span class="text-amber-400">Stability</span></h2><p class="mt-4 leading-7 text-stone-400">A practical starting guide for moving beyond survival mode.</p></div><div class="rounded-2xl border border-white/10 bg-black/30 p-6"><p class="text-4xl font-black text-amber-400">₱99</p><p class="mt-1 text-stone-400">Digital eBook</p><button id="paid-buy" class="mt-6 w-full rounded-xl bg-amber-400 px-6 py-4 font-black text-stone-950">BUY SECURELY WITH PAYMONGO →</button></div></div></div></section>
  <section id="social-channels" class="border-t border-amber-500/20 bg-stone-900"><div class="mx-auto max-w-6xl px-5 py-16 text-center"><p class="text-sm font-black tracking-widest text-amber-400">FOLLOW DELIONARYO</p><h2 class="mt-3 text-4xl font-black md:text-5xl">Continue Your Transformation.</h2><p class="mx-auto mt-4 max-w-3xl text-lg leading-8 text-stone-400">Follow DELIONARYO for financial transformation lessons, practical guidance, short-form education and new videos.</p><div class="mt-8 flex flex-wrap justify-center gap-4"><a href="${youtube}" target="_blank" rel="noopener noreferrer" class="rounded-xl bg-amber-400 px-8 py-4 font-black text-stone-950">YOUTUBE →</a><a href="${tiktok}" target="_blank" rel="noopener noreferrer" class="rounded-xl border border-amber-400 px-8 py-4 font-black text-amber-400">TIKTOK →</a><a href="${facebook}" target="_blank" rel="noopener noreferrer" class="rounded-xl border border-amber-400 px-8 py-4 font-black text-amber-400">FACEBOOK →</a></div></div></section>
  <footer class="border-t border-white/10 px-5 py-8 text-center text-sm text-stone-500">© 2026 DELIONARYO · Transformation through knowledge, execution and stewardship.</footer>
</main>`;

document.querySelector<HTMLButtonElement>('#paid-buy')?.addEventListener('click', () => { window.location.href = pay; });

document.querySelectorAll<HTMLButtonElement>('[data-video-index]').forEach(button => button.addEventListener('click', () => {
  const lesson = lessons[Number(button.dataset.videoIndex)];
  if (!lesson) return;
  const player = document.querySelector<HTMLIFrameElement>('#learning-player');
  const label = document.querySelector<HTMLElement>('#lesson-label');
  const title = document.querySelector<HTMLElement>('#lesson-title');
  if (player) player.src = `https://www.youtube-nocookie.com/embed/${lesson.id}?rel=0&playsinline=1&autoplay=1`;
  if (label) label.textContent = lesson.label;
  if (title) title.textContent = lesson.title;
  document.querySelector('#learning-player')?.scrollIntoView({ behavior:'smooth', block:'center' });
}));

const updateProgress = () => {
  const state = JSON.parse(localStorage.getItem('delionaryo-week') || '{}') as Record<string, boolean>;
  const complete = days.filter(d => state[d.day]).length;
  const count = document.querySelector<HTMLElement>('#progress-count');
  const bar = document.querySelector<HTMLElement>('#progress-bar');
  if (count) count.textContent = `${complete} / 7 COMPLETE`;
  if (bar) bar.style.width = `${(complete / 7) * 100}%`;
};

document.querySelectorAll<HTMLButtonElement>('[data-complete]').forEach(button => button.addEventListener('click', () => {
  const day = button.dataset.complete!;
  const state = JSON.parse(localStorage.getItem('delionaryo-week') || '{}') as Record<string, boolean>;
  state[day] = !state[day];
  localStorage.setItem('delionaryo-week', JSON.stringify(state));
  button.textContent = state[day] ? '✓ COMPLETED' : 'MARK COMPLETE';
  button.closest('.journey-card')?.classList.toggle('completed', state[day]);
  updateProgress();
}));
updateProgress();

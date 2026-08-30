const memberDashboard = document.createElement('section');
memberDashboard.id = 'member-dashboard';
memberDashboard.className = 'mx-auto max-w-6xl px-5 py-20';
memberDashboard.innerHTML = `
<div class="rounded-3xl border border-amber-400/20 bg-stone-900 p-8">
<p class="text-xs font-black tracking-[.25em] text-amber-400">MY DELIONARYO JOURNEY</p>
<h2 class="mt-3 text-4xl font-black">Personal Transformation Dashboard</h2>
<div class="mt-8 grid gap-4 md:grid-cols-3">
<div class="card"><b>MEMBER ID</b><p>Loading personal identity...</p></div>
<div class="card"><b>AI COACH</b><p>Personal coaching access</p></div>
<div class="card"><b>JOURNEY</b><p>Survival → Stability → Growth → Wealth Creation</p></div>
</div>
<div class="mt-6 grid gap-4 md:grid-cols-2">
<div class="card"><b>LEARNING PROGRESS</b><p>Courses, eBooks and workbook records</p></div>
<div class="card"><b>DPBS</b><p>Money Flow, Expenses and Resource Multiplication</p></div>
</div>
</div>`;

export default memberDashboard;

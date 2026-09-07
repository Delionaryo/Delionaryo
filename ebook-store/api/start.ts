export default function handler(_req:any,res:any){
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=300, s-maxage=600');
  res.status(200).send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="theme-color" content="#071015"/>
<title>DELIONARYO — From Mind to Steward</title>
<meta name="description" content="DELIONARYO is a connected financial-transformation ecosystem that moves people from learning to execution, growth and stewardship."/>
<style>
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#071015;color:#f7f4ec;--gold:#d9aa3c;--muted:#aebdc0;--card:#0b171c;--line:rgba(255,255,255,.08)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;background:radial-gradient(circle at 20% 0,rgba(217,170,60,.13),transparent 35rem),linear-gradient(180deg,#071015,#08141a 55%,#050b0e)}a{text-decoration:none}.wrap{width:min(1120px,calc(100% - 32px));margin:auto}.nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0;gap:12px}.brand{display:flex;align-items:center;gap:12px;font-weight:950;letter-spacing:.15em}.mark{width:44px;height:44px;border:1px solid #b68a31;border-radius:14px;display:grid;place-items:center;color:#e0b75c;font-size:22px}.nav a{color:#f7f4ec;font-weight:850;border:1px solid rgba(217,170,60,.35);padding:11px 15px;border-radius:11px}.hero{padding:72px 0 54px;display:grid;grid-template-columns:1.12fr .88fr;gap:28px;align-items:center}.eyebrow,.kicker{color:var(--gold);font-weight:900;letter-spacing:.2em;font-size:12px}.hero h1{font-size:clamp(48px,8vw,86px);line-height:.94;letter-spacing:-.045em;margin:18px 0}.hero h1 span{color:var(--gold)}.lead{font-size:clamp(18px,2.4vw,23px);line-height:1.65;color:#c4ced0;max-width:760px}.mission{font-size:clamp(20px,3vw,30px);font-weight:900;line-height:1.2;margin:22px 0 0}.mission span{color:var(--gold)}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.primary,.secondary{display:inline-block;padding:15px 20px;border-radius:13px;font-weight:950}.primary{background:var(--gold);color:#0e1215}.secondary{border:1px solid rgba(217,170,60,.45);color:#f4d99e}.panel{border:1px solid rgba(217,170,60,.28);background:rgba(9,24,29,.82);border-radius:24px;padding:24px;box-shadow:0 26px 70px rgba(0,0,0,.28)}.panel small{color:var(--gold);font-weight:900;letter-spacing:.15em}.panel h2{margin:10px 0 16px;font-size:27px}.flow{display:grid;gap:10px}.step{display:grid;grid-template-columns:38px 1fr;gap:12px;align-items:start;padding:12px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}.num{width:34px;height:34px;border-radius:10px;background:#112126;color:var(--gold);display:grid;place-items:center;font-weight:950}.step b{display:block}.step span{display:block;color:#96a7aa;font-size:14px;margin-top:3px;line-height:1.5}.section{padding:56px 0}.section+.section{border-top:1px solid var(--line)}.section h2{font-size:clamp(32px,5vw,52px);margin:8px 0 12px;letter-spacing:-.025em}.section .intro{color:var(--muted);line-height:1.75;font-size:18px;max-width:860px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:26px}.card{border:1px solid var(--line);background:var(--card);border-radius:18px;padding:21px}.card b{font-size:19px}.card p{margin:9px 0 0;color:#9eafb2;font-size:15px;line-height:1.65}.journey{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:26px}.journey .stage{border:1px solid rgba(217,170,60,.18);background:linear-gradient(180deg,rgba(217,170,60,.07),rgba(255,255,255,.02));border-radius:16px;padding:18px}.stage strong{display:block;color:var(--gold);font-size:14px;letter-spacing:.08em}.stage b{display:block;font-size:20px;margin-top:7px}.stage p{color:#9eafb2;line-height:1.55;font-size:14px}.principles{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:24px}.principle{border:1px solid var(--line);border-radius:16px;padding:18px;background:#0a151a}.principle strong{font-size:29px;color:var(--gold);display:block}.principle b{display:block;margin-top:6px}.principle span{display:block;color:#94a6a9;font-size:13px;margin-top:4px;line-height:1.45}.notice{border:1px solid rgba(217,170,60,.28);background:rgba(217,170,60,.055);border-radius:18px;padding:20px;color:#cbd4d5;line-height:1.65;margin-top:26px}.cta{padding:62px 0;text-align:center}.cta h2{font-size:clamp(34px,6vw,58px);margin:8px auto 14px;max-width:850px}.cta p{color:#aebdc0;line-height:1.7;max-width:760px;margin:0 auto 24px}.footer{border-top:1px solid var(--line);padding:26px 0 34px;color:#809195;font-size:13px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}@media(max-width:900px){.hero{grid-template-columns:1fr}.journey{grid-template-columns:repeat(2,1fr)}.principles{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.hero{padding-top:40px}.grid,.journey,.principles{grid-template-columns:1fr}.nav{align-items:flex-start}.brand{letter-spacing:.08em}.nav a{font-size:12px;padding:10px 12px}.hero h1{font-size:clamp(46px,14vw,68px)}.section{padding:44px 0}}
</style>
</head>
<body>
<div class="wrap">
<nav class="nav"><div class="brand"><span class="mark">D</span><span>DELIONARYO</span></div><a href="https://hub.gapcreation.space/">MEMBER LOGIN</a></nav>
<main>
<section class="hero">
<div>
<div class="eyebrow">DELIONARYO · FROM MIND TO STEWARD</div>
<h1>Learn. Apply.<br><span>Build. Steward.</span></h1>
<p class="lead">DELIONARYO is a connected transformation ecosystem built to help people move from financial survival into understanding, disciplined action, income creation, multiplication and responsible stewardship.</p>
<p class="mission">Be One in a Million. <span>Graduate From Poverty.</span></p>
<div class="actions"><a class="primary" href="https://hub.gapcreation.space/?signup=1">CREATE ACCOUNT AND GET YOUR FREE EBOOK →</a><a class="secondary" href="#ecosystem">EXPLORE THE ECOSYSTEM</a></div>
</div>
<aside class="panel"><small>OFFICIAL ACCESS FLOW</small><h2>Free account. One Hub. Protected ownership.</h2><div class="flow">
<div class="step"><div class="num">1</div><div><b>Create Your Free Account</b><span>Tap the button and register directly in the DELIONARYO Hub. No activation code is required.</span></div></div>
<div class="step"><div class="num">2</div><div><b>Enter Your Member Hub</b><span>Your Hub is the single gateway to the connected DELIONARYO ecosystem.</span></div></div>
<div class="step"><div class="num">3</div><div><b>Open Learning Campus</b><span>Your free eBook is already available there under Your Free eBook.</span></div></div>
<div class="step"><div class="num">4</div><div><b>Grow Your Access</b><span>Verified purchases connect automatically to the same account and unlock eligible paid content and features.</span></div></div>
</div></aside>
</section>

<section class="section" id="ecosystem">
<div class="kicker">THE DELIONARYO ECOSYSTEM</div>
<h2>Education must lead to execution.</h2>
<p class="intro">DELIONARYO is not designed to stop at information. The system connects learning, financial diagnostics, resource control, marketplace execution, measurement and community so a member has a practical path after learning.</p>
<div class="grid">
<article class="card"><b>Money Transformation</b><p>Build the foundation from Mind to Steward: truth, commitment, disciplined execution, results and responsible stewardship.</p></article>
<article class="card"><b>Learning Campus</b><p>Turn principles into structured lessons, guided application and continuing financial transformation.</p></article>
<article class="card"><b>Financial Tools</b><p>Use diagnostics, calculators, trackers and guided systems to understand money flow and make better decisions.</p></article>
<article class="card"><b>DPBS</b><p>Build controlled resources for multiplication and financial sovereignty instead of leaving resources without direction.</p></article>
<article class="card"><b>Marketplace Execution</b><p>Apply what you learn through real selling, promotion, service and economic activity inside the ecosystem.</p></article>
<article class="card"><b>DELIONARYO Nation</b><p>Connect with members, communicate, learn together and build a community around transformation and stewardship.</p></article>
</div>
</section>

<section class="section">
<div class="kicker">THE TRANSFORMATION JOURNEY</div>
<h2>From survival to stewardship.</h2>
<p class="intro">The goal is not simply to know more about money. The goal is to transform the way a person thinks, acts, measures progress and manages resources until learning becomes real financial capability.</p>
<div class="journey">
<div class="stage"><strong>STAGE 01</strong><b>Survival</b><p>Recognize the financial reality, money patterns and root problems that keep resources unstable.</p></div>
<div class="stage"><strong>STAGE 02</strong><b>Stability</b><p>Build control, discipline, structure and dependable money-flow habits.</p></div>
<div class="stage"><strong>STAGE 03</strong><b>Growth</b><p>Create, earn, sell, promote and multiply resources through practical execution.</p></div>
<div class="stage"><strong>STAGE 04</strong><b>Stewardship</b><p>Use resources with purpose, responsibility, measurement and long-term direction.</p></div>
</div>
</section>

<section class="section">
<div class="kicker">LEARN · EXECUTE · MEASURE · GROW</div>
<h2>A system that gives the learner somewhere to go next.</h2>
<p class="intro">Learning Campus provides the education. Financial tools help diagnose and plan. DPBS supports resource control and multiplication. Marketplace provides a place to execute. Wallet records movement. Tracker provides evidence. The Hub connects the ecosystem into one member portal.</p>
<div class="grid">
<article class="card"><b>Learn</b><p>Understand the principles and the reason behind each financial decision.</p></article>
<article class="card"><b>Execute</b><p>Apply the lesson through selling, earning, building, promoting and managing real resources.</p></article>
<article class="card"><b>Measure</b><p>Use records, balances, transaction history and tracking to see actual evidence of progress.</p></article>
</div>
</section>

<section class="section">
<div class="kicker">D.E.L.I.O. CORE PRINCIPLES</div>
<h2>Transformation requires character, not information alone.</h2>
<div class="principles">
<div class="principle"><strong>D</strong><b>Discipline</b><span>Do what must be done consistently.</span></div>
<div class="principle"><strong>E</strong><b>Excellence</b><span>Raise the quality of thinking and execution.</span></div>
<div class="principle"><strong>L</strong><b>Leadership</b><span>Take responsibility and create direction.</span></div>
<div class="principle"><strong>I</strong><b>Integrity</b><span>Build trust through truthful stewardship.</span></div>
<div class="principle"><strong>O</strong><b>Obedience</b><span>Follow sound principles even before results appear.</span></div>
</div>
</section>

<section class="section">
<div class="kicker">THE MISSION</div>
<h2>Help 1,000,000 people move toward financial transformation.</h2>
<p class="intro">DELIONARYO exists to create a practical bridge from education to execution. The mission is bigger than a lesson, an ebook or an app. It is a connected path where a person can learn, apply, build, earn, measure, grow and steward.</p>
<div class="notice"><b>Financial education notice:</b> DELIONARYO provides educational tools, learning frameworks and ecosystem utilities. It does not guarantee income, profit, investment returns or financial outcomes. Results depend on each member's decisions, effort, circumstances and responsible use of the system.</div>
</section>

<section class="cta">
<div class="kicker">START THE JOURNEY</div>
<h2>From Mind to Steward starts with one account.</h2>
<p>Create your free DELIONARYO account directly in the Hub. From there, open the Learning Campus and access Your Free eBook. Verified purchases will connect automatically to the same member account.</p>
<div class="actions" style="justify-content:center"><a class="primary" href="https://hub.gapcreation.space/?signup=1">CREATE ACCOUNT AND GET YOUR FREE EBOOK →</a><a class="secondary" href="https://hub.gapcreation.space/">MEMBER LOGIN →</a></div>
</section>
</main>
<footer class="footer"><span>© 2026 DELIONARYO</span><span>Education → Execution → Transformation → Stewardship</span></footer>
</div>
</body>
</html>`)
}

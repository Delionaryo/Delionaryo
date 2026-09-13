export default async function handler(req:any,res:any){
  try{
    const host=String(req.headers?.host||'app.gapcreation.space');
    const proto=host.includes('localhost')?'http':'https';
    const source=await fetch(`${proto}://${host}/legacy-start.html`,{headers:{'User-Agent':'DELIONARYO-Start-V2'}});
    if(!source.ok) throw new Error(`Start source unavailable: ${source.status}`);
    let html=await source.text();

    html=html.replace('<title>DELIONARYO — From Mind to Steward</title>','<title>DELIONARYO — Start Free</title>');
    html=html.replace('<meta name="description" content="Official DELIONARYO public entry and account creation page."/>','<meta name="description" content="Create your free DELIONARYO account, download DELIONARYO Economy, get your FREE M.O.N.E.Y’S Transformation Ebook inside the Academy, and explore free financial and business tools."/>');

    html=html.replace('<div class="eyebrow">DELIONARYO · FROM MIND TO STEWARD</div>','<div class="eyebrow">DELIONARYO ECONOMY · FREE ACCESS</div>');
    html=html.replace('<h1>Learn. Apply.<br><span>Build. Steward.</span></h1>','<h1>Start Your DELIONARYO Economy.<br><span>Free.</span></h1>');
    html=html.replace('<p class="lead">DELIONARYO is a connected transformation ecosystem built to help people move from financial survival into understanding, disciplined action, income creation, multiplication and responsible stewardship.</p>','<p class="lead">Create your free account and download <strong>DELIONARYO Economy</strong> to get your <strong>FREE M.O.N.E.Y’S Transformation Ebook</strong> inside the <strong>Academy</strong>—plus access to free financial, business, marketplace and learning tools across the DELIONARYO ecosystem.</p>');
    html=html.replace('INSTALL DELIONARYO ECONOMY →','DOWNLOAD DELIONARYO ECONOMY →');

    html=html.replace(/<aside class="panel">[\s\S]*?<\/aside>/,'<aside class="panel"><small>START FREE</small><h2>Create. Download. Claim. Explore.</h2><div class="flow"><div class="step"><div class="num">1</div><div><b>Create Your Free Account</b><span>Start is the official DELIONARYO public registration page. Your mobile number is your primary identity.</span></div></div><div class="step"><div class="num">2</div><div><b>Download DELIONARYO Economy</b><span>Open DELIONARYO Economy after registration and use the same account you created here.</span></div></div><div class="step"><div class="num">3</div><div><b>Get Your FREE Ebook in the Academy</b><span>Access your FREE M.O.N.E.Y’S Transformation Ebook inside the Academy ebook area.</span></div></div><div class="step"><div class="num">4</div><div><b>Explore Free Tools & Opportunities</b><span>Use Money Flow, Expense Tracker, Business Calculator, Marketplace, Watch & Earn, training, communication and prompt tools from DELIONARYO Economy.</span></div></div></div></aside>');

    html=html.replace(/<div class="registerInfo">[\s\S]*?(?=<form id="startAccountForm")/,'<div class="registerInfo"><div class="kicker">CREATE YOUR FREE ACCOUNT</div><h2>Start your DELIONARYO Economy access.</h2><p>Create your account here, then download <strong>DELIONARYO Economy</strong> to get your <strong>FREE M.O.N.E.Y’S Transformation Ebook inside the Academy</strong> and explore the free tools available in the ecosystem.</p><p>Your <strong>mobile number is the primary identity</strong>. Your email is used for login, account communication and DELIONARYO educational messages. Start is for public onboarding and account creation; DELIONARYO Economy is your main app.</p></div>');

    html=html.replace(/<section class="section" id="ecosystem">[\s\S]*?<\/section>/,'<section class="section" id="ecosystem"><div class="kicker">WHAT YOU CAN ACCESS FOR FREE</div><h2>More reasons to enter DELIONARYO Economy.</h2><p class="intro">Different people enter for different needs. DELIONARYO Economy brings free learning, financial tools, business utilities, marketplace access and communication features into one ecosystem.</p><div class="grid"><article class="card"><b>FREE Ebook · Academy</b><p>Get the M.O.N.E.Y’S Transformation Ebook inside the Academy after creating your account and entering DELIONARYO Economy.</p></article><article class="card"><b>Watch & Earn</b><p>Explore Watch & Earn opportunities available inside the DELIONARYO ecosystem.</p></article><article class="card"><b>FREE Marketplace</b><p>Explore a marketplace where products, services, skills and digital offers can be presented.</p></article><article class="card"><b>Money Flow Diagnostic</b><p>Review your income, expenses, cash flow and financial direction using Money Flow.</p></article><article class="card"><b>Expense Tracker</b><p>Track where your money goes and build clearer visibility over day-to-day spending.</p></article><article class="card"><b>Business Calculator</b><p>Use practical business calculations to understand costs, pricing, margins and basic business numbers.</p></article><article class="card"><b>FREE Training Videos</b><p>Access practical learning content designed to move from understanding into application.</p></article><article class="card"><b>Video & Voice Calls</b><p>Connect through DELIONARYO communication features for learning, collaboration and community interaction.</p></article><article class="card"><b>Prompt Tools</b><p>Use prompt-based tools to support learning, ideas, productivity and practical execution.</p></article></div><div class="notice"><b>Financial education notice:</b> DELIONARYO provides educational tools, learning frameworks and ecosystem utilities. It does not guarantee income, profit, investment returns or financial outcomes.</div></section>');

    html=html.replace('Account created successfully. Continue exploring DELIONARYO from Start.','Account created successfully. Download or open DELIONARYO Economy to get your FREE ebook inside the Academy.');
    html=html.replace('Use your existing DELIONARYO account.','Use your existing DELIONARYO account in DELIONARYO Economy.');
    html=html.replace(/Learning Campus/g,'Academy');

    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(html);
  }catch(error:any){
    console.error('start-v2',error);
    res.setHeader('Location','/legacy-start.html');
    res.status(307).end();
  }
}

const APPS: Record<string, string> = {
  main: 'https://delionaryo.vercel.app',
  campus: 'https://delionaryo-learning-campus.vercel.app',
  marketplace: 'https://delionaryo-marketplace.vercel.app',
  wallet: 'https://delionaryo-wallet.vercel.app',
  income: 'https://income.gapcreation.space',
  approver: 'https://income.gapcreation.space/pending-approver-v4',
  payment: 'https://delionaryo-payment-center.vercel.app',
  nation: 'https://delionaryo-nation.vercel.app',
  dpbs: 'https://delionaryo-dpbs.vercel.app',
  tracker: 'https://delionaryo-expense-tracker.vercel.app',
  moneyflow: 'https://delionaryo-money-flow.vercel.app',
  calculator: 'https://delionaryo-business-calculator.vercel.app',
  consultant: 'https://delionaryo-dreamer-consultant.vercel.app',
  library: 'https://delionaryo-ebook-library.vercel.app',
  videofactory: 'https://delionaryo-video-factory.vercel.app',
  videouploader: 'https://delionaryo-video-uploader.vercel.app',
  ai: 'https://delionaryo-ai.vercel.app'
};

// Emergency isolation switch.
// Keep every standalone app and its URL intact, but do not allow the Hub
// to launch or redirect into any app until each app has passed health checks.
const HUB_APPS_DETACHED = true;

const CORE_SYSTEM = {
  locked: true,
  version: 1,
  roles: {
    income: 'Owner command, settlement, treasury and system control',
    approver: 'Independent pending verification and approval control',
    wallet: 'Authenticated member value, consent and execution layer'
  },
  rule: 'No value release bypass: owner/system approval and member-side execution remain separate where two-party control is required.'
};

export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  const key = String(req.query?.to || '').trim().toLowerCase();

  if (HUB_APPS_DETACHED) {
    if (!key) {
      return res.status(200).json({
        ok: true,
        service: 'DELIONARYO Integration Hub',
        version: 3,
        mode: 'ISOLATED',
        appsDetached: true,
        core: CORE_SYSTEM,
        routes: [],
        detachedApps: Object.keys(APPS),
        message: 'All standalone apps are temporarily detached from the Hub for stability testing. No app code or data has been deleted.'
      });
    }

    if (!APPS[key]) {
      return res.status(404).json({
        ok: false,
        error: 'APP_ROUTE_NOT_FOUND',
        requested: key
      });
    }

    return res.status(503).json({
      ok: false,
      error: 'APP_TEMPORARILY_DETACHED',
      requested: key,
      hubMode: 'ISOLATED',
      message: 'This app is temporarily detached from the DELIONARYO Hub while stability checks are in progress.'
    });
  }

  if (!key) {
    return res.status(200).json({
      ok: true,
      service: 'DELIONARYO Integration Hub',
      version: 3,
      mode: 'CONNECTED',
      appsDetached: false,
      core: CORE_SYSTEM,
      routes: Object.keys(APPS)
    });
  }

  const target = APPS[key];
  if (!target) {
    return res.status(404).json({
      ok: false,
      error: 'APP_ROUTE_NOT_FOUND',
      requested: key
    });
  }

  const passthrough = new URLSearchParams();
  for (const [name, value] of Object.entries(req.query || {})) {
    if (name === 'to' || value == null) continue;
    if (Array.isArray(value)) value.forEach(v => passthrough.append(name, String(v)));
    else passthrough.set(name, String(value));
  }

  const destination = passthrough.toString()
    ? `${target}${target.includes('?') ? '&' : '?'}${passthrough.toString()}`
    : target;

  return res.redirect(302, destination);
}

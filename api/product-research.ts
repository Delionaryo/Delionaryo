type RequestBody = {
  product?: string;
  platform?: string;
  affiliateLink?: string;
};

const json = (res: any, status: number, body: unknown) => res.status(status).json(body);

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const webhookUrl = process.env.N8N_PRODUCT_RESEARCH_WEBHOOK_URL;
  if (!webhookUrl) {
    return json(res, 503, {
      error: 'Product Research Agent is not connected yet.',
      code: 'N8N_PRODUCT_RESEARCH_WEBHOOK_URL_MISSING',
      next: 'Set N8N_PRODUCT_RESEARCH_WEBHOOK_URL in Vercel Environment Variables.'
    });
  }

  const body = (req.body || {}) as RequestBody;
  const product = String(body.product || '').trim();
  if (!product) return json(res, 400, { error: 'Product name or product URL is required.' });

  const payload = {
    product,
    platform: String(body.platform || 'TikTok Shop Affiliate'),
    affiliateLink: String(body.affiliateLink || '').trim(),
    source: 'DELIONARYO_AI_COMMAND_PORTAL',
    requestId: `portal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  };

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await upstream.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!upstream.ok) return json(res, upstream.status, { error: data?.error || 'Product Research Agent request failed.', upstream: data });
    return json(res, 200, { success: true, record: data?.record || data });
  } catch (error) {
    return json(res, 502, { error: error instanceof Error ? error.message : 'Unable to reach Product Research Agent.' });
  }
}

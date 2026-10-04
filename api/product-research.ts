type RequestBody = {
  product?: string;
  platform?: string;
  affiliateLink?: string;
  sourcingMode?: 'LOCAL_PH_DROPSHIPPING';
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
    platform: String(body.platform || 'LOCAL PH'),
    affiliateLink: String(body.affiliateLink || '').trim(),
    sourcingMode: 'LOCAL_PH_DROPSHIPPING',
    market: 'PH',
    fulfillmentCountry: 'PH',
    inventoryModel: 'NO_STOCK_DROPSHIPPING',
    sourcingPriority: [
      'verified Philippine dropshipping supplier',
      'local supplier with direct-to-customer fulfillment',
      'local wholesaler/distributor supporting dropshipping'
    ],
    demandEvidenceSources: ['TikTok Shop PH', 'Shopee PH', 'Lazada PH'],
    qualificationPolicy: {
      localSupplierRequired: true,
      directCustomerFulfillmentPreferred: true,
      verifiedSupplierEvidenceRequired: true,
      verifiedDemandEvidenceRequired: true,
      exactSourceUrlRequired: true,
      noFabricatedPrice: true,
      noFabricatedShipping: true,
      noFabricatedDeliveryTime: true,
      calculateLandedCost: true,
      includeAdsCostInProfitCheck: true,
      requirePositiveProfitGateBeforePublishing: true,
      preferHighDemandLowerSellerCompetition: true
    },
    requiredOutput: [
      'productName', 'category', 'supplierName', 'supplierProductUrl',
      'supplierLocation', 'supplierCost', 'shippingFee', 'landedCost',
      'marketPriceEvidence', 'sellerCompetitionEvidence', 'estimatedAdsCost',
      'regularPrice', 'sellingPrice', 'estimatedNetProfit', 'estimatedMargin',
      'deliveryEstimate', 'dropshipCapability', 'verificationStatus',
      'profitGate', 'publishRecommendation'
    ],
    destination: 'CANONICAL_PRODUCT_LIBRARY',
    publishAuthority: 'OWNER_APPROVAL_REQUIRED',
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
    return json(res, 200, {
      success: true,
      sourcingMode: 'LOCAL_PH_DROPSHIPPING',
      market: 'PH',
      record: data?.record || data
    });
  } catch (error) {
    return json(res, 502, { error: error instanceof Error ? error.message : 'Unable to reach Product Research Agent.' });
  }
}

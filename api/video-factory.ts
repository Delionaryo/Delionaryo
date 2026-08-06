const ALLOWED_COMMAND = 'START VIDEO FACTORY';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  const webhookUrl = process.env.N8N_VIDEO_FACTORY_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({
      success: false,
      error: 'Video Factory bridge is not configured. Set N8N_VIDEO_FACTORY_WEBHOOK_URL in Vercel.',
    });
  }

  const body = req.body ?? {};
  const command = body.command ?? ALLOWED_COMMAND;
  const productName = body.product_name;

  if (command !== ALLOWED_COMMAND) {
    return res.status(400).json({ success: false, error: `Invalid command. Expected: ${ALLOWED_COMMAND}` });
  }

  if (!productName || typeof productName !== 'string') {
    return res.status(400).json({ success: false, error: 'product_name is required.' });
  }

  const payload = {
    command: ALLOWED_COMMAND,
    product_name: productName,
    product_description: body.product_description ?? '',
    product_link: body.product_link ?? '',
    target_audience: body.target_audience ?? 'Filipino online shoppers',
    platform: body.platform ?? 'TikTok',
    video_goal: body.video_goal ?? 'Generate affiliate sales',
    number_of_scenes: body.number_of_scenes ?? 5,
    scene_duration: body.scene_duration ?? 10,
    language: body.language ?? 'Filipino',
    requested_at: new Date().toISOString(),
    source: 'delionaryo-vercel-bridge',
  };

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let result: unknown = text;
    try {
      result = JSON.parse(text);
    } catch {
      // n8n may return plain text while the workflow is being configured.
    }

    if (!upstream.ok) {
      return res.status(502).json({
        success: false,
        error: 'n8n Video Factory returned an error.',
        upstream_status: upstream.status,
        result,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'DELIONARYO Video Factory triggered.',
      product_name: productName,
      result,
    });
  } catch (error) {
    console.error('Video Factory bridge error:', error);
    return res.status(502).json({
      success: false,
      error: 'Unable to reach the n8n Video Factory.',
    });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing image url' });
  }

  try {
    const targetUrl = decodeURIComponent(url);
    const parsed = new URL(targetUrl);

    // Chỉ cho phép các domain tin cậy: vietqr.io, v.v.
    const allowedHosts = ['img.vietqr.io', 'api.vietqr.io', 'vietqr.net'];
    const isAllowed = allowedHosts.some((h) => parsed.hostname.endsWith(h));
    if (!isAllowed) {
      return res.status(403).json({ error: 'Domain not allowed' });
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' });
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.send(buffer);
  } catch (error) {
    console.error('Proxy image error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


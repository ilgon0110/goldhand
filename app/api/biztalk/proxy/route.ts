import type { NextRequest } from 'next/server';

const BIZTALK_API_URL = 'https://www.biztalk-api.com';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-proxy-secret');
  const expected = process.env.BIZTALK_PROXY_SECRET;

  if (!expected || !secret || secret !== expected) {
    return new Response('unauthorized', { status: 401 });
  }

  let payload: { path: string; headers?: Record<string, string>; body: unknown };
  try {
    payload = await req.json();
  } catch {
    return new Response('invalid body', { status: 400 });
  }

  if (!payload.path || typeof payload.path !== 'string') {
    return new Response('missing path', { status: 400 });
  }

  try {
    const res = await fetch(`${BIZTALK_API_URL}${payload.path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(payload.headers ?? {}),
      },
      body: JSON.stringify(payload.body),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[biztalk-proxy] error:', err);
    return new Response('proxy error', { status: 502 });
  }
}

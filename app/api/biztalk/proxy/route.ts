import type { NextRequest } from 'next/server';

const BIZTALK_API_URL = 'https://www.biztalk-api.com';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-proxy-secret');
  const expected = process.env.BIZTALK_PROXY_SECRET;

  if (!expected || !secret || secret !== expected) {
    return new Response('unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');
  const btToken = req.headers.get('x-bt-token');

  if (!path) {
    return new Response('missing path', { status: 400 });
  }

  try {
    const res = await fetch(`${BIZTALK_API_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(btToken ? { 'bt-token': btToken } : {}),
      },
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[biztalk-proxy] GET error:', err);
    return new Response('proxy error', { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-proxy-secret');
  const expected = process.env.BIZTALK_PROXY_SECRET;

  if (!expected || !secret || secret !== expected) {
    return new Response('unauthorized', { status: 401 });
  }

  let payload: {
    path: string;
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    body?: unknown;
  };
  try {
    payload = await req.json();
  } catch {
    return new Response('invalid body', { status: 400 });
  }

  if (!payload.path || typeof payload.path !== 'string') {
    return new Response('missing path', { status: 400 });
  }

  const method = payload.method ?? 'POST';

  try {
    const res = await fetch(`${BIZTALK_API_URL}${payload.path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload.headers ?? {}),
      },
      ...(method === 'POST' ? { body: JSON.stringify(payload.body) } : {}),
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

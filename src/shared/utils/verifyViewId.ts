import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { apiUrl } from '../config';
import { safeLocalStorage } from '../storage';

const HMAC_SECRET = process.env.NEXT_PUBLIC_VIEWER_SECRET!; // 안전하게 관리

function createViewerSignature(viewerId: string): string {
  return crypto.createHmac('sha256', HMAC_SECRET).update(viewerId).digest('hex');
}

export function isViewerIdValid(viewerId: string, signature: string): boolean {
  const expected = createViewerSignature(viewerId);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function hmacSHA256(value: string, secret: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const valueData = encoder.encode(value);

  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Crypto API is not available in this environment');
  }

  return window.crypto.subtle
    .importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    .then(key => window.crypto.subtle.sign('HMAC', key, valueData))
    .then(signature =>
      Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''),
    );
}

async function getOrCreateViewer() {
  const stored = safeLocalStorage.get('viewer-id');
  if (stored) return JSON.parse(stored);

  const viewerId = uuidv4();
  const signature = await hmacSHA256(viewerId, HMAC_SECRET);

  const viewer = { id: viewerId, sig: signature };
  safeLocalStorage.set('viewer-id', JSON.stringify(viewer));
  return viewer;
}

export async function sendViewLog(docId: string) {
  const viewer = await getOrCreateViewer();

  const res = await fetch(`${apiUrl}/api/viewCount`, {
    method: 'POST',
    body: JSON.stringify({
      docId,
      viewerId: viewer.id,
      signature: viewer.sig,
    }),
  });

  const data = await res.json();
  return data;
}

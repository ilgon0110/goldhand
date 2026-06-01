import admin from 'firebase-admin';
import { type App, getApps, initializeApp } from 'firebase-admin/app';

function createAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '';
  const serviceAccount = JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf-8'));
  return initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

// Proxy를 사용해 첫 속성 접근 시점(런타임)에 초기화 — 빌드 시점엔 실행되지 않음
export const firebaseAdminApp: App = new Proxy({} as App, {
  get(_, prop) {
    const app = createAdminApp();
    const value = Reflect.get(app, prop as string);
    return typeof value === 'function' ? value.bind(app) : value;
  },
});

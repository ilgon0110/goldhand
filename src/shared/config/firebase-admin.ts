import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';

// 수정된 방식
const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '';
const serviceAccount = JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf-8'));

//const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
export const firebaseAdminApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

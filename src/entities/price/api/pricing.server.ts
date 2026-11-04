import 'server-only';

import { getFirestore } from 'firebase-admin/firestore';
import { unstable_cache } from 'next/cache';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

import type { TPriceData } from '../model/prices';

export const pricingRef = () => getFirestore(firebaseAdminApp).collection('settings').doc('pricing');

async function readPricing(): Promise<TPriceData> {
  const doc = await pricingRef().get();
  // 요금의 유일한 출처는 이 문서다. 없으면 기본값으로 숨기지 않고 실패시킨다.
  if (!doc.exists) throw new Error('settings/pricing 문서가 없습니다.');
  const { prices, revision } = doc.data() as TPriceData;
  return { prices, revision };
}

export const getPricing = unstable_cache(readPricing, ['pricing-v2'], { tags: ['pricing'] });

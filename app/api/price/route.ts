import { getFirestore } from 'firebase-admin/firestore';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { getPricing, pricingRef, validPriceData } from '@/src/entities/price/server';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { checkAdminAuth } from '@/src/shared/lib/server';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    return NextResponse.json(await getPricing());
  } catch {
    return NextResponse.json({ message: '요금을 불러오지 못했습니다.' }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  const auth = await checkAdminAuth(true);
  if (!auth.ok) return NextResponse.json({}, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({}, { status: 403 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({}, { status: 400 });
  }
  if (!body || typeof body !== 'object' || !Number.isSafeInteger(body.revision) || body.revision < 0)
    return NextResponse.json({}, { status: 400 });
  try {
    await getFirestore(firebaseAdminApp).runTransaction(async tx => {
      const ref = pricingRef();
      const current = (await tx.get(ref)).data();
      if (!current) throw new Error('not-found');
      if (current.revision !== body.revision) throw new Error('conflict');
      // 구조(키·행 개수·id)는 현재 문서와 같아야 하고, 금액과 항목명만 바꿀 수 있다.
      if (!validPriceData(body.prices, current.prices)) throw new Error('invalid');
      tx.set(ref, {
        schemaVersion: 2,
        prices: body.prices,
        revision: body.revision + 1,
        updatedBy: auth.uid,
        updatedAt: new Date(),
      });
    });
    revalidateTag('pricing');
    revalidatePath('/');
    revalidatePath('/price');
    return NextResponse.json({ prices: body.prices, revision: body.revision + 1 });
  } catch (error) {
    const reason = error instanceof Error ? error.message : '';
    if (reason === 'invalid') return NextResponse.json({ message: '요금 형식이 올바르지 않습니다.' }, { status: 400 });
    if (reason === 'not-found') return NextResponse.json({ message: '요금 문서가 없습니다.' }, { status: 404 });
    return NextResponse.json(
      { message: '저장 실패. 최신 요금을 다시 불러와 주세요.' },
      { status: reason === 'conflict' ? 409 : 500 },
    );
  }
}

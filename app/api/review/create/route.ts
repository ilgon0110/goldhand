import { cookies } from 'next/headers';

import { verifySessionCookie } from '@/src/shared/lib/sessionCookie';
import { typedJson } from '@/src/shared/utils';

import { createGuestReview } from './guestCreate';
import type { IReviewPost, IReviewResponseBody } from './lib';
import { createUserReview } from './userCreate';

export async function POST(req: Request) {
  const body = (await req.json()) as IReviewPost;
  const { title, name, franchisee, htmlString } = body;

  if (!title || !htmlString || !name || !franchisee) {
    return typedJson<IReviewResponseBody>(
      { response: 'ng', message: '필수로 입력해야하는 필드를 입력해주세요.', docId: '' },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (session == null) {
    return createGuestReview(body);
  }

  try {
    const { uid } = await verifySessionCookie(session.value);
    return createUserReview(body, uid);
  } catch (error) {
    // 세션 쿠키가 있어도 검증에 실패하면(만료 등) /api/user와 동일한 기준으로 게스트로 취급한다.
    console.error('Error verifying session cookie, falling back to guest review:', error);
    return createGuestReview(body);
  }
}

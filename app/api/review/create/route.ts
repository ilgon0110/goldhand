import { cookies } from 'next/headers';

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
  const accessToken = cookieStore.get('accessToken');

  return accessToken ? createUserReview(body, accessToken.value) : createGuestReview(body);
}

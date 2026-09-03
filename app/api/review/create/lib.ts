import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { applyReviewImageSrcs } from '@/src/shared/lib/applyReviewImageSrcs';
import { typedJson } from '@/src/shared/utils';

export interface IReviewPost {
  title: string;
  name: string;
  franchisee: string;
  htmlString: string;
  docId: string;
  images: { key: string; url: string }[] | null;
  phoneIdToken?: string;
}

export interface IReviewResponseBody {
  response: 'ng' | 'ok';
  message: string;
  docId: string;
}

interface IReviewOwner {
  userId: string | null;
  phoneNumber: string;
  phoneHash: string | null;
}

export async function saveReview(body: IReviewPost, owner: IReviewOwner) {
  const { title, name, franchisee, htmlString, docId, images } = body;
  const { imageSrcAppliedHtmlString, thumbnailUrl } = applyReviewImageSrcs(htmlString, images);
  const db = getAdminFirestore(firebaseAdminApp);

  try {
    await db.collection('reviews').doc(docId).set({
      thumbnail: thumbnailUrl,
      title,
      name,
      franchisee,
      ...owner,
      htmlString: imageSrcAppliedHtmlString,
      isPinned: false,
      pinnedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath('/review');
    return typedJson<IReviewResponseBody>(
      { response: 'ok', message: '리뷰가 성공적으로 작성되었습니다.', docId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating review post:', error);
    return typedJson<IReviewResponseBody>(
      { response: 'ng', message: '리뷰 작성에 실패했습니다.', docId },
      { status: 500 },
    );
  }
}

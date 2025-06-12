import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { CommentData, MyPageData, UserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: MyPageData;
}

const defaultData: MyPageData = {
  userData: null,
  consults: [],
  reviews: [],
  comments: [],
};

export async function GET() {
  // 현재 로그인된 유저의 uid를 가져온다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: '로그인 토큰이 존재하지 않습니다.',
        data: defaultData,
      },
      { status: 403 },
    );
  }
  const decodedToken = await getAdminAuth().verifyIdToken(accessToken.value);
  const uid = decodedToken.uid;
  console.log('uid:', uid);

  if (uid === undefined) {
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: '사용자 식별 아이디가 존재하지 않습니다.',
        data: defaultData,
      },
      { status: 403 },
    );
  }

  try {
    const db = getFirestore(firebaseApp);

    // 1. 사용자 데이터 가져오기
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserDetailData;
      console.log('User data:', userData);
    } else {
      return typedJson<IResponseBody>({
        response: 'ng',
        message: '사용자 데이터가 존재하지 않습니다.',
        data: defaultData,
      });
    }

    // 2. 예약상담 데이터 가져오기
    // userId를 이용하여 예약상담 데이터를 가져온다.
    const consultsQuery = query(collection(db, 'consults'), orderBy('createdAt', 'desc'), where('userId', '==', uid));
    const consultsSnapshot = await getDocs(consultsQuery);
    const consultsData = consultsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as MyPageData['consults'];
    console.log('Consults data:', consultsData);
    // 3. 이용후기 데이터 가져오기
    // userId를 이용하여 이용후기 데이터를 가져온다.
    const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), where('userId', '==', uid));
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const reviewsData = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as MyPageData['reviews'];
    console.log('Reviews data:', reviewsData);
    // 4. 댓글 데이터 가져오기
    // userId를 이용하여 댓글 데이터를 가져온다.
    const commentsQuery = query(collectionGroup(db, 'comments'), where('userId', '==', uid));
    const commentsSnapshot = await getDocs(commentsQuery);
    const commentsData = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Comments data:', commentsData);
    // 5. 최종 데이터 구성
    return typedJson<IResponseBody>({
      response: 'ok',
      message: '마이페이지 데이터 조회 성공',
      data: {
        userData: { ...userDocSnap.data(), uid } as UserDetailData,
        consults: consultsData,
        reviews: reviewsData,
        comments: commentsData as CommentData[],
      },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return typedJson<IResponseBody>({
      response: 'ng',
      message: '데이터를 가져오는 중 오류가 발생했습니다.',
      data: defaultData,
    });
  }
}

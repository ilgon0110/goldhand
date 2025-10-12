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
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { ICommentData, IMyPageData, IUserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IMyPageData;
}

const defaultData: IMyPageData = {
  isLinked: false,
  userData: null,
  managersData: null,
  applies: [],
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

  let uid;
  try {
    const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
    uid = decodedToken.uid;

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
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error != null && typeof error == 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<IResponseBody>(
        {
          response: 'expired',
          message: '로그인 토큰이 만료되었습니다.',
          data: defaultData,
        },
        { status: 403 },
      );
    }
    return typedJson<IResponseBody>({
      response: 'ng',
      message: '로그인 토큰 검증 중 오류가 발생했습니다.',
      data: defaultData,
    });
  }

  try {
    const db = getFirestore(firebaseApp);
    const adminDB = getAdminFirestore(firebaseAdminApp);

    // 사용자 데이터 가져오기
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return typedJson<IResponseBody>({
        response: 'ng',
        message: '사용자 데이터가 존재하지 않습니다.',
        data: defaultData,
      });
    }

    // 탈퇴한 유저인지 확인
    if (userDocSnap.data()?.isDeleted) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '탈퇴한 유저입니다.',
          data: defaultData,
        },
        { status: 403 },
      );
    }

    const userRecord = await getAdminAuth(firebaseAdminApp).getUser(uid);

    const providersId = userRecord.providerData.map(provider => provider.providerId);
    const hasEmail = providersId.includes('password');
    const hasPhone = providersId.includes('phone');
    const isLinked = hasEmail && hasPhone;
    const isAdmin = userDocSnap.data()?.grade === 'admin';

    // Admin grade 전용. 산후관리사 지원목록 데이터 가져오기
    // managers는 보안 룰 전체 false로 한 후, admin SDK로만 접근 가능하게 설정
    let managersData = null;
    if (isAdmin) {
      const managersSnapshot = await adminDB.collection('managers').orderBy('createdAt', 'desc').get();
      managersData = managersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: {
          seconds: doc.data().createdAt._seconds,
          nanoseconds: doc.data().createdAt._nanoseconds,
        },
        updatedAt: {
          seconds: doc.data().updatedAt._seconds,
          nanoseconds: doc.data().updatedAt._nanoseconds,
        },
      })) as IMyPageData['applies'];
    }

    // 산후관리사 지원문의 데이터 가져오기
    const appliesSnapshot = await adminDB
      .collection('managers')
      .orderBy('createdAt', 'desc')
      .where('userId', '==', uid)
      .get();
    const appliesData = appliesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: {
        seconds: doc.data().createdAt._seconds,
        nanoseconds: doc.data().createdAt._nanoseconds,
      },
      updatedAt: {
        seconds: doc.data().updatedAt._seconds,
        nanoseconds: doc.data().updatedAt._nanoseconds,
      },
    })) as IMyPageData['applies'];
    console.log('appliesData', appliesData);

    // 예약상담 데이터 가져오기
    const consultsQuery = query(collection(db, 'consults'), orderBy('createdAt', 'desc'), where('userId', '==', uid));
    const consultsSnapshot = await getDocs(consultsQuery);
    const consultsData = consultsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as IMyPageData['consults'];

    // 이용후기 데이터 가져오기
    const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), where('userId', '==', uid));
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const reviewsData = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as IMyPageData['reviews'];

    // 댓글 데이터 가져오기
    const commentsQuery = query(collectionGroup(db, 'comments'), where('userId', '==', uid));
    const commentsSnapshot = await getDocs(commentsQuery);
    const commentsData = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 최종 데이터 구성
    return typedJson<IResponseBody>({
      response: 'ok',
      message: '마이페이지 데이터 조회 성공',
      data: {
        isLinked,
        userData: { ...userDocSnap.data(), userId: uid } as IUserDetailData,
        managersData,
        applies: appliesData,
        consults: consultsData,
        reviews: reviewsData,
        comments: commentsData as ICommentData[],
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

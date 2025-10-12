import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IApplyDetailData, IManagerApplyListData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);
  // 현재 로그인된 유저의 uid를 가져온다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return typedJson<IManagerApplyListData>(
      {
        response: 'ng',
        message: '로그인 토큰이 존재하지 않습니다.',
        data: null,
        totalDataLength: 0,
      },
      { status: 403 },
    );
  }

  let uid;
  try {
    const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
    uid = decodedToken.uid;

    if (uid === undefined) {
      return typedJson<IManagerApplyListData>(
        {
          response: 'ng',
          message: '사용자 식별 아이디가 존재하지 않습니다.',
          data: null,
          totalDataLength: 0,
        },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error != null && typeof error == 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<IManagerApplyListData>(
        {
          response: 'ng',
          message: '로그인 토큰이 만료되었습니다.',
          data: null,
          totalDataLength: 0,
        },
        { status: 403 },
      );
    }
    return typedJson<IManagerApplyListData>({
      response: 'ng',
      message: '로그인 토큰 검증 중 오류가 발생했습니다.',
      data: null,
      totalDataLength: 0,
    });
  }

  try {
    const db = getFirestore(firebaseApp);
    const adminDB = getAdminFirestore(firebaseAdminApp);

    // 사용자 데이터 가져오기
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return typedJson<IManagerApplyListData>({
        response: 'ng',
        message: '사용자 데이터가 존재하지 않습니다.',
        data: null,
        totalDataLength: 0,
      });
    }

    // 탈퇴한 유저인지 확인
    if (userDocSnap.data()?.isDeleted) {
      return typedJson<IManagerApplyListData>(
        {
          response: 'ng',
          message: '탈퇴한 유저입니다.',
          data: null,
          totalDataLength: 0,
        },
        { status: 403 },
      );
    }
    // 관리자 계정인지 확인
    const isAdmin = userDocSnap.data()?.grade === 'admin';

    // 관리자 계정이 아니라면 해당 API 접근 불가
    if (!isAdmin) {
      return typedJson<IManagerApplyListData>(
        {
          response: 'unAuthorized',
          message: '접근 권한이 없습니다.',
          data: null,
          totalDataLength: 0,
        },
        { status: 403 },
      );
    }

    // 산후관리사 지원서 데이터 가져오기
    const baseQuery = adminDB.collection('managers').orderBy('createdAt', 'desc');
    const managersSnapshot = await baseQuery.get();
    const totalDataLength = managersSnapshot.size;

    // 페이지네이션 계산
    const PAGE_SIZE = 10;
    const startAtIndex = (page - 1) * PAGE_SIZE;
    const paginatedSnapshot = await baseQuery.offset(startAtIndex).limit(PAGE_SIZE).get();

    const managerListData: IApplyDetailData[] = paginatedSnapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data(),
      createdAt: { seconds: doc.data().createdAt._seconds, nanoseconds: doc.data().createdAt._nanoseconds },
      updatedAt: { seconds: doc.data().updatedAt._seconds, nanoseconds: doc.data().updatedAt._nanoseconds },
    })) as IApplyDetailData[];

    return typedJson<IManagerApplyListData>({
      response: 'ok',
      message: '산후관리사 지원서 데이터를 불러왔습니다.',
      data: managerListData,
      totalDataLength,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return typedJson<IManagerApplyListData>(
      {
        response: 'ng',
        message: '데이터를 가져오는 중 오류가 발생했습니다.',
        data: null,
        totalDataLength: 0,
      },
      { status: 500 },
    );
  }
}

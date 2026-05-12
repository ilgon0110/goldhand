import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import type { IApplyDetailData, IManagerApplyListData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);

  const authResult = await checkAdminAuth();
  if (!authResult.ok) {
    if (authResult.reason === 'no_token') {
      return typedJson<IManagerApplyListData>(
        { response: 'ng', message: '로그인 토큰이 존재하지 않습니다.', data: null, totalDataLength: 0 },
        { status: 403 },
      );
    }
    if (authResult.reason === 'expired') {
      return typedJson<IManagerApplyListData>(
        { response: 'ng', message: '로그인 토큰이 만료되었습니다.', data: null, totalDataLength: 0 },
        { status: 403 },
      );
    }
    if (authResult.reason === 'not_found') {
      return typedJson<IManagerApplyListData>({
        response: 'ng',
        message: '사용자 데이터가 존재하지 않습니다.',
        data: null,
        totalDataLength: 0,
      });
    }
    if (authResult.reason === 'deleted') {
      return typedJson<IManagerApplyListData>(
        { response: 'ng', message: '탈퇴한 유저입니다.', data: null, totalDataLength: 0 },
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

  // 관리자 계정이 아니라면 해당 API 접근 불가
  if (!authResult.isAdmin) {
    return typedJson<IManagerApplyListData>(
      { response: 'ng', message: '접근 권한이 없습니다.', data: null, totalDataLength: 0 },
      { status: 403 },
    );
  }

  try {
    const adminDB = getAdminFirestore(firebaseAdminApp);

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
      { response: 'ng', message: '데이터를 가져오는 중 오류가 발생했습니다.', data: null, totalDataLength: 0 },
      { status: 500 },
    );
  }
}

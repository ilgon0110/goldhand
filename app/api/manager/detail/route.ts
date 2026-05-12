import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import type { IApplyDetailData, IManagerApplyDetailResponseData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docId = searchParams.get('docId');

  const authResult = await checkAdminAuth();
  if (!authResult.ok) {
    if (authResult.reason === 'no_token') {
      return typedJson<IManagerApplyDetailResponseData>(
        { response: 'ng', message: '로그인 토큰이 존재하지 않습니다.', data: null },
        { status: 403 },
      );
    }
    if (authResult.reason === 'expired') {
      return typedJson<IManagerApplyDetailResponseData>(
        { response: 'ng', message: '로그인 토큰이 만료되었습니다.', data: null },
        { status: 403 },
      );
    }
    if (authResult.reason === 'not_found') {
      return typedJson<IManagerApplyDetailResponseData>({
        response: 'ng',
        message: '사용자 데이터가 존재하지 않습니다.',
        data: null,
      });
    }
    if (authResult.reason === 'deleted') {
      return typedJson<IManagerApplyDetailResponseData>(
        { response: 'ng', message: '탈퇴한 유저입니다.', data: null },
        { status: 403 },
      );
    }
    return typedJson<IManagerApplyDetailResponseData>({
      response: 'ng',
      message: '로그인 토큰 검증 중 오류가 발생했습니다.',
      data: null,
    });
  }

  const { uid, isAdmin } = authResult;

  if (!docId) {
    return typedJson<IManagerApplyDetailResponseData>(
      { response: 'ng', message: 'docId가 존재하지 않습니다.', data: null },
      { status: 400 },
    );
  }

  try {
    const adminDB = getAdminFirestore(firebaseAdminApp);

    // 산후관리사 신청 데이터 가져오기
    const docSnap = await adminDB.collection('managers').doc(docId).get();
    const docData = docSnap.data();

    // 관리자이거나 본인인 경우 접근 가능
    if (!isAdmin && docData?.userId != uid) {
      return typedJson<IManagerApplyDetailResponseData>(
        { response: 'ng', message: '접근 권한이 없습니다.', data: null },
        { status: 403 },
      );
    }

    return typedJson<IManagerApplyDetailResponseData>({
      response: 'ok',
      message: '데이터를 성공적으로 가져왔습니다.',
      data: docData
        ? ({
            ...docData,
            createdAt: { seconds: docData.createdAt._seconds, nanoseconds: docData.createdAt._nanoseconds },
            updatedAt: docData.updatedAt
              ? { seconds: docData.updatedAt._seconds, nanoseconds: docData.updatedAt._nanoseconds }
              : null,
          } as IApplyDetailData)
        : null,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return typedJson<IManagerApplyDetailResponseData>(
      { response: 'ng', message: '데이터를 가져오는 중 오류가 발생했습니다.', data: null },
      { status: 500 },
    );
  }
}

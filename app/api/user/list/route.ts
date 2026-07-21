import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import type { IUserListItem, IUserListResponseData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);

  const authResult = await checkAdminAuth();
  if (!authResult.ok) {
    if (authResult.reason === 'no_token') {
      return typedJson<IUserListResponseData>(
        { response: 'ng', message: '로그인 토큰이 존재하지 않습니다.', data: null, totalDataLength: 0 },
        { status: 403 },
      );
    }
    if (authResult.reason === 'expired') {
      return typedJson<IUserListResponseData>(
        { response: 'ng', message: '로그인 토큰이 만료되었습니다.', data: null, totalDataLength: 0 },
        { status: 403 },
      );
    }
    if (authResult.reason === 'not_found') {
      return typedJson<IUserListResponseData>({
        response: 'ng',
        message: '사용자 데이터가 존재하지 않습니다.',
        data: null,
        totalDataLength: 0,
      });
    }
    if (authResult.reason === 'deleted') {
      return typedJson<IUserListResponseData>(
        { response: 'ng', message: '탈퇴한 유저입니다.', data: null, totalDataLength: 0 },
        { status: 403 },
      );
    }
    return typedJson<IUserListResponseData>({
      response: 'ng',
      message: '로그인 토큰 검증 중 오류가 발생했습니다.',
      data: null,
      totalDataLength: 0,
    });
  }

  // 관리자 계정이 아니라면 해당 API 접근 불가
  if (!authResult.isAdmin) {
    return typedJson<IUserListResponseData>(
      { response: 'ng', message: '접근 권한이 없습니다.', data: null, totalDataLength: 0 },
      { status: 403 },
    );
  }

  try {
    const adminDB = getAdminFirestore(firebaseAdminApp);

    // 전체 사용자 데이터 가져오기
    const baseQuery = adminDB.collection('users').orderBy('createdAt', 'desc');
    const usersSnapshot = await baseQuery.get();
    const totalDataLength = usersSnapshot.size;

    // 페이지네이션 계산
    const PAGE_SIZE = 10;
    const startAtIndex = (page - 1) * PAGE_SIZE;
    const paginatedSnapshot = await baseQuery.offset(startAtIndex).limit(PAGE_SIZE).get();

    // 패킷 탈취 등에 대비해 화면에 필요한 필드만 명시적으로 선택하여 응답한다 (userId, kakaoId, fcmTokens 등은 제외).
    const userListData: IUserListItem[] = paginatedSnapshot.docs.map(doc => {
      const docData = doc.data();

      return {
        name: docData.name,
        nickname: docData.nickname,
        email: docData.email,
        phoneNumber: docData.phoneNumber,
        grade: docData.grade,
        provider: docData.provider,
        kakaoEmail: docData.kakaoEmail ?? null,
        isDeleted: docData.isDeleted,
        deletedAt: docData.deletedAt
          ? { seconds: docData.deletedAt._seconds, nanoseconds: docData.deletedAt._nanoseconds }
          : null,
        createdAt: { seconds: docData.createdAt._seconds, nanoseconds: docData.createdAt._nanoseconds },
        updatedAt: { seconds: docData.updatedAt._seconds, nanoseconds: docData.updatedAt._nanoseconds },
      };
    });

    return typedJson<IUserListResponseData>({
      response: 'ok',
      message: '사용자 목록을 불러왔습니다.',
      data: userListData,
      totalDataLength,
    });
  } catch (error) {
    console.error('Error fetching user list data:', error);
    return typedJson<IUserListResponseData>(
      { response: 'ng', message: '데이터를 가져오는 중 오류가 발생했습니다.', data: null, totalDataLength: 0 },
      { status: 500 },
    );
  }
}

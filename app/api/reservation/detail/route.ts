import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, Timestamp } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { ICommentData, IReservationDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  data: IReservationDetailData;
}

const defaultData: IReservationDetailData = {
  bornDate: null,
  content: '',
  createdAt: Timestamp.now(),
  franchisee: '',
  isPinned: false,
  pinnedAt: null,
  location: '',
  name: '',
  password: null,
  phoneNumber: '',
  secret: false,
  title: '',
  updatedAt: Timestamp.now(),
  userId: null,
  comments: null,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docId = searchParams.get('docId');
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const reservationToken = cookieStore.get('reservationToken');

  if (!docId) {
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: 'docId is required',
        data: defaultData,
      },
      { status: 400 },
    );
  }

  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const consultDocRef = doc(db, 'consults', docId);
    const docSnap = await getDoc(consultDocRef);

    if (!docSnap.exists()) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: 'no such document',
          data: defaultData,
        },
        { status: 404 },
      );
    }

    const data = docSnap.data() as IReservationDetailData;

    let isAdmin = false;
    let verifiedUid: string | null = null;

    if (accessToken?.value) {
      try {
        const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
        verifiedUid = decodedToken.uid;
        const userDocRef = doc(db, 'users', verifiedUid);
        const userDocSnap = await getDoc(userDocRef);
        isAdmin = userDocSnap.exists() && userDocSnap.data().grade === 'admin';
      } catch {
        // 토큰 검증 실패 시 isAdmin, verifiedUid 기본값 유지
      }
    }

    let reservationTokenDocId: string | null = null;
    if (reservationToken?.value) {
      try {
        const decoded = jwt.verify(reservationToken.value, process.env.JWT_SECRET!) as { docId: string } | null;
        reservationTokenDocId = decoded?.docId ?? null;
      } catch {
        // 토큰 검증 실패 시 reservationTokenDocId 기본값(null) 유지
      }
    }

    if (data.secret) {
      if (!isAdmin) {
        // 비밀글&비회원
        if (data.userId == null) {
          if (reservationTokenDocId !== docId) {
            return typedJson<IResponseBody>(
              {
                response: 'ng',
                message: '비밀글 인증에 실패하였습니다.',
                data: defaultData,
              },
              { status: 403 },
            );
          }
        }
        // 비밀글&회원
        else {
          if (verifiedUid == null || verifiedUid !== data.userId) {
            return typedJson<IResponseBody>(
              {
                response: 'ng',
                message: '해당 사용자가 작성한 글이 아닙니다.',
                data: defaultData,
              },
              { status: 403 },
            );
          }
        }
      }
    }

    // 연락처(phoneNumber)는 작성자 본인 또는 관리자만 조회 가능
    const isOwner = data.userId != null ? verifiedUid === data.userId : reservationTokenDocId === docId;
    const canViewPhoneNumber = isAdmin || isOwner;

    const commentsRef = collection(db, 'consults', docId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const commentSnapshot = await getDocs(q);
    const comments = commentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ICommentData[];

    // 비밀번호가 맞거나 비밀글이 아닐 경우
    const responseData: IResponseBody = {
      response: 'ok',
      message: 'ok',
      data: {
        ...data,
        phoneNumber: canViewPhoneNumber ? data.phoneNumber : '',
        comments,
      },
    };
    return typedJson<IResponseBody>(responseData, { status: 200 });
  } catch (error) {
    if ((error as { name?: string }).name === 'TokenExpiredError') {
      return typedJson<IResponseBody>({ response: 'ng', message: 'TOKEN_EXPIRED', data: defaultData }, { status: 401 });
    }
    console.error('Error getting document:', error);
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: 'Error getting document',
        data: defaultData,
      },
      { status: 500 },
    );
  }
}

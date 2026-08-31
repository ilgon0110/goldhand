import type { WhereFilterOp } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import { getPinnedFirstListAdmin } from '@/src/shared/lib/pin/getPinnedFirstList';
import { serializeAdminTimestamp } from '@/src/shared/lib/serializeAdminTimestamp';
import type { IReservationDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  message: string;
  consultData: IReservationDetailData[];
  totalDataLength: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);
  const hideSecret = searchParams.get('hideSecret');
  const PAGE_SIZE = 10;

  const authResult = await checkAdminAuth();
  const isAdmin = authResult.ok && authResult.isAdmin;
  const currentUserId = authResult.ok ? authResult.uid : null;

  try {
    const extraWhere: [string, WhereFilterOp, unknown][] = hideSecret === 'true' ? [['secret', '==', false]] : [];

    const { pinnedItems, pageItems, totalDataLength } = await getPinnedFirstListAdmin<IReservationDetailData>(
      'consults',
      extraWhere,
      page,
      PAGE_SIZE,
    );

    const maskSecretFields = (data: IReservationDetailData & { id: string }) => {
      const isOwner = currentUserId !== null && currentUserId === data.userId;
      const timestamps = {
        createdAt: serializeAdminTimestamp(data.createdAt)!,
        updatedAt: serializeAdminTimestamp(data.updatedAt)!,
        pinnedAt: serializeAdminTimestamp(data.pinnedAt),
      };

      if (data.secret && !isAdmin && !isOwner) {
        return {
          ...data,
          ...timestamps,
          title: data.title,
          content: '',
          name: '',
          phoneNumber: '',
          bornDate: null,
          location: '',
          password: null,
        };
      }

      // 리스트 UI에서는 연락처를 전혀 사용하지 않으므로 권한과 무관하게 항상 마스킹
      // bcrypt 해시(password)도 목록 응답에 노출할 이유가 없으므로 항상 제거한다.
      return { ...data, ...timestamps, phoneNumber: '', password: null };
    };

    const consults = [...pinnedItems, ...pageItems].map(maskSecretFields);

    return typedJson<IResponseBody>({ message: 'ok', consultData: consults, totalDataLength }, { status: 200 });
  } catch (error: any) {
    console.error('Error getting document:', error);
    return typedJson<IResponseBody>(
      { message: 'Error getting document', consultData: [], totalDataLength: 0 },
      { status: 500 },
    );
  }
}

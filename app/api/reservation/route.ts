import type { FirestoreDataConverter } from 'firebase/firestore';
import { where } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import { getPinnedFirstListClient } from '@/src/shared/lib/pin/getPinnedFirstList';
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
    const { pinnedItems, pageItems, totalDataLength } = await getPinnedFirstListClient<IReservationDetailData>(
      'consults',
      consultConverter,
      hideSecret === 'true' ? [where('secret', '==', false)] : [],
      page,
      PAGE_SIZE,
    );

    const maskSecretFields = (data: IReservationDetailData & { id: string }) => {
      if (data.secret && !isAdmin && (currentUserId === null || currentUserId !== data.userId)) {
        return {
          ...data,
          title: data.title,
          content: '',
          name: '',
          phoneNumber: '',
          bornDate: null,
          location: '',
          password: null,
        };
      }
      return data;
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

const consultConverter: FirestoreDataConverter<IReservationDetailData> = {
  toFirestore(data: IReservationDetailData) {
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
    } as IReservationDetailData;
  },
};

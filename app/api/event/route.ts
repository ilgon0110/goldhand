import type { WhereFilterOp } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

import { getEventRowNumberMap } from '@/src/entities/event/api/getEventRowNumbers';
import { getPinnedFirstListAdmin } from '@/src/shared/lib/pin/getPinnedFirstList';
import type { IEventDetailData, IEventListResponseData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);
  const status = searchParams.get('status') ?? 'ALL';
  const PAGE_SIZE = 10;

  try {
    const extraWhere: [string, WhereFilterOp, unknown][] = [
      ['status', 'in', status === 'ALL' ? ['ONGOING', 'ENDED', 'UPCOMING'] : [status]],
    ];

    const [{ pinnedItems, pageItems, totalDataLength }, rowNumberMap] = await Promise.all([
      getPinnedFirstListAdmin<IEventDetailData>('events', extraWhere, page, PAGE_SIZE),
      getEventRowNumberMap(),
    ]);

    const normalizeTimestamps = (item: IEventDetailData): IEventDetailData => {
      type TAdminTimestamp = IEventDetailData['createdAt'] & {
        _nanoseconds?: number;
        _seconds?: number;
      };

      const createdAt = item.createdAt as TAdminTimestamp;
      const updatedAt = item.updatedAt as TAdminTimestamp;
      const pinnedAt = item.pinnedAt as TAdminTimestamp | null;

      return {
        ...item,
        rowNumber: rowNumberMap.get(item.id) ?? 0,
        createdAt: {
          seconds: createdAt._seconds ?? createdAt.seconds,
          nanoseconds: createdAt._nanoseconds ?? createdAt.nanoseconds,
        },
        updatedAt: {
          seconds: updatedAt._seconds ?? updatedAt.seconds,
          nanoseconds: updatedAt._nanoseconds ?? updatedAt.nanoseconds,
        },
        pinnedAt: pinnedAt
          ? {
              seconds: pinnedAt._seconds ?? pinnedAt.seconds,
              nanoseconds: pinnedAt._nanoseconds ?? pinnedAt.nanoseconds,
            }
          : null,
      };
    };

    const eventsListData: IEventDetailData[] = [...pinnedItems, ...pageItems].map(normalizeTimestamps);

    return typedJson<IEventListResponseData>(
      { response: 'ok', message: 'ok', eventData: eventsListData, totalDataLength },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error getting event list:', error);
    const errorCode =
      typeof error === 'object' && error != null && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    return typedJson<IEventListResponseData>(
      { response: 'ng', message: errorCode, eventData: [], totalDataLength: 0 },
      { status: 500 },
    );
  }
}

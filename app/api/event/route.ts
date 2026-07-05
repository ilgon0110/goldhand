import type { WhereFilterOp } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

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

    const { pinnedItems, pageItems, totalDataLength } = await getPinnedFirstListAdmin<IEventDetailData>(
      'events',
      extraWhere,
      page,
      PAGE_SIZE,
    );

    const normalizeTimestamps = (item: any): IEventDetailData => ({
      ...item,
      createdAt: {
        seconds: item.createdAt._seconds ?? item.createdAt.seconds,
        nanoseconds: item.createdAt._nanoseconds ?? item.createdAt.nanoseconds,
      },
      updatedAt: {
        seconds: item.updatedAt._seconds ?? item.updatedAt.seconds,
        nanoseconds: item.updatedAt._nanoseconds ?? item.updatedAt.nanoseconds,
      },
      pinnedAt: item.pinnedAt
        ? {
            seconds: item.pinnedAt._seconds ?? item.pinnedAt.seconds,
            nanoseconds: item.pinnedAt._nanoseconds ?? item.pinnedAt.nanoseconds,
          }
        : null,
    });

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

import type { IEventListResponseData } from '@/src/shared/types';

export const mockEventListData: IEventListResponseData = {
  response: 'ok',
  message: '이벤트 리스트 조회 성공',
  eventData: [
    {
      id: 'event1',
      rowNumber: 1,
      thumbnail: null,
      htmlString: '<p>Event 1 Description</p>',
      createdAt: { seconds: 1622505600, nanoseconds: 0 },
      name: 'Event 1',
      title: 'First Event',
      updatedAt: { seconds: 1625097600, nanoseconds: 0 },
      userId: 'user1',
      status: 'ONGOING',
      comments: null,
    },
    {
      id: 'event2',
      rowNumber: 2,
      thumbnail: null,

      htmlString: '<p>Event 2 Description</p>',
      createdAt: { seconds: 1622592000, nanoseconds: 0 },
      name: 'Event 2',
      title: 'Second Event',
      updatedAt: { seconds: 1625184000, nanoseconds: 0 },
      userId: 'user2',
      status: 'UPCOMING',
      comments: null,
    },
    {
      id: 'event3',
      rowNumber: 3,
      thumbnail: null,

      htmlString: '<p>Event 3 Description</p>',
      createdAt: { seconds: 1622678400, nanoseconds: 0 },
      name: 'Event 3',
      title: 'Third Event',
      updatedAt: { seconds: 1625270400, nanoseconds: 0 },
      userId: 'user3',
      status: 'ENDED',
      comments: null,
    },
  ],
  totalDataLength: 3,
};

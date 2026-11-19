import type { Timestamp } from 'firebase/firestore';

export enum NotificationType {
  NEW_REVIEW = 'new_review',
  CONSULT_COMMENT = 'consult_comment',
  NEW_RESERVATION = 'new_reservation',
  REVIEW_COMMENT = 'review_comment',
  NEW_EVENT = 'new_event',
  EVENT_COMMENT = 'event_comment',
  NEW_MANAGER = 'new_manager',
  NEW_CONNECTION = 'new_connection',
  // 필요 시 여기에 추가
}

export interface INotificationDetailData {
  type: NotificationType;
  id: string;
  docId: string;
  userId: string;
  message: string;
  commentId?: string;
  isRead: boolean;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  origin?: string; // e.g. 'functions'
  pushProcessed?: boolean;
}

export interface INotificationResponseData {
  response: 'ng' | 'ok';
  message: string;
  data: INotificationDetailData[] | [];
  noReadCount: number;
  nextCursor: string | null;
}

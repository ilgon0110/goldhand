import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { notificationKeys } from '../config/queryKeys';
import { toastInfo, toastSuccess } from '../utils';

const CHANNELS = {
  NEW_REVIEW: 'new_review',
  CONSULT_COMMENT: 'consult_comment',
  NEW_RESERVATION: 'new_reservation',
  REVIEW_COMMENT: 'review_comment',
  NEW_EVENT: 'new_event',
  EVENT_COMMENT: 'event_comment',
  NEW_MANAGER: 'new_manager',
};

export type TChannel = (typeof CHANNELS)[keyof typeof CHANNELS];

export const useAlarm = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userId) {
      const refetchAlarms = () => {
        void queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId) });
      };

      const url = '/api/alarm/stream';
      const sse = new EventSource(url, { withCredentials: true });

      sse.onopen = () => console.log('Alarm SSE open');
      sse.onerror = err => console.error('Alarm SSE error', err);

      sse.addEventListener(CHANNELS.NEW_REVIEW, () => {
        refetchAlarms();
        toastInfo('새로운 리뷰가 등록되었습니다!');
      });

      sse.addEventListener(CHANNELS.REVIEW_COMMENT, () => {
        refetchAlarms();
        toastInfo('내 리뷰에 새로운 댓글이 달렸습니다!');
      });

      sse.addEventListener(CHANNELS.NEW_EVENT, () => {
        refetchAlarms();
        toastSuccess('새로운 이벤트가 등록되었습니다!');
      });

      sse.addEventListener(CHANNELS.EVENT_COMMENT, () => {
        refetchAlarms();
        toastInfo('내 이벤트에 새로운 댓글이 달렸습니다!');
      });

      sse.addEventListener(CHANNELS.NEW_RESERVATION, () => {
        refetchAlarms();
        toastSuccess('새로운 상담신청이 접수되었습니다!');
      });

      sse.addEventListener(CHANNELS.CONSULT_COMMENT, () => {
        refetchAlarms();
        toastInfo('내 상담에 새로운 댓글이 달렸습니다!');
      });

      return () => sse.close();
    }
  }, [userId, queryClient]);
};

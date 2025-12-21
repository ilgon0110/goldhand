import type { InfiniteData } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { notificationKeys } from '../config/queryKeys';
import type { INotificationDetailData, INotificationResponseData } from '../types';
import { toastSuccess } from '../utils';

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

  const onReceiveAlarm = useCallback(
    async (payload: INotificationDetailData) => {
      const key = notificationKeys.list(userId);

      queryClient.setQueryData<InfiniteData<INotificationResponseData> | undefined>(key, old => {
        // old가 없으면 infinite query 형태로 새로 만든다
        if (!old) {
          const newPage: INotificationResponseData = {
            response: 'ok',
            message: payload.message || '새로운 알림이 도착했습니다.',
            data: [payload],
            nextCursor: null,
          };
          return {
            pages: [newPage],
            pageParams: [1],
          };
        }

        // 중복 체크: 첫 페이지(가장 최신)에 이미 존재하면 아무 변경 없음
        const firstPage = old.pages[0];
        const exists = firstPage?.data?.find(n => n.id === payload.id);
        if (exists) return old;

        // 첫 페이지의 data에 새 알림을 앞쪽으로 추가
        const updatedFirstPage: INotificationResponseData = {
          ...firstPage,
          data: firstPage?.data ? [payload, ...firstPage.data] : [payload],
        };

        const newPages = [updatedFirstPage, ...old.pages.slice(1)];
        return {
          ...old,
          pages: newPages,
        };
      });

      if (payload.id) {
        try {
          await fetch('/api/alarm/ack', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ notificationId: payload.id }),
          });
        } catch (ackErr) {
          console.warn('Acknowledging notification failed', ackErr);
        }
      }
    },
    [userId, queryClient],
  );

  useEffect(() => {
    if (userId) {
      // 요청 시 쿠키를 함께 보내려면 withCredentials: true 사용
      const url = '/api/alarm/stream';
      const sse = new EventSource(url, { withCredentials: true });

      sse.onopen = () => console.log('Alarm SSE open');
      sse.onerror = err => console.error('Alarm SSE error', err);

      // 채널별 이벤트 처리 (server-side의 "event: <channel>" 값)
      sse.addEventListener(CHANNELS.NEW_REVIEW, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.REVIEW_COMMENT, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
        toastSuccess('새 댓글이 달렸습니다!');
      });

      sse.addEventListener(CHANNELS.NEW_EVENT, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.EVENT_COMMENT, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.NEW_RESERVATION, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.CONSULT_COMMENT, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      return () => sse.close();
    }
  }, [userId, queryClient, onReceiveAlarm]);
};

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import type { INotificationDetailData, INotificationResponseData } from '../types';
import { toastSuccess } from '../utils';

export type TChannel = 'comment' | 'consult' | 'event' | 'generic' | 'manager' | 'review';

const CHANNELS = {
  NEW_REVIEW: 'new_review',
  CONSULT_COMMENT: 'consult_comment',
  NEW_RESERVATION: 'new_reservation',
  REVIEW_COMMENT: 'review_comment',
  NEW_EVENT: 'new_event',
  EVENT_COMMENT: 'event_comment',
  NEW_MANAGER: 'new_manager',
};

export const useAlarm = (userId: string) => {
  const queryClient = useQueryClient();

  const onReceiveAlarm = useCallback(
    async (payload: INotificationDetailData) => {
      // 여기에 알림 수신 시 처리 로직 추가 (예: UI 업데이트)
      const key = ['infiniteNotifications', userId];

      queryClient.setQueryData<INotificationResponseData | undefined>(key, old => {
        // old가 없으면 새로운 구조를 반환 (INotificationResponseData 스펙에 맞춰 수정)
        if (!old) {
          return {
            response: 'ok',
            message: 'New notification received',
            data: [payload],
            nextCursor: null,
          } as INotificationResponseData;
        }

        const exists = (old.data ?? []).find(n => n.id === payload.id);
        if (exists) return old; // 중복 알림 방지

        return {
          ...old,
          data: [payload, ...(old.data ?? [])],
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

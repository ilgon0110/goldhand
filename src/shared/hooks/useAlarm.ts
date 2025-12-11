import { QueryClient, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import type { INotificationDetailData, INotificationResponseData } from '../types';
import { authFetcher } from '../utils/fetcher.server';

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
  const queryClient = useMemo(() => new QueryClient(), []);

  const { data, isLoading } = useQuery<INotificationResponseData>({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      return await authFetcher('/api/notification', {
        credentials: 'include',
      });
    },
    enabled: !!userId,
  });

  const onReceiveAlarm = useCallback(
    async (payload: INotificationDetailData) => {
      console.log('Received alarm:', payload);
      // 여기에 알림 수신 시 처리 로직 추가 (예: UI 업데이트)
      const key = ['notifications', userId];

      queryClient.setQueryData<INotificationResponseData | undefined>(key, old => {
        // old가 없으면 새로운 구조를 반환 (INotificationResponseData 스펙에 맞춰 수정)
        if (!old) {
          return {
            notifications: [payload],
          } as unknown as INotificationResponseData;
        }

        const exists = old.data.find(n => n.id === payload.id);
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

      // 기본 메시지 핸들러 (event 필드 없을 때)
      sse.onmessage = (event: MessageEvent) => {
        try {
          console.log('Alarm SSE message before parsing:', event.data);
          const parsed = JSON.parse(event.data);
          console.log('Alarm SSE message:', { type: event.type, data: parsed });
        } catch {
          console.log('Alarm SSE message (raw):', { type: event.type, data: event.data });
        }
      };

      sse.addEventListener('generic', (e: MessageEvent) => {
        console.log('Alarm SSE generic event:', e.data);
      });

      sse.addEventListener('message', (e: MessageEvent) => {
        console.log('Alarm SSE generic message event:', e.data);
      });

      // 채널별 이벤트 처리 (server-side의 "event: <channel>" 값)
      sse.addEventListener(CHANNELS.NEW_REVIEW, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        console.log('review event:', payload);
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.REVIEW_COMMENT, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        console.log('comment event:', payload);
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.NEW_EVENT, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        console.log('new_event event:', payload);
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.EVENT_COMMENT, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        console.log('event_comment event:', payload);
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.NEW_RESERVATION, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        console.log('new_reservation event:', payload);
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      sse.addEventListener(CHANNELS.CONSULT_COMMENT, async (e: MessageEvent) => {
        const payload = JSON.parse(e.data) as INotificationDetailData;
        console.log('consult_comment event:', payload);
        // 여기서 알림 UI 업데이트 등 작업 수행
        await onReceiveAlarm(payload);
      });

      return () => sse.close();
    }
  }, [userId, queryClient, onReceiveAlarm]);

  return { data, isLoading };
};

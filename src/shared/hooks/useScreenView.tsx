// hooks/useScreenView.ts
'use client';

import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';

import { firebaseAnalyticsPromise } from '../config/firebase';

/**
 * 화면 조회수를 측정하는 커스텀 훅
 *
 * @param screenName - 화면 이름 (예: "reservation_detail_123")
 * @param screenClass - 컴포넌트 이름 또는 화면 유형 (예: "ReservationDetailPage")
 * @param additionalParams - 이벤트에 포함할 추가 파라미터 (예: { doc_id: "123" })
 */
export const useScreenView = (screenName: string, screenClass: string, additionalParams: Record<string, any> = {}) => {
  useEffect(() => {
    if (!screenName || !screenClass) return;

    firebaseAnalyticsPromise.then(analytics => {
      if (!analytics) return;

      logEvent(analytics, 'screen_view', {
        firebase_screen: screenName,
        firebase_screen_class: screenClass,
        ...additionalParams,
      });
    });
  }, [screenName, screenClass, JSON.stringify(additionalParams)]);
};

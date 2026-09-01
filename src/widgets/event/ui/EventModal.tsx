'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { safeLocalStorage } from '@/src/shared/storage';
import { AnimateModal } from '@/src/shared/ui/AnimateModal';
import { Button } from '@/src/shared/ui/button';

const locationKey = () => `${window.location.pathname}${window.location.search}`;

export const EventModal = () => {
  const [currentLocation, setCurrentLocation] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateLocation = () => setCurrentLocation(locationKey());
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    const notifyLocationChange = () => window.dispatchEvent(new Event('goldhand:locationchange'));

    window.history.pushState = (...args) => {
      originalPushState.apply(window.history, args);
      notifyLocationChange();
    };
    window.history.replaceState = (...args) => {
      originalReplaceState.apply(window.history, args);
      notifyLocationChange();
    };
    window.addEventListener('goldhand:locationchange', updateLocation);
    window.addEventListener('popstate', updateLocation);
    updateLocation();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('goldhand:locationchange', updateLocation);
      window.removeEventListener('popstate', updateLocation);
    };
  }, []);

  useEffect(() => {
    const hideUntilTime = safeLocalStorage.get('hideUntilTime');
    if (hideUntilTime && new Date(hideUntilTime) > new Date()) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [currentLocation]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDontShowToday = () => {
    const tommorrow = new Date();
    tommorrow.setDate(tommorrow.getDate() + 1);
    safeLocalStorage.set('hideUntilTime', tommorrow.toISOString());
    setIsOpen(false);
  };

  return (
    <AnimateModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="relative flex h-[93%] w-full flex-col">
        <Image alt="이벤트 안내" fill src="/event/goldhand_event_03.png" style={{ objectFit: 'contain' }} />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={handleDontShowToday}>
          오늘 하루 보지 않기
        </Button>
        <Button onClick={handleClose}>닫기</Button>
      </div>
    </AnimateModal>
  );
};

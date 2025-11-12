'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { safeLocalStorage } from '@/src/shared/storage';
import { AnimateModal } from '@/src/shared/ui/AnimateModal';
import { Button } from '@/src/shared/ui/button';

export const EventModal = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hideUntilTime = safeLocalStorage.get('hideUntilTime');

  useEffect(() => {
    if (hideUntilTime && new Date(hideUntilTime) > new Date()) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [pathname, hideUntilTime, searchParams]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDontShowToday = () => {
    const tommorrow = new Date();
    tommorrow.setDate(tommorrow.getDate() + 1);
    safeLocalStorage.set('hideUntilTime', tommorrow.toISOString());
    setIsOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AnimateModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="relative flex h-[93%] w-full flex-col">
        <Image alt="이벤트 안내" fill src="/event/goldhand_event_01.png" style={{ objectFit: 'contain' }} />
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

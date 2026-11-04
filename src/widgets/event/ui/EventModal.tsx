'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import eventImage from '@/public/event/goldhand_event_03.png';
import { safeLocalStorage } from '@/src/shared/storage';
import { Button } from '@/src/shared/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/src/shared/ui/dialog';

const FOOTER_HEIGHT = '3.5rem';

export const EventModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hideUntilTime = safeLocalStorage.get('hideUntilTime');
    setIsOpen(!(hideUntilTime && new Date(hideUntilTime) > new Date()));
  }, []);

  const handleDontShowToday = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    safeLocalStorage.set('hideUntilTime', tomorrow.toISOString());
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => setIsOpen(open);

  // 첫 렌더 시 버튼에 포커스 링이 생기지 않도록 자동 포커스를 막는다.
  const handleOpenAutoFocus = (event: Event) => event.preventDefault();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          'flex h-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[420px] flex-col gap-0 overflow-hidden rounded-2xl p-0',
          'sm:h-auto sm:max-h-[90dvh] sm:w-[calc(100%-2rem)] sm:max-w-[420px] sm:rounded-2xl',
          'md:max-w-[480px]',
        )}
        hideCloseButton
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <DialogTitle className="sr-only">소식 안내</DialogTitle>
        <Image
          alt="소식 안내"
          className="h-auto w-full object-contain"
          placeholder="blur"
          src={eventImage}
          style={{ maxHeight: `calc(90dvh - ${FOOTER_HEIGHT})` }}
        />
        <div className="grid shrink-0 grid-cols-2 border-t" style={{ height: FOOTER_HEIGHT }}>
          <Button
            className="h-full rounded-none text-base text-gray-500"
            variant="ghost"
            onClick={handleDontShowToday}
          >
            오늘 하루 보지 않기
          </Button>
          <Button className="h-full rounded-none text-base" onClick={() => handleOpenChange(false)}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

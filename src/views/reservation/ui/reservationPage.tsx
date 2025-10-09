'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { orderCardList } from '../config/const';
import { OrderCard } from './_OrderCard';

export const ReservationPage = () => {
  const [height, setHeight] = useState(0);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      if (window.outerWidth < 768) {
        setHeight(Math.min(window.scrollY * 0.2, 90));
        return;
      }
      setHeight(Math.min(window.scrollY * 0.1, 90));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="신청 페이지 이동중.." />}
      <div className="flex flex-col items-center justify-center">
        <SectionTitle title="고운황금손 예약상담" />
        <div className="relative mt-6">
          <div
            className={cn('absolute left-4 top-0 -z-10 w-[1px] border border-dashed border-slate-300', 'md:left-8')}
            style={{ height: `${height}%` }}
          />
          <div className="space-y-[9vw]">
            {orderCardList.map((orderCard, index) => (
              <OrderCard
                content={orderCard.content}
                key={orderCard.title}
                order={(index + 1).toString()}
                title={orderCard.title}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        className={cn(
          'mx-auto mt-12 flex items-center justify-center rounded-full bg-[#728146] px-16 py-4 text-lg text-white transition-all duration-300 ease-in-out',
          'hover:bg-[#062E16]',
          'md:mt-20 md:px-20 md:py-5 md:text-2xl',
        )}
        onClick={() => {
          startTransition(() => {
            router.push('/reservation/apply');
          });
        }}
      >
        예약상담 신청하기
      </button>
    </>
  );
};

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { FAQItemList, orderCardList } from '../config/const';
import { FAQItem } from './FAQItem';
import { OrderCard } from './OrderCard';

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
    <div>
      {isPending && <LoadingSpinnerOverlay text="신청 페이지 이동중.." />}
      <div className="flex flex-col items-center justify-center">
        <SectionTitle title="고운황금손 예약상담" />
        <div className="relative mt-14">
          <div
            className={`absolute left-3 top-0 -z-10 w-[1px] border border-dashed border-slate-400 md:left-8`}
            style={{ height: `${height}%` }}
          />
          <div className="space-y-[9vw]">
            {orderCardList.map((orderCard, index) => (
              <OrderCard
                content={orderCard.content}
                key={orderCard.title}
                order={(index + 1).toString()}
                title={orderCard.title}
              >
                {index === 0 ? (
                  <div className="flex flex-row gap-6 md:gap-10">
                    <div className="flex flex-row items-center gap-2">
                      <svg
                        className="h-6 w-6 md:h-12 md:w-12"
                        fill="#728146"
                        viewBox="0 -960 960 960"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M776-487q-5-121-89-205t-205-89v-60q72 2 135.5 30.5T729-734q48 48 76.5 111.5T836-487h-60Zm-169 0q-5-50-40-84.5T482-611v-60q75 5 127.5 57T667-487h-60Zm188 367q-116 0-236.5-56T335-335Q232-438 176-558.5T120-795q0-19.29 12.86-32.14Q145.71-840 165-840h140q14 0 24 10t14 25l26.93 125.64Q372-665 369.5-653.5t-10.73 19.73L259-533q26 44 55 82t64 72q37 38 78 69.5t86 55.5l95-98q10-11 23.15-15 13.15-4 25.85-2l119 26q15 4 25 16.04 10 12.05 10 26.96v135q0 19.29-12.86 32.14Q814.29-120 795-120ZM229-588l81-82-23-110H180q2 42 13.5 88.5T229-588Zm369 363q41 19 89 31t93 14v-107l-103-21-79 83ZM229-588Zm369 363Z" />
                      </svg>
                      <div className="font-bold md:text-2xl">010-4437-0431</div>
                    </div>
                    <Link
                      className="flex animate-pulse flex-row items-center gap-2 rounded-sm bg-slate-100/70 p-3 transition-all duration-1000 ease-in-out hover:bg-slate-200"
                      href="http://pf.kakao.com/_tvkwxj"
                      target="_blank"
                    >
                      <div className="relative h-6 w-6 md:h-12 md:w-12">
                        <Image alt="Kakao" fill sizes="100vw" src="/icon/kakaotalk.png" />
                      </div>
                      <div className="md:text-2xl">
                        <span className="font-bold">{'고운황금손'}</span> 클릭
                      </div>
                    </Link>
                  </div>
                ) : null}
              </OrderCard>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-20 px-[10vw]">
        <SectionTitle title="예약상담 FAQ" />
        <div className="mt-6 space-y-6">
          {FAQItemList.map(faqItem => (
            <div key={faqItem.title}>
              <FAQItem content={faqItem.content} title={faqItem.title} />
              <div className="h-[1px] w-full bg-gray-500" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center space-y-2 md:space-y-4">
          <button
            className="mx-auto flex items-center justify-center rounded-full bg-[#728146] px-16 py-4 text-lg text-white transition-all duration-300 ease-in-out hover:bg-[#062E16] md:py-6 md:text-2xl"
            onClick={() => {
              startTransition(() => {
                router.push('/reservation/apply');
              });
            }}
          >
            예약상담 신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

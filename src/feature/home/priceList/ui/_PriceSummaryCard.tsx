'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

type TIconType = 'commute' | 'livein' | 'halfday' | 'dayone';

const ICON_PATHS: Record<TIconType, React.ReactNode> = {
  commute: (
    <>
      <path d="M10 36h44M14 36l5-13h26l5 13M8 36v8h5v-4h38v4h5v-8" />
      <circle cx="18" cy="44" r="4" />
      <circle cx="46" cy="44" r="4" />
    </>
  ),
  livein: (
    <>
      <path d="M10 32L32 12l22 20" />
      <path d="M16 28v24h32V28" />
      <path d="M26 52V38h12v14" />
    </>
  ),
  halfday: (
    <>
      <circle cx="32" cy="32" r="10" />
      <line x1="32" y1="8" x2="32" y2="16" />
      <line x1="32" y1="48" x2="32" y2="56" />
      <line x1="8" y1="32" x2="16" y2="32" />
      <line x1="48" y1="32" x2="56" y2="32" />
      <line x1="16.7" y1="16.7" x2="22.3" y2="22.3" />
      <line x1="41.7" y1="41.7" x2="47.3" y2="47.3" />
      <line x1="16.7" y1="47.3" x2="22.3" y2="41.7" />
      <line x1="41.7" y1="22.3" x2="47.3" y2="16.7" />
    </>
  ),
  dayone: (
    <>
      <rect height="38" rx="3" width="44" x="10" y="16" />
      <line x1="10" y1="28" x2="54" y2="28" />
      <line x1="22" y1="10" x2="22" y2="22" />
      <line x1="42" y1="10" x2="42" y2="22" />
      <rect height="8" rx="1" width="8" x="20" y="34" />
    </>
  ),
};

type TPriceSummaryCardProps = {
  title: string;
  description: string;
  priceList: { type: string; week: string; price: number }[];
  iconType: TIconType;
};

export const PriceSummaryCard = ({ title, description, priceList, iconType }: TPriceSummaryCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label={title}
      className={cn(
        'flex w-full flex-col rounded-lg border border-slate-100 bg-white shadow-md text-left',
        'hover:border-gold/40 hover:shadow-lg transition-all',
      )}
      type="button"
      onClick={() => startTransition(() => router.push('/price'))}
    >
      {isPending && <LoadingSpinnerOverlay text="이용요금 페이지 이동중..." />}
      {/* SVG 아이콘 영역 */}
      <div className="flex h-[88px] items-center justify-center">
        <svg
          aria-hidden="true"
          fill="none"
          height={64}
          stroke="#A88547"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          viewBox="0 0 64 64"
          width={64}
        >
          {ICON_PATHS[iconType]}
        </svg>
      </div>
      {/* 텍스트 + 가격 */}
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex flex-col">
          {priceList.map(item => (
            <div className="mt-4 flex flex-row justify-between gap-4" key={item.type}>
              <span className="text-base font-semibold">{item.type}</span>
              <div className="flex flex-row items-center gap-1.5">
                <span className="text-xs text-gray-500">{item.week}</span>
                <span className="text-base font-bold">{item.price.toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
        {/* gold chevron */}
        <div className="mt-4 flex justify-end">
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-gold"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            viewBox="0 0 24 24"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </button>
  );
};

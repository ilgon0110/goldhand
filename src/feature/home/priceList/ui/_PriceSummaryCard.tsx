'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

type TIconType = 'commute' | 'livein' | 'halfday' | 'dayone';

const ICON_PATHS: Record<TIconType, React.ReactNode> = {
  // 집 + 아치형 동선 + 도착 화살표
  commute: (
    <>
      <path d="M14 34 L24 26 L34 34" />
      <path d="M16 34 V44 H32 V34" />
      <path d="M22 44 V38 H26 V44" />
      <path d="M28 22 Q40 12 52 22" strokeDasharray="2 3" />
      <path d="M52 22 L48 19 M52 22 L49 26" />
      <circle cx="52" cy="22" r="1.4" fill="currentColor" />
    </>
  ),
  // 집 + 초승달 + 별 (밤새 함께)
  livein: (
    <>
      <path d="M14 38 L32 22 L50 38" />
      <path d="M18 36 V50 H46 V36" />
      <path d="M29 50 V42 H35 V50" />
      <path d="M48 16 a5 5 0 1 0 5 5 a4 4 0 0 1 -5 -5 z" fill="currentColor" fillOpacity={0.12} />
      <path d="M16 20 v3 M14.5 21.5 h3" />
    </>
  ),
  // 수평선 + 반쪽 해 (왼) + 반쪽 달 (오른)
  halfday: (
    <>
      <line x1="10" y1="38" x2="54" y2="38" />
      <path d="M14 38 a10 10 0 0 1 20 0" />
      <line x1="24" y1="20" x2="24" y2="24" />
      <line x1="16" y1="28" x2="18.5" y2="30.5" />
      <line x1="32" y1="28" x2="29.5" y2="30.5" />
      <line x1="12" y1="38" x2="9" y2="38" />
      <path d="M38 38 a8 8 0 0 1 16 0" />
      <path d="M42 38 a5 5 0 0 1 8 -4 a4 4 0 0 0 -8 4 z" fill="currentColor" fillOpacity={0.12} />
      <line x1="22" y1="46" x2="42" y2="46" strokeDasharray="2 3" />
    </>
  ),
  // 캘린더 + 원형 날짜 마커
  dayone: (
    <>
      <rect height="32" rx="2" width="36" x="14" y="18" />
      <line x1="14" y1="26" x2="50" y2="26" />
      <line x1="22" y1="14" x2="22" y2="22" />
      <line x1="42" y1="14" x2="42" y2="22" />
      <line x1="22" y1="34" x2="42" y2="34" strokeDasharray="2 3" opacity={0.5} />
      <line x1="22" y1="42" x2="42" y2="42" strokeDasharray="2 3" opacity={0.5} />
      <circle cx="32" cy="38" r="4.5" fill="currentColor" fillOpacity={0.15} />
      <path d="M32 36 v4 M30 38 h4" />
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
      <div className="flex h-[88px] items-center justify-center text-gold">
        <svg
          aria-hidden="true"
          fill="none"
          height={64}
          stroke="currentColor"
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

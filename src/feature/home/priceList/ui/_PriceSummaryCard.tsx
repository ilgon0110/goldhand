'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { IconType } from 'react-icons';
import { PiArrowRight, PiCalendarCheck, PiHouseLine, PiMoonStars, PiSunHorizon } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

type TIconType = 'commute' | 'dayone' | 'halfday' | 'livein';

const ICONS: Record<TIconType, IconType> = {
  commute: PiHouseLine,
  livein: PiMoonStars,
  halfday: PiSunHorizon,
  dayone: PiCalendarCheck,
};

type TPriceSummaryCardProps = {
  title: string;
  description: string;
  priceList: { type: string; week: string; price: number }[];
  iconType: TIconType;
  featured?: boolean;
};

export const PriceSummaryCard = ({ title, description, priceList, iconType, featured }: TPriceSummaryCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const Icon = ICONS[iconType];

  return (
    <button
      className={cn(
        // lg 미만: '지점 소개' 카드와 동일한 가로형(좌측 7rem 패널 + 우측 정보) 레이아웃
        'group relative grid h-full w-full grid-cols-[7rem_1fr] overflow-hidden rounded-2xl border text-left transition-colors active:scale-[0.99]',
        featured
          ? 'border-gold/40 bg-gold/[0.07] hover:border-gold/70'
          : 'border-border bg-background hover:border-gold/50',
        featured
          ? 'lg:row-span-3 lg:flex lg:flex-col lg:p-9'
          : 'lg:grid-cols-[auto_1fr] lg:items-center lg:gap-6 lg:p-5',
      )}
      type="button"
      onClick={() => startTransition(() => router.push('/price'))}
    >
      {isPending && <LoadingSpinnerOverlay text="이용요금 페이지 이동중..." />}

      <div
        className={cn(
          'flex min-h-[152px] items-center justify-center bg-gold/10',
          'md:min-h-[180px]',
          'lg:min-h-0 lg:bg-transparent',
          featured && 'lg:mb-10 lg:justify-between',
        )}
      >
        <span
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full bg-background text-goldDeep',
            'lg:h-11 lg:w-11 lg:bg-gold/15',
            featured && 'lg:h-14 lg:w-14',
          )}
        >
          <Icon aria-hidden="true" className={cn('h-6 w-6', featured && 'lg:h-7 lg:w-7')} />
        </span>
        {featured && <BestBadge className={cn('hidden', 'lg:inline-block')} />}
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-col justify-center gap-1 p-4',
          'md:gap-1.5 md:p-5',
          featured ? 'lg:flex-1 lg:p-0' : 'lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:p-0',
        )}
      >
        <div className={cn(featured && 'lg:flex-1')}>
          <div className="flex items-center gap-2">
            <p className={cn('text-base font-bold text-foreground', 'md:text-lg', featured && 'lg:text-3xl')}>
              {title}
            </p>
            {featured && <BestBadge className="lg:hidden" />}
          </div>
          <p className={cn('mt-0.5 break-keep text-sm text-muted-foreground', featured && 'lg:mt-1 lg:text-base')}>
            {description}
          </p>
        </div>

        <dl
          className={cn(
            'mt-2 flex flex-col gap-0.5',
            'md:mt-3',
            featured ? 'lg:mt-10 lg:gap-4 lg:border-t lg:border-gold/30 lg:pt-6' : 'lg:mt-0 lg:gap-1',
          )}
        >
          {priceList.map(item => (
            <div
              className={cn('flex items-baseline justify-between gap-4', !featured && 'lg:justify-end')}
              key={item.type}
            >
              <dt className={cn('text-sm font-semibold text-foreground', featured && 'lg:mr-auto lg:text-base')}>
                {item.type}
              </dt>
              <dd className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground">{item.week}</span>
                <span
                  className={cn(
                    'text-sm font-bold tabular-nums text-foreground',
                    'md:text-base',
                    featured && 'lg:text-3xl lg:tracking-tight',
                  )}
                >
                  {item.price.toLocaleString()}원
                </span>
              </dd>
            </div>
          ))}
        </dl>

        {featured && (
          <span className={cn('mt-8 hidden items-center gap-2 text-sm font-semibold text-goldDeep', 'lg:inline-flex')}>
            이용요금 자세히 보기
            <PiArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        )}
      </div>
    </button>
  );
};

function BestBadge({ className }: { className?: string }) {
  return (
    <span className={cn('rounded-full bg-goldDeep px-2.5 py-0.5 text-xs font-semibold text-white', className)}>
      BEST
    </span>
  );
}

import Image from 'next/image';
import { PiArrowUpRight } from 'react-icons/pi';

import { BRANCHES } from '@/app/franchisee/franchisee.config';
import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { formatPhoneNumber } from '@/src/shared/utils';

import { HomeSectionHeading } from '../../ui/HomeSectionHeading';

type TBranch = (typeof BRANCHES)[number];

function BranchTile({ branch, featured }: { branch: TBranch; featured: boolean }) {
  return (
    <a
      className={cn(
        // lg 미만: 좌측 썸네일 + 우측 정보의 가로형 카드로 한 화면에 여러 지점 노출
        'group grid h-full grid-cols-[7rem_1fr] overflow-hidden rounded-2xl border border-border bg-background transition-colors',
        'hover:border-gold/50',
        'md:grid-cols-[2fr_3fr]',
        featured && 'lg:row-span-2 lg:flex lg:flex-col',
      )}
      href={branch.naverPlaceUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div
        className={cn(
          'relative h-full min-h-[152px] overflow-hidden bg-muted',
          'md:min-h-[180px]',
          featured && 'lg:min-h-[280px] lg:flex-1',
        )}
      >
        <Image
          alt={`고운황금손 ${branch.title}`}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          fill
          sizes={
            featured
              ? '(min-width: 1024px) 50vw, (min-width: 768px) 40vw, 112px'
              : '(min-width: 1024px) 20vw, (min-width: 768px) 40vw, 112px'
          }
          src={branch.images[0]}
        />
      </div>
      <div className={cn('flex min-w-0 flex-col gap-1 p-4', 'md:gap-1.5 md:p-5', featured && 'lg:p-7')}>
        <div className="flex items-baseline gap-2">
          <h3 className={cn('text-base font-bold text-foreground', 'md:text-lg', featured && 'lg:text-2xl')}>
            {branch.title}
          </h3>
          <span className="text-sm font-semibold text-goldDeep">{branch.badge}</span>
        </div>
        <p className="break-keep text-sm text-muted-foreground">{branch.address}</p>
        <p className="text-sm tabular-nums text-muted-foreground">{formatPhoneNumber(branch.phoneNumber)}</p>
        <span className={cn('mt-2 inline-flex items-center gap-1 text-sm font-semibold text-goldDeep', 'md:mt-3')}>
          네이버 플레이스 이동하기
          <PiArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
          <span className="sr-only">(새 탭에서 열림)</span>
        </span>
      </div>
    </a>
  );
}

export function FranchiseeSheetList() {
  return (
    <FadeInWhenVisible>
      <HomeSectionHeading description="고운황금손 지점을 소개합니다." title="고운황금손 지점 소개" />
      <div className={cn('mt-10 grid grid-cols-1 gap-3', 'md:gap-5', 'lg:grid-cols-2')}>
        {BRANCHES.map((branch, index) => (
          <BranchTile branch={branch} featured={index === 0} key={branch.id} />
        ))}
      </div>
    </FadeInWhenVisible>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { PiArrowRight, PiArrowSquareOut, PiMapPin, PiPhone, PiStorefront } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { formatPhoneNumber } from '@/src/shared/utils';

import { BRANCHES } from './franchisee.config';

// 타입 스케일·섹션 구분은 다른 안내 페이지와 동일: h1 24/30/36, h2 20/24/30
const BUTTON = cn(
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep focus-visible:ring-offset-2',
);

type TBranch = (typeof BRANCHES)[number];

// 지점 하나: 좌측 정보·연락, 우측 사진 3장(대표 1 + 보조 2). 모든 지점이 같은 구조로 반복된다.
function BranchSection({ branch }: { branch: TBranch }) {
  const isHeadOffice = branch.badge === '본점';

  return (
    <FadeInWhenVisible>
      <article className={cn('grid gap-8 py-10', 'md:py-14', 'lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-12')}>
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                'rounded-md px-2 py-0.5 font-semibold',
                isHeadOffice ? 'bg-goldDeep text-white' : 'bg-gold/10 text-goldDeep',
              )}
            >
              {branch.badge}
            </span>
            <span className="text-muted-foreground">{branch.region}</span>
          </div>
          <h2 className={cn('mt-3 text-lg font-bold text-foreground', 'md:text-xl', 'xl:text-2xl')}>{branch.title}</h2>

          <dl className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <dt className="flex items-center gap-1.5 pt-px text-sm text-muted-foreground">
                <PiMapPin aria-hidden="true" className="h-4 w-4" />
                <span className="w-14">주소</span>
              </dt>
              <dd className="text-foreground">{branch.address}</dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="flex items-center gap-1.5 pt-px text-sm text-muted-foreground">
                <PiPhone aria-hidden="true" className="h-4 w-4" />
                <span className="w-14">대표 문의</span>
              </dt>
              <dd className="tabular-nums text-foreground">{formatPhoneNumber(branch.phoneNumber)}</dd>
            </div>
          </dl>

          <div className={cn('mt-8 grid grid-cols-2 gap-3', 'sm:flex')}>
            <Link className={cn(BUTTON, 'bg-goldDeep text-white', 'hover:bg-[#6B5224]')} href="/reservation">
              예약 상담하기
              <PiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              className={cn(
                BUTTON,
                // 네이버 브랜드 색(naver 토큰)으로 글자·테두리 유지
                'border border-naver bg-background text-naver',
                'hover:bg-naver/5',
              )}
              href={branch.naverPlaceUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              네이버 플레이스
              <PiArrowSquareOut aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">(새 탭에서 열림)</span>
            </a>
          </div>
        </div>

        {/* 사진: 대표 1장 + 보조 2장 */}
        <div className={cn('grid h-64 grid-cols-[1.6fr_1fr] grid-rows-2 gap-2', 'md:h-80')}>
          {branch.images.map((src, index) => (
            <div className={cn('relative overflow-hidden rounded-xl bg-muted', index === 0 && 'row-span-2')} key={src}>
              <Image
                alt={index === 0 ? `고운황금손 ${branch.title}` : `고운황금손 ${branch.title} 내부 ${index}`}
                className="object-cover"
                fill
                sizes={index === 0 ? '(min-width: 1024px) 35vw, 60vw' : '(min-width: 1024px) 20vw, 40vw'}
                src={src}
              />
            </div>
          ))}
        </div>
      </article>
    </FadeInWhenVisible>
  );
}

export default function FranchiseePage() {
  return (
    <div className="break-keep">
      {/* 1. 제목 */}
      <div className={cn('pb-8 pt-16', 'md:pb-10 md:pt-24')}>
        <FadeInWhenVisible>
          <h1 className="space-y-4">
            <span className="flex items-center gap-2 text-base font-bold text-goldDeep">
              <PiStorefront aria-hidden="true" className="h-5 w-5" />
              고운황금손 지점 안내
            </span>
            <span
              className={cn(
                // 문장형 긴 제목이라 다른 페이지 h1보다 한 단계 작게(20/24/30) 두어 데스크톱 2줄에 맞춘다.
                'block text-xl font-bold leading-[1.4] tracking-[-0.01em] text-foreground [text-wrap:balance]',
                'md:text-2xl md:leading-[1.4]',
                'xl:text-3xl xl:leading-[1.4]',
              )}
            >
              보건복지부·정부바우처 등록 기관으로 운영되는 본점·지점 모두에서 동일한 기준의 산모·신생아 케어를 받으실 수
              있습니다.
            </span>
          </h1>
        </FadeInWhenVisible>
      </div>

      {/* 2. 지점 목록 */}
      {/* 지점 사이에만 구분선(divide-y). 첫 지점은 위 여백 없이 굵은 구분선 바로 아래에서 시작한다. */}
      <div
        className={cn(
          'divide-y divide-border border-t-2 border-foreground pt-8 [&>*:first-child>article]:pt-0',
          'md:pt-10',
        )}
      >
        {BRANCHES.map(branch => (
          <BranchSection branch={branch} key={branch.id} />
        ))}
      </div>
    </div>
  );
}

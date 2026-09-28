import Link from 'next/link';
import { PiArrowRight, PiCalendarCheck, PiInfo, PiPhone } from 'react-icons/pi';
import { RiKakaoTalkFill } from 'react-icons/ri';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';

import { orderCardList } from './config';

// 좌우 여백은 app/reservation/layout.tsx가 정의한다(하위 form·list 페이지와 공유).
// 이 페이지는 다른 안내 페이지와 같은 본문 폭(1080px)만 맞춘다. 타입 스케일은 /price·/voucher와 동일.
const H2 = cn('break-keep text-xl font-bold leading-[1.35] text-foreground', 'md:text-2xl', 'xl:text-3xl');
const CONTACT_BUTTON = cn(
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-colors duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep focus-visible:ring-offset-2',
);

export default function ReservationPage() {
  return (
    <div className="mx-auto max-w-[1080px] break-keep pb-28">
      {/* 1. 제목 + 연락 수단 */}
      <div className={cn('pb-16 pt-16', 'md:pb-20 md:pt-24')}>
        <FadeInWhenVisible>
          <h1 className="space-y-4">
            <span className="flex items-center gap-2 text-base font-bold text-goldDeep">
              <PiCalendarCheck aria-hidden="true" className="h-5 w-5" />
              예약 상담
            </span>
            <span
              className={cn(
                'block text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
                'md:text-3xl md:leading-[1.3]',
                'xl:text-4xl xl:leading-[1.3]',
              )}
            >
              산후도우미 서비스 상담을 신청하세요
            </span>
          </h1>
          <p className={cn('mt-6 text-base leading-relaxed text-muted-foreground', 'md:text-lg')}>
            간단한 정보만 입력하시면, 가장 빠른 시간 내에 상담 연락을 드립니다.
          </p>

          <div className={cn('mt-8 flex flex-col gap-3', 'sm:flex-row sm:flex-wrap')}>
            <Link
              className={cn(CONTACT_BUTTON, 'bg-goldDeep text-white', 'hover:bg-[#6B5224]')}
              href="/reservation/apply"
            >
              예약상담 신청하기
              <PiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              className={cn(
                CONTACT_BUTTON,
                'border border-border bg-background tabular-nums text-foreground',
                'hover:border-gold/60 hover:text-goldDeep',
              )}
              href="tel:01044370431"
            >
              <PiPhone aria-hidden="true" className="h-5 w-5" />
              010-4437-0431
            </a>
            <a
              className={cn(CONTACT_BUTTON, 'bg-[#FAE100] text-[#3C1E1E]', 'hover:bg-[#f0d600]')}
              href="https://pf.kakao.com/_cpdEX"
              rel="noopener noreferrer"
              target="_blank"
            >
              <RiKakaoTalkFill aria-hidden="true" className="h-5 w-5" />
              카카오톡 채널
              <span className="sr-only">(새 탭에서 열림)</span>
            </a>
          </div>
          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <PiInfo aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            상담 시간 외 문의는 카카오톡 채널을 이용해 주세요. 빠른 시간 내에 답변드립니다.
          </p>
        </FadeInWhenVisible>
      </div>

      {/* 2. 예약 진행 절차: 단계 | 제목 | 설명 행 목록 (순서 자체가 정보이므로 단계 번호 유지) */}
      <div className={cn('border-t-2 border-foreground pt-10', 'md:pt-12')}>
        <div className="max-w-[65ch] space-y-3">
          <h2 className={H2}>예약 진행 절차</h2>
          <p className={cn('text-muted-foreground', 'md:text-lg')}>모든 단계는 본점·지점 동일한 기준으로 운영됩니다.</p>
        </div>
        <FadeInWhenVisible>
          {/* 단계 | 타임라인 점 | 제목 | 설명 행 목록. hover 시 행이 흰 카드(rounded + shadow)로 떠오른다. */}
          <ol className={cn('mt-10 rounded-2xl bg-muted/50 p-2', 'md:mt-12 md:p-3')}>
            {orderCardList.map((step, index) => {
              const isFirst = index === 0;
              const isLast = index === orderCardList.length - 1;
              return (
                <li
                  className={cn(
                    'grid grid-cols-[1.5rem_1fr] gap-x-3 rounded-xl px-3 py-5 transition-[background-color,box-shadow] duration-200',
                    'hover:bg-background hover:shadow-[0_12px_32px_-16px_rgba(139,107,48,0.35)]',
                    'md:px-6 md:py-6',
                    'lg:grid-cols-[4.5rem_1.5rem_14rem_1fr] lg:items-center lg:gap-x-4',
                  )}
                  key={step.title}
                >
                  {/* 단계 (lg 이상 첫 열). lg 미만은 제목 앞에 인라인으로 표기 */}
                  <span className={cn('hidden text-sm font-semibold tabular-nums text-muted-foreground', 'lg:block')}>
                    {index + 1}단계
                  </span>

                  {/* 타임라인: 행 사이를 잇는 세로선 + 점 */}
                  <span
                    aria-hidden="true"
                    className={cn('relative row-span-2 flex justify-center', 'lg:row-span-1 lg:self-stretch')}
                  >
                    <span
                      className={cn(
                        'absolute w-px bg-border',
                        isFirst ? 'top-7 lg:top-1/2' : '-top-5 md:-top-6',
                        isLast ? 'h-7 lg:bottom-1/2 lg:h-auto' : '-bottom-5 md:-bottom-6',
                      )}
                    />
                    <span
                      className={cn(
                        'relative mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-goldDeep bg-background',
                        'lg:mt-0 lg:self-center',
                      )}
                    />
                  </span>

                  {/* 제목 (모바일: 'N단계' 표기 포함) */}
                  <h3 className={cn('text-base font-bold text-foreground', 'lg:text-lg')}>
                    <span className={cn('mr-1.5 text-sm font-semibold text-muted-foreground', 'lg:sr-only')}>
                      {index + 1}단계
                    </span>
                    {step.title}
                  </h3>

                  {/* 설명 */}
                  <p
                    className={cn(
                      'col-start-2 mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground',
                      'md:text-[15px]',
                      'lg:col-start-auto lg:mt-0',
                    )}
                  >
                    {step.content}
                  </p>
                </li>
              );
            })}
          </ol>
        </FadeInWhenVisible>
      </div>
    </div>
  );
}

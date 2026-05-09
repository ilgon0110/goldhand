import Link from 'next/link';

import { cn } from '@/lib/utils';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import { orderCardList } from './reservation.config';

export default function ReservationPage() {
  return (
    <>
      <SectionTitleHero description="모든 단계는 본점·지점 동일한 기준으로 운영됩니다." label="예약 상담 · CONSULT" />
      {/* 스텝 목록 */}
      <div className="mx-auto max-w-[880px] pb-20">
        <ol className="relative m-0 list-none p-0">
          {orderCardList.map((step, index) => (
            <li
              className={cn(
                'grid gap-7 py-7',
                index === 0 ? 'pt-0' : 'border-t border-[#E8E1D2]',
                index === orderCardList.length - 1 && 'border-b border-[#E8E1D2] pb-8',
                'grid-cols-[48px_1fr]',
                'md:grid-cols-[48px_1fr_auto]',
              )}
              key={step.title}
            >
              {/* 숫자 원 */}
              <div className="relative z-10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#A88547] bg-[#FBF8F1] text-sm text-[#8B6B30]">
                {index + 1}
              </div>

              {/* 내용 */}
              <div className="pt-0.5">
                <p className={cn('font-semibold tracking-tight text-[#1B1814]', 'text-base', 'md:text-lg')}>
                  {step.title}
                </p>
                <p className="mt-1.5 max-w-lg whitespace-pre-line text-sm leading-relaxed text-[#5C5249]">
                  {step.content}
                </p>

                {/* Step 1 연락 chip */}
                {index === 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <a
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border border-[#E8E1D2] bg-white px-3.5 py-2 text-sm text-[#1B1814] transition-all',
                        'hover:border-[#A88547] hover:bg-[#F6F1E7]',
                      )}
                      href="tel:01044370431"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-3.5 w-3.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 -960 960 960"
                      >
                        <path d="M795-120q-116 0-236.5-56T335-335Q232-438 176-558.5T120-795q0-19 13-32t32-13h140q14 0 24 10t14 25l27 126q2 13-1 22t-10 16L259-533q26 44 55 82t64 72q37 38 78 69t86 56l95-98q10-11 23-15t26-2l119 26q15 4 25 16t10 27v135q0 19-13 32t-32 13Z" />
                      </svg>
                      <span className="font-serif tracking-wide">010-4437-0431</span>
                    </a>
                    <a
                      className="inline-flex items-center gap-2 rounded-full bg-[#FAE100] px-3.5 py-2 text-sm font-semibold text-[#3C1E1E] transition-all hover:bg-[#f0d600]"
                      href="http://pf.kakao.com/_tvkwxj"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-3.5 w-3.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.78 5.07 4.45 6.43-.18.6-1.05 3.42-1.08 3.6 0 0-.02.18.1.24.12.07.27.02.27.02.18-.03 3.4-2.22 3.97-2.6.74.1 1.5.16 2.29.16 5.52 0 10-3.48 10-7.85S17.52 3 12 3z" />
                      </svg>
                      <span>카카오톡 채널</span>
                    </a>
                  </div>
                )}
              </div>

              {/* STEP 라벨 (데스크탑) */}
              <div className="hidden pt-2.5 text-xs uppercase tracking-[0.18em] text-[#9A8F84] md:block">
                STEP {String(index + 1).padStart(2, '0')}
              </div>
            </li>
          ))}
        </ol>

        {/* 참고 노트 */}
        <div className="mt-7 border-l-2 border-[#A88547] bg-[#F6F1E7] px-5 py-4 text-xs leading-relaxed text-[#5C5249]">
          <strong className="text-[#1B1814]">참고</strong> · 상담 시간 외 문의는 카카오톡 채널을 이용해 주세요. 빠른
          시간 내에 답변드립니다.
        </div>

        {/* CTA */}
        <div className="mt-7 text-center">
          <Link
            className={cn(
              'inline-flex items-center gap-3 rounded-full bg-[#728146] px-14 py-4 text-sm font-semibold tracking-wide text-white transition-colors',
              'hover:bg-[#062E16]',
            )}
            href="/reservation/apply"
          >
            예약상담 신청하기
            <svg fill="none" height={14} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" width={14}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}

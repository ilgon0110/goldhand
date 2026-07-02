import Link from 'next/link';

import { cn } from '@/lib/utils';
import { gowunDodumFont } from '@/shared/fonts';
import SectionTitleHero from '@/shared/ui/SectionTitleHero';

import { policyList, ruleList } from './config';
import { PromiseCard } from './ui';

const PROMISES = [
  {
    index: 'I',
    title: '전문성',
    sub: 'EXPERTISE',
    desc: '전문 교육을 수료한 관리사가 신생아 돌보기와 산모 건강 관리를 책임집니다.',
  },
  {
    index: 'II',
    title: '안전성',
    sub: 'SAFETY',
    desc: '배상보험 가입 및 정밀 건강검진을 받은 관리사가 안전한 서비스를 제공합니다.',
  },
  {
    index: 'III',
    title: '맞춤 케어',
    sub: 'TAILORED CARE',
    desc: '각 가정의 라이프스타일과 필요에 맞춘 세심한 케어 계획을 제안합니다.',
  },
];

const Page = () => {
  return (
    <div className="flex flex-col items-center">
      {/* 1. Hero */}
      <SectionTitleHero
        description="전문 교육과 배상보험을 갖춘, 가정 방문 산후 케어 전문인입니다."
        label="산후관리사란?"
      />

      {/* 2. Lede */}
      <div className={cn('mx-auto max-w-[680px] px-6 text-center')}>
        <p className={cn('break-keep text-sm leading-[1.95] text-stone-700', 'md:text-base')}>
          출산 후, 몸의 회복이 중요한 시기인 산욕기(분만 종료 후 6~8주간)에 산모님이 가정에서 편안하게 산후관리를 하실
          수 있도록 도와드리기 위해, 산모 영양·건강관리, 신생아 돌보기 등 전문 교육을 수료하고 배상보험에 가입되어
          가정방문 산후관리 서비스를 제공하는 전문인입니다.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {['전문교육 이수', '배상보험 가입', '맞춤형 가정 케어'].map(tag => (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E1D2] px-3.5 py-1.5 text-xs tracking-[0.04em] text-stone-500"
              key={tag}
            >
              <span className="h-1 w-1 rounded-full bg-gold" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Gold Rule */}
      <div className="flex justify-center py-[72px]">
        <div className="h-14 w-px bg-gold" />
      </div>

      {/* 4. Pull Quote */}
      <div className={cn('mx-auto max-w-[800px] px-6 text-center')}>
        <div className={cn(`${gowunDodumFont.className} mb-[18px] text-5xl leading-none text-gold/50`)}>&ldquo;</div>
        <p
          className={cn(
            `${gowunDodumFont.className} break-keep text-[21px] leading-relaxed tracking-tight text-stone-900`,
            'md:text-3xl',
          )}
        >
          산모님의 회복이 가장 중요한 시기,
          <br />
          고운황금손이 가정으로 찾아갑니다.
        </p>
        <div className="mt-[22px] text-[11px] tracking-[0.32em] text-gold">─── 고운황금손의 약속 ───</div>
      </div>

      {/* 5. Three Promises */}
      <section className={cn('mx-auto mt-8 w-full max-w-5xl px-6', 'md:px-8')}>
        <div className="mb-12 text-center">
          <p className={cn('mt-4 text-sm text-stone-400', 'md:text-base')}>
            고운황금손의 모든 관리사는 다음을 약속드립니다.
          </p>
        </div>
        <div className={cn('grid border-t border-[#E8E1D2]', 'md:grid-cols-3')}>
          {PROMISES.map((promise, idx) => (
            <div
              className={cn(
                'border-b border-[#E8E1D2]',
                idx < PROMISES.length - 1 && 'md:border-r md:border-[#E8E1D2]',
              )}
              key={promise.index}
            >
              <PromiseCard {...promise} />
            </div>
          ))}
        </div>
      </section>

      {/* 6. Qualifications */}
      <section className={cn('mx-auto mt-24 w-full max-w-5xl px-6', 'md:px-8')} id="qualifications">
        <div className="mb-12 text-center">
          <h2
            className={cn(
              `${gowunDodumFont.className} text-3xl font-medium tracking-tight text-stone-900`,
              'md:text-4xl',
            )}
          >
            산후관리사 자격조건
          </h2>
          <p className={cn('mt-4 text-sm text-stone-400', 'md:text-base')}>
            산후관리사로 활동하기 위한 주요 자격 및 교육 요건입니다.
          </p>
        </div>
        <div className={cn('grid gap-10 border-t border-[#E8E1D2] pt-14', 'md:grid-cols-[1.2fr_1fr] md:gap-[72px]')}>
          <ol className="m-0 list-none p-0">
            {ruleList.map(({ number, contents }) => (
              <li
                className={cn(
                  'grid items-start gap-3.5 border-b border-[#EFE9DA] py-[18px]',
                  'grid-cols-[36px_1fr]',
                  'first:border-t first:border-[#EFE9DA]',
                  'md:grid-cols-[56px_1fr] md:gap-5 md:py-[22px]',
                )}
                key={number}
              >
                <div className={cn(`${gowunDodumFont.className} pt-1 text-[13px] tracking-[0.18em] text-gold`)}>
                  {number}
                </div>
                <div className="break-keep text-[15px] leading-[1.75] text-stone-700">{contents}</div>
              </li>
            ))}
          </ol>

          <aside className="relative border border-[#E8E1D2] bg-gradient-to-b from-[rgba(247,242,230,0.5)] to-transparent p-6 md:p-8">
            <div className="absolute -left-px top-6 h-8 w-[3px] bg-gold" />
            <p className="mb-3.5 text-[11px] tracking-[0.32em] text-gold">EDUCATION &amp; INSURANCE</p>
            <h3
              className={cn(
                `${gowunDodumFont.className} mb-[18px] text-[19px] font-medium tracking-tight text-stone-900`,
                'md:text-[22px]',
              )}
            >
              교육 &amp; 보장
            </h3>
            <p className="text-sm leading-[1.85] text-stone-700">
              모든 관리사는 정기 교육을 받고 배상보험에 가입되어 있습니다.
            </p>
            <p className="mt-2 text-sm leading-[1.85] text-stone-700">
              안전한 가정방문 서비스를 제공하기 위해 정기적인 교육을 진행합니다.
            </p>
            <div className="my-[22px] h-px bg-[#E8E1D2]" />
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {['위생 및 응급처치 교육', '신생아 관리 실습', '고객 응대 및 윤리 교육'].map(item => (
                <li className="relative pl-[22px] text-sm leading-[1.7] text-stone-700" key={item}>
                  <span className="absolute left-0 top-[9px] block h-px w-2.5 bg-gold" />
                  <span className="absolute left-1 top-[5px] block h-[9px] w-px bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* 7. Code of Conduct */}
      <section className="mt-24 w-full">
        <div className="mb-12 text-center">
          <h2
            className={cn(
              `${gowunDodumFont.className} text-3xl font-medium tracking-tight text-stone-900`,
              'md:text-4xl',
            )}
          >
            산후관리사 준수사항
          </h2>
          <p className={cn('mx-auto mt-4 max-w-[640px] break-keep px-6 text-sm text-stone-400', 'md:text-base')}>
            관리사 활동 중 회사 절차를 따르지 않고 임의로 수행한 행위에 대해서는 회사가 책임을 지지 않으며, 적발 시 내부
            규정에 따라 조치됩니다.
          </p>
        </div>
        <div className={cn('mx-auto max-w-[880px] px-6')}>
          <div className={cn('grid', 'md:grid-cols-2')}>
            {policyList.map(({ number, title, contents }, idx) => (
              <div
                className={cn(
                  'grid items-start gap-3.5 border-t border-[#E8E1D2] py-[22px]',
                  'grid-cols-[36px_1fr]',
                  'md:grid-cols-[56px_1fr] md:gap-5 md:px-7 md:py-7',
                  idx % 2 === 0 && 'md:border-r md:border-[#E8E1D2]',
                  idx === policyList.length - 1 && 'border-b',
                  idx === policyList.length - 2 && idx % 2 === 0 && 'border-b',
                )}
                key={number}
              >
                <div className={cn(`${gowunDodumFont.className} pt-1 text-[13px] tracking-[0.18em] text-gold`)}>
                  {number}
                </div>
                <div>
                  <p
                    className={cn(
                      `${gowunDodumFont.className} mb-1.5 text-[15px] font-medium leading-[1.5] tracking-tight text-stone-900`,
                      'md:text-base',
                    )}
                  >
                    {title}
                  </p>
                  <p className="break-keep text-sm leading-[1.85] text-stone-700">{contents}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <div className={cn('mx-auto mt-[120px] w-full max-w-[880px] px-6')}>
        <div
          className={cn(
            'relative grid gap-6 border border-[#E8E1D2] bg-gradient-to-b from-[rgba(247,242,230,0.6)] to-transparent p-8',
            'md:grid-cols-[1fr_auto] md:items-center md:p-12',
          )}
        >
          <div className="absolute left-8 top-0 h-px w-9 bg-gold" />
          <div>
            <p className="mb-3 text-[11px] tracking-[0.4em] text-gold">예약 상담</p>
            <h3
              className={cn(
                `${gowunDodumFont.className} mb-2.5 text-xl font-medium leading-[1.5] tracking-tight text-stone-900`,
                'md:text-2xl',
              )}
            >
              상담이 필요하신가요?
            </h3>
            <p className="max-w-[32rem] break-keep text-sm leading-[1.8] text-stone-500">
              간단한 정보만 입력하시면, 가장 빠른 시간 내에 상담 연락을 드립니다.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2.5 border border-gold px-6 py-3.5 text-[13px] font-medium tracking-[0.18em] text-[#8B6B30] transition-colors hover:bg-gold hover:text-white"
            href="/reservation"
          >
            상담 요청
            <span className={gowunDodumFont.className}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;

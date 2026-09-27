import {
  PiCertificate,
  PiCheck,
  PiCheckCircle,
  PiHandHeart,
  PiHeart,
  PiShieldCheck,
  PiWarning,
  PiWarningCircle,
} from 'react-icons/pi';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/shared/ui/FadeInWhenVisible';

import { policyList, ruleGroups } from './config';
import { PromiseFlow } from './ui/_PromiseFlow';

// 좌우 여백은 app/manager/layout.tsx에서 한 번만 정의한다. 이 페이지는 별도 가로 padding을 두지 않는다.
const SECTION = cn('border-t border-border py-20', 'md:py-28');
// 타입 스케일(Tailwind 기본 토큰): h1 24/30/36, h2 20/24/30, 본문 16/18
const H2 = cn('break-keep text-xl font-bold leading-[1.35] text-foreground', 'md:text-2xl', 'xl:text-3xl');

const PROMISES = [
  {
    icon: PiCertificate,
    tag: '전문교육 이수',
    title: '전문성',
    desc: '전문 교육을 수료한 관리사가 신생아 돌보기와 산모 건강 관리를 책임집니다.',
  },
  {
    icon: PiShieldCheck,
    tag: '배상보험 가입',
    title: '안전성',
    desc: '배상보험 가입 및 정밀 건강검진을 받은 관리사가 안전한 서비스를 제공합니다.',
  },
  {
    icon: PiHeart,
    tag: '맞춤형 가정 케어',
    title: '맞춤 케어',
    desc: '각 가정의 라이프스타일과 필요에 맞춘 세심한 케어 계획을 제안합니다.',
  },
] as const;

const EDUCATION_ITEMS = ['위생 및 응급처치 교육', '신생아 관리 실습', '고객 응대 및 윤리 교육'];

const Page = () => {
  return (
    <div className="break-keep">
      {/* 1. Hero: 산후관리사 소개 + 고운황금손의 약속 흐름 */}
      <div
        className={cn(
          'mt-6 grid items-center gap-12 rounded-2xl bg-muted/50 px-5 py-12',
          'md:mt-10 md:px-12 md:py-16',
          'lg:grid-cols-[1.05fr_1fr] lg:gap-10',
        )}
      >
        <FadeInWhenVisible>
          <div className="space-y-6">
            <h1 className="space-y-4">
              <span className="flex items-center gap-2 text-base font-bold text-goldDeep">
                <PiHandHeart aria-hidden="true" className="h-5 w-5" />
                산후관리사란?
              </span>
              <span
                className={cn(
                  // 한글은 자간을 크게 줄이면 글자가 뭉치므로 -0.01em까지만 줄인다.
                  'block text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
                  'md:text-3xl md:leading-[1.3]',
                  'xl:text-4xl xl:leading-[1.3]',
                )}
              >
                전문 교육과 배상보험을 갖춘
                <br className={cn('hidden', 'sm:block')} /> 가정 방문 산후 케어 전문인
              </span>
            </h1>
            <p className={cn('text-base leading-relaxed text-muted-foreground [text-wrap:pretty]', 'md:text-lg')}>
              출산 후, 몸의 회복이 중요한 시기인 산욕기(분만 종료 후 6~8주간)에 산모님이 가정에서 편안하게 산후관리를
              하실 수 있도록 도와드리기 위해, 산모 영양·건강관리, 신생아 돌보기 등 전문 교육을 수료하고 배상보험에
              가입되어 가정방문 산후관리 서비스를 제공하는 전문인입니다.
            </p>
          </div>
        </FadeInWhenVisible>
        <PromiseFlow promises={[...PROMISES]} />
      </div>

      {/* 2. 자격조건: 주제별 3개 그룹 + 교육·보장 안내 */}
      <div className={cn(SECTION, 'border-t-0')} id="qualifications">
        <div className="max-w-[65ch] space-y-3">
          <h2 className={H2}>산후관리사 자격조건</h2>
          <p className={cn('text-muted-foreground', 'md:text-lg')}>
            산후관리사로 활동하기 위한 주요 자격 및 교육 요건입니다.
          </p>
        </div>
        <div className={cn('mt-12 grid gap-12', 'md:grid-cols-3 md:gap-10')}>
          {ruleGroups.map(({ title, icon: Icon, items }) => (
            <div className="border-t-2 border-gold pt-6" key={title}>
              <div className="flex items-center gap-2.5">
                <Icon aria-hidden="true" className="h-6 w-6 text-goldDeep" />
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
              </div>
              <ul className="mt-5 space-y-3.5">
                {items.map(item => (
                  <li className="flex items-start gap-2.5 leading-relaxed text-foreground" key={item}>
                    <PiCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-goldDeep" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={cn('mt-16 grid gap-4 border-t border-border pt-8', 'md:grid-cols-[1fr_2fr] md:gap-10')}>
          <h3 className="text-lg font-bold text-foreground">정기 교육과 배상보험</h3>
          <div className="space-y-4">
            <p className="max-w-[62ch] leading-relaxed text-muted-foreground">
              모든 관리사는 정기 교육을 받고 배상보험에 가입되어 있습니다. 안전한 가정방문 서비스를 제공하기 위해
              정기적인 교육을 진행합니다.
            </p>
            <ul className={cn('flex flex-col gap-2.5', 'sm:flex-row sm:flex-wrap sm:gap-x-6')}>
              {EDUCATION_ITEMS.map(item => (
                <li className="flex items-center gap-2 font-semibold text-foreground" key={item}>
                  <PiCheckCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-goldDeep" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. 준수사항: 금기·의무 사항이므로 경고 톤(destructive)으로 구분 */}
      <div className={cn('mb-20 rounded-2xl bg-destructive/[0.04] px-5 py-12', 'md:mb-28 md:px-12 md:py-16')}>
        <div className="max-w-[65ch] space-y-5">
          <h2 className={cn(H2, 'flex items-center gap-2.5')}>
            <PiWarningCircle aria-hidden="true" className={cn('h-7 w-7 shrink-0 text-destructive', 'md:h-8 md:w-8')} />
            산후관리사 준수사항
          </h2>
          <p
            className={cn(
              'flex items-start gap-2 text-sm font-medium leading-relaxed text-destructive',
              'md:text-base',
            )}
            role="note"
          >
            <PiWarning aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
            관리사 활동 중 회사 절차를 따르지 않고 임의로 수행한 행위에 대해서는 회사가 책임을 지지 않으며, 적발 시 내부
            규정에 따라 조치됩니다.
          </p>
        </div>
        <ul className={cn('mt-10 grid', 'md:grid-cols-2 md:gap-x-12')}>
          {policyList.map(({ number, icon: Icon, title, contents }) => (
            <li className="flex gap-4 border-t border-destructive/15 py-6" key={number}>
              <Icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="leading-relaxed text-foreground/75">{contents}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;

import {
  PiBaby,
  PiBriefcase,
  PiCheck,
  PiHouseLine,
  PiInfo,
  PiStethoscope,
  PiUserCircleCheck,
  PiUsersThree,
} from 'react-icons/pi';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/shared/ui/FadeInWhenVisible';
import { FlowCards } from '@/shared/ui/FlowCards';

import { CARE_AREAS } from './config';

// 좌우 여백은 app/manager/layout.tsx에서 한 번만 정의한다. 타입 스케일은 /manager/about과 동일하게 맞춘다.
const SECTION = cn('border-t border-border py-20', 'md:py-28');
const H2 = cn('break-keep text-xl font-bold leading-[1.35] text-foreground', 'md:text-2xl', 'xl:text-3xl');

const WORK_PRINCIPLES = [
  {
    icon: PiBaby,
    tag: '주 업무',
    title: '산모 케어 · 신생아 케어',
    desc: '산모와 신생아 보호를 최우선으로 합니다.',
  },
  {
    icon: PiUsersThree,
    tag: '지원 업무',
    title: '큰아이 케어 · 가족 케어',
    desc: '그 외 가사 업무 지원은 별도의 규정에 따릅니다.',
  },
] as const;

const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
);
const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold text-goldDeep">{children}</span>
);

const ETIQUETTES = [
  {
    icon: PiBaby,
    title: '산모와 신생아 돌봄이 주 업무입니다',
    body: (
      <>
        산후관리사는 <Strong>산모와 신생아를 돌보는 것이 주 업무</Strong>로, 발코니나 대청소, 커튼·이불 빨래,
        김치담그기, 손님상 차리기 등 산후관리와 직접 관련이 없는 일은 하지 않습니다.{' '}
        <Highlight>산모의 산후관리와 신생아 돌보기</Highlight>에 전념할 수 있도록 협조해 주시기 바랍니다.
      </>
    ),
  },
  {
    icon: PiStethoscope,
    title: '의료인이 아닌 회복 도우미입니다',
    body: (
      <>
        <Strong>산후관리사는 의료인이 아닙니다.</Strong> 의료인으로 생각하셔서 과잉 기대를 하시는 경우가 간혹 있습니다.
        산후관리사는 산모와 아기의 회복과 안정을 돕는 사람이며, 질병의 진단과 치료는 의료 행위이므로 관리사가 수행하지
        않습니다.
      </>
    ),
  },
  {
    icon: PiUserCircleCheck,
    title: "전문 교육을 이수한 '관리사님'입니다",
    body: (
      <>
        산후관리사는 일반 가사도우미와 달리 <Strong>산모님과 신생아에 대한 전문적인 교육</Strong>을 이수한 분들로,
        호칭은 <Strong>&apos;관리사님&apos;</Strong>으로 불러주시고 인격적으로 대해 주시기 바랍니다.{' '}
        <Highlight>신생아는 산후관리사에게 믿고 맡겨 주셔도 좋습니다.</Highlight> 관리사의 점심 식사는 산모님 가정에서
        드시게 됩니다.
      </>
    ),
  },
  {
    icon: PiHouseLine,
    title: '입주·출퇴근 시 부탁드리는 점',
    body: (
      <>
        입주형의 경우, 매끼 식사는 산모님 가정에서 드시며, 관리사가 거주할 방을 마련해 주시고 저녁 8시 이후에는 아기를
        보살피며 휴식할 수 있도록 해 주세요. 출산 전 산후관리에 필요한 기본 음식 재료를 준비해 주시면 보다 케어에 집중할
        수 있습니다. 출퇴근 이용 시 장보기를 원하시는 경우, 근무시간 내에서 이루어질 수 있도록 협조 부탁드립니다.
      </>
    ),
  },
];

const ManagerWorkPage = () => {
  return (
    <div className="break-keep">
      {/* 1. Hero: 소개 + 업무 원칙 흐름 */}
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
                <PiBriefcase aria-hidden="true" className="h-5 w-5" />
                산후관리사가 하는 일
              </span>
              <span
                className={cn(
                  'block text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
                  'md:text-3xl md:leading-[1.3]',
                  'xl:text-4xl xl:leading-[1.3]',
                )}
              >
                산모님의 회복과 신생아의 안정을 최우선으로
              </span>
            </h1>
            <p className={cn('text-base leading-relaxed text-muted-foreground [text-wrap:pretty]', 'md:text-lg')}>
              산후관리사는 산모와 신생아, 그리고 직계 가족(남편·아이들)에 관련된 일을 주로 수행합니다. 체계적인
              산모·신생아 관리를 통해 산모의 건강 회복과 가정의 안정을 돕는 것이 핵심 역할입니다.
            </p>
          </div>
        </FadeInWhenVisible>
        <FlowCards items={WORK_PRINCIPLES} title="업무 원칙" />
      </div>

      {/* 2. 케어 영역: 주 업무(금색) / 지원 업무(회색) 4개 그룹 */}
      <div className={cn(SECTION, 'border-t-0')}>
        <div className="max-w-[65ch] space-y-3">
          <h2 className={H2}>산후관리사의 업무 범위</h2>
          <p className={cn('text-muted-foreground', 'md:text-lg')}>
            산모와 신생아의 회복을 중심으로, 가족 모두의 일상이 평온하도록 도와드립니다.
          </p>
        </div>
        <div className={cn('mt-12 grid gap-12', 'md:grid-cols-2 md:gap-10', 'xl:grid-cols-4')}>
          {CARE_AREAS.map(({ title, icon: Icon, primary, contentList, note }) => (
            <div className={cn('border-t-2 pt-6', primary ? 'border-gold' : 'border-border')} key={title}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Icon
                    aria-hidden="true"
                    className={cn('h-6 w-6', primary ? 'text-goldDeep' : 'text-foreground/60')}
                  />
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                </div>
                <span
                  className={cn('shrink-0 text-xs font-semibold', primary ? 'text-goldDeep' : 'text-muted-foreground')}
                >
                  {primary ? '주 업무' : '지원 업무'}
                </span>
              </div>
              <ul className="mt-5 space-y-3.5">
                {contentList.map(item => (
                  <li className="flex items-start gap-2.5 leading-relaxed text-foreground" key={item}>
                    <PiCheck
                      aria-hidden="true"
                      className={cn('mt-1 h-4 w-4 shrink-0', primary ? 'text-goldDeep' : 'text-foreground/50')}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              {note && (
                <p className="mt-4 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <PiInfo aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  {note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. 기본 에티켓: 좌측 고정 제목 + 우측 목록 */}
      <div className={cn(SECTION, 'grid gap-10', 'lg:grid-cols-[1fr_1.6fr] lg:gap-16')}>
        <div className={cn('space-y-3', 'lg:sticky lg:top-28 lg:self-start')}>
          <h2 className={H2}>산후관리사에 대한 기본 에티켓</h2>
          <p className={cn('text-muted-foreground', 'md:text-lg')}>
            관리사가 산모님과 아기에게 온전히 집중할 수 있도록, 네 가지를 부탁드립니다.
          </p>
        </div>
        <ul className="divide-y divide-border">
          {ETIQUETTES.map(({ icon: Icon, title, body }) => (
            <li className={cn('grid grid-cols-[auto_1fr] gap-5 py-8', 'first:pt-0 last:pb-0', 'md:gap-6')} key={title}>
              <span
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-goldDeep',
                  'md:h-12 md:w-12',
                )}
              >
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="space-y-2.5">
                <h3 className={cn('text-lg font-bold text-foreground', 'md:text-xl')}>{title}</h3>
                <p className="leading-relaxed text-muted-foreground [text-wrap:pretty]">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagerWorkPage;

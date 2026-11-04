import type { ReactNode } from 'react';
import { PiCurrencyKrw } from 'react-icons/pi';

import { cn } from '@/lib/utils';

import { PLAN_LINKS } from '../config/const';

// /price와 /price/manage가 같은 페이지 골격을 쓴다.
// 타입 스케일은 /manager·/rental과 동일: h1 24/30/36, h2 20/24/30, h3 18/20

export function PriceHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className={cn('pb-16 pt-16', 'md:pb-20 md:pt-24')}>
      <h1 className="space-y-4">
        <span className="flex items-center gap-2 text-base font-bold text-goldDeep">
          <PiCurrencyKrw aria-hidden="true" className="h-5 w-5" />
          {eyebrow}
        </span>
        <span
          className={cn(
            'block text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
            'md:text-3xl md:leading-[1.3]',
            'xl:text-4xl xl:leading-[1.3]',
          )}
        >
          {title}
        </span>
      </h1>
      {children}
    </div>
  );
}

export function PlanNav({ children }: { children?: ReactNode }) {
  return (
    <nav aria-label="요금 유형 바로가기" className="mt-8 flex flex-wrap items-center gap-3">
      <ul className="flex flex-wrap gap-2">
        {PLAN_LINKS.map(({ id, label }) => (
          <li key={id}>
            <a
              className={cn(
                'inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors duration-200',
                'hover:border-gold/60 hover:text-goldDeep',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep',
              )}
              href={`#${id}`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      {children}
    </nav>
  );
}

// 섹션(h2)은 진한 2px 선으로 시작하고, 섹션 간 간격 > 섹션 내 유형 간 간격으로 근접성 그룹을 만든다.
export function PlanSection({
  id,
  title,
  desc,
  className,
  children,
}: {
  id?: string;
  title: string;
  desc: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('scroll-mt-16 border-t-2 border-foreground pb-24 pt-10', 'md:pb-32 md:pt-12', className)}
      id={id}
    >
      <div className="max-w-[65ch] space-y-3">
        <h2 className={cn('break-keep text-xl font-bold leading-[1.35] text-foreground', 'md:text-2xl', 'xl:text-3xl')}>
          {title}
        </h2>
        <p className={cn('text-muted-foreground', 'md:text-lg')}>{desc}</p>
      </div>
      <div className={cn('mt-10 space-y-12', 'md:mt-12 md:space-y-16')}>{children}</div>
    </div>
  );
}

// 유형 하나: 좌측 이름·설명·유의사항, 우측 요금(표·입력).
export function PlanBlock({
  id,
  title,
  desc,
  notes,
  children,
}: {
  id?: string;
  title: string;
  desc?: string;
  notes: string[];
  children: ReactNode;
}) {
  return (
    <div className={cn('grid scroll-mt-16 gap-6', 'lg:grid-cols-[1fr_1.4fr] lg:gap-12')} id={id}>
      <div>
        <h3 className={cn('text-lg font-bold text-foreground', 'md:text-xl')}>{title}</h3>
        {desc && <p className="mt-1.5 text-muted-foreground">{desc}</p>}
        <ul className={cn('list-disc space-y-2 pl-5 marker:text-goldDeep', desc ? 'mt-5' : 'mt-3')}>
          {notes.map(note => (
            <li className="text-sm leading-relaxed text-foreground/80" key={note}>
              {note}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

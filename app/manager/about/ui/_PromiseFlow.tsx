import type { IconType } from 'react-icons';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/shared/ui/FadeInWhenVisible';

type TPromise = {
  icon: IconType;
  tag: string;
  title: string;
  desc: string;
};

// 카드 폭 78% 기준, 좌측 카드 중심 39% ↔ 우측 카드 중심 61%를 곡선으로 잇는다.
function Connector({ reverse = false }: { reverse?: boolean }) {
  const [from, to] = reverse ? [61, 39] : [39, 61];

  return (
    <div aria-hidden="true" className={cn('relative h-8', 'md:h-14')}>
      {/* 모바일: 카드가 전폭이므로 중앙 직선 */}
      <div className={cn('absolute inset-y-0 left-1/2 w-px bg-gold/50', 'md:hidden')} />
      <svg
        className={cn('absolute inset-0 hidden h-full w-full', 'md:block')}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 100 56"
      >
        <path
          className="stroke-gold/60"
          d={`M${from} 0 C${from} 28, ${to} 28, ${to} 56`}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function PromiseCard({ icon: Icon, tag, title, desc }: TPromise) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-[0_12px_32px_-16px_rgba(139,107,48,0.35)]">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-gold/10 px-2 py-0.5 text-xs font-semibold text-goldDeep">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {tag}
      </span>
      <h3 className="mt-3 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

export function PromiseFlow({ promises }: { promises: [TPromise, TPromise, TPromise] }) {
  const [first, second, third] = promises;
  const cardWidth = cn('w-full', 'md:w-[78%]');

  return (
    <div>
      <h2 className="sr-only">고운황금손의 약속</h2>
      <FadeInWhenVisible delay={0.1}>
        <div className={cardWidth}>
          <PromiseCard {...first} />
        </div>
      </FadeInWhenVisible>
      <Connector />
      <FadeInWhenVisible delay={0.25}>
        <div className={cn(cardWidth, 'md:ml-auto')}>
          <PromiseCard {...second} />
        </div>
      </FadeInWhenVisible>
      <Connector reverse />
      <FadeInWhenVisible delay={0.4}>
        <div className={cardWidth}>
          <PromiseCard {...third} />
        </div>
      </FadeInWhenVisible>
    </div>
  );
}

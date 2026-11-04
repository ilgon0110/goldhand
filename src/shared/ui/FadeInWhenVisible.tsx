'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type TProps = {
  children: React.ReactNode;
  delay?: number; // in seconds
};

// 서버 HTML에서는 항상 보이게 렌더링한다. (opacity: 0으로 시작하면 하이드레이션 전까지 화면이 비어 보인다)
// 하이드레이션 후 아직 화면 아래에 있는 섹션만 숨겼다가, 스크롤로 들어오면 페이드인한다.
export default function FadeInWhenVisible({ children, delay = 0 }: TProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'hidden' | 'shown' | 'static'>('static');

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // 이미 화면 안(또는 지나간 위치)에 있으면 사용자가 보고 있는 중이므로 건드리지 않는다.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setPhase('hidden');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setPhase('shown');
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        'w-full',
        phase === 'hidden' && 'opacity-0',
        phase === 'shown' && 'duration-[600ms] ease-out animate-in fade-in fill-mode-both slide-in-from-bottom-[30px]',
      )}
      data-phase={phase}
      ref={ref}
      style={phase === 'shown' ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

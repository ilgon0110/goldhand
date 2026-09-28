import { cn } from '@/lib/utils';

type TSectionTitleHeroProps = {
  label: string;
  description?: React.ReactNode;
  level?: 'h1' | 'h2';
};

// 리스트·폼 페이지 공용 제목. 리디자인된 안내 페이지와 같은 타입 스케일(제목 24/30, 설명 16/18)을 쓴다.
// 폭을 강제하지 않아 일반 페이지에서는 좌측 정렬, items-center 부모(로그인 등)에서는 가운데로 놓인다.
export default function SectionTitleHero({ label, description, level = 'h1' }: TSectionTitleHeroProps) {
  const Heading = level;

  return (
    <div className={cn('break-keep pb-8 pt-12', 'md:pb-10 md:pt-16')}>
      <Heading
        className={cn(
          'text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
          'md:text-3xl md:leading-[1.3]',
        )}
      >
        {label}
      </Heading>
      {description && (
        <p className={cn('mt-3 max-w-[65ch] text-base leading-relaxed text-muted-foreground', 'md:text-lg')}>
          {description}
        </p>
      )}
    </div>
  );
}

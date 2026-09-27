import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';

const STATS = [
  { value: '3,000+', label: '산모 신생아 케어 서비스 이용자 수' },
  { value: '200+', label: '전문 교육을 이수한 산후도우미 수' },
  { value: '1,000+', label: '고운황금손 만족후기' },
] as const;

export function MainTitle() {
  return (
    <div className={cn('grid grid-cols-1 gap-14 break-keep', 'lg:grid-cols-[1.25fr_1fr] lg:gap-24')}>
      <FadeInWhenVisible>
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className={cn('text-3xl font-bold leading-tight text-foreground', 'md:text-5xl')}>
              산모·신생아 전문 케어 서비스, 고운황금손입니다.
            </h1>
            <div className={cn('max-w-[52ch] space-y-1 leading-relaxed text-muted-foreground', 'md:text-lg')}>
              <p>전문 교육을 이수한 산후도우미가 집으로 직접 찾아갑니다.</p>
              <p>식사 준비, 아기 돌봄까지 책임지고 돕습니다.</p>
              <p>서비스 전 상담부터 종료까지, 체계적인 관리로 운영됩니다.</p>
            </div>
          </div>
          <p
            className={cn(
              'border-l-2 border-gold pl-4 text-base font-semibold text-foreground',
              'md:text-xl',
              'xl:whitespace-nowrap',
            )}
          >
            믿고 맡길 수 있는 산후 도우미를 찾고 계시다면,
            {/* xl 미만(2단 컬럼이 좁거나 모바일)에서는 문장 단위로 줄바꿈 */}
            <br className="xl:hidden" /> 고운황금손이 정답입니다.
          </p>
        </div>
      </FadeInWhenVisible>

      <FadeInWhenVisible delay={0.2}>
        <dl className="divide-y divide-border border-y border-border">
          {STATS.map(({ value, label }) => (
            <div className={cn('flex items-baseline justify-between gap-6 py-6', 'md:py-8')} key={label}>
              <dt className={cn('text-sm text-muted-foreground', 'md:text-base')}>{label}</dt>
              <dd className={cn('shrink-0 text-4xl font-bold tabular-nums tracking-tight text-gold', 'md:text-6xl')}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className={cn('mt-4 text-xs text-muted-foreground', 'md:text-sm')}>
          * 위 수치는 화성동탄점(본점) 기준입니다.
        </p>
      </FadeInWhenVisible>
    </div>
  );
}

import Image from 'next/image';
import { PiInfo, PiPackage } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/shared/ui/FadeInWhenVisible';

import { RENTAL_FEES, RENTAL_ITEMS, RENTAL_NOTES } from './rental.config';

// 타입 스케일은 /manager 페이지와 동일하게 맞춘다: h1 24/30/36, h2 20/24/30.
// 카드 제목(h3)은 h2보다 한 단계 아래(18/20/24), 요금 수치는 h2와 같은 단(20/24/30)으로 h1을 넘지 않는다.
const H2 = cn('break-keep text-xl font-bold leading-[1.35] text-foreground', 'md:text-2xl', 'xl:text-3xl');

type TRentalItem = (typeof RENTAL_ITEMS)[number];

// 전면 이미지 + 하단 그라디언트 위 흰색 제목. 모든 물품은 동일한 크기·위계로 보여준다.
function RentalCard({ item, delay }: { item: TRentalItem; delay: number }) {
  return (
    <FadeInWhenVisible delay={delay}>
      <article className={cn('group relative aspect-[2/1] overflow-hidden rounded-2xl bg-muted', 'md:aspect-[3/4]')}>
        <Image
          alt={item.alt}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          src={item.src}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950/75 via-stone-950/30 to-transparent"
        />
        <div className={cn('absolute inset-x-0 bottom-0 p-5', 'md:p-6')}>
          <p className="text-sm text-white/80">{item.category}</p>
          <h3 className={cn('mt-1 text-lg font-bold text-white', 'md:text-xl', 'xl:text-2xl')}>{item.name}</h3>
        </div>
      </article>
    </FadeInWhenVisible>
  );
}

const RentalPage = () => {
  return (
    <div className="break-keep">
      {/* 1. 제목 */}
      <FadeInWhenVisible>
        <h1 className={cn('flex flex-col items-center gap-4 pt-16 text-center', 'md:pt-24')}>
          <span className="flex items-center gap-2 text-base font-bold text-goldDeep">
            <PiPackage aria-hidden="true" className="h-5 w-5" />
            고운황금손 대여물품
          </span>
          <span
            className={cn(
              'block text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
              'md:text-3xl md:leading-[1.3]',
              'xl:text-4xl xl:leading-[1.3]',
            )}
          >
            산모님께 꼭 필요한 물품을
            <br /> 서비스 기간 동안
            <br className="sm:hidden" /> 무료로 대여해 드려요
          </span>
        </h1>
      </FadeInWhenVisible>

      {/* 2. 대여 물품: 동일 크기 이미지 카드 3개 (모바일은 가로형 카드 세로 나열, md 이상 세로형 3열) */}
      <h2 className="sr-only">대여 가능한 물품</h2>
      <ul
        aria-label="대여 물품 목록"
        className={cn('mt-12 grid grid-cols-1 gap-3', 'md:mt-16 md:grid-cols-3 md:gap-6')}
      >
        {RENTAL_ITEMS.map((item, index) => (
          <li key={item.name}>
            <RentalCard delay={index * 0.1} item={item} />
          </li>
        ))}
      </ul>

      {/* 3. 이용 안내: 요금 + 유의사항 */}
      <div
        className={cn(
          'mt-16 grid gap-12 border-t border-border pt-16',
          'md:mt-20 md:pt-20',
          'lg:grid-cols-[1.1fr_1fr] lg:gap-16',
        )}
      >
        <div>
          <h2 className={H2}>이용 요금</h2>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {RENTAL_FEES.map(({ label, value, desc }) => (
              <div className={cn('flex items-center justify-between gap-6 py-6', 'md:py-8')} key={label}>
                <dt>
                  <span className="block font-semibold text-foreground">{label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{desc}</span>
                </dt>
                <dd className={cn('shrink-0 text-xl font-bold tabular-nums text-gold', 'md:text-2xl', 'xl:text-3xl')}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className={H2}>이용 안내</h2>
          <ul className="mt-8 space-y-4">
            {RENTAL_NOTES.map(note => (
              <li className="flex items-start gap-2.5 leading-relaxed text-foreground" key={note}>
                <PiInfo aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-goldDeep" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RentalPage;

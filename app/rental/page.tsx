import { cn } from '@/lib/utils';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import { RentalCard } from './_RentalCard';
import { RENTAL_ITEMS, RENTAL_NOTES } from './rental.config';

const RentalPage = () => {
  return (
    <>
      <SectionTitleHero
        description={
          <>
            산모님께 꼭 필요한 세 가지 물품을
            <br />
            서비스 기간 동안 무료로 대여해 드립니다.
          </>
        }
        label="고운황금손 대여물품"
      />

      {/* Gold rule */}
      <div className="flex justify-center pb-2">
        <div className="h-12 w-px bg-[#A88547]" />
      </div>

      {/* Price stamp */}
      <div className={cn('mx-auto flex flex-col items-center gap-1.5', 'px-6')}>
        <p className="text-[11px] font-medium tracking-[0.4em] text-[#A88547]">RENTAL · COMPLIMENTARY</p>
        <p className={cn('font-serif text-3xl font-medium tracking-tight text-[#1B1814]', 'md:text-4xl')}>
          대여 비용 전액 무료
        </p>
      </div>

      {/* Products grid */}
      <section className={cn('mx-auto mt-16 grid max-w-[1200px] grid-cols-1 gap-8', 'md:grid-cols-3 md:gap-7', 'px-8')}>
        {RENTAL_ITEMS.map(item => (
          <RentalCard key={item.name} {...item} />
        ))}
      </section>

      {/* Notes */}
      <div className={cn('mx-auto mt-20 max-w-[880px]', 'px-8')}>
        <div className="pb-8 text-center">
          <p className="mb-3.5 text-[11px] font-medium tracking-[0.4em] text-[#A88547]">RENTAL NOTES</p>
          <h2 className="font-serif text-2xl font-medium tracking-tight text-[#1B1814]">이용 안내</h2>
        </div>

        <div className="border border-[#E8E1D2] bg-white px-8 py-2">
          {RENTAL_NOTES.map((note, i) => (
            <div
              className={cn(
                'grid items-baseline gap-4 py-[18px] text-sm leading-[1.7] text-[#3F362D]',
                'grid-cols-[28px_1fr]',
                'md:grid-cols-[36px_1fr_auto]',
                i !== 0 && 'border-t border-[#EFE9DA]',
              )}
              key={note.n}
            >
              <span className="font-serif text-xs tracking-[0.18em] text-[#A88547]">{note.n}</span>
              <span className="break-keep">{note.text}</span>
              <span className={cn('hidden font-serif text-[13px] text-[#9A8F84]', 'md:block')}>{note.tail}</span>
            </div>
          ))}
        </div>

        {/* Fee callout */}
        <div
          className={cn(
            'mt-7 flex flex-wrap items-center justify-between gap-6',
            'border border-[#E8E1D2] border-l-[#A88547] bg-[#F6F1E7] px-7 py-5',
            'border-l-2',
          )}
        >
          <p className="max-w-[520px] break-keep text-[13.5px] leading-[1.7] text-[#3F362D]">
            단, <strong className="font-semibold text-[#1B1814]">왕복 택배비는 별도</strong>이며, 유축기 소모품은 개별
            구매해 주셔야 합니다.
          </p>
          <div className="text-right">
            <p className="mb-1 text-[10px] font-medium tracking-[0.24em] text-[#A88547]">ROUND-TRIP SHIPPING</p>
            <p className="font-serif text-[22px] tracking-tight text-[#1B1814]">10,000원</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalPage;

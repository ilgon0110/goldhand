import { cn } from '@/lib/utils';
import { gowunDodumFont } from '@/shared/fonts';

type TPromiseCardProps = {
  index: string;
  title: string;
  sub: string;
  desc: string;
};

export const PromiseCard = ({ index, title, sub, desc }: TPromiseCardProps) => {
  return (
    <article className={cn('bg-gradient-to-b from-[rgba(247,242,230,0.4)] to-transparent', 'p-7', 'md:p-10')}>
      <div className={cn(`${gowunDodumFont.className} mb-[18px] text-[13px] tracking-[0.18em] text-gold`)}>{index}</div>
      <h2 className={cn(`${gowunDodumFont.className} mb-1.5 text-[22px] font-medium tracking-tight text-stone-900`)}>
        {title}
      </h2>
      <div className="mb-[18px] text-[12px] tracking-[0.16em] text-stone-300">{sub}</div>
      <p className="break-keep text-sm leading-[1.85] text-stone-700">{desc}</p>
    </article>
  );
};

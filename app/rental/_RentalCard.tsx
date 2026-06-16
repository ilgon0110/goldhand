import Image from 'next/image';

import { cn } from '@/lib/utils';

type TRentalCardProps = {
  category: string;
  name: string;
  src: string;
  alt: string;
};

export const RentalCard = ({ category, name, src, alt }: TRentalCardProps) => {
  return (
    <article
      className={cn(
        'flex flex-col border border-[#E8E1D2] bg-white transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-[#D8B97B]',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#EFE9DA] bg-[#F6F1E7]">
        <Image alt={alt} fill src={src} style={{ objectFit: 'cover' }} />
      </div>
      <div className="flex flex-col gap-1.5 px-6 pb-7 pt-6">
        <p className="text-[11px] font-medium tracking-[0.24em] text-[#A88547]">{category}</p>
        <h2 className="mt-1 font-serif text-[22px] font-medium leading-snug tracking-tight text-[#1B1814]">{name}</h2>
      </div>
    </article>
  );
};

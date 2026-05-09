import { cn } from '@/lib/utils';

type SectionTitleHeroProps = {
  label: string;
  description?: React.ReactNode;
};

export default function SectionTitleHero({ label, description }: SectionTitleHeroProps) {
  return (
    <div className={cn('py-12 text-center')}>
      <h1 className="text-xl font-semibold tracking-[0.4em] text-[#A88547]">─── {label} ───</h1>
      {description && (
        <p className={cn('mx-auto mt-4 max-w-lg text-sm leading-loose text-slate-500', 'md:text-base')}>
          {description}
        </p>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';

type TSectionTitleHeroProps = {
  label: string;
  description?: React.ReactNode;
};

export default function SectionTitleHero({ label, description }: TSectionTitleHeroProps) {
  return (
    <div className={cn('py-12 text-center')}>
      <h1
        className={cn(
          'whitespace-nowrap font-semibold text-[#A88547]',
          'text-sm tracking-[0.2em]',
          'md:text-xl md:tracking-[0.4em]',
        )}
      >
        <span aria-hidden="true">─── </span>{label}<span aria-hidden="true"> ───</span>
      </h1>
      {description && (
        <p className={cn('mx-auto mt-4 max-w-lg text-xs leading-loose text-slate-500', 'md:text-base')}>
          {description}
        </p>
      )}
    </div>
  );
}

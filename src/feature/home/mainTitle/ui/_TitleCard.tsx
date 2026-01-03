import { cn } from '@/lib/utils';

interface ITitleCardProps {
  title: string;
  contents: string;
  icon: React.ReactNode;
}

export const TitleCard = ({ title, contents, icon }: ITitleCardProps) => {
  return (
    <div
      className={cn(
        'group flex w-full flex-row items-center justify-center rounded border border-slate-100 bg-[#FAFAFA] py-3 transition-all duration-300 ease-in-out',
        'hover:border-none hover:bg-[#4B552F] hover:text-white',
        'md:px-9 md:py-12',
      )}
    >
      <div className={cn('relative flex flex-col items-center justify-center gap-2', 'md:gap-8')}>
        {icon}
        <span
          className={cn(
            'text-center text-sm text-slate-500',
            'group-hover:text-slate-200',
            'sm:text-base',
            'md:text-lg',
          )}
        >
          {contents}
        </span>
        <span className={cn('text-center text-2xl font-bold', 'md:text-[56px]')}>{title}</span>
      </div>
    </div>
  );
};

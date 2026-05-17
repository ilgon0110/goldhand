import { cn } from '@/lib/utils';

type TManagerWorkCardProps = {
  index: number;
  title: string;
  contentList: string[];
  note?: string;
};

export const ManagerWorkCard = ({ index, title, contentList, note }: TManagerWorkCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col border-b border-[#E8E1D2] bg-gradient-to-b from-[#F7F2E6]/40 to-transparent p-8',
        'md:p-9',
      )}
    >
      <div className="flex items-start gap-6">
        <span className="min-w-[28px] pt-2 text-sm tracking-[0.18em] text-gold">{index}</span>
        <div className="flex-1">
          <h3 className={cn('text-xl font-semibold tracking-tight text-stone-900', 'md:text-2xl')}>{title}</h3>
          <ul className="mt-4 flex flex-col gap-2">
            {contentList.map(content => (
              <li
                className="relative pl-4 text-sm leading-relaxed text-stone-700 before:absolute before:left-0 before:top-[0.6em] before:h-px before:w-2.5 before:bg-gold"
                key={content}
              >
                {content}
              </li>
            ))}
          </ul>
          {note && <p className="mt-3 text-xs text-stone-400">{note}</p>}
        </div>
      </div>
    </div>
  );
};

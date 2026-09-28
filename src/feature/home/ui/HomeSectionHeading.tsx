import { cn } from '@/lib/utils';

type THomeSectionHeadingProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function HomeSectionHeading({ title, description, action }: THomeSectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4', 'md:flex-row md:items-end md:justify-between')}>
      <div className="max-w-[65ch] space-y-3">
        <h2 className={cn('break-keep text-2xl font-bold text-foreground', 'md:text-4xl')}>{title}</h2>
        {description && (
          <p className={cn('break-keep text-sm leading-relaxed text-muted-foreground', 'md:text-base')}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

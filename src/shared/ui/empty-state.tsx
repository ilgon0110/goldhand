import { cn } from '@/lib/utils';

type TEmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export const EmptyState = ({ title, description, className }: TEmptyStateProps) => {
  return (
    <div className={cn('text-center', className)}>
      <svg
        aria-hidden="true"
        className="mx-auto size-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
};

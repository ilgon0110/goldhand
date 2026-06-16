import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

type TDefaultImageProps = {
  className?: string;
  style?: CSSProperties;
};

export default function DefaultImage({ className, style }: TDefaultImageProps) {
  return (
    <div className={cn('flex items-center justify-center bg-slate-100', className)} style={style}>
      <div className="flex flex-col items-center gap-1 text-slate-300">
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height={18} rx={2} ry={2} width={18} x={3} y={3} />
          <circle cx={8.5} cy={8.5} r={1.5} />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    </div>
  );
}

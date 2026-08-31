import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

type TReviewStepIndicatorProps = {
  ariaLabel: string;
  isVerified: boolean;
  secondStepLabel: string;
};

export const ReviewStepIndicator = ({ ariaLabel, isVerified, secondStepLabel }: TReviewStepIndicatorProps) => (
  <ol aria-label={ariaLabel} className="mx-auto mb-8 flex max-w-xl items-center text-sm">
    <li
      aria-current={!isVerified ? 'step' : undefined}
      className={cn('flex items-center gap-2 font-medium', !isVerified ? 'text-primary' : 'text-green-700')}
    >
      <span
        aria-label={isVerified ? '본인 인증 완료' : undefined}
        className={cn(
          'flex size-7 items-center justify-center rounded-full border',
          isVerified && 'border-green-600 bg-green-600 text-white',
        )}
      >
        {isVerified ? <Check aria-hidden="true" className="size-4" /> : '1'}
      </span>
      <span>본인 인증</span>
    </li>
    <li aria-hidden="true" className="mx-3 h-px flex-1 bg-slate-200" />
    <li
      aria-current={isVerified ? 'step' : undefined}
      className={cn('flex items-center gap-2 font-medium', isVerified ? 'text-primary' : 'text-slate-400')}
    >
      <span className="flex size-7 items-center justify-center rounded-full border">2</span>
      <span>{secondStepLabel}</span>
    </li>
  </ol>
);

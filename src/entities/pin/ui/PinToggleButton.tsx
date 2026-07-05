'use client';

import { cn } from '@/lib/utils';

type TPinToggleButtonProps = {
  isPinned: boolean;
  isAdmin: boolean;
  isLoading?: boolean;
  onToggle: () => void;
};

export const PinToggleButton = ({ isPinned, isAdmin, isLoading = false, onToggle }: TPinToggleButtonProps) => {
  if (!isAdmin) {
    if (!isPinned) return null;
    return (
      <span
        className="whitespace-nowrap rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10.5px] font-medium tracking-[0.06em] text-gold"
        data-testid="pin-badge"
      >
        📌 고정
      </span>
    );
  }

  return (
    <button
      aria-pressed={isPinned}
      className={cn(
        'whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-medium tracking-[0.06em] transition-colors',
        isPinned ? 'border-gold/40 bg-gold/10 text-gold' : 'border-stone-200 bg-stone-50 text-stone-400',
      )}
      data-testid="pin-toggle-button"
      disabled={isLoading}
      type="button"
      onClick={e => {
        e.stopPropagation();
        onToggle();
      }}
      onKeyDown={e => {
        e.stopPropagation();
      }}
    >
      📌 {isPinned ? '고정 해제' : '고정하기'}
    </button>
  );
};

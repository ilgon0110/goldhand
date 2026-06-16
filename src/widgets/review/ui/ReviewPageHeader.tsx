'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/ui/select';

type TReviewPageHeaderProps = {
  franchiseeList: string[];
  handleFranchiseeChange: (value: string) => void;
  isLogin: boolean;
  totalDataLength: number;
};

const PenIcon = () => (
  <svg aria-hidden="true" className="h-[13px] w-[13px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path
      d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReviewPageHeader = ({
  franchiseeList,
  handleFranchiseeChange,
  isLogin,
  totalDataLength,
}: TReviewPageHeaderProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="후기 작성 페이지 이동중.." />}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 px-1 py-3.5">
        <p className="text-[12px] tracking-[0.08em] text-stone-500">
          총{' '}
          <span className="font-serif text-[14px] font-medium tracking-[0.02em] text-stone-900">{totalDataLength}</span>{' '}
          건
        </p>
        <div className="flex items-center gap-2">
          <Select defaultValue={franchiseeList[0]} onValueChange={handleFranchiseeChange}>
            <SelectTrigger
              aria-label="지점 선택"
              className={cn(
                'h-auto rounded-full border-stone-200 bg-white px-4 py-2 text-[13px] tracking-[-0.005em] text-stone-600',
                'transition-all duration-200 hover:border-amber-300 hover:text-stone-900',
                'sm:w-auto',
              )}
            >
              <SelectValue placeholder="지점 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>지점 선택</SelectLabel>
                {franchiseeList.map(franchisee => (
                  <SelectItem key={franchisee} value={franchisee}>
                    {franchisee}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <button
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-stone-900 bg-stone-900',
              'px-[18px] py-[9px] text-[13px] tracking-[0.02em] text-stone-100',
              'transition-all duration-200 hover:border-gold hover:bg-gold',
              !isLogin && 'cursor-not-allowed opacity-30',
            )}
            disabled={!isLogin}
            onClick={() => {
              if (!isLogin) return;
              startTransition(() => {
                router.push('/review/form');
              });
            }}
          >
            <PenIcon />
            {isLogin ? '후기 남기기' : '로그인 후 작성'}
          </button>
        </div>
      </div>
    </>
  );
};

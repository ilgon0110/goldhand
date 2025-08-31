'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/src/shared/ui/button';
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
  viewMode: 'CARD' | 'TABLE';
  setViewMode: React.Dispatch<React.SetStateAction<'CARD' | 'TABLE'>>;
};

export const ReviewPageHeader = ({
  franchiseeList,
  handleFranchiseeChange,
  isLogin,
  viewMode,
  setViewMode,
}: TReviewPageHeaderProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="후기 작성 페이지 이동중.." />}
      <div className="flex w-full flex-row justify-between gap-2 sm:justify-normal">
        <Select defaultValue={franchiseeList[0]} onValueChange={handleFranchiseeChange}>
          <SelectTrigger className="mt-4 w-[180px]">
            <SelectValue placeholder="지점 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>지점 선택</SelectLabel>
              {franchiseeList.map(franchisee => {
                return (
                  <SelectItem key={franchisee} value={franchisee}>
                    {franchisee}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-row items-center gap-2 pt-3">
          <button
            className={cn(
              'fill-slate-200 transition-all duration-300 ease-in-out hover:fill-slate-500',
              viewMode === 'TABLE' && 'fill-slate-500',
            )}
            title="table-view-button"
            onClick={() => setViewMode('TABLE')}
          >
            <svg fill="current" height="24px" viewBox="0 -960 960 960" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M320-80q-33 0-56.5-23.5T240-160v-480q0-33 23.5-56.5T320-720h480q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H320Zm0-80h200v-120H320v120Zm280 0h200v-120H600v120ZM80-240v-560q0-33 23.5-56.5T160-880h560v80H160v560H80Zm240-120h200v-120H320v120Zm280 0h200v-120H600v120ZM320-560h480v-80H320v80Z" />
            </svg>
          </button>
          <button
            className={cn(
              'fill-slate-200 transition-all duration-300 ease-in-out hover:fill-slate-500',
              viewMode === 'CARD' && 'fill-slate-500',
            )}
            title="card-view-button"
            onClick={() => setViewMode('CARD')}
          >
            <svg fill="current" height="24px" viewBox="0 -960 960 960" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M80-360v-240q0-33 23.5-56.5T160-680q33 0 56.5 23.5T240-600v240q0 33-23.5 56.5T160-280q-33 0-56.5-23.5T80-360Zm280 160q-33 0-56.5-23.5T280-280v-400q0-33 23.5-56.5T360-760h240q33 0 56.5 23.5T680-680v400q0 33-23.5 56.5T600-200H360Zm360-160v-240q0-33 23.5-56.5T800-680q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280q-33 0-56.5-23.5T720-360Zm-360 80h240v-400H360v400Zm120-200Z" />
            </svg>
          </button>
        </div>
      </div>
      <Button
        className={cn('', !isLogin && 'opacity-20 hover:cursor-not-allowed')}
        disabled={!isLogin}
        onClick={() => {
          startTransition(() => {
            router.push('/review/form');
          });
        }}
      >
        {isLogin ? '후기 남기기' : '로그인 후 작성 가능'}
      </Button>
    </>
  );
};

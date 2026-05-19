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
};

export const ReviewPageHeader = ({
  franchiseeList,
  handleFranchiseeChange,
  isLogin,
}: TReviewPageHeaderProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="후기 작성 페이지 이동중.." />}
      <div className={cn('flex w-full flex-col justify-between gap-2', 'sm:flex-row')}>
        <Select defaultValue={franchiseeList[0]} onValueChange={handleFranchiseeChange}>
          <SelectTrigger className={cn('w-full', 'sm:w-[180px]')}>
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

        <Button
          className={cn(
            'w-fit place-self-end',
            'sm:place-self-auto',
            !isLogin && 'opacity-20 hover:cursor-not-allowed',
          )}
          disabled={!isLogin}
          onClick={() => {
            if (!isLogin) return;
            startTransition(() => {
              router.push('/review/form');
            });
          }}
        >
          {isLogin ? '후기 남기기' : '로그인 후 작성 가능'}
        </Button>
      </div>
    </>
  );
};

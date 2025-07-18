'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Button } from '@/src/shared/ui/button';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

export const ReservationApplyPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      {isPending && <LoadingSpinnerOverlay text="페이지 이동중.." />}
      <SectionTitle buttonTitle="" title="고운황금손 예약상담" onClickButtonTitle={() => {}} />
      <Image alt="apply" className="mx-auto mt-4" height={200} src="/apply.png" width={300} />
      <p className="mt-4 flex flex-col items-center justify-center space-y-2 break-keep text-center text-lg">
        <span>
          <span className="font-bold">회원</span>으로 예약상담 신청 시 카카오톡을 통해{' '}
          <span className="font-bold">답변 등록 알림</span>을 보내드려요.
        </span>
        <span>또한 고운황금손 이용 시 관리일지, 이용후기 남기기 등 다양한 서비스를 이용하실 수 있어요.</span>
        <span>물론 비회원으로도 문의하실 수 있습니다.</span>
      </p>
      <div className="mx-auto mt-6 flex w-full flex-col items-center justify-center space-y-6 px-4 md:px-[10vw]">
        <Button
          className="flex w-full items-center justify-center md:w-1/2"
          variant="outline"
          onClick={() =>
            startTransition(() => {
              router.push('/login');
            })
          }
        >
          로그인하기
        </Button>
        <Button
          className="flex w-full items-center justify-center md:w-1/2"
          variant="default"
          onClick={() =>
            startTransition(() => {
              router.push('/reservation/form');
            })
          }
        >
          비회원으로 문의하기
        </Button>
      </div>
    </div>
  );
};

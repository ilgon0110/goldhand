import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/src/shared/ui/button';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

export const ReservationApplyPage = () => {
  return (
    <div>
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
      <div className="mx-auto mt-6 flex w-full flex-col space-y-6 px-4 md:px-[10vw]">
        <Link className="flex items-center justify-center" href="/login">
          <Button className="w-full md:w-1/2" variant="outline">
            로그인하기
          </Button>
        </Link>
        <Link className="flex items-center justify-center" href="/reservation/form">
          <Button className="w-full md:w-1/2" variant="default">
            비회원으로 문의하기
          </Button>
        </Link>
      </div>
    </div>
  );
};

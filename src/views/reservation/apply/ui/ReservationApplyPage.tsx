import Image from 'next/image';
import Link from 'next/link';

import { SectionTitle } from '@/src/shared/ui/sectionTitle';

export const ReservationApplyPage = () => {
  return (
    <div>
      <SectionTitle buttonTitle="" title="고운황금손 예약상담" onClickButtonTitle={() => {}} />
      <Image alt="apply" className="mx-auto mt-4 h-auto w-1/2" height={500} src="/apply.png" width={500} />
      <p className="mt-4 flex flex-col items-center justify-center space-y-2 break-keep text-center text-lg">
        <span>
          <span className="font-bold">회원</span>으로 예약상담 신청 시 카카오톡을 통해{' '}
          <span className="font-bold">답변 등록 알림</span>을 보내드려요.
        </span>
        <span>또한 고운황금손 이용 시 관리일지, 이용후기 남기기 등 다양한 서비스를 이용하실 수 있어요.</span>
        <span>물론 비회원으로도 문의하실 수 있습니다.</span>
      </p>
      <div className="mt-6 space-y-6 px-4 md:px-[10vw]">
        <Link href="/login">
          <button className="w-full rounded-full border border-[#0F2E16] py-4 transition-all duration-200 ease-in-out hover:bg-[#0F2E16] hover:text-white">
            로그인하기
          </button>
        </Link>
        <Link href="/reservation/form">
          <button className="mt-6 w-full rounded-full border border-[#0F2E16] py-4 transition-all duration-200 ease-in-out hover:bg-[#0F2E16] hover:text-white">
            비회원으로 문의하기
          </button>
        </Link>
      </div>
    </div>
  );
};

import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import Image from "next/image";
import Link from "next/link";

export const ReservationApplyPage = () => {
  return (
    <div>
      <SectionTitle title="고운황금손 예약상담" buttonTitle="" />
      <Image
        src="/apply.png"
        alt="apply"
        width={500}
        height={500}
        className="w-1/2 h-auto mx-auto mt-4"
      />
      <p className="flex flex-col space-y-2 items-center justify-center text-lg mt-4 break-keep text-center">
        <span>
          <span className="font-bold">회원</span>으로 예약상담 신청 시
          카카오톡을 통해 <span className="font-bold">답변 등록 알림</span>을
          보내드려요.
        </span>
        <span>
          또한 고운황금손 이용 시 관리일지, 이용후기 남기기 등 다양한 서비스를
          이용하실 수 있어요.
        </span>
        <span>물론 비회원으로도 문의하실 수 있습니다.</span>
      </p>
      <div className="px-4 md:px-[10vw] space-y-6 mt-6">
        <Link href="/login">
          <button className="w-full py-4 rounded-full border border-[#0F2E16] hover:bg-[#0F2E16] hover:text-white transition-all duration-200 ease-in-out">
            로그인하기
          </button>
        </Link>
        <Link href="/reservation/form">
          <button className="w-full py-4 mt-6 rounded-full border border-[#0F2E16] hover:bg-[#0F2E16] hover:text-white transition-all duration-200 ease-in-out">
            비회원으로 문의하기
          </button>
        </Link>
      </div>
    </div>
  );
};

import Image from 'next/image';
import Link from 'next/link';

import { SectionTitle } from '@/src/shared/ui/sectionTitle';

export const VoucherPage = () => {
  return (
    <div>
      <SectionTitle buttonTitle="" title="고운황금손 2025년 바우처 이용 안내" onClickButtonTitle={() => {}} />
      <div className={`mt-6 whitespace-pre-wrap break-keep text-center leading-6 text-slate-700 xl:text-lg`}>
        {`출산가정에 건강관리사를 파견하여 산모의 산후 회복과 신생아의 양육을 지원하고\n출산가정의 경제적 부담을 경감 및 산모, 신생아 건강관리사 양성을 통해 일자리를 창출하는 제도입니다.`}
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-300" />
      <div className="mt-6 w-full text-center text-xl font-bold text-[#728146] lg:text-2xl">신청 대상</div>
      <div className={`mt-3 whitespace-pre-wrap break-keep text-center leading-7 text-slate-700 xl:text-lg`}>
        {`국내에 주민등록(주민등록을 한 재외국민 포함) 또는 외국인 등록을 둔 출산가정으로써,\n산모 또는 배우자가 생계·의료·주거·교육급여 수급자 또는 차상위계층에 해당하는 출산가정\n기준중위소득 100%이하의 출산 가정(임신 16주 이후 발생한 유산·사산의 경우도 포함)`}
      </div>
      <div className="mt-10 w-full text-center text-xl font-bold text-[#728146] lg:text-2xl">신청 기간</div>
      <div className={`mt-3 whitespace-pre-wrap break-keep text-center leading-7 text-slate-700 xl:text-lg`}>
        {`출산 예정일 40일 전부터 출산일로부터 30일까지\n(임신 16주 이후 발생한 유산·사산의 경우도 포함)`}
      </div>
      <div className="mt-10 w-full text-center text-xl font-bold text-[#728146] lg:text-2xl">서비스 제공시간</div>
      <div className={`mt-3 whitespace-pre-wrap break-keep text-center leading-7 text-slate-700 xl:text-lg`}>
        {`평일 : 9시부터 18시까지 (휴게시간 1시간 포함)\n토요일 또는 공휴일 : 9시부터 14시까지 (서비스 원할 경우 협의)`}
      </div>
      <div className="mt-10 w-full text-center text-xl font-bold text-[#728146] lg:text-2xl">신청 장소</div>
      <div
        className={`mt-3 flex flex-col gap-[2px] whitespace-pre-wrap break-keep text-center leading-7 text-slate-700 xl:text-lg`}
      >
        <span>산모의 주민등록 주소지 관할 시·군·구 보건소</span>
        <span>
          온라인신청 : 복지로{' '}
          <Link className="text-blue-500 underline" href="https://www.bokjiro.go.kr/ssis-tbu/index.do" target="_blank">
            www.bokjiro.go.kr
          </Link>
        </span>
        <span className="font-bold text-[#728146]">(단,바우처 유효기간은 원칙적으로 출산일로부터 60일 이내)</span>
        <span>바우처 잔량이 있는 경우라도 출산일로부터 60일이 경과하면 바우처 소멸</span>
      </div>

      <div className="mt-10 w-full text-center text-xl font-bold text-[#728146] lg:text-2xl">구비 서류</div>
      <div
        className={`mt-3 flex flex-col gap-[2px] whitespace-pre-wrap break-keep text-center leading-7 text-slate-700 xl:text-lg`}
      >
        <span>신청서 1부 (보건소 비치)</span>
        <span>건강보험자격확인서 (피부양자 표시 필) 발급</span>
        <span>건강보험납부확인서 : 최근 월 고지금액 납부확인서</span>
        <span>산모신분증, 대리인 신청시 대리인 신분증, 산모수첩(출생 후 출생증명서)</span>
        <span className="font-bold text-[#728146]">※ 예외지원의 경우 별도 해당서류 첨부(전화문의)</span>
        <span>1개월 이상 휴직중인 경우 휴직증명서(휴직기간, 유급/무급 기재)</span>
        <span className="font-bold text-[#728146]">※ 유급 시 최근월분 급여명세서 첨부</span>
        <span>가족관계증명서 : 외국인 산모, 부부간 주소시 다를 시</span>
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-300" />
      <div className="relative mt-6 h-[100vh] w-full">
        <Image alt="정부바우처 이용요금표" fill sizes="100vw" src="/voucher_price_table.png" />
      </div>
    </div>
  );
};

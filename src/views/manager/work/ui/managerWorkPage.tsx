import Image from 'next/image';

import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { BabyCardInfo, FamilyCardInfo, MotherCardInfo, StudentCardInfo } from '../config/const';
import { ManagerWorkCard } from './managerWorkCard';

export const ManagerWorkPage = () => {
  return (
    <div className="mt-14 pb-[20vw] md:pb-0">
      <div className="mx-auto w-full px-4 md:max-w-[50vw]">
        <SectionTitle buttonTitle="" title="산후관리사가 하는 일" onClickButtonTitle={() => {}} />
        <div className="mt-4 flex flex-col gap-1 whitespace-pre-wrap break-keep text-center text-base md:first-letter:leading-6 lg:text-lg">
          산후관리사는 산모와 신생아 그리고 직계 가족(남편, 아이들)에 관련된 일을 주로 수행합니다.
          <br />
          <span className="font-bold">산모와 신생아 보호를 최우선으로 합니다.</span>
          기타 가족이 포함된 가사 일을 지원할 경우는 별도 규정에 따릅니다.
        </div>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-12 md:px-[10vw] lg:grid-cols-4">
        <ManagerWorkCard
          contentList={MotherCardInfo.contentList}
          iconSrc={MotherCardInfo.iconSrc}
          title={MotherCardInfo.title}
        />
        <ManagerWorkCard
          contentList={BabyCardInfo.contentList}
          iconSrc={BabyCardInfo.iconSrc}
          title={BabyCardInfo.title}
        />
        <ManagerWorkCard
          contentList={StudentCardInfo.contentList}
          iconSrc={StudentCardInfo.iconSrc}
          title={StudentCardInfo.title}
        />
        <ManagerWorkCard
          contentList={FamilyCardInfo.contentList}
          iconSrc={FamilyCardInfo.iconSrc}
          title={FamilyCardInfo.title}
        />
      </div>
      <div className="relative mt-20 flex flex-col bg-[#F5F5F5] lg:block">
        <div className="order-2 h-[53vw] w-full bg-[#728146] lg:absolute lg:right-0 lg:order-1 lg:h-full lg:w-[40%]" />
        <div className="absolute -bottom-[18vw] h-[66vw] w-[100vw] lg:bottom-0 lg:right-0 lg:h-[30vw] lg:w-[45vw]">
          <Image alt="산후관리사가 하는 일 설명 이미지" fill sizes="100vw" src="/woman_group.png" />
        </div>
        <div className="p-4 text-center text-2xl font-bold lg:pl-[10vw] lg:pt-9 lg:text-start lg:text-5xl">
          산후관리사에 대한 기본 에티켓
        </div>
        <div className="w-full space-y-10 break-keep px-8 pb-8 text-center text-base lg:mt-8 lg:w-[50vw] lg:pl-[10vw] lg:text-start lg:text-xl">
          <div className="w-full">
            산후관리사는 <span className="font-bold">산모와 신생아를 돌보는 것이 주 업무</span>로 발코니 또는 대청소,
            커튼/이불/빨래, 김치담그기, 손님상 차리기 등 산후관리와 직접적인 연관이 없는 일은 하지 않습니다.{' '}
            <span className="font-bold">산모의 산후관리와 신생아 돌보기</span>에 전념할 수 있도록 협조해 주시기
            바랍니다.
          </div>
          <div className="w-full">
            <span className="font-bold">산후관리사는 의료인이 아닙니다.</span> 의료인으로 생각하셔서 과잉기대를 하시는
            산모님이 간혹 계십니다. 산후관리사는 산모와 아기의 회복과 안정을 도와주는 사람입니다. 산모와 아기의 질병
            진단과 치료는 의료 행위임으로 관리사가 하지 않습니다.
          </div>
          <div className="w-full">
            산후관리사는 일반 가사도우미와는 달리{' '}
            <span className="font-bold">산모님과 신생아에 대한 전문적인 교육</span>을 이수하신 분들로 호칭은{' '}
            <span className="font-bold">‘관리사님&apos;</span>으로 불러주시고 인격적으로 대해 주시기 바랍니다.{' '}
            <span className="font-bold">신생아는 산후관리사에게 믿고 맡겨 주셔도 좋습니다.</span> 산후관리사의 점심
            식사는 산모님 가정에서 드시게 합니다.
          </div>
          <div className="w-full">
            입주형의 경우 매끼 식사는 산모님 가정에서 드시게 되며, 관리사가 거주할 수 있는 방을 마련하여 저녁 8시 이후는
            아기를 보살펴주며 휴식할 수 있게 합니다. 출산 전 산후관리에 필요한 기본 음식 재료를 준비해 주시면 산후관리에
            보다 집중할 수 있습니다. 출퇴근 이용시 장보기를 원하실 경우, 근무시간 내에서 이루어 질 수 있도록 해 주시기
            바랍니다.
          </div>
        </div>
      </div>
    </div>
  );
};

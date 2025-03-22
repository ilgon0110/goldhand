import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import {
  BabyCardInfo,
  FamilyCardInfo,
  ManagerWorkCard,
  MotherCardInfo,
  StudentCardInfo,
} from "../../index";
import Image from "next/image";

export const ManagerWorkPage = () => {
  return (
    <div className="mt-14 pb-[20vw] md:pb-0">
      <div className="max-w-[50vw] mx-auto">
        <SectionTitle
          title="산후관리사가 하는 일"
          contents="산후관리사는 산모와 신생아 그리고 직계 가족(남편, 아이들)에
관련된 일을 주로 하며, 산모와 신생아 보호를 최우선으로 합니다.
(기타 가족이 포함된 가사 일을 지원할 경우는 별도 규정에 따릅니다.)"
          buttonTitle=""
        />
      </div>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 md:px-[10vw] px-4">
        <ManagerWorkCard
          title={MotherCardInfo.title}
          iconSrc={MotherCardInfo.iconSrc}
          contentList={MotherCardInfo.contentList}
        />
        <ManagerWorkCard
          title={BabyCardInfo.title}
          iconSrc={BabyCardInfo.iconSrc}
          contentList={BabyCardInfo.contentList}
        />
        <ManagerWorkCard
          title={StudentCardInfo.title}
          iconSrc={StudentCardInfo.iconSrc}
          contentList={StudentCardInfo.contentList}
        />
        <ManagerWorkCard
          title={FamilyCardInfo.title}
          iconSrc={FamilyCardInfo.iconSrc}
          contentList={FamilyCardInfo.contentList}
        />
      </div>
      <div className="bg-[#F5F5F5] mt-20 relative flex flex-col md:block">
        <div className="md:absolute md:right-0 bg-[#728146] w-full h-[53vw] md:w-[40%] md:h-full order-2 md:order-1" />
        <div className="w-[100vw] h-[66vw] md:w-[45vw] md:h-[30vw] absolute md:bottom-0 md:right-0 -bottom-[18vw]">
          <Image
            src="/woman_group.png"
            fill
            sizes="100vw"
            alt="산후관리사가 하는 일 설명 이미지"
          />
        </div>
        <div className="text-2xl md:text-5xl font-bold p-4 text-center md:text-start md:pl-[10vw] md:pt-9">
          산후관리사에 대한 기본 에티켓
        </div>
        <div className="w-full md:w-[50vw] space-y-10 text-base text-center md:text-start md:text-xl break-keep px-8 md:pl-[10vw] md:mt-8 pb-8">
          <div className="w-full">
            산후관리사는{" "}
            <span className="font-bold">
              산모와 신생아를 돌보는 것이 주 업무
            </span>
            로 발코니 또는 대청소, 커튼/이불/빨래, 김치담그기, 손님상 차리기 등
            산후관리와 직접적인 연관이 없는 일은 하지 않습니다.{" "}
            <span className="font-bold">산모의 산후관리와 신생아 돌보기</span>에
            전념할 수 있도록 협조해 주시기 바랍니다.
          </div>
          <div className="w-full">
            <span className="font-bold">산후관리사는 의료인이 아닙니다.</span>{" "}
            의료인으로 생각하셔서 과잉기대를 하시는 산모님이 간혹 계십니다.
            산후관리사는 산모와 아기의 회복과 안정을 도와주는 사람입니다. 산모와
            아기의 질병 진단과 치료는 의료 행위임으로 관리사가 하지 않습니다.
          </div>
          <div className="w-full">
            산후관리사는 일반 가사도우미와는 달리{" "}
            <span className="font-bold">
              산모님과 신생아에 대한 전문적인 교육
            </span>
            을 이수하신 분들로 호칭은{" "}
            <span className="font-bold">‘관리사님'</span>으로 불러주시고
            인격적으로 대해 주시기 바랍니다.{" "}
            <span className="font-bold">
              신생아는 산후관리사에게 믿고 맡겨 주셔도 좋습니다.
            </span>{" "}
            산후관리사의 점심 식사는 산모님 가정에서 드시게 합니다.
          </div>
          <div className="w-full">
            입주형의 경우 매끼 식사는 산모님 가정에서 드시게 되며, 관리사가
            거주할 수 있는 방을 마련하여 저녁 8시 이후는 아기를 보살펴주며
            휴식할 수 있게 합니다. 출산 전 산후관리에 필요한 기본 음식 재료를
            준비해 주시면 산후관리에 보다 집중할 수 있습니다. 출퇴근 이용시
            장보기를 원하실 경우, 근무시간 내에서 이루어 질 수 있도록 해 주시기
            바랍니다.
          </div>
        </div>
      </div>
    </div>
  );
};

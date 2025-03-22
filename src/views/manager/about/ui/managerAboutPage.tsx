import Image from "next/image";
import { gowunDodumFont } from "@/shared/fonts";
import { policyList, ruleList } from "../../index";

export const ManagerAboutPage = () => {
  return (
    <div className="mt-28">
      {/* 산후관리사란 */}
      <div className="flex flex-col md:flex-row">
        <div
          className={`w-full md:w-[46vw] ${gowunDodumFont.className} text-sm md:text-base lg:text-xl top-1/2 flex flex-col justify-center`}
        >
          <div className="text-3xl md:text-4xl text-center md:text-start text-[#728146] font-bold">
            산후관리사란
          </div>
          <div className="whitespace-pre-wrap break-keep mt-4 text-base text-center md:text-start md:text-lg lg:text-xl space-y-2">
            <div>
              출산 후, 몸의 회복이 중요한 시기인 산욕기(분만종료 후 6~8주간)에
            </div>
            <div>
              산모님이 가정에서 편안하게 산후관리를 하실 수 있도록 도와드리기
              위해
            </div>
            <div>산모 영양/건강관리, 신생아 돌보기 등 전문교육을 수료하고 </div>
            <div>
              배상보험에 가입되어 가정방문 산후관리 서비스를 제공하는
              전문인입니다.
            </div>
            <div className="mt-6">
              산후관리사는 산모님이 가정 내에서 충분한 휴식과 안정을 취하여
            </div>
            <div>
              조속히 건강을 회복할 수 있도록 하며, 신생아의 건강을 보살피고
            </div>
            <div>
              큰아이가 있는 경우 자녀 돌보기는 물론 전반적인 가사관리를
              지원함으로써
            </div>
            <div>
              고객님의 행복한 가정생활이 원만히 유지되도록 도와드리는
              행복도우미입니다.
            </div>
          </div>
        </div>
        <div className="w-full h-[76vw] md:w-[54vw] md:h-[30vw] relative mt-6 md:mt-0">
          <Image
            src="/handwithbaby.jpg"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 100vw"
            quality={100}
            alt="산후관리사란 설명 이미지"
          />
        </div>
      </div>
      {/* 산후관리사 자격조건 */}
      <div className="mt-24 flex flex-col relative md:flex-row gap-12 md:gap-0">
        <div className="w-[301px] h-[401px] mx-auto md:mx-0 md:w-[46vw] md:h-[35vw] order-2 md:order-1 ">
          <div className="w-full md:w-[25vw] h-full flex justify-center items-center relative mt-6 md:mt-0">
            <Image
              src="/baby_1.jpg"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 100vw"
              quality={100}
              alt="산후관리사 자격조건 설명 이미지"
            />
          </div>
        </div>
        <div className="flex flex-col relative w-full md:w-[54vw] order-1 md:order-2">
          <div
            className={`text-3xl md:text-4xl text-[#728146] font-bold text-center md:text-start ${gowunDodumFont.className}`}
          >
            산후관리사 자격조건
          </div>
          <ul className="mt-10 space-y-6 whitespace-pre-wrap break-keep text-base md:text-lg lg:text-xl flex flex-col">
            {ruleList.map(({ number, contents }) => {
              return (
                <li key={number}>
                  <NumberList number={number} contents={contents} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* 산후관리사 준수사항 */}
      <div className="mt-24 flex flex-col relative md:flex-row gap-12 md:gap-0">
        <div className="w-[301px] h-[401px] mx-auto md:mx-0 flex justify-center items-center my-auto md:w-[46vw] md:h-[35vw] order-2">
          <div className="w-full md:w-[25vw] h-full flex justify-center items-center relative mt-6 md:mt-0">
            <Image
              src="/policy.png"
              fill
              sizes="100vw"
              alt="산후관리사 준수사항 설명 일러스트"
            />
          </div>
        </div>
        <div className="flex flex-col relative w-full md:w-[54vw] order-1">
          <div
            className={`text-3xl md:text-4xl text-[#728146] font-bold text-center md:text-start ${gowunDodumFont.className}`}
          >
            산후관리사 준수사항
          </div>
          <div
            className={`${gowunDodumFont.className} text-base md:text-2xl whitespace-pre-wrap break-keep mt-6`}
          >
            {`관리사 활동 중 회사를 통하지 않고 산모 등의 개인적인 소개에 의해\n관리사 임의로 수행한 활동에 대해서는 민원 및 보상책임 발생 시\n회사가 일체의 책임을 지지 않으며 이의 적발 시 퇴사 조치합니다.`}
          </div>
          <ul className="mt-10 space-y-6 whitespace-pre-wrap break-keep text-base md:text-lg lg:text-xl flex flex-col">
            {policyList.map(({ number, contents }) => {
              return (
                <li key={number}>
                  <NumberList number={number} contents={contents} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const NumberList = ({
  number,
  contents,
}: {
  number: string;
  contents: string;
}) => {
  return (
    <span className="flex flex-row items-center gap-2 md:gap-6">
      <div className="md:w-12 md:h-12 w-7 h-7 md:text-2xl rounded-full bg-[#728146] flex justify-center items-center fond-bold text-white">
        {number}
      </div>
      <span className="font-medium md:text-xl">{contents}</span>
    </span>
  );
};

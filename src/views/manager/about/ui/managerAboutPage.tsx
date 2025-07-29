import Image from 'next/image';

import { gowunDodumFont } from '@/shared/fonts';

import { policyList, ruleList } from '../config/const';

export const ManagerAboutPage = () => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center leading-6">
      {/* 산후관리사란 */}
      <div className="text-center">
        <div className={``}>
          <span
            className={`text-center text-3xl font-bold text-[#728146] md:text-start md:text-4xl ${gowunDodumFont.className}`}
          >
            산후관리사란
          </span>
          <div className="mt-4 flex flex-col gap-1 whitespace-pre-wrap break-keep text-sm lg:text-base xl:text-lg">
            <span>출산 후, 몸의 회복이 중요한 시기인 산욕기(분만종료 후 6~8주간)에</span>
            <span>산모님이 가정에서 편안하게 산후관리를 하실 수 있도록 도와드리기 위해</span>
            <span>산모 영양/건강관리, 신생아 돌보기 등 전문교육을 수료하고 </span>
            <span>배상보험에 가입되어 가정방문 산후관리 서비스를 제공하는 전문인입니다.</span>
            <span className="mt-6">산후관리사는 산모님이 가정 내에서 충분한 휴식과 안정을 취하여</span>
            <span>조속히 건강을 회복할 수 있도록 하며, 신생아의 건강을 보살피고</span>
            <span>큰아이가 있는 경우 자녀 돌보기는 물론 전반적인 가사관리를 지원함으로써</span>
            <span className="font-bold">고객님의 행복한 가정생활이 원만히 유지되도록 도와드리는 행복도우미입니다.</span>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <Image
            alt="산후관리사란 설명 이미지"
            height={300}
            quality={50}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 100vw"
            src="/handwithbaby.jpg"
            width={400}
          />
        </div>
      </div>
      {/* 산후관리사 자격조건 */}
      <div className="mt-24 flex flex-col items-center justify-center">
        <span
          className={`text-center text-3xl font-bold text-[#728146] md:text-start md:text-4xl ${gowunDodumFont.className}`}
        >
          산후관리사 자격조건
        </span>
        <ul className="mt-6 flex flex-col space-y-6 whitespace-pre-wrap break-keep text-start text-sm md:text-base lg:text-lg">
          {ruleList.map(({ number, contents }) => {
            return (
              <li key={number}>
                <NumberList contents={contents} number={number} />
              </li>
            );
          })}
        </ul>
        {/* <Image
          src="/baby_1.jpg"
          width={427}
          height={640}
          quality={100}
          alt="산후관리사 자격조건 설명 이미지"
        /> */}
      </div>
      {/* 산후관리사 준수사항 */}
      <div className="mt-24 flex flex-col items-center justify-center text-center">
        <Image alt="산후관리사 준수사항 설명 일러스트" height={350} sizes="100vw" src="/policy.png" width={200} />
        <div
          className={`mt-10 text-center text-3xl font-bold text-[#728146] md:text-start md:text-4xl ${gowunDodumFont.className}`}
        >
          산후관리사 준수사항
        </div>
        <div className={`mt-6 whitespace-pre-wrap break-keep leading-6 text-slate-700 xl:text-lg`}>
          {`관리사 활동 중 회사를 통하지 않고 산모 등의 개인적인 소개에 의해\n관리사 임의로 수행한 활동에 대해서는 민원 및 보상책임 발생 시\n회사가 일체의 책임을 지지 않으며 이의 적발 시 퇴사 조치합니다.`}
        </div>
        <ul className="mt-10 flex flex-col space-y-6 whitespace-pre-wrap break-keep text-start text-sm md:text-base lg:text-lg">
          {policyList.map(({ number, contents }) => {
            return (
              <li key={number}>
                <NumberList contents={contents} number={number} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const NumberList = ({ number, contents }: { number: string; contents: string }) => {
  return (
    <span className="flex flex-row items-center gap-3 md:gap-6">
      <span className="fond-bold flex h-6 w-6 items-center justify-center rounded-full bg-[#728146] text-white md:h-8 md:w-8 md:text-xl">
        {number}
      </span>
      <span>{contents}</span>
    </span>
  );
};

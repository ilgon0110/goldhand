import { gowunDodumFont } from "@/shared/fonts";

export function MainTitle() {
  return (
    <div
      className={`${gowunDodumFont.className} space-y-8 mt-24 break-keep text-base md:text-lg lg:text-xl`}
    >
      <div className="text-center">
        화성, 동탄 산후도우미 <span className="text-[#728146]">고운황금손</span>
      </div>
      <div className="font-bold whitespace-pre-wrap text-center">
        {`안녕하세요, 고운황금손 산후도우미 입니다.\n사랑과 전문 지식을 바탕으로 산모와 아기를 보살펴 드립니다.`}
      </div>
      <div className="font-bold text-center">
        산모와 아기가 편안한 휴식을 취할 수 있도록 최선을 다하겠습니다.
      </div>
      <div className="font-bold text-center">
        <span className="text-[#728146]">고운황금손</span>이 도와드리겠습니다.
      </div>
    </div>
  );
}

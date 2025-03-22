import { gowunDodumFont } from "@/shared/fonts";

export function MainTitle() {
  return (
    <div
      className={`bg-[#4B552F] w-full left-0 flex flex-row py-8 md:py-24 px-4 md:px-9 justify-between gap-12`}
    >
      <Card
        title="80"
        contents="경기도 최대 산후관리사 인원 보유"
        divider={true}
      />
      <Card
        title="S+"
        contents="2025년 정부인증 최고 관리등급 획득"
        divider={true}
      />
      <Card title="3,000+" contents="누적 이용자 수" divider={false} />
    </div>
  );
}

const Card = ({
  title,
  contents,
  divider,
}: {
  title: string;
  contents: string;
  divider: boolean;
}) => {
  return (
    <div className="flex flex-row justify-between w-full">
      <div className="flex flex-col gap-2 md:gap-16 text-white">
        <span className="text-4xl lg:text-[120px] font-bold">{title}</span>
        <span className="text-[10px] md:text-2xl">{contents}</span>
      </div>
      {divider && <div className="w-[1px] h-full bg-white" />}
    </div>
  );
};

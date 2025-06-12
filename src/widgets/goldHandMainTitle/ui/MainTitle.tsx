export function MainTitle() {
  return (
    <div className="grid w-full grid-cols-5 place-items-center overflow-hidden bg-[#4B552F] px-4 py-8 md:px-9 md:py-24">
      <Card contents="경기도 최대 산후관리사 인원 보유" title="80" />
      <div className="h-full w-[1px] bg-white" />
      <Card contents="2025년 정부인증 최고 관리등급 획득" title="S+" />
      <div className="h-full w-[1px] bg-white" />
      <Card contents="누적 이용자 수" title="3,000+" />
    </div>
  );
}

const Card = ({ title, contents }: { title: string; contents: string }) => {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex flex-col gap-2 text-white md:gap-16">
        <span className="text-center text-2xl font-bold md:text-[56px] lg:text-[80px]">{title}</span>
        <span className="text-sm sm:text-base md:text-2xl">{contents}</span>
      </div>
    </div>
  );
};

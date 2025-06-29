import { PiRankingFill } from 'react-icons/pi';

export function MainTitle() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
      <Card contents="경기도 최대 산후관리사 인원 보유" title="80" />
      <Card contents="2025년 정부인증 최고 관리등급 획득" title="S+" />
      <Card contents="누적 이용자 수" title="3,000+" />
    </div>
  );
}

const Card = ({ title, contents }: { title: string; contents: string }) => {
  return (
    <div className="flex flex-row items-center justify-center rounded border border-slate-100 bg-[#FAFAFA] px-4 py-8 shadow transition-all duration-300 ease-in-out hover:border-none hover:bg-[#4B552F] hover:text-white md:px-9 md:py-12">
      <div className="flex flex-col items-center justify-center gap-2 md:gap-8">
        <PiRankingFill size={48} />
        <span className="text-center text-2xl font-bold md:text-[56px]">{title}</span>
        <span className="text-center text-sm sm:text-base md:text-2xl">{contents}</span>
      </div>
    </div>
  );
};

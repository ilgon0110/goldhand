export const CompanyPage = () => {
  return (
    <div className="break-keep text-xl text-white md:text-2xl">
      <span className="whitespace-pre-wrap text-4xl">{`고운황금손 멋진 소개 카피라이트.\n두줄 정도 있으면 좋을듯.`}</span>
      <div className="mt-6 flex w-full justify-between gap-6">
        <Slogan content="80+" title="경기도 최대 산후관리사 보유" />
        <Slogan content="3,000+" title="누적 사용자 수" />
        <Slogan content="S+" title="2025년 정부 관리등급 평가" />
      </div>
      <div className="mt-14">
        <span>산모님과 아기의 편안한 쉼을 누리는 시간이 되도록 최선을 다하겠습니다.</span>
      </div>
      <div className="mt-6">
        <span className="text-[#728146] drop-shadow">고운황금손</span>
        <span>이 도와드리겠습니다.</span>
      </div>
    </div>
  );
};

const Slogan = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base text-gray-400 md:text-xl">{title}</span>
      <span className="text-xl font-bold text-white md:text-3xl">{content}</span>
    </div>
  );
};

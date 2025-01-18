import { ApplyButton } from "./applyButton";

export const ApplyList = () => {
  const items = [
    {
      title: "가맹점을 운영하고 싶어요",
      description: "고운황금손과 파트너가 되길 원하시는 분들은 신청해주세요.",
      src: "/icon/agency.png",
    },
    {
      title: "관리사가 되고 싶어요",
      description: "고운황금손의 관리사로 지원하고 싶은 분들을 환영합니다.",
      src: "/icon/employee.png",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full gap-8">
      {items.map((item, index) => (
        <ApplyButton
          key={index}
          title={item.title}
          description={item.description}
          src={item.src}
        />
      ))}
    </div>
  );
};

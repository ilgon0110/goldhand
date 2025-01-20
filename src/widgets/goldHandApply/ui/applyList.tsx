import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import { ApplyButton } from "./applyButton";

export const ApplyList = () => {
  const items = [
    {
      title: "예약상담을 받고 싶어요",
      buttonTitle: "예약상담 신청하기",
      description: "고운황금손 서비스 상담을 받고 싶으신 분들은 신청해주세요.",
      src: "/icon/reservation_gray.png",
    },
    {
      title: "가맹점을 운영하고 싶어요",
      buttonTitle: "가맹점 신청하기",
      description: "고운황금손과 파트너가 되길 원하시는 분들은 신청해주세요.",
      src: "/icon/agency.png",
    },
    {
      title: "관리사가 되고 싶어요",
      buttonTitle: "관리사 지원하기",
      description: "고운황금손의 관리사로 지원하고 싶은 분들을 환영합니다.",
      src: "/icon/employee.png",
    },
  ];

  return (
    <section>
      <div className="mb-6">
        <SectionTitle title="신청하기" />
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-2">
        {items.map((item, index) => (
          <ApplyButton
            key={index}
            title={item.title}
            buttonTitle={item.buttonTitle}
            description={item.description}
            src={item.src}
          />
        ))}
      </div>
    </section>
  );
};

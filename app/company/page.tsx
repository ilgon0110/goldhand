import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

export const dynamic = 'force-dynamic';

const CompanyPage = () => {
  return (
    <article className="mx-auto max-w-3xl">
      <SectionTitleHero
        description="광교·용인·수원 산모신생아 케어 전문기업"
        label="수원 산후도우미 고운황금손 대표 인사말"
      />
      <div className="space-y-6 text-base leading-relaxed text-gray-700 md:text-lg">
        <p>저희 고운황금손을 찾아주신 분들께 진심으로 감사드립니다.</p>
        <p>
          여자로 태어나 가장 큰 고통과 기쁨을 함께하며, 세상에서 가장 소중한 새 생명을 탄생시킨 어머니들의 지친 몸과
          마음을 따스한 사랑의 손길로 감싸드리고자 합니다.
        </p>
        <p>
          출산의 고통이 채 가시기 전에 마주하게 되는 낯선 육아. 그것이 처음 겪는 일이건 경험했던 일이건, 새로운 시작은
          언제나 설레고도 두려운 법입니다. 육아의 건강한 첫걸음은 바로 편안한 산후조리에서 시작됩니다.
        </p>
        <p>
          가정을 위해 온갖 어려움을 이겨내고, 누구보다 크고 푸르게 자라날 아기를 지켜나갈 산모님을 위해 이제 저희가
          든든한 버팀목이 되어 드리겠습니다.
        </p>
        <p>
          가장 편안하고 따뜻한 만남을 통해 산모님과 아가가 온전한 쉼을 누릴 수 있도록 전문가의 손길로 정성을 다해 보살펴
          드리겠습니다.
        </p>
        <p>출산의 어려움과 육아의 두려움이 기분 좋은 자신감이 되도록, 늘 곁에서 정성으로 함께하겠습니다.</p>
        <p>감사합니다.</p>
        <p className="text-right font-semibold text-gray-900">대표 차 복 규</p>
      </div>
    </article>
  );
};

export default CompanyPage;

import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { FranchiseeCard } from './FranchiseeCard';

export const FranchiseePage = () => {
  const franchisees = [
    {
      src: '/goldhand_black.png',
      title: '화성동탄점',
      phoneNumber: '010-8381-0431',
      description: '고운황금손 화성동탄 본점입니다.',
      naverPlaceUrl: 'https://naver.me/FBepMjL3',
    },
    {
      src: '/goldhand_black.png',
      title: '수원점',
      phoneNumber: '010-5536-3765',
      description: '고운황금손 수원점입니다.',
      naverPlaceUrl: 'https://naver.me/xpB4oXiI',
    },
    // Add more franchisees as needed
  ];
  return (
    <>
      <SectionTitle buttonTitle="" title="지점 안내" onClickButtonTitle={() => {}} />
      <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {franchisees.map(franchisee => (
          <FranchiseeCard
            description={franchisee.description}
            key={franchisee.title}
            naverPlaceUrl={franchisee.naverPlaceUrl}
            phoneNumber={franchisee.phoneNumber}
            src={franchisee.src}
            title={franchisee.title}
          />
        ))}
      </div>
    </>
  );
};

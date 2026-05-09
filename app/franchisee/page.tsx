import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import { FranchiseeCard } from './_FranchiseeCard';
import { BRANCHES } from './franchisee.config';

export default function FranchiseePage() {
  return (
    <div>
      <SectionTitleHero
        description={
          <>
            보건복지부·정부바우처 등록 기관으로 운영되는 본점·지점 모두에서
            <br />
            동일한 기준의 산모·신생아 케어를 받으실 수 있습니다.
          </>
        }
        label="고운황금손 지점 안내"
      />
      {/* 지점 목록 */}
      <div>
        {BRANCHES.map((branch, index) => (
          <FranchiseeCard
            address={branch.address}
            badge={branch.badge}
            description={branch.description}
            images={branch.images}
            index={index}
            key={branch.id}
            naverPlaceUrl={branch.naverPlaceUrl}
            phoneNumber={branch.phoneNumber}
            region={branch.region}
            title={branch.title}
            total={BRANCHES.length}
          />
        ))}
      </div>
    </div>
  );
}

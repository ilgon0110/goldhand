import Image from 'next/image';

import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

export const SponsorList = () => {
  return (
    <div className="mt-12">
      <FadeInWhenVisible>
        <SectionTitle buttonTitle="" title="고운황금손 협력사" onClickButtonTitle={() => {}} />
        <div className="relative mt-4 flex h-12 flex-row justify-center">
          <div className="relative h-full basis-1/5">
            <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_1.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-full basis-1/4">
            <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_2.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-full basis-1/4">
            <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_5.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-full basis-1/4">
            <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_3.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-full basis-1/4">
            <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_4.png" style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  );
};

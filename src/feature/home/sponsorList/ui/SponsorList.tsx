import Image from 'next/image';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

export const SponsorList = () => {
  return (
    <div className="mt-12">
      <FadeInWhenVisible>
        <SectionTitleHero description="고운황금손 협력사를 소개합니다." label="고운황금손 협력사" />
        <div className={cn('mt-4 grid grid-cols-2 gap-x-4 gap-y-6', 'md:grid-cols-5', 'xl:grid-cols-5')}>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_1.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_2.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_5.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_3.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_4.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_6.jpg" style={{ objectFit: 'cover' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_7.jpg" style={{ objectFit: 'cover' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_8.gif" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_9.png" style={{ objectFit: 'contain' }} />
          </div>
          <div className="relative h-12">
            <Image alt="" fill sizes="150" src="/sponsor_10.svg" style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  );
};

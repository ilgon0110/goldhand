import Image from 'next/image';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';

import { HomeSectionHeading } from '../../ui/HomeSectionHeading';

const SPONSORS = [
  { src: '/sponsor_1.png', fit: 'contain' },
  { src: '/sponsor_2.png', fit: 'contain' },
  { src: '/sponsor_5.png', fit: 'contain' },
  { src: '/sponsor_3.png', fit: 'contain' },
  { src: '/sponsor_4.png', fit: 'contain' },
  { src: '/sponsor_6.jpg', fit: 'cover' },
  { src: '/sponsor_7.jpg', fit: 'cover' },
  { src: '/sponsor_8.gif', fit: 'contain' },
  { src: '/sponsor_9.png', fit: 'contain' },
  { src: '/sponsor_10.svg', fit: 'contain' },
] as const;

export const SponsorList = () => {
  return (
    <FadeInWhenVisible>
      <HomeSectionHeading description="고운황금손 협력사를 소개합니다." title="고운황금손 협력사" />
      <div
        className={cn(
          'mt-10 grid grid-cols-2 gap-x-8 gap-y-10 rounded-2xl border border-border px-6 py-10',
          'md:grid-cols-5 md:px-10',
        )}
      >
        {SPONSORS.map(({ src, fit }) => (
          <div className="relative h-12" key={src}>
            <Image alt="" fill sizes="150px" src={src} style={{ objectFit: fit }} />
          </div>
        ))}
      </div>
    </FadeInWhenVisible>
  );
};

import Image from 'next/image';

import { CarouselItem } from '@/src/shared/ui/carousel';

type TImageCardProps = {
  src: string;
  alt: string;
};

export function ImageCard({ src, alt }: TImageCardProps) {
  return (
    <CarouselItem className="relative h-full w-full">
      <Image alt={alt} fill sizes="100vw" src={src} style={{ objectFit: 'cover' }} />
    </CarouselItem>
  );
}

ImageCard.displayName = 'ImageCard';

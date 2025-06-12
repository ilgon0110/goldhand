import Image from 'next/image';

import { CarouselItem } from '@/src/shared/ui/carousel';

type ImageCardProps = {
  src: string;
  alt: string;
};

export function ImageCard({ src, alt }: ImageCardProps) {
  return (
    <CarouselItem className="relative h-full w-full">
      <Image
        alt={alt}
        fill
        src={src}
        style={{ objectFit: 'cover' }}
        //(max-width: 640px) 33vw, (max-width: 768px) 50vw,
        sizes="100vw"
      />
    </CarouselItem>
  );
}

ImageCard.displayName = 'ImageCard';

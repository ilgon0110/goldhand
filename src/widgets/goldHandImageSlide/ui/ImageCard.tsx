import { CarouselItem } from "@/src/shared/ui/carousel";
import Image from "next/image";

type ImageCardProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function ImageCard({ src, alt, width, height }: ImageCardProps) {
  return (
    <CarouselItem>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 640px) 33vw, (max-width: 768px) 50vw, 100vw"
      />
    </CarouselItem>
  );
}

ImageCard.displayName = "ImageCard";

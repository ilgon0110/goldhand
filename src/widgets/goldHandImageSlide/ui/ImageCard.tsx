import { CarouselItem } from "@/src/shared/ui/carousel";
import Image from "next/image";

type ImageCardProps = {
  src: string;
  alt: string;
};

export function ImageCard({ src, alt }: ImageCardProps) {
  return (
    <CarouselItem className="w-full h-full relative">
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        //(max-width: 640px) 33vw, (max-width: 768px) 50vw,
        sizes="100vw"
      />
    </CarouselItem>
  );
}

ImageCard.displayName = "ImageCard";

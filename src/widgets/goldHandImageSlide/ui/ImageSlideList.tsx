"use client";

import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent } from "@/src/shared/ui/carousel";
import { useRef } from "react";
import { ImageCard } from "./ImageCard";

export function ImageSlideList() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const images = [
    "/imageslide/goldhand_imageslide_1.jpg",
    "/imageslide/goldhand_imageslide_2.jpg",
    "/imageslide/goldhand_imageslide_3.jpg",
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      //onMouseEnter={plugin.current.stop}
      //onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="w-full">
        <ImageCard src={images[0]} alt="Gold Hand" width={2000} height={600} />
        <ImageCard src={images[1]} alt="Gold Hand" width={2000} height={600} />
        <ImageCard src={images[2]} alt="Gold Hand" width={2000} height={600} />
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}

import Image from 'next/image';

export const RentalCard = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative h-[400px] w-full bg-[#F0F4FA]">
      <div className="absolute right-0 top-6">
        <Image alt={alt} height={200} src={src} style={{ objectFit: 'contain' }} width={200} />
      </div>
      <span className="absolute bottom-6 left-4 text-2xl font-bold">{alt}</span>
    </div>
  );
};

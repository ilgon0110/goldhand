import Image from 'next/image';

export const RentalCard = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative h-[400px] w-full rounded-lg bg-white p-2 shadow">
      <div className="relative h-[330px] w-full rounded">
        <Image alt={alt} fill src={src} style={{ objectFit: 'cover', borderRadius: '0.5rem' }} />
      </div>
      <h3 className="px-4 py-2 text-lg font-bold">{alt}</h3>
    </div>
  );
};

import Image from 'next/image';

export const SponsorList = () => {
  return (
    <div className="relative flex h-12 flex-row justify-center md:px-[10vw]">
      <div className="relative h-full basis-1/4">
        <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_1.png" style={{ objectFit: 'contain' }} />
      </div>
      <div className="relative h-full basis-1/4">
        <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_2.png" style={{ objectFit: 'contain' }} />
      </div>
      <div className="relative h-full basis-1/4">
        <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_3.png" style={{ objectFit: 'contain' }} />
      </div>
      <div className="relative h-full basis-1/4">
        <Image alt="스폰서 로고 이미지" fill sizes="75" src="/sponsor_4.png" style={{ objectFit: 'contain' }} />
      </div>
    </div>
  );
};

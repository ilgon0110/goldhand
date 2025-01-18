import Image from "next/image";

export const SponsorList = () => {
  return (
    <div className="flex flex-row h-12 justify-center relative">
      <div className="basis-1/4 h-full relative">
        <Image
          src="/sponsor_1.png"
          fill
          alt="스폰서 로고 이미지"
          sizes="75"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="basis-1/4 h-full relative">
        <Image
          src="/sponsor_2.png"
          fill
          alt="스폰서 로고 이미지"
          sizes="75"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="basis-1/4 h-full relative">
        <Image
          src="/sponsor_3.png"
          fill
          alt="스폰서 로고 이미지"
          sizes="75"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="basis-1/4 h-full relative">
        <Image
          src="/sponsor_4.png"
          fill
          alt="스폰서 로고 이미지"
          sizes="75"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

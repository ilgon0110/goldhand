import Image from 'next/image';
import Link from 'next/link';

type TFranchisseeCardProps = {
  src: string;
  title: string;
  phoneNumber: string;
  description: string;
  naverPlaceUrl: string;
};

export const FranchiseeCard = ({ src, title, phoneNumber, description, naverPlaceUrl }: TFranchisseeCardProps) => {
  return (
    <div className="col-span-1 flex h-[600px] flex-col rounded bg-white shadow-lg">
      <div className="relative h-[400px] w-full">
        <Image alt={title} fill src={src} style={{ objectFit: 'cover' }} />
      </div>
      <div className="mt-6 flex flex-col space-y-1 px-4">
        <span className="text-xl font-bold">{title}</span>
        <span className="text-slate-700">{phoneNumber}</span>
        <p>{description}</p>
        <Link className="mt-2 text-[#2DB400] underline" href={naverPlaceUrl} target="_blank">
          네이버 플레이스 이동하기
        </Link>
      </div>
    </div>
  );
};

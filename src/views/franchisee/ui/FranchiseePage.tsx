import Image from 'next/image';
import Link from 'next/link';

import { SectionTitle } from '@/src/shared/ui/sectionTitle';

export const FranchiseePage = () => {
  const franchisees = [
    {
      src: '/goldhand_black.png',
      title: '화성동탄점',
      phoneNumber: '+1234567890',
      description: 'Description for Franchisee 1',
      naverPlaceUrl: 'https://naver.me/FBepMjL3',
    },
    {
      src: '/goldhand_black.png',
      title: '수원점',
      phoneNumber: '+0987654321',
      description: 'Description for Franchisee 2',
      naverPlaceUrl: 'https://naver.me/xpB4oXiI',
    },
    // Add more franchisees as needed
  ];
  return (
    <>
      <SectionTitle buttonTitle="" title="지점 안내" onClickButtonTitle={() => {}} />
      <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {franchisees.map(franchisee => (
          <Card
            description={franchisee.description}
            key={franchisee.title}
            naverPlaceUrl={franchisee.naverPlaceUrl}
            phoneNumber={franchisee.phoneNumber}
            src={franchisee.src}
            title={franchisee.title}
          />
        ))}
      </div>
    </>
  );
};

type CardProps = {
  src: string;
  title: string;
  phoneNumber: string;
  description: string;
  naverPlaceUrl: string;
};

const Card = ({ src, title, phoneNumber, description, naverPlaceUrl }: CardProps) => {
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

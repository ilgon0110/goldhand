import Image from 'next/image';

import { cn } from '@/lib/utils';

type TManagerWorkCardProps = {
  iconSrc: string;
  title: string;
  contentList: string[];
};

export const ManagerWorkCard = ({ iconSrc, title, contentList }: TManagerWorkCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-start justify-center rounded-sm border border-slate-100 bg-white p-4',
        'md:justify-normal',
      )}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="relative h-12 w-12">
          <Image alt="Manager Work Icon" fill sizes="100vw" src={iconSrc} style={{ objectFit: 'contain' }} />
        </div>
        <div className={cn('text-base font-bold text-[#728146]', 'md:text-lg')}>{title}</div>
      </div>
      <ul className="mt-4 grid w-full grid-cols-2 gap-2 text-sm">
        {contentList.map(content => (
          <li className="list-none text-gray-500" key={content}>
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

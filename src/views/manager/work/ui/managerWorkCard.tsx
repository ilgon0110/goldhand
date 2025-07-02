import Image from 'next/image';

type TManagerWorkCardProps = {
  iconSrc: string;
  title: string;
  contentList: string[];
};

export const ManagerWorkCard = ({ iconSrc, title, contentList }: TManagerWorkCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center md:items-start md:justify-normal">
      <div className="relative h-[50px] w-[50px] md:h-[90px] md:w-[90px]">
        <Image alt="Manager Work Icon" fill sizes="100vw" src={iconSrc} style={{ objectFit: 'contain' }} />
      </div>
      <div className="mt-3 text-base font-bold text-[#728146] md:mt-6 md:text-lg">{title}</div>
      <ul className="mt-3 space-y-1 text-base md:text-lg">
        {contentList.map(content => (
          <li className="list-none text-gray-500" key={content}>
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

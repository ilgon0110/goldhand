import Image from 'next/image';

type ManagerWorkCardProps = {
  iconSrc: string;
  title: string;
  contentList: string[];
};

export const ManagerWorkCard = ({ iconSrc, title, contentList }: ManagerWorkCardProps) => {
  return (
    <div className="relative h-[230px] w-full rounded-md bg-[#F6F6F6] p-3 md:h-fit md:min-h-[25vw] md:p-7">
      <div className="absolute -left-[3px] -z-10 h-9 w-[6px] rounded-full bg-[#728146] md:-left-4 md:h-[7vw] md:w-9" />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 md:h-[7vw] md:w-[7vw] md:p-[1.5vw]">
        <Image
          alt="Manager Work Icon"
          height={0}
          sizes="100vw"
          src={iconSrc}
          style={{ width: '7vw', height: '7vw', objectFit: 'contain' }}
          width={0}
        />
      </div>
      <div className="mt-3 text-base font-bold text-[#728146] md:mt-6 md:text-3xl">{title}</div>
      <ul className="mt-3 space-y-2 text-sm md:mt-6 md:text-lg lg:text-xl">
        {contentList.map(content => (
          <li className="list-none" key={content}>
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

import Image from "next/image";

type ManagerWorkCardProps = {
  iconSrc: string;
  title: string;
  contentList: string[];
};

export const ManagerWorkCard = ({
  iconSrc,
  title,
  contentList,
}: ManagerWorkCardProps) => {
  return (
    <div className="w-full h-[230px] md:min-h-[25vw] md:h-fit bg-[#F6F6F6] rounded-md relative p-3 md:p-7">
      <div className="absolute md:-left-4 -left-[3px] -z-10 w-[6px] md:w-9 h-9 md:h-[7vw] bg-[#728146] rounded-full" />
      <div className="md:w-[7vw] md:h-[7vw] w-12 h-12 rounded-full bg-white flex justify-center items-center p-3 md:p-[1.5vw]">
        <Image
          src={iconSrc}
          alt="Manager Work Icon"
          width={0}
          height={0}
          style={{ width: "7vw", height: "7vw", objectFit: "contain" }}
          sizes="100vw"
        />
      </div>
      <div className="text-base md:text-3xl text-[#728146] font-bold mt-3 md:mt-6">
        {title}
      </div>
      <ul className="mt-3 md:mt-6 space-y-2 text-sm md:text-lg lg:text-xl">
        {contentList.map((content) => (
          <li className="list-none" key={content}>
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

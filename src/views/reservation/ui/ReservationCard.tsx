import TruncateText from "@/src/shared/ui/TruncateText";

type ReservationCardProps = {
  title: string;
  author: string;
  createdAt: string;
  spot: string;
  isSecret: boolean;
};

export const ReservationCard = ({
  title,
  author,
  createdAt,
  spot,
  isSecret,
}: ReservationCardProps) => {
  return (
    <button
      className="w-full group border border-[#0F2E16] hover:bg-[#0F2E16] relative flex flex-start flex-col text-start p-2 md:p-6 rounded-sm md:rounded-md transform transition-all ease-in-out duration-300"
      disabled={isSecret}
    >
      {isSecret && (
        <div className="absolute md:right-6 md:top-6 right-2 top-2 group-hover:fill-[#FFFFFF]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="current"
            className="w-6 h-6 md:w-12 md:h-12"
          >
            <path d="M220-80q-24.75 0-42.37-17.63Q160-115.25 160-140v-434q0-24.75 17.63-42.38Q195.25-634 220-634h70v-96q0-78.85 55.61-134.42Q401.21-920 480.11-920q78.89 0 134.39 55.58Q670-808.85 670-730v96h70q24.75 0 42.38 17.62Q800-598.75 800-574v434q0 24.75-17.62 42.37Q764.75-80 740-80H220Zm0-60h520v-434H220v434Zm260.17-140q31.83 0 54.33-22.03T557-355q0-30-22.67-54.5t-54.5-24.5q-31.83 0-54.33 24.5t-22.5 55q0 30.5 22.67 52.5t54.5 22ZM350-634h260v-96q0-54.17-37.88-92.08-37.88-37.92-92-37.92T388-822.08q-38 37.91-38 92.08v96ZM220-140v-434 434Z" />
          </svg>
        </div>
      )}
      <div className="font-bold text-base md:text-3xl text-[#0F2E16] group-hover:text-[#FFFFFF]">
        <TruncateText text={isSecret ? "비밀글입니다" : title} maxLines={1} />
      </div>
      <div className="text-sm md:text-xl mt-2 md:mt-6 group-hover:text-[#FFFFFF]">
        <TruncateText text={isSecret ? "비밀글입니다" : author} maxLines={1} />
      </div>
      <div className="flex flex-row items-center text-[#878787] space-x-2 md:space-x-4 mt-2 md:mt-3 group-hover:text-[#FFFFFF]">
        <div className="text-sm md:text-xl">{createdAt}</div>
        <div className="w-[1px] h-[14px] md:h-[20px] bg-slate-500" />
        <div className="text-sm md:text-xl">{spot}</div>
      </div>
    </button>
  );
};

import Image from 'next/image';

import { cn } from '@/lib/utils';

type TAutoLoginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  iconSrc: string;
  color: 'green' | 'yellow';
  onClick: () => void;
};

export const AuthLoginButton = ({ title, iconSrc, color, onClick, ...props }: TAutoLoginButtonProps) => {
  const colorVariants = {
    green: 'bg-[#2DB400] hover:bg-green-600 text-white',
    yellow: 'bg-[#FFEB3B] hover:bg-yellow-300 text-black',
  };
  return (
    <button
      {...props}
      className={cn(
        `${colorVariants[color]} flex h-14 w-full flex-row items-center justify-center gap-2 rounded-full`,
        props.className,
      )}
      onClick={onClick}
    >
      <Image alt="icon" height={24} src={iconSrc} width={24} />
      {title}
    </button>
  );
};

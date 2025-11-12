import Image from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { safeLocalStorage } from '@/src/shared/storage';

type TAutoLoginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  provider: 'kakao' | 'naver';
  title: string;
  iconSrc: string;
  handleClick: () => void;
};

export const AuthLoginButton = ({ provider, title, iconSrc, handleClick, ...props }: TAutoLoginButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // 마운트 이후에만 localStorage를 읽음 -> SSR과 동일한 초기 마크업 보장
    try {
      setShowTooltip(safeLocalStorage.get('last-login-tooltip') === provider);
    } catch {
      setShowTooltip(false);
    }
  }, [provider]);

  return (
    <div className={cn('w-full space-y-3', 'md:w-fit')}>
      <button
        {...props}
        className={cn(
          `flex h-14 w-full flex-row items-center justify-center gap-2 rounded-full px-16`,
          provider === 'kakao' ? 'bg-kakao text-black hover:bg-yellow-300' : 'bg-naver text-white hover:bg-green-600',
          props.className,
        )}
        onClick={handleClick}
      >
        <Image alt="icon" height={24} src={iconSrc} width={24} />
        {title}
      </button>
      {showTooltip && (
        <div className="bg- relative w-max rounded-lg bg-slate-200 p-4 text-black">
          {'최근에 로그인했어요.'}
          <div className="absolute -top-2 left-4 h-0 w-0 border-b-8 border-l-8 border-r-8 border-b-slate-200 border-l-transparent border-r-transparent"></div>
        </div>
      )}
    </div>
  );
};

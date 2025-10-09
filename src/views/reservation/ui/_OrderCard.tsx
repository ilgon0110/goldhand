import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type TOrderCardProps = {
  order: string;
  title: string;
  content: string;
};
export const OrderCard = ({ order, title, content }: TOrderCardProps) => {
  return (
    <div className={cn('flex flex-row gap-2', 'md:gap-4')}>
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full bg-[#728146] text-sm font-bold text-white',
          'md:h-16 md:w-16 md:text-2xl',
        )}
      >
        {order}
      </div>
      <div className="w-[90%] space-y-3">
        <div className={cn('text-2xl font-bold text-[#373737]', 'md:text-4xl')}>{title}</div>
        <div className={cn('whitespace-pre-wrap break-keep text-base text-[#373737]', 'md:text-2xl')}>{content}</div>
        {order === '1' ? (
          <div className={cn('flex flex-row gap-6', 'md:gap-10')}>
            <div className="flex flex-row items-center gap-2">
              <svg
                className={cn('h-6 w-6', 'md:h-12 md:w-12')}
                fill="#728146"
                viewBox="0 -960 960 960"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M776-487q-5-121-89-205t-205-89v-60q72 2 135.5 30.5T729-734q48 48 76.5 111.5T836-487h-60Zm-169 0q-5-50-40-84.5T482-611v-60q75 5 127.5 57T667-487h-60Zm188 367q-116 0-236.5-56T335-335Q232-438 176-558.5T120-795q0-19.29 12.86-32.14Q145.71-840 165-840h140q14 0 24 10t14 25l26.93 125.64Q372-665 369.5-653.5t-10.73 19.73L259-533q26 44 55 82t64 72q37 38 78 69.5t86 55.5l95-98q10-11 23.15-15 13.15-4 25.85-2l119 26q15 4 25 16.04 10 12.05 10 26.96v135q0 19.29-12.86 32.14Q814.29-120 795-120ZM229-588l81-82-23-110H180q2 42 13.5 88.5T229-588Zm369 363q41 19 89 31t93 14v-107l-103-21-79 83ZM229-588Zm369 363Z" />
              </svg>
              <div className={cn('font-bold', 'md:text-2xl')}>010-4437-0431</div>
            </div>
            <Link
              className={cn(
                'flex animate-pulse flex-row items-center gap-2 rounded-sm bg-slate-100/70 p-3 transition-all duration-1000 ease-in-out',
                'hover:bg-slate-200',
              )}
              href="http://pf.kakao.com/_tvkwxj"
              target="_blank"
            >
              <div className={cn('relative h-8 w-8', 'md:h-12 md:w-12')}>
                <Image alt="Kakao" fill sizes="100vw" src="/icon/kakaotalk.png" />
              </div>
              <div className={cn('', 'md:text-2xl')}>
                <span className="font-bold">고운황금손</span> 클릭
              </div>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

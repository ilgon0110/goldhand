'use client';

import Image from 'next/image';
import { Suspense, useState } from 'react';

import { cn } from '@/lib/utils';
import { useGetUserListData } from '@/src/entities/user';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { formatDateToYMD, formatPhoneNumber } from '@/src/shared/utils';

const PAGE_SIZE = 10;

const dash = (value: string | null | undefined) => (value == null || value === '' ? '-' : value);

const TABLE_HEADERS = [
  '번호',
  '이름',
  '닉네임',
  '이메일',
  '전화번호',
  '등급',
  '가입경로',
  '카카오이메일',
  '탈퇴여부',
  '탈퇴일',
  '가입일',
  '수정일',
];

const UserListTableSkeleton = () => {
  return (
    <div className="mt-4 border border-stone-200">
      <div className="h-9 w-full bg-stone-50" />
      <div className="divide-y divide-stone-100">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <div className="flex items-center gap-4 px-3 py-3" key={index}>
            <div className="h-3 w-full animate-pulse rounded-sm bg-stone-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

const GradeBadge = ({ grade }: { grade: 'admin' | 'basic' }) => {
  const isAdmin = grade === 'admin';

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-[9px] py-[3px] text-[10.5px] font-medium tracking-[0.06em]',
        isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-700',
      )}
    >
      {isAdmin ? 'ADMIN' : 'BASIC'}
    </span>
  );
};

const DeletedBadge = ({ isDeleted }: { isDeleted: boolean }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-[9px] py-[3px] text-[10.5px] font-medium tracking-[0.06em]',
        isDeleted ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-500',
      )}
    >
      {isDeleted ? '탈퇴' : '회원'}
    </span>
  );
};

const ProviderBadge = ({ provider }: { provider: 'kakao' | 'naver' }) => {
  const isNaver = provider === 'naver';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px]',
        'whitespace-nowrap text-[10.5px] font-medium tracking-[0.06em]',
        isNaver ? 'bg-naver text-white' : 'bg-kakao text-black',
      )}
    >
      <Image alt={`${provider} icon`} height={12} src={isNaver ? '/icon/naver.png' : '/icon/kakaotalk.png'} width={12} />
      {provider}
    </span>
  );
};

const MyPageUserListEmptyState = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="mt-4 border border-dashed border-stone-200 bg-white/60 px-6 py-20 text-center">
      <div className="mb-3 font-serif text-3xl leading-none text-gold/50">○</div>
      <h3 className="mb-1.5 font-serif text-lg font-medium text-stone-900">{title}</h3>
      <p className="text-[13px] text-stone-400">{description}</p>
    </div>
  );
};

const MyPageUserListContent = () => {
  const [page, setPage] = useState(1);
  const { data } = useGetUserListData({ page });

  const handleChangePage = (nextPage: number) => {
    setPage(nextPage);
  };

  if (data.response === 'ng') {
    return <MyPageUserListEmptyState description={data.message} title="사용자 목록을 불러오지 못했습니다." />;
  }

  if (data.data == null || data.data.length === 0) {
    return <MyPageUserListEmptyState description="" title="가입된 사용자가 없습니다." />;
  }

  return (
    <div>
      <div className={cn('mt-4 overflow-x-auto border border-stone-200')}>
        <table className="w-full min-w-[960px] table-auto border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-[11px] tracking-[0.08em] text-stone-500">
              {TABLE_HEADERS.map(header => (
                <th className="whitespace-nowrap px-3 py-2.5 font-medium" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.data.map((user, index) => (
              <tr
                className="border-b border-stone-100 text-stone-700 hover:bg-stone-50"
                key={`${user.email}-${index}`}
              >
                <td className="whitespace-nowrap px-3 py-3 font-serif text-gold">
                  {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, '0')}
                </td>
                <td className="whitespace-nowrap px-3 py-3">{dash(user.name)}</td>
                <td className="whitespace-nowrap px-3 py-3">{dash(user.nickname)}</td>
                <td className="whitespace-nowrap px-3 py-3">{dash(user.email)}</td>
                <td className="whitespace-nowrap px-3 py-3">{dash(formatPhoneNumber(user.phoneNumber))}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <GradeBadge grade={user.grade} />
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <ProviderBadge provider={user.provider} />
                </td>
                <td className="whitespace-nowrap px-3 py-3">{dash(user.kakaoEmail)}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <DeletedBadge isDeleted={user.isDeleted} />
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-serif text-stone-400">
                  {dash(formatDateToYMD(user.deletedAt))}
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-serif text-stone-400">
                  {dash(formatDateToYMD(user.createdAt))}
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-serif text-stone-400">
                  {dash(formatDateToYMD(user.updatedAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.totalDataLength > PAGE_SIZE && (
        <CustomPagination
          maxColumnNumber={PAGE_SIZE}
          targetPage={page}
          totalDataLength={data.totalDataLength}
          onChangePage={handleChangePage}
        />
      )}
    </div>
  );
};

export const MyPageUserList = () => {
  return (
    <Suspense fallback={<UserListTableSkeleton />}>
      <MyPageUserListContent />
    </Suspense>
  );
};

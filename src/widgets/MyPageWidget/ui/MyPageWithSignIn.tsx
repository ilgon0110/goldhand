'use client';

import { getAuth, signOut } from 'firebase/auth';
import { BadgeCheckIcon, CalendarIcon, EditIcon, ShieldCheckIcon, TextIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { IMyPageResponseData } from '@/src/shared/types';
import { Badge } from '@/src/shared/ui/badge';
import { Button } from '@/src/shared/ui/button';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { formatDateToYMD, toastError, toastSuccess } from '@/src/shared/utils';
import { WithdrawalModal } from '@/src/views/mypage/ui/WithdrawalModal';

import { useLogoutMutation } from '../hooks/useLogoutMutation';

type TMyPageDataProps = {
  myPageData: IMyPageResponseData;
};

export const MyPageWithSignIn = ({ myPageData }: TMyPageDataProps) => {
  const auth = getAuth();
  const router = useRouter();
  const [withDrawalModalOpen, setWithDrawalModalOpen] = useState(false);
  const { mutate: logout } = useLogoutMutation({
    onSuccess: data => {
      signOut(auth).then(() => {
        toastSuccess(data.message || '로그아웃 되었습니다.');

        setTimeout(() => {
          router.replace('/');
        }, 3000);
      });
    },
    onError: error => {
      toastError('로그아웃 중 오류가 발생했습니다.\n' + error.message);
    },
  });

  const onClickTitle = (id: string, docType: 'consult' | 'review') => {
    if (docType === 'review') {
      router.push(`/review/${id}`);
      return;
    }
    if (docType === 'consult') {
      router.push(`/reservation/list/${id}`);
    }
  };

  return (
    <div>
      <WithdrawalModal isOpen={withDrawalModalOpen} setIsOpen={setWithDrawalModalOpen} />
      <SectionTitle buttonTitle="" title="고운황금손 마이페이지" onClickButtonTitle={() => {}} />
      <div className="relative mt-6 w-full rounded border border-slate-300 p-3 md:p-11">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="flex flex-col gap-2 text-base font-bold md:flex-row md:items-center md:text-3xl">
            <div className="space-x-2">
              <span>{myPageData.data.userData?.name || '이름'}</span>
              <span className="font-medium text-[#728146]">{myPageData.data.userData?.nickname || '닉네임'}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Badge
                className={cn(
                  myPageData.data.userData?.grade === 'admin'
                    ? 'space-x-1 bg-primary'
                    : 'space-x-1 bg-blue-500 text-white dark:bg-blue-600',
                )}
              >
                {myPageData.data.userData?.grade === 'admin' ? <ShieldCheckIcon /> : <BadgeCheckIcon />}
                <span>{myPageData.data.userData?.grade}</span>
              </Badge>
              <Badge
                className={cn(
                  myPageData.data.userData?.provider === 'naver' ? 'bg-naver text-white' : 'bg-kakao text-black',
                  'space-x-1',
                )}
              >
                <Image
                  alt="icon"
                  height={24}
                  src={myPageData.data.userData?.provider === 'naver' ? '/icon/naver.png' : '/icon/kakaotalk.png'}
                  width={24}
                />
                <span>{myPageData.data.userData?.provider}</span>
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 text-sm md:mt-8 md:flex-row md:gap-9 md:text-xl">
          <div className="space-x-2">
            <span className="text-slate-500">전화번호</span>
            <span>{myPageData.data.userData?.phoneNumber || '00011112222'}</span>
          </div>
          <div className="space-x-2">
            <span className="text-slate-500">이메일</span>
            <span>{myPageData.data.userData?.email}</span>
          </div>
        </div>
      </div>
      <div className="relative mt-4 flex flex-row justify-end gap-3">
        <Button className="absolute left-0" variant="outline" onClick={() => logout()}>
          로그아웃
        </Button>
        <Button
          onClick={() => {
            if (myPageData.data.isLinked) {
              router.push('/mypage/edit');
            } else {
              router.push('/signup');
            }
          }}
        >
          {myPageData.data.isLinked ? '수정하기' : '회원가입'}
        </Button>
        {myPageData.data.isLinked && (
          <Button variant="destructive" onClick={() => setWithDrawalModalOpen(true)}>
            회원탈퇴
          </Button>
        )}
      </div>
      {/* 예약 상담 */}
      <div>
        <div className="relative mt-6 flex flex-row items-center gap-3">
          <CalendarIcon className="mr-2 h-6 w-6" />
          <span className="text-base font-bold md:text-2xl">예약 내역</span>
          <div className="absolute right-1 text-slate-500 underline transition-all ease-in-out hover:cursor-pointer hover:text-black">
            전체 보기
          </div>
        </div>
        <div className="mt-2 h-[1px] w-full bg-black" />
        {myPageData.data.consults && myPageData.data.consults.length > 0
          ? myPageData.data.consults.map(consult => (
              <div className="mt-3 flex flex-row justify-between" key={consult.id}>
                <span
                  className="text-base font-medium underline hover:cursor-pointer md:text-xl"
                  onClick={() => onClickTitle(consult.id, 'consult')}
                >
                  {consult.title}
                </span>
                <span className="text-slate-500">{formatDateToYMD(consult.updatedAt)}</span>
              </div>
            ))
          : null}
      </div>
      {/* 이용 후기 */}
      <div className="mt-10">
        <div className="relative mt-6 flex flex-row items-center gap-3">
          <EditIcon className="mr-2 h-6 w-6" />
          <span className="text-base font-bold md:text-2xl">이용 후기</span>
          <div className="absolute right-1 text-slate-500 underline transition-all ease-in-out hover:cursor-pointer hover:text-black">
            전체 보기
          </div>
        </div>
        <div className="mt-2 h-[1px] w-full bg-black" />
        {myPageData.data.reviews && myPageData.data.reviews.length > 0
          ? myPageData.data.reviews.map(consult => (
              <div className="mt-3 flex flex-row justify-between" key={consult.id}>
                <span
                  className="text-base font-medium underline hover:cursor-pointer md:text-xl"
                  onClick={() => onClickTitle(consult.id, 'review')}
                >
                  {consult.title}
                </span>
                <span className="text-slate-500">{formatDateToYMD(consult.updatedAt)}</span>
              </div>
            ))
          : null}
      </div>

      {/* 작성 댓글 */}
      <div className="mt-10">
        <div className="relative mt-6 flex flex-row items-center gap-3">
          <TextIcon className="mr-2 h-6 w-6" />
          <span className="text-base font-bold md:text-2xl">작성 댓글</span>
          <div className="absolute right-1 text-slate-500 underline transition-all ease-in-out hover:cursor-pointer hover:text-black">
            전체 보기
          </div>
        </div>
        <div className="mt-2 h-[1px] w-full bg-black" />
        {myPageData.data.comments && myPageData.data.comments.length > 0
          ? myPageData.data.comments.map(consult => (
              <div className="mt-3 flex flex-row justify-between" key={consult.id}>
                <span
                  className="text-base font-medium underline hover:cursor-pointer md:text-xl"
                  onClick={() => onClickTitle(consult.docId, consult.docType)}
                >
                  {consult.comment}
                </span>
                <span className="text-slate-500">{formatDateToYMD(consult.updatedAt)}</span>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

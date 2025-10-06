'use client';

import { getAuth, signOut } from 'firebase/auth';
import { BadgeCheckIcon, BookCheck, BookX, CalendarIcon, EditIcon, ShieldCheckIcon, TextIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IMyPageResponseData } from '@/src/shared/types';
import { Badge } from '@/src/shared/ui/badge';
import { Button } from '@/src/shared/ui/button';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { WithEmptyState } from '@/src/shared/ui/WithEmptyState';
import { formatDateToYMD, toastError, toastSuccess } from '@/src/shared/utils';
import { useLogoutMutation } from '@/src/widgets/MyPageWidget/hooks/useLogoutMutation';
import { WithdrawalModal } from '@/src/widgets/MyPageWidget/ui/WithdrawalModal';

type TMyPageDataProps = {
  myPageData: IMyPageResponseData;
};

export const MyPagePage = ({ myPageData }: TMyPageDataProps) => {
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const [withDrawalModalOpen, setWithDrawalModalOpen] = useState(false);
  const { mutate: logout } = useLogoutMutation({
    onSuccess: data => {
      signOut(auth).then(() => {
        toastSuccess(data.message || '로그아웃 되었습니다.');

        setTimeout(() => {
          router.replace('/');
        }, 1000);
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
      <SectionTitle title="고운황금손 마이페이지" />
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
                variant="outline"
              >
                {myPageData.data.userData?.grade === 'admin' ? <ShieldCheckIcon /> : <BadgeCheckIcon />}
                <span>{myPageData.data.userData?.grade}</span>
              </Badge>
              <Badge
                className={cn(
                  myPageData.data.userData?.provider === 'naver' ? 'bg-naver text-white' : 'bg-kakao text-black',
                  'space-x-1',
                )}
                variant="outline"
              >
                <Image
                  alt="icon"
                  height={24}
                  src={myPageData.data.userData?.provider === 'naver' ? '/icon/naver.png' : '/icon/kakaotalk.png'}
                  width={24}
                />
                <span>{myPageData.data.userData?.provider}</span>
              </Badge>
              <Badge className={cn('space-x-1')} variant={myPageData.data.isLinked ? 'default' : 'outline'}>
                <span>{myPageData.data.isLinked ? <BookCheck /> : <BookX color="gray" />}</span>
                <span>{myPageData.data.isLinked ? '전화번호 인증완료' : '전화번호 미인증'}</span>
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 text-sm md:mt-8 md:flex-row md:gap-9 md:text-xl">
          <div className="space-x-2">
            <span className="text-slate-500">전화번호</span>
            <span>{myPageData.data.userData?.phoneNumber || '미등록'}</span>
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
            router.push('/signup/phone');
          }}
        >
          전화번호 인증
        </Button>
        <Button
          onClick={() => {
            router.push('/mypage/edit');
          }}
        >
          정보수정
        </Button>
        <Button variant="destructive" onClick={() => setWithDrawalModalOpen(true)}>
          회원탈퇴
        </Button>
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
        <WithEmptyState
          data={myPageData.data.consults}
          emptyDescription="새로운 예약을 추가해보세요."
          emptyTitle="예약 내역이 없습니다."
        >
          {myPageData.data?.consults?.map(consult => (
            <div className="mt-3 flex flex-row justify-between" key={consult.id}>
              <span
                className="text-base font-medium underline hover:cursor-pointer md:text-xl"
                onClick={() => onClickTitle(consult.id, 'consult')}
              >
                {consult.title}
              </span>
              <span className="text-slate-500">{formatDateToYMD(consult.updatedAt)}</span>
            </div>
          ))}
        </WithEmptyState>
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
        <WithEmptyState
          data={myPageData.data.reviews}
          emptyDescription="새로운 후기를 추가해보세요."
          emptyTitle="후기 내역이 없습니다."
        >
          {myPageData.data?.reviews?.map(consult => (
            <div className="mt-3 flex flex-row justify-between" key={consult.id}>
              <span
                className="text-base font-medium underline hover:cursor-pointer md:text-xl"
                onClick={() => onClickTitle(consult.id, 'review')}
              >
                {consult.title}
              </span>
              <span className="text-slate-500">{formatDateToYMD(consult.updatedAt)}</span>
            </div>
          ))}
        </WithEmptyState>
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
        <WithEmptyState
          data={myPageData.data.comments}
          emptyDescription="새로운 댓글을 추가해보세요."
          emptyTitle="댓글 내역이 없습니다."
        >
          {myPageData.data?.comments?.map(consult => (
            <div className="mt-3 flex flex-row justify-between" key={consult.id}>
              <span
                className="text-base font-medium underline hover:cursor-pointer md:text-xl"
                onClick={() => onClickTitle(consult.docId, consult.docType)}
              >
                {consult.comment}
              </span>
              <span className="text-slate-500">{formatDateToYMD(consult.updatedAt)}</span>
            </div>
          ))}
        </WithEmptyState>
      </div>
    </div>
  );
};

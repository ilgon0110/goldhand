'use client';

import { getAuth, signOut } from 'firebase/auth';
import { BadgeCheckIcon, CalendarIcon, EditIcon, TextIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { IMyPageData } from '@/src/shared/types';
import { Badge } from '@/src/shared/ui/badge';
import { Button } from '@/src/shared/ui/button';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { formatDateToYMD, toastError, toastSuccess } from '@/src/shared/utils';

type TMyPageDataProps = {
  myPageData: IMyPageData;
};

export const MyPagePage = ({ myPageData }: TMyPageDataProps) => {
  const router = useRouter();
  const onClickTitle = (id: string, docType: 'consult' | 'review') => {
    if (docType === 'review') {
      router.push(`/review/${id}`);
      return;
    }
    if (docType === 'consult') {
      router.push(`/reservation/list/${id}`);
    }
  };

  const onClickLogout = async () => {
    const auth = getAuth();
    try {
      const res = await (
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json();

      if (res.response === 'ok') {
        signOut(auth)
          .then(() => {
            toastSuccess('로그아웃 되었습니다.');

            setTimeout(() => {
              router.replace('/');
            }, 3000);
          })
          .catch(error => {
            toastError('로그아웃 중 오류가 발생했습니다.\n' + error.message);
          });
      }
    } catch (error: any) {
      toastError('로그아웃 중 오류가 발생했습니다.\n' + error.message);
    }
  };

  return (
    <div>
      <SectionTitle buttonTitle="" title="고운황금손 마이페이지" onClickButtonTitle={() => {}} />
      <div className="relative mt-6 w-full rounded border border-slate-300 p-3 md:p-11">
        <div className="flex flex-row justify-between">
          <div className="space-x-2 text-base font-bold md:text-3xl">
            <span>{myPageData.data.userData?.name || '이름'}</span>
            <span className="font-medium text-[#728146]">{myPageData.data.userData?.nickname || '닉네임'}</span>
            <Badge className="bg-blue-500 text-white dark:bg-blue-600" variant="secondary">
              <BadgeCheckIcon />
              {myPageData.data.userData?.grade}
            </Badge>
          </div>
          <div className="space-x-3">
            <Button
              className=""
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
            <Button className="" variant={'destructive'} onClick={onClickLogout}>
              로그아웃
            </Button>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4 text-sm md:mt-8 md:flex-row md:gap-9 md:text-xl">
          <div className="space-x-8">
            <span>전화번호</span>
            <span>{myPageData.data.userData?.phoneNumber || '00011112222'}</span>
          </div>
          <div className="space-x-8">
            <span>이메일</span>
            <span>{myPageData.data.userData?.email}</span>
          </div>
        </div>
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

import { CalendarIcon, EditIcon, TextIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import type { IMyPageResponseData } from '@/src/shared/types';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

import { MyPageSection } from './_MyPageSection';

interface IMyPagePostListProps {
  myPageData: IMyPageResponseData;
}

export const MyPagePostList = ({ myPageData }: IMyPagePostListProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isAdmin = myPageData.data.userData?.grade === 'admin';

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="페이지 이동 중..." />}

      {isAdmin && (
        <MyPageSection
          data={myPageData.data.managersData}
          emptyDescription=""
          emptyTitle="산후관리사 지원목록이 없습니다."
          getDate={item => item.updatedAt}
          getId={item => item.id}
          getLabel={item => item.content}
          icon={<CalendarIcon className="mr-2 h-6 w-6" />}
          title="산후관리사 지원목록"
          onClickItem={item => {
            startTransition(() => {
              router.push(`/manager/${item.id}`);
            });
          }}
        />
      )}

      <MyPageSection
        data={myPageData.data.applies}
        emptyDescription=""
        emptyTitle="산후관리사 지원내역이 없습니다."
        getDate={item => item.updatedAt}
        getId={item => item.id}
        getLabel={item => item.content}
        icon={<CalendarIcon className="mr-2 h-6 w-6" />}
        title="산후관리사 지원문의"
        onClickItem={item => {
          startTransition(() => {
            router.push(`/manager/${item.id}`);
          });
        }}
      />

      <MyPageSection
        data={myPageData.data.consults}
        emptyDescription="새로운 예약을 추가해보세요."
        emptyTitle="예약 내역이 없습니다."
        getDate={item => item.updatedAt}
        getId={item => item.id}
        getLabel={item => item.title}
        icon={<CalendarIcon className="mr-2 h-6 w-6" />}
        title="예약 내역"
        onClickItem={item => {
          startTransition(() => {
            router.push(`/reservation/list/${item.id}`);
          });
        }}
      />

      <MyPageSection
        className="mt-10"
        data={myPageData.data.reviews}
        emptyDescription="새로운 후기를 추가해보세요."
        emptyTitle="후기 내역이 없습니다."
        getDate={item => item.updatedAt}
        getId={item => item.id}
        getLabel={item => item.title}
        icon={<EditIcon className="mr-2 h-6 w-6" />}
        title="이용 후기"
        onClickItem={item => {
          startTransition(() => {
            router.push(`/review/${item.id}`);
          });
        }}
      />

      <MyPageSection
        className="mt-10"
        data={myPageData.data.comments}
        emptyDescription="새로운 댓글을 추가해보세요."
        emptyTitle="댓글 내역이 없습니다."
        getDate={item => item.updatedAt}
        getId={item => item.id}
        getLabel={item => item.comment}
        icon={<TextIcon className="mr-2 h-6 w-6" />}
        title="작성 댓글"
        onClickItem={item => {
          startTransition(() => {
            if (item.docType === 'review') router.push(`/review/${item.docId}`);
            if (item.docType === 'consult') router.push(`/reservation/list/${item.docId}`);
            if (item.docType === 'manager') router.push(`/manager/${item.docId}`);
            if (item.docType === 'event') router.push(`/event/${item.docId}`);
          });
        }}
      />
    </>
  );
};

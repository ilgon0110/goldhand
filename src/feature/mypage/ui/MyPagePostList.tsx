import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import type { IMyPageResponseData } from '@/src/shared/types';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/ui/tabs';

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
      <Tabs className="mt-4" defaultValue="CONSULT">
        <TabsList variant="line">
          <TabsTrigger value="CONSULT">상담</TabsTrigger>
          <TabsTrigger value="REVIEW">후기</TabsTrigger>
          <TabsTrigger value="COMMENT">댓글</TabsTrigger>
          {isAdmin && <TabsTrigger value="MANAGER">지원목록</TabsTrigger>}
          <TabsTrigger value="APPLY">지원서</TabsTrigger>
        </TabsList>

        <TabsContent value="CONSULT">
          <MyPageSection
            data={myPageData.data.consults}
            emptyDescription="새로운 예약을 추가해보세요."
            emptyTitle="예약 내역이 없습니다."
            getDate={item => item.updatedAt}
            getId={item => item.id}
            getLabel={item => item.title}
            tag="예약"
            title="예약 내역"
            onClickItem={item => {
              startTransition(() => {
                router.push(`/reservation/list/${item.id}`);
              });
            }}
          />
        </TabsContent>

        <TabsContent value="REVIEW">
          <MyPageSection
            data={myPageData.data.reviews}
            emptyDescription="새로운 후기를 추가해보세요."
            emptyTitle="후기 내역이 없습니다."
            getDate={item => item.updatedAt}
            getId={item => item.id}
            getLabel={item => item.title}
            tag="후기"
            title="이용 후기"
            onClickItem={item => {
              startTransition(() => {
                router.push(`/review/${item.id}`);
              });
            }}
          />
        </TabsContent>

        <TabsContent value="COMMENT">
          <MyPageSection
            data={myPageData.data.comments}
            emptyDescription="새로운 댓글을 추가해보세요."
            emptyTitle="댓글 내역이 없습니다."
            getDate={item => item.updatedAt}
            getId={item => item.id}
            getLabel={item => item.comment}
            tag="댓글"
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
        </TabsContent>

        {isAdmin && (
          <TabsContent value="MANAGER">
            <MyPageSection
              data={myPageData.data.managersData}
              emptyDescription=""
              emptyTitle="산후관리사 지원목록이 없습니다."
              getDate={item => item.updatedAt}
              getId={item => item.id}
              getLabel={item => item.content}
              tag="지원"
              title="산후관리사 지원목록"
              onClickItem={item => {
                startTransition(() => {
                  router.push(`/manager/${item.id}`);
                });
              }}
            />
          </TabsContent>
        )}

        <TabsContent value="APPLY">
          <MyPageSection
            data={myPageData.data.applies}
            emptyDescription=""
            emptyTitle="산후관리사 지원내역이 없습니다."
            getDate={item => item.updatedAt}
            getId={item => item.id}
            getLabel={item => item.content}
            tag="지원서"
            title="내 산후관리사 지원내역"
            onClickItem={item => {
              startTransition(() => {
                router.push(`/manager/${item.id}`);
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

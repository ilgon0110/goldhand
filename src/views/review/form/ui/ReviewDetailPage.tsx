'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { useScreenView } from '@/src/shared/hooks/useScreenView';
import type { IReviewResponseData, IUserResponseData, IViewCountResponseData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { ViewIcon } from '@/src/shared/ui/icons/ViewIcon';
import { Label } from '@/src/shared/ui/label';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { MyAlertDialog } from '@/src/shared/ui/MyAlertDialog';
import { Textarea } from '@/src/shared/ui/textarea';
import { formatDateToYMD, toastError, toastSuccess } from '@/src/shared/utils';
import { Editor } from '@/src/widgets/editor/ui/Editor';
import { Comment, useComments } from '@/widgets/Comment';

import { reviewCommentSchema } from '../config/reviewCommentSchema';

type TReviewDetailPageProps = {
  data: IReviewResponseData;
  docId: string;
  userData: IUserResponseData;
  viewCountData: IViewCountResponseData;
};

interface IResponsePost {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export const ReviewDetailPage = ({ data, docId, userData, viewCountData }: TReviewDetailPageProps) => {
  const router = useRouter();
  const { comments, loading: isCommentSubmitting } = useComments({
    docId,
    collectionName: 'reviews',
  });

  const [reviewUpdateAlertDialogOpen, setReviewUpdateAlertDialogOpen] = useState(false);
  const [isReviewUpdateSubmitting, setIsReviewUpdateSubmitting] = useState(false);
  const [reviewDeleteAlertDialogOpen, setReviewDeleteAlertDialogOpen] = useState(false);
  const [isReviewDeleteSubmitting, setIsReviewDeleteSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reviewCommentSchema>>({
    resolver: zodResolver(reviewCommentSchema),
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  });

  const formValidation = form.formState.isValid;
  const isOwner = data.data.userId === userData.userData?.userId;

  const onSubmit = async (values: z.infer<typeof reviewCommentSchema>) => {
    if (!formValidation) return;
    const { comment } = values;

    try {
      const response = await fetch('/api/review/detail/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          docId,
          comment,
        }),
      });
      const data: IResponsePost = await response.json();
      if (data.response === 'ok') {
        toastSuccess('댓글이 작성되었습니다.');
        form.reset();
      } else if (data.response === 'unAuthorized' || data.response === 'expired') {
        toastError('로그인 후 이용해주세요.');
        form.reset();
      } else {
        toastError('댓글 작성 중 알 수 없는 오류가 발생하였습니다.\n' + data.message);
      }
    } catch {
      toastError('댓글 작성 중 알 수 없는 오류가 발생하였습니다.\n' + data.message);
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    // 수정 Form으로 이동
    setReviewUpdateAlertDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setReviewDeleteAlertDialogOpen(true);
  };

  const onhandleReviewUpdateActionClick = () => {
    router.push(`/review/${docId}/edit`);
  };

  const onhandleReviewDeleteActionClick = async () => {
    try {
      setIsReviewDeleteSubmitting(true);
      const res = await fetch(`/api/review/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId,
          userId: data.data.userId,
        }),
      });
      const responseData = await res.json();
      if (responseData.response === 'ok') {
        toastSuccess('게시글이 삭제되었습니다.');
        router.push('/review');
      } else if (data.response === 'unAuthorized') {
        toastError('비밀번호가 틀립니다.');
      } else if (data.response === 'expired') {
        toastError('로그인 후 이용해주세요.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toastError('게시글 삭제 중 서버 오류가 발생하였습니다.');
    } finally {
      setIsReviewDeleteSubmitting(false);
      setReviewDeleteAlertDialogOpen(false);
    }
  };

  if (data.response === 'ng') {
    throw new Error(data.message);
  }

  // 댓글 삭제 및 수정 함수
  const mutateDeleteComment = async (commentId: string) => {
    return await fetch('/api/review/detail/comment/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userData.userData?.userId,
        docId,
        commentId,
      }),
    });
  };

  const mutateUpdateComment = async (commentId: string, comment: string) => {
    return await fetch('/api/review/detail/comment/update', {
      method: 'POST',
      body: JSON.stringify({
        docId,
        commentId,
        comment,
      }),
    });
  };

  // Firebase Analytics 이벤트 로깅
  useScreenView(`review_detail_${docId}`, 'ReviewDetailPage', { doc_id: docId });

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-bold md:text-3xl">{data.data.title}</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="space-x-2">
            <span className="text-slate-500">{data.data.franchisee}</span>
            <span>{data.data.name}</span>
            <span>{formatDateToYMD(data.data.createdAt)}</span>
          </div>
          <div className="flex flex-row items-center gap-2 text-slate-500 sm:ml-auto">
            <ViewIcon />
            <span>{viewCountData.data?.totalViewCount || 0}회</span>
          </div>
        </div>
      </div>
      <div className="my-4 h-[1px] w-full bg-slate-300" />
      <div className="relative w-full">
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-xl font-bold">후기</span>
          <Editor editable={false} htmlString={data.data.htmlString} onEditorChange={() => {}} />
        </div>
      </div>
      <div className="mb-4 mt-4 h-[1px] w-full bg-slate-300" />
      {isOwner && (
        <div className="flex w-full justify-end space-x-4">
          <Button
            className="border border-primary bg-transparent text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            onClick={e => handleEditClick(e)}
          >
            수정하기
          </Button>
          <Button variant="destructive" onClick={e => handleDeleteClick(e)}>
            삭제하기
          </Button>
        </div>
      )}

      {/* 댓글 입력란 */}
      <Form {...form}>
        <form className="mt-4 space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            defaultValue={''}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>댓글 남기기</FormLabel>
                <FormControl>
                  <Textarea placeholder="댓글을 입력하세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.comment?.message}</FormMessage>
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <Button
              className={cn('transition-all duration-300', formValidation ? '' : 'opacity-20 hover:cursor-not-allowed')}
              disabled={!formValidation}
              type="submit"
            >
              {isCommentSubmitting ? <LoadingSpinnerIcon /> : '댓글달기'}
            </Button>
          </div>
        </form>
      </Form>

      {/* 댓글들 */}
      <Label className="mt-10 text-lg font-bold">{`댓글 (${
        comments != null ? comments.length : '댓글이 없습니다'
      })`}</Label>
      <div className="mt-2 space-y-4">
        {comments?.map(item => {
          return (
            <Comment
              commentId={item.id}
              content={item.comment}
              createdAt={item.createdAt}
              docId={docId}
              isCommentOwner={item.userId === userData.userData?.userId}
              key={item.id}
              mutateDeleteComment={mutateDeleteComment}
              mutateUpdateComment={mutateUpdateComment}
              updatedAt={item.updatedAt}
            />
          );
        })}
      </div>

      {/* 수정 확인 알림 */}
      <MyAlertDialog
        description={'게시글 수정 화면으로 이동하시겠습니까?'}
        handleDeletePostClick={onhandleReviewUpdateActionClick}
        isPending={isReviewUpdateSubmitting}
        okButtonText={'수정하기'}
        opOpenChange={open => setReviewUpdateAlertDialogOpen(open)}
        open={reviewUpdateAlertDialogOpen}
        title={'게시글 수정'}
      />
      {/* 삭제 확인 알림 */}
      <MyAlertDialog
        description={'삭제된 게시글은 복구할 수 없습니다.'}
        handleDeletePostClick={onhandleReviewDeleteActionClick}
        isPending={isReviewDeleteSubmitting}
        okButtonText={'삭제하기'}
        opOpenChange={open => setReviewDeleteAlertDialogOpen(open)}
        open={reviewDeleteAlertDialogOpen}
        title={'게시글을 삭제하시겠습니까?'}
      />
    </>
  );
};

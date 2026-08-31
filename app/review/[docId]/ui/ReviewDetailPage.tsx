/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { Comment, useComments } from '@/src/entities/comment';
import { phoneAuthFormSchema } from '@/src/entities/phoneAuth';
import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  usePhoneAuthVerifyFlow,
} from '@/src/entities/phoneAuth/client';
import { PinToggleButton, usePinMutation } from '@/src/entities/pin';
import { useGetReviewDetailData } from '@/src/entities/review';
import { useGetUserData } from '@/src/entities/user';
import { useGetViewCountData } from '@/src/entities/viewCount';
import { useScreenView } from '@/src/shared/hooks/useScreenView';
import { Button } from '@/src/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { ViewIcon } from '@/src/shared/ui/icons/ViewIcon';
import { Label } from '@/src/shared/ui/label';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { MyAlertDialog } from '@/src/shared/ui/MyAlertDialog';
import { Textarea } from '@/src/shared/ui/textarea';
import { formatDateToYMD, toastError, toastSuccess } from '@/src/shared/utils';
import { Editor } from '@/src/widgets/editor/ui/Editor';

import { useReviewDeleteMutation, useReviewDetailCommentMutation } from '../api';
import { reviewCommentSchema } from '../config';

type TReviewDetailPageProps = {
  docId: string;
};

export const ReviewDetailPage = ({ docId }: TReviewDetailPageProps) => {
  const { data } = useGetReviewDetailData(docId);
  const { data: userData } = useGetUserData();
  const { data: viewCountData } = useGetViewCountData(docId);
  const router = useRouter();

  const isGuestPost = data.data.userId == null;
  const isOwner = data.data.userId ? data.data.userId === userData.userData?.userId : true;
  const isAdmin = userData.userData?.grade === 'admin';
  const canManage = isOwner || isAdmin;
  const requiresPhoneAuth = isGuestPost && !isAdmin;

  const form = useForm<z.infer<typeof reviewCommentSchema>>({
    resolver: zodResolver(reviewCommentSchema),
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  });
  const { comments, loading: isCommentSubmitting } = useComments({
    docId,
    collectionName: 'reviews',
  });
  const { mutate } = useReviewDetailCommentMutation(docId, {
    onSuccess: () => {
      toastSuccess('댓글이 작성되었습니다.');
      form.reset();
    },
    onError: data => {
      toastError('댓글 작성에 실패하였습니다.\n' + data.message);
    },
    onSettled: () => {},
  });

  const [reviewUpdateAlertDialogOpen, setReviewUpdateAlertDialogOpen] = useState(false);
  const [reviewDeleteAlertDialogOpen, setReviewDeleteAlertDialogOpen] = useState(false);
  const [isDeletePhoneAuthDialogOpen, setIsDeletePhoneAuthDialogOpen] = useState(false);
  const phoneIdTokenRef = useRef<string | null>(null);

  const phoneAuthForm = useForm<z.infer<typeof phoneAuthFormSchema>>({
    resolver: zodResolver(phoneAuthFormSchema),
    defaultValues: { phoneNumber: '', authCode: '' },
    mode: 'onChange',
  });

  const phoneAuth = usePhoneAuthVerifyFlow(
    phoneAuthForm,
    { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' },
    {
      onConfirmed: async result => {
        phoneIdTokenRef.current = await result.user.getIdToken();
        setIsDeletePhoneAuthDialogOpen(false);
        setReviewDeleteAlertDialogOpen(true);
      },
    },
  );

  const { mutate: deleteReview, isPending: isReviewDeleteSubmitting } = useReviewDeleteMutation({
    onSuccess: () => {
      toastSuccess('게시글이 삭제되었습니다.');
      router.replace('/review');
      router.refresh();
    },
    onError: error => {
      toastError('게시글 삭제에 실패하였습니다.\n' + error.message);
    },
    onSettled: () => {
      setReviewDeleteAlertDialogOpen(false);
    },
  });

  const formValidation = form.formState.isValid;
  const { mutate: togglePin, isPending: isPinToggling } = usePinMutation('review');

  const onCommentSubmit = async (values: z.infer<typeof reviewCommentSchema>) => {
    if (!formValidation) return;
    const { comment } = values;

    try {
      mutate(comment);
    } catch {
      toastError('댓글 작성 중 알 수 없는 오류가 발생하였습니다.\n' + data.message);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (requiresPhoneAuth) {
      setIsDeletePhoneAuthDialogOpen(true);
    } else {
      setReviewDeleteAlertDialogOpen(true);
    }
  };

  const onHandleReviewDeleteActionClick = () => {
    deleteReview({ docId, phoneIdToken: phoneIdTokenRef.current ?? undefined });
  };

  // Firebase Analytics 이벤트 로깅
  useScreenView(`review_detail_${docId}`, 'ReviewDetailPage', { doc_id: docId });

  return (
    <>
      <button
        aria-hidden="true"
        className="hidden"
        id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID}
        key={phoneAuth.recaptchaKey}
        tabIndex={-1}
      />
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-bold md:text-3xl">{data.data.title}</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-slate-500">{data.data.franchisee}</span>
            <span>{data.data.name}</span>
            <span>{formatDateToYMD(data.data.createdAt)}</span>
            {isAdmin && data.data.phoneNumber && (
              <span className="whitespace-nowrap text-slate-500">
                <span className="font-bold">연락처:</span> {data.data.phoneNumber}
              </span>
            )}
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
      <PinToggleButton
        isAdmin={isAdmin}
        isLoading={isPinToggling}
        isPinned={data.data.isPinned}
        onToggle={() => togglePin({ docId, isPinned: !data.data.isPinned })}
      />
      {canManage && (
        <div className="flex w-full justify-end space-x-4">
          <Button
            className="border border-primary bg-transparent text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            onClick={e => {
              e.stopPropagation();
              setReviewUpdateAlertDialogOpen(true);
            }}
          >
            수정하기
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            삭제하기
          </Button>
        </div>
      )}

      {/* 댓글 입력란 */}
      <Form {...form}>
        <form className="mt-4 space-y-2" onSubmit={form.handleSubmit(onCommentSubmit)}>
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
              disabled={!formValidation || isCommentSubmitting || userData.userData == null}
              type="submit"
            >
              {isCommentSubmitting ? (
                <LoadingSpinnerIcon />
              ) : userData.userData == null ? (
                '로그인 후 댓글 작성'
              ) : (
                '댓글달기'
              )}
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
              isAuthorAdmin={item.isAuthorAdmin}
              isCommentOwner={item.userId === userData.userData?.userId}
              key={item.id}
              type="review"
              updatedAt={item.updatedAt}
              userId={userData.userData?.userId || ''}
            />
          );
        })}
      </div>

      {/* 수정 확인 알림 */}
      <MyAlertDialog
        description={'게시글 수정 화면으로 이동하시겠습니까?'}
        handleDeletePostClick={() => router.push(`/review/${docId}/edit`)}
        isPending={false}
        okButtonText={'수정하기'}
        opOpenChange={open => setReviewUpdateAlertDialogOpen(open)}
        open={reviewUpdateAlertDialogOpen}
        title={'게시글 수정'}
      />

      {/* 비회원 삭제 - 휴대폰 재인증 모달 */}
      <Dialog open={isDeletePhoneAuthDialogOpen} onOpenChange={setIsDeletePhoneAuthDialogOpen}>
        <DialogContent className="sm:max-w-[425px] sm:px-8">
          <DialogTitle>본인 확인을 위해 휴대폰 인증을 진행해주세요.</DialogTitle>
          <DialogHeader>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...phoneAuthForm}>
            <form className="space-y-6">
              <PhoneAuthFields
                authCodeName="authCode"
                control={phoneAuthForm.control}
                phoneAuth={phoneAuth}
                phoneNumberName="phoneNumber"
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 알림 */}
      <MyAlertDialog
        description={'삭제된 게시글은 복구할 수 없습니다.'}
        handleDeletePostClick={onHandleReviewDeleteActionClick}
        isPending={isReviewDeleteSubmitting}
        okButtonText={'삭제하기'}
        opOpenChange={open => setReviewDeleteAlertDialogOpen(open)}
        open={reviewDeleteAlertDialogOpen}
        title={'게시글을 삭제하시겠습니까?'}
      />
    </>
  );
};

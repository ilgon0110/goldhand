'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { useScreenView } from '@/src/shared/hooks/useScreenView';
import type { IConsultResponseData, IUserResponseData, IViewCountResponseData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { ViewIcon } from '@/src/shared/ui/icons/ViewIcon';
import { Input } from '@/src/shared/ui/input';
import { Label } from '@/src/shared/ui/label';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { MyAlertDialog } from '@/src/shared/ui/MyAlertDialog';
import { Textarea } from '@/src/shared/ui/textarea';
import { formatDateToYMD, toastError, toastSuccess } from '@/src/shared/utils';
import { Comment, useComments } from '@/widgets/Comment';

import { passwordPostAction } from '../../list/api/passwordPostAction';
import { consultCommentSchema, detailPasswordFormSchema } from '../config/consultCommentSchema';

type TReservationDetailPageProps = {
  data: IConsultResponseData;
  docId: string;
  userData: IUserResponseData;
  viewCountData: IViewCountResponseData;
};

interface IResponsePost {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export const ReservationDetailPage = ({ data, docId, userData, viewCountData }: TReservationDetailPageProps) => {
  const router = useRouter();
  const author = data.data.userId ? data.data.name : '비회원';
  const { comments, loading: isCommentSubmitting } = useComments({
    docId,
    collectionName: 'consults',
  });
  const [updateButtonName, setUpdateButtonName] = useState<'DELETE' | 'EDIT'>('EDIT');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof consultCommentSchema>>({
    resolver: zodResolver(consultCommentSchema),
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  });

  const formValidation = form.formState.isValid;
  const isConsultDetailOwner = data.data.userId ? data.data.userId === userData.userData?.userId : true;

  const onSubmit = async (values: z.infer<typeof consultCommentSchema>) => {
    if (!formValidation) return;
    const { comment } = values;

    try {
      const response = await fetch('/api/consultDetail/comment', {
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
        toastError('댓글 작성 중 알 수 없는 오류가 발생하였습니다.');
      }
    } catch {
      toastError('댓글 작성 중 알 수 없는 오류가 발생하였습니다.');
    }
  };

  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const passwordForm = useForm<z.infer<typeof detailPasswordFormSchema>>({
    resolver: zodResolver(detailPasswordFormSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  });

  const onPasswordSubmit = async (values: z.infer<typeof detailPasswordFormSchema>) => {
    const { password } = values;

    try {
      setIsPasswordSubmitting(true);
      const passwordResponseData = await passwordPostAction(docId, password);

      if (passwordResponseData.response === 'ok') {
        // 수정하기 버튼 클릭 시
        if (updateButtonName === 'EDIT') {
          router.push(`/reservation/edit?docId=${docId}`);
          return;
        }
        // 삭제하기 버튼 클릭 시
        setAlertDialogOpen(true);
      } else {
        toastError(passwordResponseData.message);
        passwordForm.reset();
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toastError('비밀번호 검증 중 서버 오류가 발생하였습니다.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 비회원의 경우 비밀번호 검증
    e.stopPropagation();
    setUpdateButtonName('EDIT');
    if (author === '비회원') {
      setDialogOpen(true);
    } else {
      // 수정 Form으로 이동
      startTransition(() => {
        router.push(`/reservation/edit?docId=${docId}`);
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 비회원의 경우 비밀번호 검증
    e.stopPropagation();
    setUpdateButtonName('DELETE');
    if (author === '비회원') {
      setDialogOpen(true);
    } else {
      // 삭제 API 호출
      setAlertDialogOpen(true);
    }
  };

  const onhandleDeleteActionClick = async () => {
    try {
      setIsDeleteSubmitting(true);
      const res = await fetch(`/api/consultDetail/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId,
          userId: data.data.userId,
          password: passwordForm.getValues('password'),
        }),
      });
      const responseData = await res.json();
      if (responseData.response === 'ok') {
        toastSuccess('게시글이 삭제되었습니다.');
        router.push('/reservation/list');
      } else if (data.response === 'unAuthorized') {
        toastError('비밀번호가 틀립니다.');
      } else if (data.response === 'expired') {
        toastError('로그인 후 이용해주세요.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toastError('게시글 삭제 중 서버 오류가 발생하였습니다.');
    } finally {
      setIsDeleteSubmitting(false);
      setAlertDialogOpen(false);
    }
  };

  const mutateDeleteComment = async (commentId: string) => {
    return await fetch('/api/consultDetail/comment/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docId,
        commentId,
      }),
    });
  };

  const mutateUpdateComment = async (commentId: string, comment: string) => {
    return await fetch('/api/consultDetail/comment/update', {
      method: 'POST',
      body: JSON.stringify({
        docId,
        commentId,
        comment,
      }),
    });
  };

  // Firebase Analytics 이벤트 로깅
  useScreenView(`reservation_detail_${docId}`, 'ReservationDetailPage', { doc_id: docId });

  if (data.response === 'ng') {
    throw new Error(data.message);
  }

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="페이지 이동중.." />}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="relative flex flex-col gap-2">
          <h3 className="text-xl font-bold md:text-3xl">{data.data.title}</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="space-x-2">
              <span className="text-slate-500">{data.data.franchisee}</span>
              <span>{author}</span>
              <span>{formatDateToYMD(data.data.createdAt)}</span>
            </div>
            <div className="flex flex-row items-center gap-1 text-slate-500 sm:ml-auto">
              <ViewIcon />
              <span>{viewCountData.data?.totalViewCount}회</span>
            </div>
          </div>
        </div>
        <div className="my-4 h-[1px] w-full bg-slate-300" />
        <div className="relative w-full">
          <div className="relative mb-4 flex flex-col gap-1">
            <span className="text-xl font-bold">출산 예정일</span>
            <span className="text-slate-500">{data.data.bornDate ? formatToYYYYMMDD(data.data.bornDate) : '없음'}</span>
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <span className="text-xl font-bold">상담내용</span>
            <p>{data.data.content}</p>
          </div>
        </div>
        <div className="mb-4 mt-4 h-[1px] w-full bg-slate-300" />
        {isConsultDetailOwner && (
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
                className={cn(
                  'transition-all duration-300',
                  formValidation ? '' : 'opacity-20 hover:cursor-not-allowed',
                )}
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

        {/* 비밀번호 입력 모달 */}
        <DialogContent className="sm:max-w-[425px] sm:px-8">
          <DialogTitle>비밀번호를 입력하세요.</DialogTitle>
          <DialogHeader>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form className="space-y-6" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
              <FormField
                control={passwordForm.control}
                defaultValue=""
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input placeholder="" type="password" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit">{isPasswordSubmitting ? <LoadingSpinnerIcon /> : '확인'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 알림 */}
      <MyAlertDialog
        description="삭제된 게시글은 복구할 수 없습니다."
        handleOkActionClick={onhandleDeleteActionClick}
        isPending={isDeleteSubmitting}
        okButtonText="삭제하기"
        opOpenChange={open => setAlertDialogOpen(open)}
        open={alertDialogOpen}
        title="게시글을 삭제하시겠습니까?"
      />
    </>
  );
};

function formatToYYYYMMDD(dateInput: string | Date): string {
  const date = new Date(dateInput);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-based
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

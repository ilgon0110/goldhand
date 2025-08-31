'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { MyAlertDialog } from '@/src/shared/ui/MyAlertDialog';
import { Textarea } from '@/src/shared/ui/textarea';
import { formatDateToHMS, getRelativeTimeFromTimestamp, toastError, toastSuccess } from '@/src/shared/utils';
import { commentEditSchema } from '@/src/views/reservation/detail/config/commentEditSchema';

type TCommentProps = {
  docId: string;
  commentId: string;
  isCommentOwner: boolean;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  mutateUpdateComment: (commentId: string, comment: string) => Promise<any>;
  mutateDeleteComment: (commentId: string) => Promise<any>;
};

export const Comment = ({
  docId,
  commentId,
  isCommentOwner,
  content,
  createdAt,
  updatedAt,
  mutateUpdateComment,
  mutateDeleteComment,
}: TCommentProps) => {
  const isUpdated = createdAt.toMillis() !== updatedAt.toMillis();
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const form = useForm<z.infer<typeof commentEditSchema>>({
    resolver: zodResolver(commentEditSchema),
    defaultValues: {
      editComment: content,
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;

  const handleEditClick = () => {
    setIsEditMode(prev => !prev);
  };

  const onhandleDeleteClick = async () => {
    setIsEditMode(false);

    // 삭제 로직 시작
    try {
      setIsDeleteSubmitting(true);
      const result = await (await mutateDeleteComment(commentId)).json();
      if (result.response === 'ok') {
        toastSuccess('댓글 삭제 완료!');
      } else {
        toastError(result.message || '댓글 삭제 실패!');
      }
    } catch (error: any) {
      toastError(error.message || '댓글 삭제 중 알 수 없는 오류가 발생하였습니다.');
    } finally {
      setIsDeleteSubmitting(false);
      setAlertDialogOpen(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof commentEditSchema>) => {
    if (!formValidation) return;

    // 수정 로직 시작
    try {
      const result = await (await mutateUpdateComment(commentId, values.editComment)).json();

      if (result.response === 'ok') {
        toastSuccess('댓글 수정 완료!');
        setIsEditMode(false);
      } else {
        toastSuccess('댓글 수정 실패!');
      }
    } catch {
      toastError('댓글 수정 중 알 수 없는 오류가 발생하였습니다.');
    }
  };

  return (
    <>
      <div className="flex w-full flex-row gap-4">
        <div className="relative mt-2 flex h-6 w-6 items-center justify-center">
          <Image alt="댓글 프로필 이미지" fill sizes="100%" src="/icon/avatar_placeholder.png" />
        </div>
        <div className="w-full">
          <div className="flex flex-row gap-2 text-sm">
            <span>회원</span>
            <span className="text-slate-500">{getRelativeTimeFromTimestamp(createdAt)}</span>
            <span className="text-slate-500">{formatDateToHMS(updatedAt)}</span>
            {isUpdated && <span>수정됨</span>}
            {isCommentOwner && (
              <>
                <button
                  className="text-slate-500 transition-all duration-200 hover:text-black"
                  data-testid="edit-button"
                  onClick={handleEditClick}
                >
                  <svg
                    fill="currentColor"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                  </svg>
                </button>
                <button
                  className="text-slate-500 transition-all duration-200 hover:text-red-500"
                  data-testid="delete-button"
                  onClick={() => setAlertDialogOpen(true)}
                >
                  <svg
                    fill="currentColor"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="mt-1 w-full">
            {isEditMode ? (
              <Form {...form}>
                <form className="w-full space-y-1" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="editComment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                          <Textarea className="w-full resize-none" placeholder={content} {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-x-3">
                    <Button type="submit">수정완료</Button>
                    <Button
                      className="border border-slate-500 bg-transparent text-slate-500 hover:text-white"
                      onClick={() => setIsEditMode(false)}
                    >
                      취소
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <p>{content}</p>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 알림 */}
      <MyAlertDialog
        description="삭제된 댓글은 복구할 수 없습니다."
        handleDeletePostClick={onhandleDeleteClick}
        isPending={isDeleteSubmitting}
        okButtonText="삭제하기"
        opOpenChange={open => setAlertDialogOpen(open)}
        open={alertDialogOpen}
        title="댓글을 삭제하시겠습니까?"
      />
    </>
  );
};

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/ui/alert-dialog';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Textarea } from '@/src/shared/ui/textarea';
import { formatDateToHMS, getRelativeTimeFromTimestamp, toastError, toastSuccess } from '@/src/shared/utils';

import { commentEditSchema } from '../../../views/reservation/detail/config/commentEditSchema';

type CommentProps = {
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
}: CommentProps) => {
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

  const handleDeleteClick = async () => {
    setIsEditMode(false);

    // 삭제 로직 시작
    try {
      setIsDeleteSubmitting(true);
      const result = await (await mutateDeleteComment(commentId)).json();
      // const result = await (
      //   await fetch("/api/consultDetail/comment/delete", {
      //     method: "DELETE",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       docId,
      //       commentId,
      //     }),
      //   })
      // ).json();
      if (result.response === 'ok') {
        toastSuccess('댓글 삭제 완료!');
      } else {
        toastError('댓글 삭제 실패!');
      }
    } catch (error) {
      toastError('댓글 삭제 중 오류가 발생하였습니다.');
    } finally {
      setIsDeleteSubmitting(false);
      setAlertDialogOpen(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof commentEditSchema>) => {
    if (!formValidation) return;

    // 수정 로직 시작
    const result = await (await mutateUpdateComment(commentId, values.editComment)).json();
    // const result = await (
    //   await fetch("/api/consultDetail/comment/update", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       docId,
    //       commentId,
    //       comment: values.editComment,
    //     }),
    //   })
    // ).json();

    if (result.response === 'ok') {
      toastSuccess('댓글 수정 완료!');
      setIsEditMode(false);
    } else {
      toastSuccess('댓글 수정 실패!');
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
      <AlertDialog open={alertDialogOpen} onOpenChange={open => setAlertDialogOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>삭제된 댓글은 복구할 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소하기</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClick}>
              {isDeleteSubmitting ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 animate-spin fill-green-500 text-gray-200 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 100 101"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                '삭제하기'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

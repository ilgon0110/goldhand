/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { passwordPostAction, useDeletePostMutation, useGetReservationDetailData } from '@/src/entities/reservation';
import { useGetUserData } from '@/src/entities/user';
import { useGetViewCountData } from '@/src/entities/viewCount';
import { useScreenView } from '@/src/shared/hooks/useScreenView';
import { Button } from '@/src/shared/ui/button';
import { DeleteConfirmContent } from '@/src/shared/ui/DeleteConfirmContent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { toastError, toastSuccess } from '@/src/shared/utils';
import {
  detailPasswordFormSchema,
  ReservationCommentForm,
  ReservationCommentList,
  ReservationDetailContent,
} from '@/src/widgets/reservation';

type TReservationDetailPageProps = {
  docId: string;
};

type TReservationDialogState =
  | { open: boolean; password: string; step: 'delete-confirm' }
  | { open: boolean; step: 'password' };

export const ReservationDetailPage = ({ docId }: TReservationDetailPageProps) => {
  const { data } = useGetReservationDetailData(docId);
  const { data: userData } = useGetUserData();
  const { data: viewCountData } = useGetViewCountData(docId);
  const router = useRouter();
  const [updateButtonName, setUpdateButtonName] = useState<'DELETE' | 'EDIT'>('EDIT');
  const [dialogState, setDialogState] = useState<TReservationDialogState>({ open: false, step: 'password' });
  const [isEditNavigating, setIsEditNavigating] = useState(false);
  const [isDeleteNavigating, setIsDeleteNavigating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChangeUpdateButtonName = (name: 'DELETE' | 'EDIT') => {
    setUpdateButtonName(name);
  };

  const handleChangeDialogOpen = (open: boolean) => {
    setDialogState({ open, step: 'password' });
    if (!open) {
      setUpdateButtonName('EDIT');
    }
  };

  const handleChangeAlertDialogOpen = (open: boolean) => {
    setDialogState({ open, password: '', step: 'delete-confirm' });
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

    if (updateButtonName === 'EDIT') {
      setDialogState({ open: false, step: 'password' });
      setIsEditNavigating(true);

      try {
        const passwordResponseData = await passwordPostAction(docId, password);

        if (passwordResponseData.response === 'ok') {
          startTransition(() => {
            router.push(`/reservation/edit?docId=${docId}`);
          });
          return;
        }

        passwordForm.reset();
        setIsEditNavigating(false);
        setDialogState({ open: true, step: 'password' });
        toastError(passwordResponseData.message);
      } catch (error) {
        console.error('Error during form submission:', error);
        passwordForm.reset();
        setIsEditNavigating(false);
        setDialogState({ open: true, step: 'password' });
        toastError('비밀번호 검증 중 서버 오류가 발생하였습니다.');
      }
      return;
    }

    try {
      setIsPasswordSubmitting(true);
      const passwordResponseData = await passwordPostAction(docId, password);

      if (passwordResponseData.response === 'ok') {
        setDialogState({ open: true, password, step: 'delete-confirm' });
      } else {
        toastError(passwordResponseData.message);
        passwordForm.reset();
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      passwordForm.reset();
      toastError('비밀번호 검증 중 서버 오류가 발생하였습니다.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const { mutate, isPending: isDeleteSubmitting } = useDeletePostMutation({
    onSuccess: () => {
      setIsDeleteNavigating(true);
      toastSuccess('게시글이 삭제되었습니다.');
      router.push('/reservation/list');
      router.refresh();
    },
    onError: error => {
      toastError(error.message);
    },
  });
  const isDeletePending = isDeleteSubmitting || isDeleteNavigating;

  const closeDialog = () => {
    if (isPasswordSubmitting || isDeletePending) return;

    passwordForm.reset();
    setUpdateButtonName('EDIT');
    setDialogState(current => ({ ...current, open: false }));
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) closeDialog();
  };

  const handleDeleteConfirm = () => {
    if (dialogState.step !== 'delete-confirm') return;

    mutate({ docId, userId: data.data.userId, password: dialogState.password });
  };

  // Firebase Analytics 이벤트 로깅
  useScreenView(`reservation_detail_${docId}`, 'ReservationDetailPage', { doc_id: docId });

  if (data.response === 'ng') {
    throw new Error(data.message);
  }

  return (
    <>
      {isEditNavigating || isPending ? <LoadingSpinnerOverlay text="수정 페이지 이동 중..." /> : null}
      <Dialog open={dialogState.open} onOpenChange={handleDialogOpenChange}>
        {/* 예약 내용 */}
        <ReservationDetailContent
          docId={docId}
          isAdmin={userData.userData?.grade === 'admin'}
          isOwner={data.data.userId ? data.data.userId === userData.userData?.userId : true}
          reservationDetailData={data.data}
          viewCountData={viewCountData.data}
          onChangeAlertDialogOpen={handleChangeAlertDialogOpen}
          onChangeDialogOpen={handleChangeDialogOpen}
          onChangeUpdateButtonName={handleChangeUpdateButtonName}
        />

        {/* 댓글 입력란 */}
        <ReservationCommentForm docId={docId} />

        {/* 댓글들 */}
        <ReservationCommentList docId={docId} userId={userData.userData?.userId} />

        {/* 비밀번호 인증과 삭제 확인은 같은 Dialog 안에서 단계만 전환한다. */}
        <DialogContent
          className="sm:max-w-[425px] sm:px-8"
          closeDisabled={isPasswordSubmitting || isDeletePending}
          onEscapeKeyDown={event => {
            if (isPasswordSubmitting || isDeletePending) event.preventDefault();
          }}
          onPointerDownOutside={event => {
            if (isPasswordSubmitting || isDeletePending) event.preventDefault();
          }}
        >
          {dialogState.step === 'delete-confirm' ? (
            <DeleteConfirmContent
              description="삭제된 게시글은 복구할 수 없습니다."
              isPending={isDeletePending}
              title="게시글을 삭제하시겠습니까?"
              onCancel={closeDialog}
              onConfirm={handleDeleteConfirm}
            />
          ) : (
            <>
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
                  <Button disabled={isPasswordSubmitting} type="submit">
                    {isPasswordSubmitting ? <LoadingSpinnerIcon /> : '확인'}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

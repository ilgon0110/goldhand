/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useScreenView } from '@/src/shared/hooks/useScreenView';
import type { IReservationResponseData, IUserResponseData, IViewCountResponseData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { MyAlertDialog } from '@/src/shared/ui/MyAlertDialog';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { ReservationCommentForm, ReservationCommentList, ReservationDetailContent } from '@/src/widgets/reservation';
import { passwordPostAction } from '@/src/widgets/reservation/api/passwordPostAction';

import { useDeletePostMutation } from '../api/deletePostAction';
import { detailPasswordFormSchema } from '../../../../entities/comment/config/consultCommentSchema';

type TReservationDetailPageProps = {
  data: IReservationResponseData;
  docId: string;
  userData: IUserResponseData;
  viewCountData: IViewCountResponseData;
};

export const ReservationDetailPage = ({ data, docId, userData, viewCountData }: TReservationDetailPageProps) => {
  const router = useRouter();
  const [updateButtonName, setUpdateButtonName] = useState<'DELETE' | 'EDIT'>('EDIT');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChangeUpdateButtonName = (name: 'DELETE' | 'EDIT') => {
    setUpdateButtonName(name);
  };

  const handleChangeDialogOpen = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setUpdateButtonName('EDIT');
      setAlertDialogOpen(false);
    }
  };

  const handleChangeAlertDialogOpen = (open: boolean) => {
    setAlertDialogOpen(open);
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
          startTransition(() => {
            router.push(`/reservation/edit?docId=${docId}`);
          });
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

  const { mutate, isPending: isDeleteSubmitting } = useDeletePostMutation({
    docId,
    userId: data.data.userId,
    password: passwordForm.getValues('password'),
    onSuccess: () => {
      toastSuccess('게시글이 삭제되었습니다.');
      router.push('/reservation/list');
    },
    onError: error => {
      toastError(error);
    },
    onSettled: () => {
      setAlertDialogOpen(false);
    },
  });

  // Firebase Analytics 이벤트 로깅
  useScreenView(`reservation_detail_${docId}`, 'ReservationDetailPage', { doc_id: docId });

  if (data.response === 'ng') {
    throw new Error(data.message);
  }

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="수정 페이지 이동 중... " />}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* 예약 내용 */}
        <ReservationDetailContent
          docId={docId}
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
        handleDeletePostClick={() => mutate()}
        isPending={isDeleteSubmitting}
        okButtonText="삭제하기"
        opOpenChange={open => setAlertDialogOpen(open)}
        open={alertDialogOpen}
        title="게시글을 삭제하시겠습니까?"
      />
    </>
  );
};

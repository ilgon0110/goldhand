'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { usePinMutation } from '@/src/entities/pin';
import { passwordPostAction, useDeletePostMutation } from '@/src/entities/reservation';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { detailPasswordFormSchema } from '../config/detailPasswordFormSchema';
export type TReservationManageDialogState =
  | { open: boolean; password: string; step: 'delete-confirm' }
  | { open: boolean; step: 'password' };

type TUseReservationDetailActionsParams = {
  docId: string;
  isGuestPost: boolean;
  isPinned: boolean;
  userId: string | null;
};

export function useReservationDetailActions({
  docId,
  isGuestPost,
  isPinned,
  userId,
}: TUseReservationDetailActionsParams) {
  const router = useRouter();
  const [action, setAction] = useState<'DELETE' | 'EDIT'>('EDIT');
  const [dialogState, setDialogState] = useState<TReservationManageDialogState>({ open: false, step: 'password' });
  const [isEditNavigating, setIsEditNavigating] = useState(false);
  const [isDeleteNavigating, setIsDeleteNavigating] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isRoutePending, startTransition] = useTransition();

  const passwordForm = useForm<z.infer<typeof detailPasswordFormSchema>>({
    resolver: zodResolver(detailPasswordFormSchema),
    defaultValues: { password: '' },
    mode: 'onChange',
  });

  const { mutate: togglePin, isPending: isPinToggling } = usePinMutation('reservation');
  const { mutate: deletePost, isPending: isDeleteSubmitting } = useDeletePostMutation({
    onSuccess: () => {
      setIsDeleteNavigating(true);
      toastSuccess('게시글이 삭제되었습니다.');
      router.push('/reservation/list');
      router.refresh();
    },
    onError: error => toastError(error.message),
  });

  const isDeletePending = isDeleteSubmitting || isDeleteNavigating;
  const isDialogPending = isPasswordSubmitting || isDeletePending;

  const handleEdit = () => {
    setAction('EDIT');
    if (isGuestPost) {
      setDialogState({ open: true, step: 'password' });
      return;
    }

    startTransition(() => router.push(`/reservation/edit?docId=${docId}`));
  };

  const handleDelete = () => {
    setAction('DELETE');
    setDialogState(
      isGuestPost ? { open: true, step: 'password' } : { open: true, password: '', step: 'delete-confirm' },
    );
  };

  const handlePasswordSubmit = async (values: z.infer<typeof detailPasswordFormSchema>) => {
    const { password } = values;

    if (action === 'EDIT') {
      setDialogState({ open: false, step: 'password' });
      setIsEditNavigating(true);
      try {
        const response = await passwordPostAction(docId, password);
        if (response.response === 'ok') {
          startTransition(() => router.push(`/reservation/edit?docId=${docId}`));
          return;
        }
        toastError(response.message);
      } catch (error) {
        console.error('Error during form submission:', error);
        toastError('비밀번호 검증 중 서버 오류가 발생하였습니다.');
      }
      passwordForm.reset();
      setIsEditNavigating(false);
      setDialogState({ open: true, step: 'password' });
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      const response = await passwordPostAction(docId, password);
      if (response.response === 'ok') {
        setDialogState({ open: true, password, step: 'delete-confirm' });
      } else {
        toastError(response.message);
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

  const handleCloseDialog = () => {
    if (isDialogPending) return;
    passwordForm.reset();
    setAction('EDIT');
    setDialogState(current => ({ ...current, open: false }));
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) handleCloseDialog();
  };

  const handleDeleteConfirm = () => {
    if (dialogState.step !== 'delete-confirm') return;
    deletePost({ docId, password: dialogState.password, userId });
  };

  const handleTogglePin = () => togglePin({ docId, isPinned: !isPinned });

  return {
    dialogState,
    editLoadingText: isGuestPost ? '수정 페이지 이동 중...' : '페이지 이동중..',
    handleCloseDialog,
    handleDelete,
    handleDeleteConfirm,
    handleDialogOpenChange,
    handleEdit,
    handlePasswordSubmit,
    handleTogglePin,
    isDeletePending,
    isDialogPending,
    isEditNavigating: isEditNavigating || isRoutePending,
    isPasswordSubmitting,
    isPinToggling,
    passwordForm,
  };
}

export type TReservationDetailActions = ReturnType<typeof useReservationDetailActions>;

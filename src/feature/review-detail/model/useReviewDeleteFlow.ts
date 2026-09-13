'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { phoneAuthFormSchema } from '@/src/entities/phoneAuth';
import { usePhoneAuthVerifyFlow } from '@/src/entities/phoneAuth/client';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { useReviewDeleteMutation } from '../api/useReviewDeleteMutation';

export type TReviewDeleteDialogState = {
  open: boolean;
  step: 'delete-confirm' | 'phone-auth';
};

type TUseReviewDeleteFlowParams = {
  docId: string;
  requiresPhoneAuth: boolean;
};

export function useReviewDeleteFlow({ docId, requiresPhoneAuth }: TUseReviewDeleteFlowParams) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<TReviewDeleteDialogState>({ open: false, step: 'phone-auth' });
  const [isDeleteNavigating, setIsDeleteNavigating] = useState(false);
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
        setDialogState({ open: true, step: 'delete-confirm' });
      },
    },
  );
  const { mutate: deleteReview, isPending: isDeleteSubmitting } = useReviewDeleteMutation({
    onSuccess: () => {
      setIsDeleteNavigating(true);
      toastSuccess('게시글이 삭제되었습니다.');
      router.replace('/review');
      router.refresh();
    },
    onError: error => toastError('게시글 삭제에 실패하였습니다.\n' + error.message),
  });
  const isPhoneAuthPending = phoneAuth.isSendingSms || phoneAuth.isConfirming;
  const isDeletePending = isDeleteSubmitting || isDeleteNavigating;
  const isDialogPending = isPhoneAuthPending || isDeletePending;

  const handleOpen = () =>
    setDialogState({ open: true, step: requiresPhoneAuth ? 'phone-auth' : 'delete-confirm' });
  const handleClose = () => {
    if (isDialogPending) return;
    phoneIdTokenRef.current = null;
    phoneAuth.onRestartClick();
    setDialogState(current => ({ ...current, open: false }));
  };
  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };
  const handleConfirmDelete = () =>
    deleteReview({ docId, phoneIdToken: phoneIdTokenRef.current ?? undefined });

  return {
    dialogState,
    handleClose,
    handleConfirmDelete,
    handleOpen,
    handleOpenChange,
    isDeletePending,
    isDialogPending,
    phoneAuth,
    phoneAuthForm,
  };
}

export type TReviewDeleteFlow = ReturnType<typeof useReviewDeleteFlow>;

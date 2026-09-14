'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { usePinMutation } from '@/src/entities/pin';

type TUseReviewDetailActionsParams = {
  docId: string;
  isAdmin: boolean;
  isPinned: boolean;
  postUserId: string | null;
  userId?: string;
};

export function useReviewDetailActions({
  docId,
  isAdmin,
  isPinned,
  postUserId,
  userId,
}: TUseReviewDetailActionsParams) {
  const router = useRouter();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const isOwner = postUserId ? postUserId === userId : true;
  const canManage = isOwner || isAdmin;
  const { mutate: togglePin, isPending: isPinToggling } = usePinMutation('review');

  const handleEdit = () => setIsUpdateDialogOpen(true);
  const handleEditConfirm = () => router.push(`/review/${docId}/edit`);
  const handleUpdateDialogOpenChange = (open: boolean) => setIsUpdateDialogOpen(open);
  const handleTogglePin = () => togglePin({ docId, isPinned: !isPinned });

  return {
    canManage,
    handleEdit,
    handleEditConfirm,
    handleTogglePin,
    handleUpdateDialogOpenChange,
    isPinToggling,
    isUpdateDialogOpen,
  };
}

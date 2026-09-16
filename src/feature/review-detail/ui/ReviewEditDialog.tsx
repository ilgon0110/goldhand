'use client';

import { PencilLine } from 'lucide-react';

import { Button } from '@/src/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';

type TReviewEditDialogProps = {
  open: boolean;
  handleConfirm: () => void;
  handleOpenChange: (open: boolean) => void;
};

export function ReviewEditDialog({ open, handleConfirm, handleOpenChange }: TReviewEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] sm:px-8">
        <DialogHeader>
          <DialogTitle>게시글을 수정하시겠습니까?</DialogTitle>
          <DialogDescription>게시글 수정 화면으로 이동합니다.</DialogDescription>
        </DialogHeader>
        <div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 flex-col items-center gap-6 sm:static sm:translate-y-0">
          <div className="flex size-28 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PencilLine aria-label="수정" className="size-[72px]" role="img" strokeWidth={1.75} />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button className="w-full" type="button" onClick={handleConfirm}>
              수정하기
            </Button>
            <Button className="w-full" type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              취소하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

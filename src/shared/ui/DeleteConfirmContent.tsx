import { Trash2 } from 'lucide-react';

import { Button } from './button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { LoadingSpinnerIcon } from './loadingSpinnerIcon';

type TDeleteConfirmContentProps = {
  description: string;
  isPending: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmContent({
  description,
  isPending,
  title,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
}: TDeleteConfirmContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 flex-col items-center gap-6 sm:static sm:translate-y-0">
        <div className="flex size-28 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <Trash2 aria-label="삭제" className="size-[72px]" role="img" strokeWidth={1.75} />
        </div>
        <DialogFooter className="w-full flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full" disabled={isPending} type="button" variant="destructive" onClick={handleConfirm}>
            {isPending ? <LoadingSpinnerIcon /> : '삭제하기'}
          </Button>
          <Button className="w-full" disabled={isPending} type="button" variant="outline" onClick={handleCancel}>
            취소하기
          </Button>
        </DialogFooter>
      </div>
    </>
  );
}

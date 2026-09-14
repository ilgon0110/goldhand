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
      <DialogFooter>
        <Button disabled={isPending} type="button" variant="outline" onClick={handleCancel}>
          취소하기
        </Button>
        <Button disabled={isPending} type="button" variant="destructive" onClick={handleConfirm}>
          {isPending ? <LoadingSpinnerIcon /> : '삭제하기'}
        </Button>
      </DialogFooter>
    </>
  );
}

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

import { LoadingSpinnerIcon } from './loadingSpinnerIcon';

type TMyAlertDialogProps = {
  open: boolean;
  opOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  handleDeletePostClick: () => void;
  isPending?: boolean;
  okButtonText: string;
};

export function MyAlertDialog({
  open,
  opOpenChange,
  title,
  description,
  handleDeletePostClick,
  isPending = false,
  okButtonText,
}: TMyAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={open => opOpenChange(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소하기</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDeletePostClick}>
            {isPending ? <LoadingSpinnerIcon /> : okButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

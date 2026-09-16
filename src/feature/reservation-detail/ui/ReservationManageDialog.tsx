'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/src/shared/ui/button';
import { DeleteConfirmContent } from '@/src/shared/ui/DeleteConfirmContent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';

import type { TReservationDetailActions } from '../model/useReservationDetailActions';

type TReservationManageDialogProps = Pick<
  TReservationDetailActions,
  | 'dialogState'
  | 'handleCloseDialog'
  | 'handleDeleteConfirm'
  | 'handleDialogOpenChange'
  | 'handlePasswordSubmit'
  | 'isDeletePending'
  | 'isDialogPending'
  | 'isPasswordSubmitting'
  | 'passwordForm'
>;

export function ReservationManageDialog({
  dialogState,
  handleCloseDialog,
  handleDeleteConfirm,
  handleDialogOpenChange,
  handlePasswordSubmit,
  isDeletePending,
  isDialogPending,
  isPasswordSubmitting,
  passwordForm,
}: TReservationManageDialogProps) {
  const handleEscapeKeyDown = (event: Event) => {
    if (isDialogPending) event.preventDefault();
  };
  const handlePointerDownOutside = (event: Event) => {
    if (isDialogPending) event.preventDefault();
  };

  return (
    <Dialog open={dialogState.open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className={cn(
          'sm:max-w-[425px] sm:px-8',
          dialogState.step === 'password' && 'gap-6',
        )}
        closeDisabled={isDialogPending}
        onEscapeKeyDown={handleEscapeKeyDown}
        onPointerDownOutside={handlePointerDownOutside}
      >
        {dialogState.step === 'delete-confirm' ? (
          <DeleteConfirmContent
            description="삭제된 게시글은 복구할 수 없습니다."
            isPending={isDeletePending}
            title="게시글을 삭제하시겠습니까?"
            onCancel={handleCloseDialog}
            onConfirm={handleDeleteConfirm}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>비밀번호를 입력하세요.</DialogTitle>
              <DialogDescription className="sr-only">게시글 확인을 위한 비밀번호를 입력하세요.</DialogDescription>
            </DialogHeader>
            <Form {...passwordForm}>
              <form className="space-y-6" onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">비밀번호</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">게시글 작성 시 설정한 비밀번호</FormDescription>
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
  );
}

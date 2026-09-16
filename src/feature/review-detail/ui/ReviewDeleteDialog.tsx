'use client';

import { cn } from '@/lib/utils';
import { PHONE_AUTH_RECAPTCHA_CONTAINER_ID, PhoneAuthFields } from '@/src/entities/phoneAuth/client';
import { DeleteConfirmContent } from '@/src/shared/ui/DeleteConfirmContent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';
import { Form } from '@/src/shared/ui/form';

import type { TReviewDeleteFlow } from '../model/useReviewDeleteFlow';

type TReviewDeleteDialogProps = Pick<
  TReviewDeleteFlow,
  | 'dialogState'
  | 'handleClose'
  | 'handleConfirmDelete'
  | 'handleOpenChange'
  | 'isDeletePending'
  | 'isDialogPending'
  | 'phoneAuth'
  | 'phoneAuthForm'
>;

export function ReviewDeleteDialog({
  dialogState,
  handleClose,
  handleConfirmDelete,
  handleOpenChange,
  isDeletePending,
  isDialogPending,
  phoneAuth,
  phoneAuthForm,
}: TReviewDeleteDialogProps) {
  const handleEscapeKeyDown = (event: Event) => {
    if (isDialogPending) event.preventDefault();
  };
  const handlePointerDownOutside = (event: Event) => {
    if (isDialogPending) event.preventDefault();
  };

  return (
    <>
      <button
        aria-hidden="true"
        className="hidden"
        id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID}
        key={phoneAuth.recaptchaKey}
        tabIndex={-1}
      />
      <Dialog open={dialogState.open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn('sm:max-w-[425px] sm:px-8', dialogState.step === 'phone-auth' && 'h-[80dvh]')}
          closeDisabled={isDialogPending}
          onEscapeKeyDown={handleEscapeKeyDown}
          onPointerDownOutside={handlePointerDownOutside}
        >
          {dialogState.step === 'phone-auth' ? (
            <>
              <DialogTitle>휴대폰 인증</DialogTitle>
              <DialogHeader>
                <DialogDescription />
              </DialogHeader>
              <Form {...phoneAuthForm}>
                <form className="space-y-6">
                  <PhoneAuthFields
                    authCodeName="authCode"
                    control={phoneAuthForm.control}
                    phoneAuth={phoneAuth}
                    phoneNumberName="phoneNumber"
                  />
                </form>
              </Form>
            </>
          ) : (
            <DeleteConfirmContent
              description="삭제된 게시글은 복구할 수 없습니다."
              isPending={isDeletePending}
              title="게시글을 삭제하시겠습니까?"
              onCancel={handleClose}
              onConfirm={handleConfirmDelete}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

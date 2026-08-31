/* eslint-disable react/jsx-handler-names */
'use client';

import { Button } from '@/src/shared/ui/button';
import { Form } from '@/src/shared/ui/form';
import { useImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import type { TGuestVerification } from '../model';
import { useReviewWriteForm } from '../model';
import { ReviewFields } from './_ReviewFields';
import { ReviewUploadProgress } from './_ReviewUploadProgress';

type TGuestReviewFormStepProps = {
  verification: TGuestVerification;
  onRestartVerification: () => void;
};

const maskPhoneNumber = (phoneNumber: string) => phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');

export const GuestReviewFormStep = ({ verification, onRestartVerification }: TGuestReviewFormStepProps) => {
  const { setImages } = useImagesContext();
  const writeForm = useReviewWriteForm({ isGuestPost: true, phoneIdToken: verification.phoneIdToken });

  const handleRestartVerification = () => {
    setImages(null);
    writeForm.resetImageProgress();
    writeForm.form.reset();
    onRestartVerification();
  };

  return (
    <>
      <Form {...writeForm.form}>
        <form className="space-y-6" onSubmit={writeForm.handleSubmit}>
          <div
            aria-live="polite"
            className="flex flex-col gap-3 rounded-lg border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">후기 작성</h2>
              <p className="mt-1 text-sm text-green-700">인증 완료 · {maskPhoneNumber(verification.phoneNumber)}</p>
            </div>
            <Button type="button" variant="outline" onClick={handleRestartVerification}>
              다른 번호로 인증
            </Button>
          </div>
          <ReviewFields
            autoFocusName
            form={writeForm.form}
            isOptimizing={writeForm.isOptimizing}
            isSubmitting={writeForm.isSubmitting}
            onEditorChange={writeForm.handleChangeReviewFormEditor}
          />
        </form>
      </Form>
      <ReviewUploadProgress
        imageProgress={writeForm.imageProgress}
        isOptimizing={writeForm.isOptimizing}
        onReset={writeForm.resetImageProgress}
      />
    </>
  );
};

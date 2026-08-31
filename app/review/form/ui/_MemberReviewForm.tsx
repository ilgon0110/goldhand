/* eslint-disable react/jsx-handler-names */
'use client';

import { Form } from '@/src/shared/ui/form';

import { useReviewWriteForm } from '../model';
import { ReviewFields } from './_ReviewFields';
import { ReviewUploadProgress } from './_ReviewUploadProgress';

export const MemberReviewForm = () => {
  const writeForm = useReviewWriteForm({ isGuestPost: false });

  return (
    <>
      <Form {...writeForm.form}>
        <form className="space-y-6" onSubmit={writeForm.handleSubmit}>
          <ReviewFields
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

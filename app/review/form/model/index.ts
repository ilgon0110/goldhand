import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { reviewContentSchema, useReviewFormMutation } from '@/src/entities/review';

type TUseReviewWriteFormOptions = {
  isGuestPost: boolean;
  phoneIdToken?: string;
};
export type TGuestVerification = {
  phoneNumber: string;
  phoneIdToken: string;
};

export type TReviewContentValues = z.infer<typeof reviewContentSchema>;

export const useReviewWriteForm = ({ isGuestPost, phoneIdToken }: TUseReviewWriteFormOptions) => {
  const form = useForm<TReviewContentValues>({
    resolver: zodResolver(reviewContentSchema),
    defaultValues: { name: '', title: '', franchisee: '' },
    mode: 'onChange',
  });

  const mutation = useReviewFormMutation('create');
  const handleSubmit = form.handleSubmit(values => mutation.onSubmit({ ...values, isGuestPost }, phoneIdToken));

  return { form, handleSubmit, ...mutation };
};

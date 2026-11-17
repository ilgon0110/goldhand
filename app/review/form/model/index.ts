import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { reviewContentSchema } from '@/src/entities/review';
import { refineAdminOnlyName } from '@/src/feature/auth';
import { useReviewFormMutation } from '@/src/feature/review-form';

type TUseReviewWriteFormOptions = {
  isGuestPost: boolean;
  phoneIdToken?: string;
  isAdmin?: boolean;
};
export type TGuestVerification = {
  phoneNumber: string;
  phoneIdToken: string;
};

export type TReviewContentValues = z.infer<typeof reviewContentSchema>;

export const useReviewWriteForm = ({ isGuestPost, phoneIdToken, isAdmin = false }: TUseReviewWriteFormOptions) => {
  const form = useForm<TReviewContentValues>({
    resolver: zodResolver(reviewContentSchema.superRefine(refineAdminOnlyName(isAdmin))),
    defaultValues: { name: '', title: '', franchisee: '' },
    mode: 'onChange',
  });

  const mutation = useReviewFormMutation('create');
  const handleSubmit = form.handleSubmit(values => mutation.onSubmit({ ...values, isGuestPost }, phoneIdToken));

  return { form, handleSubmit, ...mutation };
};

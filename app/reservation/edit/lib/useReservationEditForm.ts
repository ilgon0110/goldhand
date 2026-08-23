import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';
import type z from 'zod';

import { reservationEditFormSchema } from '@/src/entities/reservation';
import type { IReservationResponseData, IUserResponseData } from '@/src/shared/types';
import { toastError } from '@/src/shared/utils';

import { useReservationEditMutation } from '../api';

interface IUseReservationEditFormProps {
  userData: IUserResponseData;
  consultDetailData: IReservationResponseData;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useReservationEditForm = ({
  consultDetailData,
  userData,
  onSuccess,
  onError,
}: IUseReservationEditFormProps) => {
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const docId = searchParams.get('docId');
  const { mutate, isPending } = useReservationEditMutation();

  const commonDefaults = {
    title: consultDetailData.data.title || '',
    name: userData?.userData?.name || consultDetailData.data.name || '',
    secret: consultDetailData.data.secret || false,
    franchisee: consultDetailData.data.franchisee || '',
    phoneNumber: userData?.userData?.phoneNumber || consultDetailData.data.phoneNumber || '',
    bornDate: consultDetailData.data.bornDate ? new Date(consultDetailData.data.bornDate) : undefined,
    location: consultDetailData.data.location || '',
    content: consultDetailData.data.content || '',
  };

  const isGuestPost = consultDetailData.data.userId == null;

  const form = useForm<z.infer<typeof reservationEditFormSchema>>({
    resolver: zodResolver(reservationEditFormSchema),
    defaultValues: isGuestPost
      ? { ...commonDefaults, isGuestPost: true, oldPassword: '', password: '' }
      : { ...commonDefaults, isGuestPost: false, oldPassword: undefined, password: undefined },
    mode: 'onChange',
  });

  const formValidation = form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof reservationEditFormSchema>) => {
    if (!formValidation) return;
    if (!executeRecaptcha) return;
    if (docId == null) {
      toastError('잘못된 접근입니다. 다시 시도해주세요.');
      return;
    }
    const recaptchaToken = await executeRecaptcha('join');

    mutate(
      {
        ...values,
        password: values.password || undefined,
        oldPassword: values.oldPassword || undefined,
        secret: values.secret || false,
        docId,
        recaptchaToken,
        userId: userData.userData?.userId,
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onError: error => {
          if (onError) onError(error);
        },
      },
    );
  };

  return { form, onSubmit, isPending, docId };
};

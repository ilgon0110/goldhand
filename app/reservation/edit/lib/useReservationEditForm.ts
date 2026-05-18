import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';
import type z from 'zod';

import { reservationFormSchema } from '@/src/entities/reservation';
import type { IReservationResponseData, IUserResponseData } from '@/src/shared/types';
import { toastError } from '@/src/shared/utils';

import { useReservationMutation } from '../api';

interface IUseReservationEditFormProps {
  userData: IUserResponseData;
  consultDetailData: IReservationResponseData;
  onSuccess?: () => void;
  onError?: () => void;
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
  const { mutate, isPending } = useReservationMutation();

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

  const isMember = userData.userData?.userId != null;

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: isMember
      ? { ...commonDefaults, isMember: true, password: undefined }
      : { ...commonDefaults, isMember: false, password: '' },
    mode: 'onChange',
  });

  const formValidation = form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof reservationFormSchema>) => {
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
        secret: values.secret || false,
        docId,
        recaptchaToken,
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onError: () => {
          if (onError) onError();
        },
      },
    );
  };

  return { form, onSubmit, isPending, docId };
};

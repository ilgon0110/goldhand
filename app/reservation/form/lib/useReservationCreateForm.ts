import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';
import type z from 'zod';

import { passwordPostAction, reservationFormSchema } from '@/src/entities/reservation';
import type { IUserResponseData } from '@/src/shared/types';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';

import { useReservationCreateMutation } from '../api';

interface IUseReservationCreateFormProps {
  userData: IUserResponseData;
  onSuccess?: () => void;
  onError?: () => void;
}

export const useReservationCreateForm = ({ userData, onSuccess, onError }: IUseReservationCreateFormProps) => {
  const { mutate, isPending } = useReservationCreateMutation();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      title: '',
      name: userData?.userData?.name || '',
      isGuestPost: userData.userData == null,
      secret: true,
      franchisee: '',
      phoneNumber: userData?.userData?.phoneNumber || '',
      bornDate: undefined,
      location: '',
      content: '',
    },
    mode: 'onChange',
  });

  const formValidation = form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof reservationFormSchema>) => {
    if (!formValidation) return;
    if (!executeRecaptcha) return;

    const recaptchaToken = await executeRecaptcha('join');
    // POST 요청
    mutate(
      {
        ...values,
        secret: values.secret || false,
        userId: userData.userData?.userId,
        recaptchaToken,
      },
      {
        onSuccess: async data => {
          if (data == null || data.docId == null) return;
          await Promise.all([
            values.password ? passwordPostAction(data.docId, values.password) : Promise.resolve(),
            sendViewLog(data.docId),
          ]);
          toastSuccess('상담 신청이 완료되었습니다.\n잠시 후 작성글 페이지로 이동합니다.');
          // 비밀번호 입력된 경우 비밀번호 검증 jwt 쿠키 저장
          // 3초 후에 페이지 이동
          setTimeout(() => {
            router.replace(`/reservation/list/${data.docId}`);
            router.refresh();
          }, 3000);

          if (onSuccess) onSuccess();
        },
        onError: () => {
          toastError(`상담 신청에 실패했습니다.`);
          if (onError) onError();
        },
      },
    );
  };

  return {
    form,
    onSubmit,
    isPending,
  };
};

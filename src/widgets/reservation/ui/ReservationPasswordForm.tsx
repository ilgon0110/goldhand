'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { toastError } from '@/src/shared/utils';

import { passwordPostAction } from '../api/passwordPostAction';
import { detailPasswordFormSchema } from '../config/consultCommentSchema';

type TReservationPasswordFormProps = {
  docId: string;
  updateButtonName: 'DELETE' | 'EDIT';
  onChangeUpdateButtonName: (name: 'DELETE' | 'EDIT') => void;
  onChangeAlertDialogOpen: (open: boolean) => void;
};

export const ReservationPasswordForm = ({
  docId,
  updateButtonName,
  onChangeUpdateButtonName,
  onChangeAlertDialogOpen,
}: TReservationPasswordFormProps) => {
  const router = useRouter();
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const passwordForm = useForm<z.infer<typeof detailPasswordFormSchema>>({
    resolver: zodResolver(detailPasswordFormSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  });

  const onPasswordSubmit = async (values: z.infer<typeof detailPasswordFormSchema>) => {
    const { password } = values;

    try {
      setIsPasswordSubmitting(true);
      const passwordResponseData = await passwordPostAction(docId, password);

      if (passwordResponseData.response === 'ok') {
        // 수정하기 버튼 클릭 시
        if (updateButtonName === 'EDIT') {
          router.push(`/reservation/edit?docId=${docId}`);
          return;
        }
        // 삭제하기 버튼 클릭 시
        onChangeAlertDialogOpen(true);
      } else {
        toastError(passwordResponseData.message);
        passwordForm.reset();
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toastError('비밀번호 검증 중 서버 오류가 발생하였습니다.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <>
      <Form {...passwordForm}>
        <form className="space-y-6" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <FormField
            control={passwordForm.control}
            defaultValue=""
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit">{isPasswordSubmitting ? <LoadingSpinnerIcon /> : '확인'}</Button>
        </form>
      </Form>
    </>
  );
};

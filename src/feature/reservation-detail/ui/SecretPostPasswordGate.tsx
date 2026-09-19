'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { passwordPostAction } from '@/src/entities/reservation';
import { Button } from '@/src/shared/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { toastError } from '@/src/shared/utils';

import { detailPasswordFormSchema } from '../config/detailPasswordFormSchema';
import { useAuthReturnRefresh } from '../model/useAuthReturnRefresh';
import { SecretPostGateShell, SecretPostLoading } from './SecretPostGateShell';

type TSecretPostPasswordGateProps = { docId: string };

export function SecretPostPasswordGate({ docId }: TSecretPostPasswordGateProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isWaitingForAuthReturn = useAuthReturnRefresh();

  const passwordForm = useForm<z.infer<typeof detailPasswordFormSchema>>({
    resolver: zodResolver(detailPasswordFormSchema),
    defaultValues: { password: '' },
    mode: 'onChange',
  });

  const handleSubmit = async ({ password }: z.infer<typeof detailPasswordFormSchema>) => {
    // React가 disabled를 반영하기 전의 연타로 인한 중복 제출을 막는다.
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await passwordPostAction(docId, password);
      if (response.response === 'ok') {
        router.refresh();
        return;
      }
      toastError(response.message);
    } catch (error) {
      console.error('Error during form submission:', error);
      toastError('비밀번호 검증 중 서버 오류가 발생하였습니다.');
    }

    // 성공 시에는 router.refresh()가 게시글을 렌더할 때까지 제출 버튼을 잠근 채로 둔다.
    passwordForm.reset();
    setIsSubmitting(false);
  };

  // 대부분 이 게이트는 비회원 작성 글이고, 실제로 조회하는 건 관리자인 경우가 많다.
  // 비밀번호를 모르는 관리자를 위해 로그인 경로도 함께 제공한다(로그인 시 isAdmin이면 비밀글 체크를 통째로 건너뜀).
  if (isWaitingForAuthReturn) return <SecretPostLoading />;

  return (
    <SecretPostGateShell>
      <h2 className="text-lg font-semibold">비밀글입니다.</h2>
      <p className="mt-2 text-sm text-gray-500">비밀번호를 입력하면 게시글을 확인할 수 있습니다.</p>
      <Form {...passwordForm}>
        <form className="mt-6 space-y-6" onSubmit={passwordForm.handleSubmit(handleSubmit)}>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? <LoadingSpinnerIcon /> : '확인'}
          </Button>
        </form>
      </Form>
      <p className="mt-6 border-t pt-4 text-center text-sm text-gray-500">
        관리자라면{' '}
        <Link
          className="font-medium underline"
          href={`/login?redirect=${encodeURIComponent(`/reservation/list/${docId}`)}`}
        >
          로그인
        </Link>
        해주세요.
      </p>
    </SecretPostGateShell>
  );
}

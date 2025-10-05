/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { useAuth } from '@/src/shared/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/ui/alert-dialog';
import { Button } from '@/src/shared/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/src/shared/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import TruncateText from '@/src/shared/ui/TruncateText';
import { toastError } from '@/src/shared/utils';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';
import { passwordPostAction } from '@/src/views/reservation';

import { detailFormSchema } from '../list/config/detailFormSchema';

type TReservationCardProps = {
  docId: string;
  title: string;
  author: string;
  createdAt: string;
  spot: string;
  isSecret: boolean;
  content: string;
  dataUserId: string | null; // 추가된 부분: 데이터의 userId
};

export const ReservationCard = ({
  docId,
  title,
  author,
  createdAt,
  spot,
  isSecret,
  content,
  dataUserId,
}: TReservationCardProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof detailFormSchema>>({
    resolver: zodResolver(detailFormSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { userData } = useAuth();

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (isSecret && author === '비회원') {
      setIsPasswordDialogOpen(true);
      return;
    }

    if (isSecret && author !== '비회원' && dataUserId !== userData?.userId) {
      setIsAlertDialogOpen(true);
      return;
    }

    // 조회수 기록
    const viewRes = sendViewLog(docId);
    if (!viewRes) {
      console.error('Failed to send view log');
    }

    // 비밀글이 아닌 경우 상세 페이지로 이동
    router.push(`/reservation/list/${docId}`);
  };

  // 비밀글인 경우 비밀번호 검증 후 상세 페이지로 이동
  const onSubmit = async (values: z.infer<typeof detailFormSchema>) => {
    if (!formValidation) {
      toastError('비밀번호가 틀립니다.');
      return;
    }
    // 비밀번호 검증 후 상세 페이지로 이동
    try {
      setIsSubmitting(true);
      const passwordResponseData = await passwordPostAction(docId, values.password);

      if (passwordResponseData.response === 'ok') {
        // 조회수 기록
        const viewRes = await sendViewLog(docId);
        if (!viewRes) {
          console.error('Failed to send view log');
        }

        router.push(`/reservation/list/${docId}`);
      } else {
        toastError(passwordResponseData.message);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toastError('비밀번호 검증 중 서버 오류가 발생하였습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <button
            aria-disabled={isSecret}
            className={cn('relative flex w-full flex-1 flex-row gap-3 overflow-hidden border-b border-gray-200 p-4')}
            data-testid={docId}
            onClick={handleOnClick}
          >
            {isSecret && (
              <div className="absolute right-6 top-6 group-hover:fill-[#FFFFFF]">
                <svg className="h-6 w-6" fill="current" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                  <path d="M220-80q-24.75 0-42.37-17.63Q160-115.25 160-140v-434q0-24.75 17.63-42.38Q195.25-634 220-634h70v-96q0-78.85 55.61-134.42Q401.21-920 480.11-920q78.89 0 134.39 55.58Q670-808.85 670-730v96h70q24.75 0 42.38 17.62Q800-598.75 800-574v434q0 24.75-17.62 42.37Q764.75-80 740-80H220Zm0-60h520v-434H220v434Zm260.17-140q31.83 0 54.33-22.03T557-355q0-30-22.67-54.5t-54.5-24.5q-31.83 0-54.33 24.5t-22.5 55q0 30.5 22.67 52.5t54.5 22ZM350-634h260v-96q0-54.17-37.88-92.08-37.88-37.92-92-37.92T388-822.08q-38 37.91-38 92.08v96ZM220-140v-434 434Z" />{' '}
                </svg>
              </div>
            )}
            {
              <div>
                <div className="text-start text-lg font-bold">
                  <TruncateText maxLines={1} text={isSecret ? '비밀글입니다' : title} />
                </div>
                <div className="mt-[1px] flex w-full gap-2 text-sm">
                  <span>
                    <TruncateText maxLines={1} text={spot} />
                  </span>
                  <span className="text-gray-800">
                    <TruncateText maxLines={1} text={author} />
                  </span>
                  <span className="text-gray-500">
                    <TruncateText maxLines={1} text={createdAt} />
                  </span>
                </div>
                <div className="mt-2 text-start text-sm text-gray-800">
                  <TruncateText maxLines={1} text={isSecret ? '비밀글입니다' : content} />
                </div>
              </div>
            }
          </button>

          {/* 비밀번호 입력 모달 */}
          <DialogContent className="sm:max-w-[425px] sm:px-8">
            <DialogTitle>비밀번호를 입력하세요.</DialogTitle>
            <DialogHeader>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form aria-label="비밀번호입력폼" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  defaultValue={''}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input data-testid="password-input" placeholder="" type="password" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                    </FormItem>
                  )}
                />
                <Button type="submit">{isSubmitting ? <LoadingSpinnerIcon /> : '확인'}</Button>
              </form>
            </Form>
          </DialogContent>

          {/* 열람 불가 알림 */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>비밀글 알림</AlertDialogTitle>
              <AlertDialogDescription>작성자와 운영자만 조회가 가능합니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </Dialog>
      </AlertDialog>
    </>
  );
};

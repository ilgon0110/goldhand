/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { passwordPostAction } from '@/src/entities/reservation';
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
import { toastError } from '@/src/shared/utils';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';

const LockIcon = () => (
  <svg className="h-[14px] w-[14px]" fill="currentColor" viewBox="0 -960 960 960">
    <path d="M220-80q-24.75 0-42.37-17.63Q160-115.25 160-140v-434q0-24.75 17.63-42.38Q195.25-634 220-634h70v-96q0-78.85 55.61-134.42Q401.21-920 480.11-920q78.89 0 134.39 55.58Q670-808.85 670-730v96h70q24.75 0 42.38 17.62Q800-598.75 800-574v434q0 24.75-17.62 42.37Q764.75-80 740-80H220Zm0-60h520v-434H220v434Zm260.17-140q31.83 0 54.33-22.03T557-355q0-30-22.67-54.5t-54.5-24.5q-31.83 0-54.33 24.5t-22.5 55q0 30.5 22.67 52.5t54.5 22ZM350-634h260v-96q0-54.17-37.88-92.08-37.88-37.92-92-37.92T388-822.08q-38 37.91-38 92.08v96Z" />
  </svg>
);

import { detailFormSchema } from '../config';

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
  const { data: userData } = useAuth();
  const isAdmin = userData?.userData?.grade === 'admin';

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    if (!isAdmin) {
      if (isSecret && author === '비회원') {
        setIsPasswordDialogOpen(true);
        return;
      }

      if (isSecret && author !== '비회원' && dataUserId !== userData?.userData?.userId) {
        setIsAlertDialogOpen(true);
        return;
      }
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
          <li className="list-none">
            <button
              aria-disabled={isSecret}
              className={cn(
                'group grid w-full items-baseline border-b border-stone-200 text-left transition-colors duration-150',
                'grid-cols-[16px_1fr] gap-x-2.5 gap-y-1 px-1 py-3.5',
                'md:grid-cols-[18px_1fr_auto] md:gap-x-3.5',
                'hover:bg-stone-50',
              )}
              data-testid={docId}
              type="button"
              onClick={handleOnClick}
            >
              {/* 자물쇠 (2행) */}
              <div className="row-span-2 flex items-center justify-center self-center text-gold">
                {isSecret && <LockIcon />}
              </div>

              {/* 제목 + 메타 */}
              <div className="flex min-w-0 items-baseline gap-x-3">
                <p
                  className={cn(
                    'min-w-0 truncate text-[15px] font-medium tracking-[-0.01em] text-stone-700 group-hover:text-stone-900',
                    isSecret && 'text-stone-400',
                  )}
                >
                  {isSecret ? '비밀글입니다' : title}
                </p>
                <div className="inline-flex shrink-0 items-center gap-2">
                  {spot && (
                    <span className="whitespace-nowrap rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10.5px] font-medium tracking-[0.06em] text-stone-500">
                      {spot}
                    </span>
                  )}
                  <span
                    className={cn(
                      'whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-medium tracking-[0.06em]',
                      author === '회원'
                        ? 'border-greenDeep/25 bg-greenDeep/10 text-greenDeep'
                        : 'border-stone-200 text-stone-400',
                    )}
                  >
                    {author}
                  </span>
                </div>
              </div>

              {/* 날짜 (데스크탑 전용) */}
              <p className="hidden self-start whitespace-nowrap font-serif text-[12.5px] tracking-[0.04em] text-stone-400 md:block">
                {createdAt}
              </p>

              {/* 미리보기 + 날짜(모바일) */}
              <div className="flex min-w-0 items-center justify-between gap-2">
                <p
                  className={cn(
                    'truncate text-[13px] tracking-[-0.005em] text-stone-500',
                    isSecret && 'text-stone-300',
                  )}
                >
                  {isSecret ? '비밀글입니다' : content}
                </p>
                <p className="shrink-0 whitespace-nowrap font-serif text-[11px] tracking-[0.04em] text-stone-400 md:hidden">
                  {createdAt}
                </p>
              </div>
            </button>
          </li>

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

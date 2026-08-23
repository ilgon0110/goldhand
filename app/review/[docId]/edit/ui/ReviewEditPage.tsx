/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  useConfirmPhoneAuthCode,
  usePhoneAuthCodeSendMutation,
  useRecaptcha,
} from '@/src/entities/phoneAuth';
import { reviewEditFormSchema, useGetReviewDetailData, useReviewFormMutation } from '@/src/entities/review';
import { useGetUserData } from '@/src/entities/user';
import { franchiseeList } from '@/src/shared/config';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/ui/alert-dialog';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { Editor } from '@/src/widgets/editor/ui/Editor';

type TReviewEditPageProps = {
  docId: string;
};

export const ReviewEditPage = ({ docId }: TReviewEditPageProps) => {
  const { data } = useGetReviewDetailData(docId);
  const { data: userData } = useGetUserData();
  const isAdmin = userData.userData?.grade === 'admin';
  const isGuestPost = data.data.userId == null;
  // 관리자가 비회원 글을 수정할 땐 SMS 재인증이 필요 없다.
  const requiresPhoneAuth = isGuestPost && !isAdmin;

  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const phoneIdTokenRef = useRef<string | null>(null);

  const form = useForm<z.infer<typeof reviewEditFormSchema>>({
    resolver: zodResolver(reviewEditFormSchema),
    defaultValues: requiresPhoneAuth
      ? {
          isGuestPost: true,
          title: data.data.title,
          name: data.data.name,
          franchisee: data.data.franchisee,
          phoneNumber: '',
          authCode: '',
        }
      : {
          isGuestPost: false,
          title: data.data.title,
          name: data.data.name,
          franchisee: data.data.franchisee,
        },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const phoneNumberError = !!form.formState.errors.phoneNumber;
  const authCodeError = !!form.formState.errors.authCode;

  useRecaptcha(PHONE_AUTH_RECAPTCHA_CONTAINER_ID);

  const {
    mutate: sendAuthCode,
    isPending: isSendingSms,
    sendSmsSuccessMessage,
  } = usePhoneAuthCodeSendMutation({
    onSuccess: res => {
      confirmationResultRef.current = res;
    },
    onError: () => {
      form.setError('phoneNumber', {
        type: 'manual',
        message: '인증번호 발송에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const handleSendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsAuthCodeOpen(true);
    sendAuthCode(form.getValues('phoneNumber') || '');
  };

  const {
    isSuccess: authCodeSuccess,
    mutate: confirmAuthCode,
    isPending: isConfirming,
    getErrorMessage,
  } = useConfirmPhoneAuthCode({
    onSuccess: async result => {
      phoneIdTokenRef.current = await result.user.getIdToken();
    },
  });

  const handleConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (authCodeSuccess) return;
    await confirmAuthCode(form.getValues('authCode') || '', confirmationResultRef.current);

    const errorMessage = getErrorMessage();
    if (errorMessage === 'auth/invalid-verification-code') {
      form.setError('authCode', {
        type: 'manual',
        message: '인증코드가 일치하지 않습니다.',
      });
    } else if (errorMessage) {
      form.setError('authCode', {
        type: 'manual',
        message: '알 수 없는 오류가 발생했습니다.',
      });
    }
  };

  const { onSubmit, handleChangeReviewFormEditor, isSubmitting, imageProgress, resetImageProgress, isOptimizing } =
    useReviewFormMutation('update', docId);

  const handleSubmit = form.handleSubmit(values => onSubmit(values, phoneIdTokenRef.current));
  const canSubmit = formValidation && (!requiresPhoneAuth || authCodeSuccess);

  return (
    <>
      {isOptimizing && <LoadingSpinnerOverlay text={`이미지 최적화 중...`} />}
      <SectionTitleHero description="후기를 수정할 수 있습니다." label="고운황금손 후기수정" />
      {requiresPhoneAuth && (
        <button aria-hidden="true" className="hidden" id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID} tabIndex={-1} />
      )}
      <Form {...form}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            defaultValue={data.data.name}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이름 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="후기에 표시될 이름이나 닉네임을 입력해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          {requiresPhoneAuth && (
            <>
              <PhoneAuthFields
                authCodeError={authCodeError}
                authCodeName="authCode"
                authCodeSuccess={authCodeSuccess}
                control={form.control}
                isAuthCodeOpen={isAuthCodeOpen}
                isConfirming={isConfirming}
                isSendingSms={isSendingSms}
                phoneNumberError={phoneNumberError}
                phoneNumberName="phoneNumber"
                sendSmsConfirmSuccessMessage={authCodeSuccess ? '인증코드가 확인되었습니다.' : ''}
                sendSmsSuccessMessage={sendSmsSuccessMessage}
                onConfirmClick={handleConfirmClick}
                onSendClick={handleSendClick}
              />
              <p className="text-xs text-slate-500">본인 확인을 위해 작성 시 사용한 휴대폰번호로 재인증해주세요.</p>
            </>
          )}
          <FormField
            control={form.control}
            defaultValue={data.data.title}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  제목 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="제목을 입력해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={data.data.franchisee}
            name="franchisee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  대리점 <span className="text-red-500">*</span>
                </FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger aria-label="대리점 선택">
                      <SelectValue placeholder="이용했던 대리점을 선택해주세요." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {franchiseeList.map(franchisee => {
                      return (
                        <SelectItem key={franchisee} value={franchisee}>
                          {franchisee}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs"></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Editor editable={true} htmlString={data.data.htmlString} onEditorChange={handleChangeReviewFormEditor} />
          <div className="flex w-full justify-between">
            <Button
              className={cn(
                'transition-all duration-300 ease-in-out',
                canSubmit ? '' : 'cursor-not-allowed opacity-20',
              )}
              disabled={!canSubmit}
              type="submit"
            >
              {isSubmitting ? <LoadingSpinnerIcon /> : '후기 수정하기'}
            </Button>
          </div>
        </form>
      </Form>
      {/* 이미지 업로드 진행 상황 모달 */}
      <AlertDialog open={imageProgress !== undefined} onOpenChange={resetImageProgress}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>업로드 진행 상황</AlertDialogTitle>
            <AlertDialogDescription>
              {imageProgress ? (
                <div className="w-full">
                  <div className="mb-2 text-sm">
                    {imageProgress.key} 업로드 진행률: {imageProgress.progress}%
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-200">
                    <div
                      className="h-4 rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
                      style={{ width: `${imageProgress.progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-sm">업로드 진행 상황이 없습니다.</div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>닫기</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

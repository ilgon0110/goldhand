/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
//import { Editor } from '@/src/widgets/editor/ui/Editor';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  useConfirmPhoneAuthCode,
  usePhoneAuthCodeSendMutation,
  useRecaptcha,
} from '@/src/entities/phoneAuth/client';
import { reviewFormSchema, useReviewFormMutation } from '@/src/entities/review';
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
import { Checkbox } from '@/src/shared/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { PrivacyModal } from '@/src/widgets/Privacy/ui/PrivacyModal';

const Editor = dynamic(() => import('@/src/widgets/editor/ui/Editor').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <LoadingSpinnerIcon />,
});

export const ReviewFormPage = () => {
  const { data: userData } = useGetUserData();
  const isGuestPost = userData.userData == null;
  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const phoneIdTokenRef = useRef<string | null>(null);

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: isGuestPost
      ? { isGuestPost: true, title: '', name: '', franchisee: '', phoneNumber: '', authCode: '', agreePersonalInfo: undefined }
      : { isGuestPost: false, title: '', name: '', franchisee: '' },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const phoneNumberError = !!form.formState.errors.phoneNumber;
  const authCodeError = !!form.formState.errors.authCode;

  useRecaptcha(PHONE_AUTH_RECAPTCHA_CONTAINER_ID);

  useEffect(() => {
    form.trigger();
  }, [form]);

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

  const { onSubmit, handleChangeReviewFormEditor, isSubmitting, isOptimizing, imageProgress, resetImageProgress } =
    useReviewFormMutation('create');

  const handleSubmit = form.handleSubmit(values => onSubmit(values, phoneIdTokenRef.current));

  const canSubmit = formValidation && (!isGuestPost || authCodeSuccess);

  return (
    <>
      {isOptimizing && <LoadingSpinnerOverlay text={`이미지 최적화 중...`} />}
      <SectionTitleHero description="후기를 작성할 수 있습니다." label="고운황금손 후기남기기" />
      <button aria-hidden="true" className="hidden" id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID} tabIndex={-1} />
      <Form {...form}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            defaultValue={''}
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
          {isGuestPost && (
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
              <p className="text-xs text-slate-500">동일한 대리점에는 24시간 내 1회만 후기를 작성할 수 있습니다.</p>
              <FormField
                control={form.control}
                name="agreePersonalInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      개인정보 수집 및 이용에 동의합니다.{' '}
                      <button
                        className="text-primary underline"
                        type="button"
                        onClick={() => setIsPrivacyModalOpen(true)}
                      >
                        자세히 보기
                      </button>
                    </FormLabel>
                    <FormMessage>{form.formState.errors.agreePersonalInfo?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <PrivacyModal isOpen={isPrivacyModalOpen} setIsOpen={setIsPrivacyModalOpen} />
            </>
          )}
          <FormField
            control={form.control}
            defaultValue={''}
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
            name="franchisee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  대리점 <span className="text-red-500">*</span>
                </FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger aria-label="대리점 선택" data-testid="franchisee-select-trigger">
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
          <Editor editable={true} onEditorChange={handleChangeReviewFormEditor} />
          <div className="flex w-full justify-between">
            <Button
              className={cn(
                'transition-all duration-300 ease-in-out',
                canSubmit ? '' : 'cursor-not-allowed opacity-20',
              )}
              disabled={!canSubmit}
              type="submit"
            >
              {isSubmitting || isOptimizing ? <LoadingSpinnerIcon /> : '후기 남기기'}
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

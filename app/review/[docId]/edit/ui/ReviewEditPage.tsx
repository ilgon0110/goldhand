/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import {
  reviewContentSchema,
  ReviewStepIndicator,
  useGetReviewDetailData,
  useReviewFormMutation,
} from '@/src/entities/review';
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
import { useImagesContext } from '@/src/widgets/editor/context/ImagesContext';
import { Editor } from '@/src/widgets/editor/ui/Editor';

import type { TGuestEditVerification } from './_GuestEditConfirmationStep';
import { GuestEditConfirmationStep } from './_GuestEditConfirmationStep';

type TReviewEditPageProps = {
  docId: string;
};

const maskPhoneNumber = (phoneNumber: string) => phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');

export const ReviewEditPage = ({ docId }: TReviewEditPageProps) => {
  const { data } = useGetReviewDetailData(docId);
  const { data: userData } = useGetUserData();
  const isAdmin = userData.userData?.grade === 'admin';
  const isGuestPost = data.data.userId == null;
  // 관리자가 비회원 글을 수정할 땐 SMS 재인증이 필요 없다.
  const requiresPhoneAuth = isGuestPost && !isAdmin;
  const [guestVerification, setGuestVerification] = useState<TGuestEditVerification | null>(null);
  const { setImages } = useImagesContext();

  const reviewDefaultValues = {
    title: data.data.title,
    name: data.data.name,
    franchisee: data.data.franchisee,
  };

  const form = useForm<z.infer<typeof reviewContentSchema>>({
    resolver: zodResolver(reviewContentSchema),
    defaultValues: reviewDefaultValues,
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;

  const { onSubmit, handleChangeReviewFormEditor, isSubmitting, imageProgress, resetImageProgress, isOptimizing } =
    useReviewFormMutation('update', docId);

  const handleSubmit = form.handleSubmit(values =>
    onSubmit({ ...values, isGuestPost: requiresPhoneAuth }, guestVerification?.phoneIdToken),
  );
  const canSubmit = formValidation;

  const handleRestartVerification = () => {
    setImages(null);
    resetImageProgress();
    form.reset(reviewDefaultValues);
    setGuestVerification(null);
  };

  return (
    <>
      {isOptimizing && <LoadingSpinnerOverlay text={`이미지 최적화 중...`} />}
      <SectionTitleHero description="후기를 수정할 수 있습니다." label="고운황금손 후기수정" />
      {requiresPhoneAuth && (
        <ReviewStepIndicator
          ariaLabel="후기 수정 단계"
          isVerified={guestVerification !== null}
          secondStepLabel="후기 수정"
        />
      )}
      {requiresPhoneAuth && !guestVerification ? (
        <GuestEditConfirmationStep docId={docId} onConfirmed={setGuestVerification} />
      ) : (
        <>
          {guestVerification && (
            <div
              aria-live="polite"
              className="mb-6 flex flex-col gap-3 rounded-lg border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">후기 수정</h2>
                <p className="mt-1 text-sm text-green-700">
                  인증 완료 · {maskPhoneNumber(guestVerification.phoneNumber)}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={handleRestartVerification}>
                다시 인증
              </Button>
            </div>
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
        </>
      )}
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

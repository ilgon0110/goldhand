'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { UploadMetadata } from 'firebase/storage';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import type { LexicalEditor } from 'lexical';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { franchiseeList } from '@/src/shared/config';
import { useAuthState } from '@/src/shared/hooks/useAuthState';
import type { IReviewDetailData } from '@/src/shared/types';
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
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { useImagesContext } from '@/src/widgets/editor/context/ImagesContext';
import { Editor } from '@/src/widgets/editor/ui/Editor';

import { reviewFormSchema } from '../config/reviewFormSchema';

type TReviewEditPageProps = {
  docId: string;
};

interface IReviewPostData {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export const ReviewEditPage = ({ docId }: TReviewEditPageProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ['reviewEdit', docId],
    queryFn: async () => {
      const response = await fetch(`/api/review/detail?docId=${docId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch review detail');
      }
      return response.json() as Promise<IReviewDetailData>;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (data.response !== 'ok') {
    throw new Error(data.message || 'Failed to fetch review data');
  }

  const router = useRouter();
  const { isLinked, userData } = useAuthState();

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: data.data.title || '',
      name: data.data.name || '',
      franchisee: data.data.franchisee || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewFormEditor, setReviewFormEditor] = useState<LexicalEditor>();
  const { images } = useImagesContext();
  const [imageProgress, setImagesProgress] = useState<{
    key: string;
    progress: number;
  }>();

  const onEditorChange = (edtior: LexicalEditor) => {
    setReviewFormEditor(edtior);
  };

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    // editor validation
    if (reviewFormEditor === undefined) return;
    reviewFormEditor.read(() => {
      const htmlString = $generateHtmlFromNodes(reviewFormEditor, null);
      const downloadedImages: { key: string; url: string }[] = [];

      if (isLinked && userData?.uid) {
        const storage = getStorage();
        // 이미지 있을 때 업로드 로직
        if (images != null && images.length > 0) {
          for (const image of images) {
            const metadata: UploadMetadata = {
              contentType: image.file.type,
              customMetadata: {
                userId: userData.uid,
              },
            };

            const imageRef = ref(storage, `reviews/${user.uid}/${docId}/${image.key}`);
            const uploadTask = uploadBytesResumable(imageRef, image.file, metadata);
            uploadTask.on(
              'state_changed',
              snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagesProgress({ key: image.file.name, progress });
              },
              error => {
                setImagesProgress(undefined);
                toastError('이미지 업로드 중 오류가 발생했습니다. : ' + error.message);
                downloadedImages.push({
                  key: image.key,
                  url: '',
                });
              },
              () => {
                setImagesProgress(undefined);
                getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
                  downloadedImages.push({
                    key: image.key,
                    url: downloadURL,
                  });
                  // 모든 이미지 업로드가 완료되면 서버에 요청
                  if (downloadedImages.length === images.length) {
                    setImagesProgress({
                      key: '이미지 업로드 완료. 잠시만 기다려주세요.',
                      progress: 100,
                    });
                    postReview(values, htmlString, docId, downloadedImages);
                  }
                });
              },
            );
          }
        } else {
          postReview(values, htmlString, docId, null);
        }
      }
    });
  };

  const postReview = async (
    formValues: {
      title: string;
      name: string;
      franchisee: string;
    },
    htmlString: string,
    docId: string,
    downloadedImages: { key: string; url: string }[] | null,
  ) => {
    try {
      const data: IReviewPostData = await (
        await fetch('/api/review/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formValues.name,
            title: formValues.title,
            franchisee: formValues.franchisee,
            htmlString,
            docId,
            images: downloadedImages,
          }),
        })
      ).json();

      if (data.response === 'ok') {
        toastSuccess('후기가 성공적으로 업로드되었습니다.\n잠시 후 작성후기로 이동합니다.');
        // 3초 후에 페이지 이동
        setTimeout(() => {
          router.replace(`/review/${docId}`);
        }, 3000);
      } else if (data.response === 'expired') {
        toastError('세션이 만료되었습니다. 잠시 후 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          router.replace('/login');
        }, 3000);
      } else if (data.response === 'unAuthorized') {
        toastError('권한이 없습니다. 잠시 후 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          router.replace('/login');
        }, 3000);
      }
    } catch (error) {
      toastError('후기 업로드 중 오류가 발생했습니다.');
      console.error(`후기 업로드 중 오류가 발생했습니다.\n${error}`);
    } finally {
      setIsSubmitting(false);
      setImagesProgress(undefined);
    }
  };

  return (
    <>
      <SectionTitle buttonTitle="" title="고운황금손 후기남기기" onClickButtonTitle={() => {}} />
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                    <SelectTrigger>
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
          <Editor editable={true} htmlString={data.data.htmlString} onEditorChange={onEditorChange} />
          <div className="flex w-full justify-between">
            <Button
              className={cn(
                'transition-all duration-300 ease-in-out',
                formValidation ? '' : 'cursor-not-allowed opacity-20',
              )}
              disabled={!formValidation}
              type="submit"
            >
              {isSubmitting ? <LoadingSpinnerIcon /> : '후기 수정하기'}
            </Button>
          </div>
        </form>
      </Form>
      {/* 이미지 업로드 진행 상황 모달 */}
      <AlertDialog open={imageProgress !== undefined} onOpenChange={() => setImagesProgress(undefined)}>
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

"use client";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";
import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import { Textarea } from "@/src/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { reviewFormSchema } from "../config/reviewFormSchema";
import { z } from "zod";
import { Input } from "@/src/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import { Button } from "@/src/shared/ui/button";
import { createRef, useState } from "react";
import { LoadingSpinnerIcon } from "@/src/shared/ui/loadingSpinnerIcon";
import { Editor } from "@/src/widgets/editor/ui/Editor";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import PlaygroundNodes from "@/src/widgets/editor/nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "@/src/widgets/editor/theme/PlaygroundEditorTheme";
import {
  $isTextNode,
  $parseSerializedNode,
  DOMConversionMap,
  EditorState,
  LexicalEditor,
  TextNode,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { toastError, toastSuccess } from "@/src/shared/utils";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  ImagesContext,
  useImagesContext,
} from "@/src/widgets/editor/context/ImagesContext";
import { firebaseApp } from "@/src/shared/config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/src/shared/ui/alert-dialog";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";

interface ReviewPostData {
  response: "ok" | "ng" | "expired" | "unAuthorized";
  message: string;
  docId?: string;
}

export const ReviewFormPage = () => {
  const router = useRouter();
  const app = firebaseApp;
  const auth = getAuth();
  const user = auth.currentUser;

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: "",
      name: "",
      franchisee: "",
    },
    mode: "onChange",
  });
  const formValidation = form.formState.isValid;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = createRef<ReCAPTCHA>();
  const [reviewFormEditor, setReviewFormEditor] = useState<LexicalEditor>();
  const { images } = useImagesContext();
  const [imageProgress, setImagesProgress] = useState<{
    key: string;
    progress: number;
  }>();
  console.log("images", images);
  const onEditorChange = (edtior: LexicalEditor) => {
    setReviewFormEditor(edtior);
  };

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    // editor validation
    if (reviewFormEditor === undefined) return;
    reviewFormEditor.read(() => {
      const htmlString = $generateHtmlFromNodes(reviewFormEditor, null);
      const downloadedImages: { key: string; url: string }[] = [];
      const docId = uuidv4();
      if (user) {
        const storage = getStorage();
        if (images != null && images.length > 0) {
          for (const image of images) {
            const imageRef = ref(
              storage,
              `reviews/${user.uid}/${docId}/${image.key}`
            );
            const metadata = {
              contentType: image.file.type,
            };

            const uploadTask = uploadBytesResumable(
              imageRef,
              image.file,
              metadata
            );
            console.log("uploadTask", uploadTask);
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagesProgress({ key: image.file.name, progress });
              },
              (error) => {
                setImagesProgress(undefined);
                toastError(
                  "이미지 업로드 중 오류가 발생했습니다. : " + error.message
                );
                downloadedImages.push({
                  key: image.key,
                  url: "",
                });
              },
              () => {
                setImagesProgress(undefined);
                getDownloadURL(uploadTask.snapshot.ref).then(
                  async (downloadURL) => {
                    downloadedImages.push({
                      key: image.key,
                      url: downloadURL,
                    });
                    console.log("downloadedImages", downloadedImages);
                    // 모든 이미지 업로드가 완료되면 서버에 요청
                    if (downloadedImages.length === images.length) {
                      setImagesProgress({
                        key: "이미지 업로드 완료. 잠시만 기다려주세요.",
                        progress: 100,
                      });
                      console.log("모든 이미지 업로드 완료", downloadedImages);
                      try {
                        const data: ReviewPostData = await (
                          await fetch("/api/review/create", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              name: values.name,
                              title: values.title,
                              franchisee: values.franchisee,
                              htmlString,
                              docId,
                              images: downloadedImages,
                            }),
                          })
                        ).json();

                        if (data.response === "ok") {
                          toastSuccess(
                            "후기가 성공적으로 업로드되었습니다.\n잠시 후 작성후기로 이동합니다."
                          );
                          // 3초 후에 페이지 이동
                          setTimeout(() => {
                            router.replace(`/review/${data.docId}`);
                          }, 3000);
                        } else if (data.response === "expired") {
                          toastError(
                            "세션이 만료되었습니다. 잠시 후 로그인 페이지로 이동합니다."
                          );
                          setTimeout(() => {
                            router.replace("/login");
                          }, 3000);
                        } else if (data.response === "unAuthorized") {
                          toastError(
                            "권한이 없습니다. 잠시 후 로그인 페이지로 이동합니다."
                          );
                          setTimeout(() => {
                            router.replace("/login");
                          }, 3000);
                        }
                      } catch (error) {
                        toastError("후기 업로드 중 오류가 발생했습니다.");
                        console.error(
                          `후기 업로드 중 오류가 발생했습니다.\n${error}`
                        );
                      } finally {
                        setIsSubmitting(false);
                        setImagesProgress(undefined);
                      }
                    }
                  }
                );
              }
            );
          }
        }
      }
    });
  };

  return (
    <>
      <SectionTitle title="고운황금손 후기남기기" buttonTitle="" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            defaultValue={""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이름 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="후기에 표시될 이름이나 닉네임을 입력해주세요."
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            defaultValue={""}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="이용했던 대리점을 선택해주세요." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="화성동탄점">화성동탄점</SelectItem>
                    <SelectItem value="수원점">수원점</SelectItem>
                    <SelectItem value="용인점">용인점</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs"></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Editor onEditorChange={onEditorChange} editable={true} />
          <div className="flex w-full justify-between">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              size="invisible"
            />
            <Button
              type="submit"
              disabled={!formValidation}
              className={cn(
                "duration-300 transition-all ease-in-out",
                formValidation ? "" : "cursor-not-allowed opacity-20"
              )}
            >
              {isSubmitting ? <LoadingSpinnerIcon /> : "후기 남기기"}
            </Button>
          </div>
        </form>
      </Form>
      {/* 이미지 업로드 진행 상황 모달 */}
      <AlertDialog
        open={imageProgress !== undefined}
        onOpenChange={() => setImagesProgress(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>업로드 진행 상황</AlertDialogTitle>
            <AlertDialogDescription>
              {imageProgress ? (
                <div className="w-full">
                  <div className="text-sm mb-2">
                    {imageProgress.key} 업로드 진행률: {imageProgress.progress}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
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

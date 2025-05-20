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
import { ImageBoxRef } from "./ImageBox";
import { LoadingSpinnerIcon } from "@/src/shared/ui/loadingSpinnerIcon";
import { Editor } from "@/src/widgets/editor/ui/Editor";

export const ReviewFormPage = () => {
  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: "",
      name: "",
      franchisee: "",
      images: { fileArray: [] },
      content: "",
    },
    mode: "onChange",
  });
  const formValidation = form.formState.isValid;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = createRef<ReCAPTCHA>();
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviewImages = newFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newFiles]);
      setPreviewImages((prev) => [...prev, ...newPreviewImages]);
    }
  };

  console.log("images", images);
  console.log("previewImages", previewImages);

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {};
  return (
    <div>
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
          <FormField
            control={form.control}
            name="images"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>사진 업로드</FormLabel>
                <FormControl>
                  {/* <ImageBoxRef
                    placeholder="사진 업로드"
                    {...rest}
                    accept=".jpeg,.jpg,.png,.gif"
                    onChange={onImageChange}
                    ref={rest.ref}
                    previewImages={previewImages}
                  /> */}
                </FormControl>
                <FormDescription className="text-xs"></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
      <Editor />
    </div>
  );
};

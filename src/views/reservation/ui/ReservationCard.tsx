"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/src/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import TruncateText from "@/src/shared/ui/TruncateText";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { detailFormSchema } from "../list/config/detailFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/shared/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastError } from "@/src/shared/utils";

type ReservationCardProps = {
  docId: string;
  title: string;
  author: string;
  createdAt: string;
  spot: string;
  isSecret: boolean;
  content: string;
};

export const ReservationCard = ({
  docId,
  title,
  author,
  createdAt,
  spot,
  isSecret,
  content,
}: ReservationCardProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof detailFormSchema>>({
    resolver: zodResolver(detailFormSchema),
    defaultValues: {
      password: "",
    },
    mode: "onChange",
  });
  const formValidation = form.formState.isValid;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (isSecret) return;

    // 비밀글이 아닌 경우 상세 페이지로 이동
    router.push(`/reservation/list/${docId}?password=${""}`);
  };

  // 비밀글인 경우 비밀번호 검증 후 상세 페이지로 이동
  const onSubmit = async (values: z.infer<typeof detailFormSchema>) => {
    if (!formValidation) {
      toastError("비밀번호가 틀립니다.");
      return;
    }
    // 비밀번호 검증 후 상세 페이지로 이동
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/consultDetail/password?docId=${docId}&password=${values.password}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log("data", data.response);
      if (data.response === "ok") {
        router.push(`/reservation/list/${docId}?password=${values.password}`);
      } else {
        toastError("비밀번호가 틀립니다.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toastError("비밀번호 검증 중 서버 오류가 발생하였습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog>
        <button
          className={cn(
            "border-b border-gray-200 p-4 gap-3 flex-row flex flex-1 overflow-hidden w-full relative"
          )}
          onClick={handleOnClick}
          aria-disabled={isSecret}
        >
          {isSecret && author === "비회원" && (
            <DialogTrigger asChild>
              <div className="w-full h-full absolute top-0 left-0 bg-transparent z-10" />
            </DialogTrigger>
          )}
          {isSecret && (
            <div className="absolute top-6 right-6 group-hover:fill-[#FFFFFF]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="current"
                className="w-6 h-6"
              >
                <path d="M220-80q-24.75 0-42.37-17.63Q160-115.25 160-140v-434q0-24.75 17.63-42.38Q195.25-634 220-634h70v-96q0-78.85 55.61-134.42Q401.21-920 480.11-920q78.89 0 134.39 55.58Q670-808.85 670-730v96h70q24.75 0 42.38 17.62Q800-598.75 800-574v434q0 24.75-17.62 42.37Q764.75-80 740-80H220Zm0-60h520v-434H220v434Zm260.17-140q31.83 0 54.33-22.03T557-355q0-30-22.67-54.5t-54.5-24.5q-31.83 0-54.33 24.5t-22.5 55q0 30.5 22.67 52.5t54.5 22ZM350-634h260v-96q0-54.17-37.88-92.08-37.88-37.92-92-37.92T388-822.08q-38 37.91-38 92.08v96ZM220-140v-434 434Z" />{" "}
              </svg>
            </div>
          )}
          {
            <div>
              <div className="text-lg font-bold text-start">
                <TruncateText
                  text={isSecret ? "비밀글입니다" : title}
                  maxLines={1}
                />
              </div>
              <div className="flex gap-2 w-full mt-[1px] text-sm">
                <span>
                  <TruncateText text={spot} maxLines={1} />
                </span>
                <span className="text-gray-800">
                  <TruncateText text={author} maxLines={1} />
                </span>
                <span className="text-gray-500">
                  <TruncateText text={createdAt} maxLines={1} />
                </span>
              </div>
              <div className="text-gray-800 text-start text-sm mt-2">
                <TruncateText
                  text={isSecret ? "비밀글입니다" : content}
                  maxLines={1}
                />
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                defaultValue={""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isSubmitting ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "확인"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

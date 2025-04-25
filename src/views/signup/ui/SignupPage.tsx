"use client";

import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  UserCredential,
  deleteUser,
} from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useRecaptcha } from "../hooks/useRecaptcha";
import { PhoneAuthProvider, linkWithCredential } from "firebase/auth";
import { toastError, toastSuccess } from "@/src/shared/utils";
import { useRouter } from "next/navigation";
import { formSchema } from "../config/formSchema";

interface IUserData {
  response: string;
  message: string;
  accessToken: string | null;
  userData: {
    phoneNumber: string;
    email: string;
    provider: string;
    point: number;
    uid: string;
    grade: string;
    createdAt: { seconds: number; nanoseconds: number };
    nickname: string;
    name: string;
    updatedAt: { seconds: number; nanoseconds: number };
  } | null;
}

interface SignUpResponse {
  response: string;
  message: string;
  redirectTo: string;
  user: UserCredential | null;
  accessToken: string | null;
}

export const SignupPage = ({ userData }: { userData: IUserData }) => {
  const router = useRouter();
  const auth = getAuth();
  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const [sendSmsSuccessMessage, setSendSmsSuccessMessage] = useState("");
  const [SmsConfirmSuccessMessage, setSmsConfirmSuccessMessage] = useState("");
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confirmationResultRef = useRef<any>(null);
  const { initializeRecaptcha } = useRecaptcha("sign-in-button");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData?.userData?.name || "",
      nickname: userData?.userData?.nickname || "",
      phoneNumber: userData?.userData?.phoneNumber || "",
      email: userData?.userData?.email || "",
    },
    mode: "onChange",
  });
  const formValidation = form.formState.isValid;
  const phoneNumberError = !!form.formState.errors.phoneNumber;
  const authCodeError = !!form.formState.errors.authCode;

  console.log("formValidation: ", formValidation);
  console.log("phoneNumberError: ", phoneNumberError);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!formValidation) return;
    if (!!SmsConfirmSuccessMessage === false) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });
      if (!res.ok) {
        throw new Error("회원가입 실패");
      }
      const result = await res.json();
      if (result.response === "ok") {
        toastSuccess("회원가입 성공!\n잠시 후 메인 페이지로 이동합니다.");
        setTimeout(() => {
          router.replace("/");
        }, 3000);
      } else {
        toastError("회원가입 실패\n다시 시도해주세요.");
        setTimeout(() => {
          router.refresh();
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error during form submission:", error);
      toastError(`회원가입 중 오류가 발생했습니다.\n${error.message}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }

    console.log("values: ", values);
  };

  const handleSignInPhoneNumber = useCallback(
    async (phoneNumber: string) => {
      setIsSendingSms(true);

      phoneNumber = `+82${phoneNumber.substring(1)}`;
      try {
        if (!window.recaptchaVerifier) {
          initializeRecaptcha();
        }
        const appVerifier = window.recaptchaVerifier;
        if (!appVerifier) {
          throw new Error("RecaptchaVerifier is not initialized");
        }

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier
        );
        if (confirmationResult) {
          console.log("SMS sent successfully");
          setSendSmsSuccessMessage("인증번호가 발송되었습니다.");
          confirmationResultRef.current = confirmationResult;
        }
      } catch (error) {
        console.error("Error during signInWithPhoneNumber:", error);
        form.setError("phoneNumber", {
          type: "manual",
          message: "인증번호 발송에 실패했습니다. 다시 시도해주세요.",
        });

        initializeRecaptcha();
      } finally {
        setIsSendingSms(false);
      }
    },
    [form]
  );

  const handleAuthClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsAuthCodeOpen(true);
    // 인증번호 발송 버튼 클릭 시
    handleSignInPhoneNumber(form.getValues().phoneNumber);
  };

  const handleAuthConfirmClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault(); // 항상 최상단에서 방지
      setIsConfirming(true);

      const authCode = form.getValues().authCode;
      const confirmationResult = confirmationResultRef.current;

      if (!confirmationResult) {
        console.error("No confirmation result found.");
        return;
      }

      try {
        const { user } = await confirmationResult.confirm(authCode);
        if (user) {
          // 인증코드 확인 후, 전화번호를 현재 로그인된 계정에 연결
          try {
            if (userData.userData && auth.currentUser) {
              // ✅ 1. 전화번호 인증 -> 로그인됨 (새로운 유저)
              const phoneCredential = PhoneAuthProvider.credential(
                confirmationResult.verificationId,
                authCode
              );

              // ✅ 2. 전화번호 유저 삭제
              await deleteUser(auth.currentUser);

              // ✅ 3. 다시 이메일 유저 로그인
              const emailUser = await signInWithEmailAndPassword(
                auth,
                userData.userData.email,
                process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!
              );

              // ✅ 4. 이메일 유저에 전화번호 연결
              const linkedResult = await linkWithCredential(
                emailUser.user,
                phoneCredential
              );

              if (linkedResult) {
                setSmsConfirmSuccessMessage("인증코드가 확인되었습니다.");
                console.log("🔗 계정 연결 성공");
              }
            } else {
              form.setError("authCode", {
                type: "manual",
                message:
                  "전화번호 인증 계정이 조회되지 않습니다. 처음부터 다시 시도해주세요.",
              });
            }
          } catch (error: any) {
            console.error("Error linking phone number:", error);
            form.setError("authCode", {
              type: "manual",
              message:
                "이메일과 전화번호 연동에 실패했습니다. 처음부터 다시 시도해주세요.",
            });
          }
        }
      } catch (error: any) {
        console.error("Error confirming SMS code:", error);
        if (error.code === "auth/invalid-verification-code") {
          form.setError("authCode", {
            type: "manual",
            message: "인증코드가 일치하지 않습니다.",
          });
        } else {
          form.setError("authCode", {
            type: "manual",
            message: "알 수 없는 오류가 발생했습니다.",
          });
        }
      } finally {
        setIsConfirming(false);
      }
    },
    [form, confirmationResultRef]
  );

  useEffect(() => {
    form.trigger();
  }, []);

  console.log(form.formState.errors);
  return (
    <div>
      <SectionTitle title="고운황금손 회원가입" buttonTitle="" />
      <button id="sign-in-button" className="hidden" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            defaultValue={userData?.userData?.name || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="이름을 입력하세요." {...field} required />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            defaultValue={userData?.userData?.nickname || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input placeholder="닉네임을 입력하세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            defaultValue={userData?.userData?.phoneNumber || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대폰번호</FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-6">
                    <Input
                      placeholder="휴대폰번호를 입력해주세요. (예:01012345678)"
                      {...field}
                      required
                      minLength={6}
                      maxLength={12}
                    />
                    <Button
                      onClick={(e) => handleAuthClick(e)}
                      disabled={phoneNumberError}
                      className={cn(
                        "transition-all duration-300 ease-in-out",
                        phoneNumberError && "opacity-20 cursor-not-allowed",
                        sendSmsSuccessMessage && "bg-green-500"
                      )}
                    >
                      {isSendingSms ? (
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
                      ) : sendSmsSuccessMessage != "" ? (
                        "인증번호 발송완료"
                      ) : (
                        "인증받기"
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>{sendSmsSuccessMessage}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isAuthCodeOpen && (
            <FormField
              control={form.control}
              name="authCode"
              defaultValue={""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>인증코드</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-6">
                      <Input
                        placeholder="수신받은 인증코드를 입력해주세요."
                        {...field}
                        minLength={6}
                        maxLength={6}
                      />
                      <Button
                        onClick={(e) => handleAuthConfirmClick(e)}
                        disabled={authCodeError}
                        className={cn(
                          "transition-all duration-300 ease-in-out",
                          authCodeError && "opacity-20 cursor-not-allowed",
                          SmsConfirmSuccessMessage && "bg-green-500"
                        )}
                      >
                        {isConfirming ? (
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
                        ) : SmsConfirmSuccessMessage == "" ? (
                          "인증하기"
                        ) : (
                          "인증확인"
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>{SmsConfirmSuccessMessage}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            defaultValue={userData?.userData?.email || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="이메일을 입력해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!formValidation}
            className={cn(
              "duration-300 transition-all ease-in-out",
              formValidation ? "" : "cursor-not-allowed opacity-20"
            )}
          >
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
              "회원가입"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

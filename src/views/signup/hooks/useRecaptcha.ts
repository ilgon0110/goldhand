"use client";

import { useEffect, useRef, useCallback } from "react";
import { RecaptchaVerifier, getAuth, ConfirmationResult } from "firebase/auth";
import { firebaseApp } from "@/src/shared/config/firebase";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    confirmationResult: ConfirmationResult;
  }
}

export function useRecaptcha(containerId: string = "recaptcha-container") {
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  // 초기화 함수
  const initializeRecaptcha = useCallback(() => {
    const app = firebaseApp;
    const auth = getAuth();
    auth.languageCode = "ko";

    if (!window.recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, containerId, {
          size: "invisible", // 또는 'normal'
          callback: (response: string) => {
            console.log("reCAPTCHA solved:", response);
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired. Resetting...");
            verifier.clear();
          },
        });

        verifier.render().then((widgetId) => {
          console.log("reCAPTCHA rendered with widgetId:", widgetId);
        });

        window.recaptchaVerifier = verifier;
        recaptchaRef.current = verifier;
      } catch (error) {
        console.error("reCAPTCHA initialization error:", error);
      }
    }
  }, [containerId]);

  // 초기화 & 언마운트 시 정리
  useEffect(() => {
    initializeRecaptcha();

    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
        window.recaptchaVerifier = null;
        console.log("reCAPTCHA cleared on unmount");
      }
    };
  }, [initializeRecaptcha]);

  return { initializeRecaptcha };
}

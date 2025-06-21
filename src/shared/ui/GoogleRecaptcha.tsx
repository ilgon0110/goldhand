'use client';

import type { ReactNode } from 'react';
import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const MyGoogleCaptcha = ({ children }: { children: ReactNode }) => {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

  return <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>{children}</GoogleReCaptchaProvider>;
};

export default MyGoogleCaptcha;

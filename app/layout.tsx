import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ToastContainer } from 'react-toastify';

import { QueryProvider } from '@/src/app/providers/query-provider';
import { ThemeProvider } from '@/src/app/providers/theme-provider';
import { Footer } from '@/src/widgets/footer';
import { Header } from '@/src/widgets/header';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    naver: any;
    kakao: any;
  }
}

const pretendard = localFont({
  src: [
    {
      path: './fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard-Medium.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '고운황금손',
  description: '고운황금손 공식 홈페이지',
  icons: {
    icon: '/favicon-96x96.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className={`${pretendard.className} relative`}>
          <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
            <NuqsAdapter>
              <QueryProvider>
                <Header />
                {children}
              </QueryProvider>
            </NuqsAdapter>
            <Footer />
            <ToastContainer />
          </ThemeProvider>
          <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="beforeInteractive" />
          <Script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js" strategy="beforeInteractive" />
          <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`}></Script>
        </body>
      </html>
    </>
  );
}

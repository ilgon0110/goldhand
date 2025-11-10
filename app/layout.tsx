import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

import { QueryProvider } from '@/src/app/providers/query-provider';
import { ThemeProvider } from '@/src/app/providers/theme-provider';
import { EventModal } from '@/src/widgets/event/ui/EventModal';
import { Footer } from '@/src/widgets/footer';
import { Header } from '@/src/widgets/header';

const pretendard = localFont({
  src: [
    { path: '../public/fonts/Pretendard-Regular.subset.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Pretendard-Medium.subset.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/Pretendard-Bold.subset.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '고운황금손 수원산후도우미',
  description: '보건복지부 산후도우미, 정부지원 바우처 서비스 수원 산모신생아 케어 전문기업 고운황금손',
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
      <html className={`${pretendard.variable} font-pretendard`} lang="ko" suppressHydrationWarning>
        <body className="relative">
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
              <NuqsAdapter>
                <QueryProvider>
                  <Header />
                  <EventModal />
                  {children}
                </QueryProvider>
              </NuqsAdapter>
              <Footer />
              <ToastContainer />
            </ThemeProvider>
          </Suspense>
          <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="beforeInteractive" />
          <Script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js" strategy="beforeInteractive" />
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`}
            strategy="lazyOnload"
          ></Script>
        </body>
      </html>
    </>
  );
}

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

const pretendard = localFont({
  src: [
    { path: './fonts/Pretendard-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Pretendard-Medium.woff2', weight: '600', style: 'normal' },
    { path: './fonts/Pretendard-Bold.woff2', weight: '700', style: 'normal' },
    { path: './fonts/Pretendard-Black.woff2', weight: '900', style: 'normal' },
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
  const isDev = process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production';
  return (
    <>
      <html className={`${isDev ? null : pretendard.variable}`} lang="en">
        <body className={`relative`}>
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
          <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="lazyOnload" />
          <Script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js" strategy="lazyOnload" />
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`}
            strategy="lazyOnload"
          ></Script>
          {/* ✅ DEV 모드에서는 fallback 폰트 스타일을 추가 */}
          {isDev && (
            <style
              dangerouslySetInnerHTML={{
                __html: `
                @font-face {
                  font-family: 'Pretendard';
                  src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
                  font-weight: 400;
                  font-style: normal;
                  font-display: swap;
                }
                @font-face {
                  font-family: 'Pretendard';
                  src: url('/fonts/Pretendard-Medium.woff2') format('woff2');
                  font-weight: 600;
                  font-style: normal;
                  font-display: swap;
                }
                @font-face {
                  font-family: 'Pretendard';
                  src: url('/fonts/Pretendard-Bold.woff2') format('woff2');
                  font-weight: 700;
                  font-style: normal;
                  font-display: swap;
                }
                @font-face {
                  font-family: 'Pretendard';
                  src: url('/fonts/Pretendard-Black.woff2') format('woff2');
                  font-weight: 900;
                  font-style: normal;
                  font-display: swap;
                }
                .font-pretendard { font-family: 'Pretendard', sans-serif; }
              `,
              }}
            />
          )}
        </body>
      </html>
    </>
  );
}

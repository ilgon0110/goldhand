import './globals.css';

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import localFont from 'next/font/local';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

import QueryProvider from '@/src/app/providers/query-provider';
import { ThemeProvider } from '@/src/app/providers/theme-provider';
import { OAuthSuccessHandler } from '@/src/shared/ui/OAuthSuccessHandler';
import { Header } from '@/src/widgets/header';

const Footer = dynamic(() => import('@/src/widgets/footer/ui/footer').then(mod => mod.Footer), { ssr: false });

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
  metadataBase: new URL('https://nicegoldhand.com'),
  title: {
    default: '수원 산후도우미 고운황금손 | 광교·용인 산모신생아 케어',
    template: '%s | 고운황금손',
  },
  description: '보건복지부 인증 수원 산후도우미 고운황금손. 광교·용인·수원 전지역 정부바우처 산모신생아 돌봄 서비스.',
  keywords: [
    '수원산후도우미',
    '광교산후도우미',
    '용인산후도우미',
    '산후도우미',
    '산모신생아케어',
    '정부바우처',
    '보건복지부인증',
  ],
  icons: { icon: '/favicon-96x96.png' },
  alternates: {
    canonical: 'https://nicegoldhand.com',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://nicegoldhand.com',
    siteName: '고운황금손',
    title: '수원 산후도우미 고운황금손 | 광교·용인 산모신생아 케어',
    description: '보건복지부 인증 수원 산후도우미 고운황금손. 광교·용인·수원 전지역 정부바우처 산모신생아 돌봄 서비스.',
    images: [{ url: '/logo_green.png', width: 128, height: 36, alt: '고운황금손 로고' }],
  },
  twitter: {
    card: 'summary',
    title: '수원 산후도우미 고운황금손',
    description: '보건복지부 인증 수원 산후도우미 고운황금손. 광교·용인 산모신생아 돌봄 서비스.',
  },
  verification: {
    other: {
      'naver-site-verification': '0c571a1af17055e0ff6ba71e658f7fe8672ddb22',
    },
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: '고운황금손',
  description: '보건복지부 인증 수원 산후도우미 전문기업. 광교·용인·수원 정부바우처 산모신생아 돌봄 서비스.',
  url: 'https://nicegoldhand.com',
  telephone: '010-4437-0431',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '경기 수원시 팔달구 인계로124번길 19 9층 903호',
    addressLocality: '수원시',
    addressRegion: '경기도',
    addressCountry: 'KR',
  },
  areaServed: ['수원시', '용인시', '광교'],
  serviceType: '산후도우미',
  image: 'https://nicegoldhand.com/logo_green.png',
  sameAs: [
    'https://youtube.com/channel/UCQPWd5YKHGfxXAB8i35piEg',
    'https://blog.naver.com/goldhandkorea',
    'https://www.instagram.com/goldhandkorea/',
  ],
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: '산모 고객' },
      reviewBody:
        '고운황금손 업체 화성에서 유명한데 수원에도 열었다는 소식 듣고 이용했습니다. 초산이라 솔직히 걱정이 많았는데, 기대이상으로 너무 잘이용했네요 ㅠㅠ 아기 진심을 다해서 사랑으로 대해주시는 관리사님 보내주서서 정말 감사했습니다!!',
    },
  ],
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${pretendard.variable} font-pretendard`} lang="ko" suppressHydrationWarning>
      <body className="relative">
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} type="application/ld+json" />
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
            <NuqsAdapter>
              <QueryProvider>
                <OAuthSuccessHandler />
                <Header />
                <main>{children}</main>
              </QueryProvider>
            </NuqsAdapter>
            <Footer />
            <ToastContainer />
          </ThemeProvider>
        </Suspense>
        <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="lazyOnload" />
        <Script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js" strategy="lazyOnload" />
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/app/providers/theme-provider";
import { Header } from "@/src/widgets/header";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Footer } from "@/src/widgets/footer";
import Script from "next/script";

declare global {
  interface Window {
    naver: any;
    kakao: any;
  }
}

const inter = Inter({ subsets: ["latin"] });
const pretendard = localFont({
  src: [
    {
      path: "./fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Medium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "고운황금손",
  description: "고운황금손 공식 홈페이지",
  icons: {
    icon: "/favicon-96x96.png",
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
        <body className={`${pretendard.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <Header />
              {children}
            </NuqsAdapter>
            <Footer />
          </ThemeProvider>
          <Script
            src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
            strategy="beforeInteractive"
          />
        </body>
      </html>
    </>
  );
}

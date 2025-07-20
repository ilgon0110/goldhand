'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { IMyPageResponseData } from '@/src/shared/types';
import { MyPageNotYetSignIn } from '@/src/widgets/MyPageWidget';
import { MyPageWithSignIn } from '@/src/widgets/MyPageWidget/ui/MyPageWithSignIn';

type TMyPageDataProps = {
  myPageData: IMyPageResponseData;
};

export const MyPagePage = ({ myPageData }: TMyPageDataProps) => {
  const client = new QueryClient();

  // Oauth 로그인은 했지만 회원가입은 안한 상태
  if (!!myPageData.data.userData == true && !myPageData.data.isLinked) {
    return (
      <QueryClientProvider client={client}>
        <MyPageNotYetSignIn provider={myPageData.data.userData.provider} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={client}>
      <MyPageWithSignIn myPageData={myPageData} />
    </QueryClientProvider>
  );
};

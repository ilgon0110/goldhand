'use client';

import type { IMyPageResponseData } from '@/src/shared/types';
import { MyPageNotYetSignIn } from '@/src/widgets/MyPageWidget';
import { MyPageWithSignIn } from '@/src/widgets/MyPageWidget/ui/MyPageWithSignIn';

type TMyPageDataProps = {
  myPageData: IMyPageResponseData;
};

export const MyPagePage = ({ myPageData }: TMyPageDataProps) => {
  // Oauth 로그인은 했지만 회원가입은 안한 상태
  if (!!myPageData.data.userData == true && !myPageData.data.isLinked) {
    return <MyPageNotYetSignIn provider={myPageData.data.userData.provider} />;
  }

  return <MyPageWithSignIn myPageData={myPageData} />;
};

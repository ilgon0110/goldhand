'use client';

import { useState } from 'react';

import { MyPageInfoCard, MyPagePostList, WithdrawalModal } from '@/src/feature/mypage';
import type { IMyPageResponseData } from '@/src/shared/types';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

type TMyPageDataProps = {
  myPageData: IMyPageResponseData;
};

export const MyPagePage = ({ myPageData }: TMyPageDataProps) => {
  const [withDrawalModalOpen, setWithDrawalModalOpen] = useState(false);

  return (
    <>
      <WithdrawalModal isOpen={withDrawalModalOpen} setIsOpen={setWithDrawalModalOpen} />
      <SectionTitleHero description="내 정보와 그동안 남기신 글을 확인할 수 있습니다." label="고운황금손 마이페이지" />
      <MyPageInfoCard handleWithdrawModalOpen={() => setWithDrawalModalOpen(true)} myPageData={myPageData} />
      <MyPagePostList myPageData={myPageData} />
    </>
  );
};

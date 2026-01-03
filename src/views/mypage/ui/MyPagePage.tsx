'use client';

import { useState } from 'react';

import { MyPageInfoCard, MyPagePostList, WithdrawalModal } from '@/src/feature/mypage';
import type { IMyPageResponseData } from '@/src/shared/types';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

type TMyPageDataProps = {
  myPageData: IMyPageResponseData;
};

export const MyPagePage = ({ myPageData }: TMyPageDataProps) => {
  const [withDrawalModalOpen, setWithDrawalModalOpen] = useState(false);

  return (
    <>
      <WithdrawalModal isOpen={withDrawalModalOpen} setIsOpen={setWithDrawalModalOpen} />
      <SectionTitle title="고운황금손 마이페이지" />
      <MyPageInfoCard handleWithdrawModalOpen={() => setWithDrawalModalOpen(true)} myPageData={myPageData} />
      <MyPagePostList myPageData={myPageData} />
    </>
  );
};

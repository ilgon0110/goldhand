import { useRouter } from 'next/navigation';

import type { IUserDetailData } from '@/src/shared/types';
import { AnimateModal } from '@/src/shared/ui/AnimateModal';
import { Button } from '@/src/shared/ui/button';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { formatDateToYMD, toastError, toastSuccess } from '@/src/shared/utils';

import { useRejoinMutation } from '../hooks/useRejoinMutation';

type TRejoinModalProps = {
  isRejoinDialogOpen: boolean;
  setIsRejoinDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rejoinUserData: IUserDetailData | undefined;
  setRejoinUserData: React.Dispatch<React.SetStateAction<IUserDetailData | undefined>>;
};

export const RejoinModal = ({
  isRejoinDialogOpen,
  setIsRejoinDialogOpen,
  rejoinUserData,
  setRejoinUserData,
}: TRejoinModalProps) => {
  const router = useRouter();
  const { mutate: rejoinMutate, isPending } = useRejoinMutation(rejoinUserData?.userId, {
    onSuccess: data => {
      if (data.response === 'ok') {
        toastSuccess('재가입이 완료되었습니다.');
        router.replace('/');
      } else {
        toastError(data.message || '재가입에 실패했습니다. 다시 시도해주세요.');
      }
    },
    onError: error => {
      console.error('재가입 중 오류 발생:', error);
      toastError('재가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
    onSettled: () => {
      setIsRejoinDialogOpen(false);
      setRejoinUserData(undefined);
      router.replace('/');
    },
  });

  const handleRejoin = async () => {
    setIsRejoinDialogOpen(false);
    if (!rejoinUserData) return;
    rejoinMutate();
  };

  return (
    <>
      <AnimateModal isOpen={isRejoinDialogOpen} setIsOpen={setIsRejoinDialogOpen}>
        {isPending && <LoadingSpinnerOverlay text="재가입 중..." />}
        <p className="mb-2">고운황금손에 재가입하시겠습니까?</p>
        <p className="mb-2 text-sm lg:text-base">기존 계정 정보</p>
        <p className="mb-2 text-sm lg:text-base">가입일시 : {formatDateToYMD(rejoinUserData?.createdAt)}</p>
        <p className="mb-2 text-sm lg:text-base">탈퇴일시 : {formatDateToYMD(rejoinUserData?.deletedAt)}</p>
        <p className="mb-2 text-sm lg:text-base">이메일 : {rejoinUserData?.email || '이메일 없음'}</p>
        <p className="mb-2 text-sm lg:text-base">전화번호 : {rejoinUserData?.phoneNumber || '전화번호 없음'}</p>
        <p className="mb-2 text-sm lg:text-base">이름 : {rejoinUserData?.name || '이름 없음'}</p>
        <p className="text-sm text-gray-500">
          확인을 누르시면 고운황금손에 재가입됩니다. 재가입 후에는 기존의 탈퇴 기록이 복구되며, 이전에 사용하던 계정
          정보(이메일, 전화번호 등)로 다시 로그인할 수 있습니다.
        </p>
        <div className="absolute bottom-4 right-4 mt-4 flex w-full justify-end gap-2">
          <Button onClick={handleRejoin}>재가입</Button>
          <Button variant="outline" onClick={() => setIsRejoinDialogOpen(false)}>
            닫기
          </Button>
        </div>
      </AnimateModal>
    </>
  );
};

import type { CheckedState } from '@radix-ui/react-checkbox';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';

import { cn } from '@/lib/utils';
import { AnimateModal } from '@/src/shared/ui/AnimateModal';
import { Button } from '@/src/shared/ui/button';
import { Checkbox } from '@/src/shared/ui/checkbox';
import { Label } from '@/src/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { privacyContent, privacyVersionDateList } from '@/src/widgets/Privacy';

import { useWithdrawalMutation } from '../hooks/useWithdrawalMutation';

type TWithdrawalModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function WithdrawalModal({ isOpen, setIsOpen }: TWithdrawalModalProps) {
  const router = useRouter();
  const [date, setDate] = useState(privacyVersionDateList[0].date);
  const [isChecked, setIsChecked] = useState<CheckedState>(false);
  const selectSeq = privacyVersionDateList.find(item => item.date === date)?.seq || 0;

  const { mutate: withdraw } = useWithdrawalMutation({
    onSuccess: () => {
      toastSuccess('회원탈퇴가 완료되었습니다.\n다시 방문해주시면 감사하겠습니다.');
      setTimeout(() => {
        router.replace('/');
      }, 1000);
    },
    onError: error => {
      console.error('회원탈퇴 중 오류 발생:', error);
      toastError('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
    onSettled: () => {
      setIsOpen(false);
    },
  });

  const handleWithdrawal = async () => {
    if (!isChecked) {
      toastError('개인정보 처리 방침에 동의해주세요.');
      return;
    }

    withdraw();
  };

  return (
    <AnimateModal className="w-[500px]" isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col items-center justify-center p-6">
        <h2 className="mb-4 text-xl font-semibold">회원 탈퇴</h2>
        <div className="flex space-x-4">
          <div>
            <Label>개인정보 처리방침</Label>
            <Select value={date} onValueChange={setDate}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder={privacyVersionDateList[0].date} />
              </SelectTrigger>
              <SelectContent>
                {privacyVersionDateList.map(item => (
                  <SelectItem key={item.seq} value={item.date}>
                    {item.date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={() => setIsOpen(false)}>
              <MdClose className="absolute right-8 top-4 h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
            <div className="space-y-2">
              {privacyContent[selectSeq].contents.map(item => (
                <p className={cn('text-slate-700', item.styleClass)} key={item.value}>
                  {item.value}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-start gap-3">
          <Checkbox checked={isChecked} id="terms-2" onCheckedChange={value => setIsChecked(value)} />
          <div className="grid gap-2">
            <Label htmlFor="terms-2">회원 탈퇴 및 개인정보 처리 방침에 동의합니다.</Label>
            <p className="text-sm text-muted-foreground">
              귀하는 본 방침에 동의함으로써, 회원 탈퇴 시 개인정보가 관련 법령에 따라 1년간 보관되며, 이 기간 동안
              동일한 계정 정보(이메일, 전화번호 등)로 재가입이 제한될 수 있음에 동의합니다. 또한, 보관 기간이 종료되면
              개인정보는 안전하게 파기되며, 그 이전에는 탈퇴 기록 확인 목적 외의 어떤 용도로도 사용되지 않습니다.
            </p>
          </div>
        </div>
        <Button
          className="mt-6 w-full transition-all duration-300 ease-in-out"
          disabled={!isChecked}
          variant="destructive"
          onClick={handleWithdrawal}
        >
          {isChecked ? '탈퇴하기' : '개인정보 처리 방침에 동의해주세요'}
        </Button>
      </div>
    </AnimateModal>
  );
}

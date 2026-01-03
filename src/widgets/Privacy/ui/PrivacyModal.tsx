import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

import { cn } from '@/lib/utils';
import { privacyContent, privacyVersionDateList } from '@/src/shared/config/privacy';
import { AnimateModal } from '@/src/shared/ui/AnimateModal';
import { Button } from '@/src/shared/ui/button';
import { Label } from '@/src/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';

type TPrivacyModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const PrivacyModal = ({ isOpen, setIsOpen }: TPrivacyModalProps) => {
  const [date, setDate] = useState(privacyVersionDateList[0].date);
  const selectSeq = privacyVersionDateList.find(item => item.date === date)?.seq || 0;

  return (
    <AnimateModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Label>개정 이전 내용 조회</Label>
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
          <p className={cn('text-slate-700', item.styleClass)} key={uuidv4()}>
            {item.value}
          </p>
        ))}
      </div>
      <Button className="mt-4 w-full" variant="default" onClick={() => setIsOpen(false)}>
        확인했습니다
      </Button>
    </AnimateModal>
  );
};

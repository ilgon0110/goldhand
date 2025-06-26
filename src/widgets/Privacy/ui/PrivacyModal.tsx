import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';

import { cn } from '@/lib/utils';
import { Button } from '@/src/shared/ui/button';
import { Label } from '@/src/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';

import { privacyContent, privacyVersionDateList } from '../config/const';

type TPrivacyModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

export const PrivacyModal = ({ isOpen, handleClose }: TPrivacyModalProps) => {
  const [date, setDate] = useState(privacyVersionDateList[0].date);
  const selectSeq = privacyVersionDateList.find(item => item.date === date)?.seq || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="overlay"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={handleClose}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[720px] w-[650px] min-w-[650px] overflow-y-scroll rounded-xl bg-white p-8 shadow-lg"
            exit={{ opacity: 0, y: 50 }}
            initial={{ opacity: 0, y: 50 }}
            key="modal"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()} // Prevent click from closing modal
          >
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
            <button onClick={handleClose}>
              <MdClose className="absolute right-8 top-4 h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
            <div className="space-y-2">
              {privacyContent[selectSeq].contents.map(item => (
                <p className={cn('text-slate-700', item.styleClass)} key={item.value}>
                  {item.value}
                </p>
              ))}
            </div>
            <Button className="mt-4 w-full" variant="default" onClick={handleClose}>
              확인했습니다
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

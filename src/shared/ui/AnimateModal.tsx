'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { useMediaQuery } from '../hooks/useMediaQuery';
import { Drawer, DrawerContent, DrawerTitle } from './drawer';

type TPrivacyModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export const AnimateModal = ({ isOpen, handleClose, children, className }: TPrivacyModalProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = useState(isOpen);

  return isDesktop ? (
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
            className={cn(
              'relative h-[720px] w-[650px] min-w-[650px] overflow-y-scroll rounded-xl bg-white p-8 shadow-lg',
              className,
            )}
            exit={{ opacity: 0, y: 50 }}
            initial={{ opacity: 0, y: 50 }}
            key="modal"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()} // Prevent click from closing modal
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ) : (
    <Drawer direction="bottom" open={open} onAnimationEnd={() => handleClose()} onOpenChange={setOpen}>
      <DrawerContent
        className="fixed bottom-0 left-0 right-0 flex h-[80vh] flex-col rounded-t-[4px] bg-white outline-none"
        forceMount
      >
        <DrawerTitle className="hidden" sr-only="true">
          Title
        </DrawerTitle>
        <div className="mx-auto mt-3 h-[5px] w-1/3 min-w-32 rounded bg-gray-300" />
        <div className="mt-9 flex-1 overflow-y-auto rounded-t-[4px] bg-white p-6">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

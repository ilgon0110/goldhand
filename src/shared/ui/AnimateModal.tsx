import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type TPrivacyModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export const AnimateModal = ({ isOpen, handleClose, children, className }: TPrivacyModalProps) => {
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
  );
};

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';

type TProps = {
  text?: string;
  show?: boolean;
};

export const LoadingSpinnerOverlay = ({ text = '로딩 중...', show = true }: TProps) => {
  const [mounted, setMounted] = useState(false);

  // client component에서 hydration mismatch 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center space-y-4"
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <BarLoader color="white" cssOverride={{ width: '64px' }} />
          <p className="text-sm text-white">{text}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

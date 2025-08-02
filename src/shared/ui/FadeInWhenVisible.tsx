'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type TProps = {
  children: React.ReactNode;
  delay?: number;
  yaxis?: number; // in px
};

export default function FadeInWhenVisible({ children, delay = 0, yaxis = 0 }: TProps) {
  const { ref, inView, entry } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

  const [triggerPoint, setTriggerPoint] = useState<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && entry && triggerPoint === null) {
      const baseY = window.scrollY;
      setTriggerPoint(baseY + yaxis);
    }
  }, [inView, entry, yaxis, triggerPoint]);

  useEffect(() => {
    if (triggerPoint === null || hasAnimated) return;

    const handleScroll = () => {
      if (window.scrollY >= triggerPoint) {
        setHasAnimated(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [triggerPoint, hasAnimated]);

  const shouldAnimate = yaxis === 0 ? inView : hasAnimated;

  return (
    <motion.div
      animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      ref={ref}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

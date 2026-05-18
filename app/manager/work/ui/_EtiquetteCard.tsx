import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type TEtiquetteCardProps = {
  number: string;
  title: string;
  children: React.ReactNode;
};

export const EtiquetteCard = ({ number, title, children }: TEtiquetteCardProps) => {
  return (
    <motion.div
      className={cn('grid grid-cols-[3rem_1fr] gap-6 border-t border-[#E8E1D2] py-9', 'md:gap-8')}
      initial={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.6 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      <div className="pt-1.5 text-sm tracking-[0.18em] text-gold">{number}</div>
      <div>
        <p className="mb-3 text-lg font-semibold tracking-tight text-stone-900">{title}</p>
        <div className="break-keep text-sm leading-loose text-stone-700">{children}</div>
      </div>
    </motion.div>
  );
};

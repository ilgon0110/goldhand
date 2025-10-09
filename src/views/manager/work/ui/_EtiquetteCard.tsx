import { motion } from 'framer-motion';

export const EtiquetteCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="w-full rounded-sm bg-[#F5F5F5] p-4"
      initial={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.6 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      {children}
    </motion.div>
  );
};

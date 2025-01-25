'use client';

import { motion } from 'framer-motion';

interface InlineLoadingProps {
  size?: 'small' | 'medium';
  text?: string;
}

export default function InlineLoading({ size = 'medium', text }: InlineLoadingProps) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-3'
  };

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`${sizeClasses[size]} rounded-full border-t-[#1B4D3E] border-r-[#1B4D3E]/30 border-b-[#1B4D3E]/10 border-l-[#1B4D3E]/60`}
      />
      {text && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600"
        >
          {text}
        </motion.span>
      )}
    </div>
  );
} 
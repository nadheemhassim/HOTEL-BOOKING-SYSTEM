'use client';

import { motion, Variants } from 'framer-motion';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({ fullScreen = true }: LoadingSpinnerProps) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  const pulseVariants: Variants = {
    initial: {
      scale: 0.8,
      opacity: 0.6
    },
    animate: {
      scale: 1.2,
      opacity: 0,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const content = (
    <div className="relative flex flex-col items-center gap-4">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={spinTransition}
      >
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-t-[#1B4D3E] border-r-[#1B4D3E]/30 border-b-[#1B4D3E]/10 border-l-[#1B4D3E]/60"
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
        
        <motion.div 
          className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-[#8B9D83] border-b-[#8B9D83]/30 border-l-transparent"
          animate={{ rotate: -360 }}
          transition={spinTransition}
        />
        
        <motion.div 
          className="absolute inset-[10px] bg-[#1B4D3E] rounded-full"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className="text-[#1B4D3E] font-medium tracking-wide"
      >
        Loading...
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        {content}
      </motion.div>
    );
  }

  return content;
} 
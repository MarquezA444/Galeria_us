'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function SkeletonHeart() {
  return (
    <div className="flex w-full h-full min-h-[250px] items-center justify-center bg-romantic-100/50 rounded-3xl glass-panel relative overflow-hidden">
      {/* Resplandor animado de fondo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      />
      {/* Corazón simulando pulso */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Heart className="w-10 h-10 text-romantic-400 fill-romantic-300/30" strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}

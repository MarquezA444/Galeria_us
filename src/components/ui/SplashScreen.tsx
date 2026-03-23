'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicYellowFlower from '../effects/MagicYellowFlower';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setIsLoading(false);
      return;
    }
    
    // Simulamos la precarga de assets pesados (Three.js, vídeos, fuentes)
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }, 2500); 

    // Bloquea el scroll mientras carga
    document.body.style.overflow = 'hidden';
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          className="fixed inset-0 z-[9999] bg-[#110b0e] flex flex-col items-center justify-center font-serif"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
          onAnimationComplete={() => { document.body.style.overflow = 'auto'; }}
        >
          {/* Flor solitaria en el centro de la pantalla negra */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring", damping: 20 }}
            className="relative flex items-center justify-center"
          >
            <MagicYellowFlower size={120} delay={0} />
            <div className="absolute inset-0 bg-yellow-400 blur-[60px] mix-blend-screen opacity-20 animate-pulse" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-12 text-sm md:text-xl tracking-[0.4em] font-light text-yellow-100/60 uppercase"
          >
            Despertando Magia
          </motion.h1>
          
          {/* Barra de progreso minimalista */}
          <motion.div 
            className="mt-6 w-32 h-[1px] bg-white/10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-500/0 via-yellow-400 to-yellow-500/0"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

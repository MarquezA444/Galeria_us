'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicYellowFlower from '../effects/MagicYellowFlower';

export default function MagicLock({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pressProgress, setPressProgress] = useState(0); 
  const isPressingRef = useRef(false);

  useEffect(() => {
    const unlocked = sessionStorage.getItem('galleryUnlocked') === 'true';
    if (unlocked) {
      setIsUnlocked(true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const tick = () => {
      if (isPressingRef.current) {
        setPressProgress((prev) => {
          if (prev >= 100) {
            setIsUnlocked(true);
            sessionStorage.setItem('galleryUnlocked', 'true');
            return 100;
          }
          return prev + 2; // 50 ticks de 40ms = 2000ms = 2 segundos exactos
        });
      } else {
        setPressProgress((prev) => Math.max(0, prev - 8)); // Se desvanece rápido si se suelta antes de tiempo
      }
    };

    if (!isUnlocked) {
      interval = setInterval(tick, 40);
    }

    return () => clearInterval(interval);
  }, [isUnlocked]);

  const handlePressStart = () => { isPressingRef.current = true; };
  const handlePressEnd = () => { isPressingRef.current = false; };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-[#090507] flex flex-col items-center justify-center select-none touch-none overflow-hidden">
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeIn" }}
            className="flex flex-col items-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-yellow-100/60 font-serif tracking-[0.3em] uppercase text-xs sm:text-sm mb-16 text-center px-6 leading-relaxed"
            >
              Mantén presionada la flor <br /> para despertar los recuerdos
            </motion.h1>

            <motion.div
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              className="relative cursor-pointer rounded-full p-10 flex items-center justify-center transform-gpu"
              whileTap={{ scale: 0.95 }}
            >
              {/* Anillo de progreso SVG */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,215,0,0.05)" strokeWidth="2" />
                <circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke="#FFD700" 
                  strokeWidth="2" 
                  strokeDasharray="301" // Circunferencia exacta ~301
                  strokeDashoffset={301 - (pressProgress / 100) * 301}
                  className="transition-all duration-75 ease-linear drop-shadow-[0_0_8px_#FFD700]"
                  strokeLinecap="round"
                />
              </svg>

              {/* El núcleo: la flor mágica */}
              <div className="relative z-10 pointer-events-none">
                <MagicYellowFlower size={90} delay={0} />
              </div>
              
              {/* Glow expansivo en base a la presión del dedo/mouse */}
              <div 
                className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl pointer-events-none transition-all duration-75 ease-linear"
                style={{ 
                  opacity: (pressProgress / 100) * 0.8, 
                  transform: `scale(${1 + (pressProgress / 100) * 0.8})` 
                }}
              />
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

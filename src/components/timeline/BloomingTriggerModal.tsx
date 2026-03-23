'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MagicYellowFlower from '../effects/MagicYellowFlower';
import Image from 'next/image';
import { Lock } from 'lucide-react';

interface BloomingTriggerModalProps {
  id: string; 
  date: string;
  title: string;
  message: string;
  fullSecretMessage?: string;
  gifUrl?: string;
  unlockDate?: string;
}

export default function BloomingTriggerModal({ date, title, message, fullSecretMessage, gifUrl, unlockDate }: BloomingTriggerModalProps) {
  const [isBlooming, setIsBlooming] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCountdownOpen, setIsCountdownOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLocked = unlockDate ? new Date().getTime() < new Date(unlockDate).getTime() : false;
  // Si fue bloqueado antes y ahora el reloj pasó la fecha, mostramos un aura premium
  const isNewlyUnlocked = unlockDate ? !isLocked : false; 

  useEffect(() => {
    if (unlockDate) {
      const diff = new Date(unlockDate).getTime() - new Date().getTime();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }
  }, [unlockDate]);

  // Bloqueo estricto del scroll
  useEffect(() => {
    if (isOpen || isCountdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isCountdownOpen]);

  const handleFlowerClick = () => {
    if (isLocked) {
      setIsCountdownOpen(true);
      return;
    }

    setIsBlooming(true);
    
    setTimeout(() => {
      setIsOpen(true);
    }, 750);

    setTimeout(() => {
      setIsBlooming(false);
    }, 1600);
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-16 group z-10">
      
      {/* 1. TEXTO INICIAL (Colapsado) */}
      <div className={`text-center mb-8 max-w-2xl px-4 transition-opacity duration-500 ${isBlooming || isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <p className="text-quartz text-xs md:text-sm tracking-[0.2em] uppercase font-sans mb-4">{date}</p>
        <p className="text-foreground text-lg md:text-xl italic font-serif font-light leading-relaxed opacity-90">
          {isLocked ? "Un recuerdo aguarda pacientemente a que llegue su hora." : message}
        </p>
      </div>

      {/* ÁREA DE INTERACCIÓN CENTRAL */}
      <div className={`relative flex items-center justify-center w-32 h-32 ${isBlooming ? 'z-[110]' : 'z-10'}`}>
        
        {/* FASE 1: THE STATIC FLOWER OR LOCKED BUD */}
        <AnimatePresence>
          {!isBlooming && !isOpen && (
            <motion.div
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              onClick={handleFlowerClick}
              className="cursor-pointer z-10 absolute flex flex-col items-center"
              whileHover={{ scale: 1.15, rotate: isLocked ? 0 : 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className={`relative flex items-center justify-center p-4 transition-all duration-300 ${isNewlyUnlocked ? 'drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]' : 'group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]'}`}>
                {isLocked ? (
                  // CAPULLO CERRADO (LOCKED TIMECAPSULE)
                  <div className="relative w-14 h-20 bg-[#0F0A00] rounded-t-[3rem] rounded-b-[1.5rem] border border-yellow-700/40 flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(255,215,0,0.05),0_0_15px_rgba(255,215,0,0.1)] overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-yellow-900/10 to-yellow-600/5" />
                     <Lock className="w-5 h-5 text-yellow-600/70 z-10" strokeWidth={1.5} />
                     {/* Resplandor orgánico interior que late lento */}
                     <motion.div 
                       animate={{ opacity: [0.1, 0.3, 0.1] }}
                       transition={{ duration: 4, repeat: Infinity }}
                       className="absolute bottom-[-10px] w-full h-10 bg-yellow-500/30 blur-md pointer-events-none mix-blend-screen" 
                     />
                  </div>
                ) : (
                  // FLOR MAGICA DESBLOQUEADA
                  <>
                    <MagicYellowFlower size={70} delay={0} />
                    {isNewlyUnlocked && (
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-yellow-400 blur-xl mix-blend-screen pointer-events-none"
                        animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </>
                )}
              </div>
              <p className="text-yellow-400/60 text-xs tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full whitespace-nowrap drop-shadow">
                {isLocked ? "Cápsula del Tiempo" : (isNewlyUnlocked ? "¡Florecido!" : "Descubrir")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FASE 2: THE BLOOMING FLOWER (ORGÁNICO) */}
        <AnimatePresence>
          {isBlooming && (
            <motion.div 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              <motion.div 
                className="relative w-0 h-0"
                initial={{ scale: 0.2, rotate: -45 }}
                animate={{ scale: 3.5, rotate: 0, opacity: [1, 1, 0] }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                style={{ willChange: "transform, opacity" }}
              >
                {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => (
                  <motion.div
                    key={angle}
                    className="absolute w-6 h-20 bg-gradient-to-t from-yellow-400 via-yellow-200 to-white shadow-[0_0_12px_rgba(255,215,0,0.8)]"
                    style={{ 
                      borderRadius: '50% 50% 10% 10%',
                      transformOrigin: 'bottom center',
                      top: '-5rem',
                      left: '-0.75rem',
                      willChange: "transform"
                    }}
                    initial={{ scaleY: 0, scaleX: 0, rotate: angle - 20 }}
                    animate={{ scaleY: 1, scaleX: 1, rotate: angle }}
                    transition={{
                      duration: 0.9,
                      delay: i * 0.03,
                      type: "spring",
                      damping: 12,
                      stiffness: 100,
                    }}
                  />
                ))}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                  className="absolute w-12 h-12 bg-yellow-100 rounded-full shadow-[0_0_20px_#FFD700]"
                  style={{ top: '-1.5rem', left: '-1.5rem', willChange: "transform" }}
                />
              </motion.div>
              <motion.div 
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 15, opacity: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="absolute w-20 h-20 bg-white rounded-full blur-2xl pointer-events-none"
                style={{ willChange: "transform, opacity" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FASE 3: THE LORE MODAL */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/85 backdrop-blur-xl"
              />

              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 250, damping: 25, delay: 0.1 }}
                style={{ willChange: "transform, opacity" }}
                className="relative w-[95vw] sm:w-full max-w-3xl bg-[#1d1519]/90 border border-yellow-400/20 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.1)] z-10 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              >
                <div className="p-6 sm:p-8 md:p-12 w-full flex-1 min-h-0 flex flex-col items-center text-center overflow-y-auto overscroll-contain custom-scrollbar touch-pan-y relative z-20">
                  {gifUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="relative w-full h-48 sm:h-56 md:h-80 shrink-0 rounded-2xl mb-6 md:mb-8 border border-white/5 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] overflow-hidden bg-black/50"
                    >
                      {gifUrl.endsWith('.mp4') || gifUrl.endsWith('.webm') ? (
                        <video src={gifUrl} autoPlay loop muted playsInline className="object-cover w-full h-full" />
                      ) : (
                        <Image src={gifUrl} alt={title} fill className="object-cover" unoptimized priority />
                      )}
                    </motion.div>
                  )}
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-5xl font-serif text-yellow-100 mb-6 font-light drop-shadow-md"
                  >
                    {title}
                  </motion.h2>
                  
                  {fullSecretMessage && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="text-white/85 font-sans leading-relaxed text-base md:text-lg space-y-6 max-w-2xl px-2"
                    >
                      {fullSecretMessage.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </motion.div>
                  )}
                  
                  <motion.button 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setIsOpen(false)}
                    className="mt-12 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-full font-bold tracking-wide 
                               shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] hover:scale-105 hover:-translate-y-1 transition-all outline-none"
                  >
                    Cerrar Pétalos
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* MODAL DE CÁPSULA DEL TIEMPO (CUENTA REGRESIVA) */}
      {mounted && createPortal(
        <AnimatePresence>
          {isCountdownOpen && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsCountdownOpen(false)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="relative w-full max-w-sm bg-[#080500] border border-yellow-700/30 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[inset_0_0_40px_rgba(255,215,0,0.03),0_0_50px_rgba(0,0,0,0.8)] z-10"
              >
                <div className="w-16 h-16 rounded-full bg-yellow-900/10 border border-yellow-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,215,0,0.05)]">
                  <Lock className="w-6 h-6 text-yellow-500/60" />
                </div>

                <h3 className="font-serif text-2xl text-yellow-100/90 font-light italic mb-4">
                  Recuerdo Protegido
                </h3>
                
                <p className="text-romantic-200/60 text-sm font-light mb-10 leading-relaxed max-w-[250px]">
                  Este capullo aún no está listo para abrirse. Florecerá exactamente en la fecha destinada para ti.
                </p>

                <div className="flex flex-col items-center space-y-3 mb-10 w-full">
                  <div className="bg-yellow-500/5 px-8 py-4 rounded-2xl border border-yellow-500/10 w-full">
                    <span className="font-mono text-5xl text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                      {daysLeft}
                    </span>
                  </div>
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-yellow-500/50 font-semibold">
                    Días para Florecer
                  </span>
                </div>

                <button 
                  onClick={() => setIsCountdownOpen(false)}
                  className="text-[10px] font-sans tracking-widest text-[#FFFACD]/30 hover:text-[#FFFACD] uppercase transition-colors"
                >
                  Volver al jardín
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

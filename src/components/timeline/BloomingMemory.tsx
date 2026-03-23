'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicYellowFlower from '../effects/MagicYellowFlower';
import Image from 'next/image';

interface BloomingMemoryProps {
  id: string;
  date: string;
  title: string;
  message: string;
  fullSecretMessage?: string;
  gifUrl?: string;
}

export default function BloomingMemory({ id, date, title, message, fullSecretMessage, gifUrl }: BloomingMemoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center my-16 group">
      {/* 1. MODO COLAPSADO: Mensaje + Flor interactiva */}
      
      <div className="text-center mb-8 max-w-2xl px-4 transition-opacity duration-300">
        <p className="text-quartz text-xs md:text-sm tracking-[0.2em] uppercase font-sans mb-4">{date}</p>
        <p className="text-foreground text-lg md:text-xl italic font-serif font-light leading-relaxed opacity-90">
          {message}
        </p>
      </div>

      {!isOpen && (
        <motion.div
          layoutId={`flower-transform-${id}`}
          onClick={() => setIsOpen(true)}
          className="cursor-pointer z-10"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.15, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* Flor Amarilla Actuando como Botón Mágico */}
          <div className="relative flex items-center justify-center p-4 group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] transition-all duration-300">
            <MagicYellowFlower size={70} delay={0} />
            <div className="absolute inset-0 rounded-full shadow-[0_0_25px_rgba(255,215,0,0.3)] mix-blend-screen pointer-events-none" />
          </div>
          <p className="text-yellow-400/60 text-xs tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Descubrir
          </p>
        </motion.div>
      )}

      {/* 2. EL MODAL FLORECIENTE (EXPANDIDO) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-auto">
            {/* Fondo oscuro con desenfoque extremo */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Contenedor que "Florece" físicamente desde el icono de la flor */}
            <motion.div
              layoutId={`flower-transform-${id}`}
              className="relative w-full max-w-3xl bg-[#1d1519]/95 backdrop-blur-3xl border border-yellow-400/20 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.15)] z-10 flex flex-col max-h-[90vh]"
              initial={{ rotate: -5 }}
              animate={{ rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.3 } }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
              {/* Efecto de destello de luz mágica al momento de expandirse */}
              <motion.div 
                initial={{ opacity: 0.8, scale: 0 }}
                animate={{ opacity: 0, scale: 3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 bg-yellow-200 z-20 pointer-events-none mix-blend-screen"
                style={{ borderRadius: "inherit" }}
              />

              {/* Contenido Secreto del Recuerdo */}
              <div className="p-8 md:p-12 flex flex-col items-center text-center overflow-y-auto custom-scrollbar">
                
                {gifUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="relative w-full h-56 md:h-80 rounded-2xl mb-8 border border-yellow-100/10 shadow-inner overflow-hidden"
                  >
                    <Image src={gifUrl} alt={title} fill className="object-cover" unoptimized />
                  </motion.div>
                )}
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
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
                    transition={{ delay: 0.4, duration: 1 }}
                    className="text-white/85 font-sans leading-relaxed text-base md:text-lg space-y-6 max-w-2xl px-2"
                  >
                    {fullSecretMessage.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </motion.div>
                )}
                
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setIsOpen(false)}
                  className="mt-12 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-full font-semibold tracking-wide 
                             shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:scale-105 transition-all outline-none"
                >
                  Cerrar Pétalos
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import MagicYellowFlower from '../effects/MagicYellowFlower';
import Image from 'next/image';

interface ExpandedCardProps {
  id: string; // Único para conectar el layoutId
  date: string;
  title?: string;
  message: string;
  fullSecretMessage?: string;
  gifUrl?: string;
}

export default function ExpandedCard({ id, date, title, message, fullSecretMessage, gifUrl }: ExpandedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  
  // Efecto Typewriter inicial solo para la tarjeta colapsada
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(message.substring(0, i));
      i++;
      if (i > message.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    // Evitar que el fondo haga scroll cuando la tarjeta esté expandida
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isExpanded]);

  return (
    <>
      <motion.div
        layoutId={`card-container-${id}`}
        onClick={() => setIsExpanded(true)}
        className="max-w-xl mx-auto my-8 glass-panel p-8 rounded-3xl cursor-pointer transition-colors hover:bg-white/10 relative group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Glow de hover simulando luz dorada interactiva */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(255,215,0,0.1)] pointer-events-none" />

        <motion.div layoutId={`card-date-${id}`} className="text-quartz text-sm font-medium mb-3 tracking-widest uppercase font-sans">
          {date}
        </motion.div>
        
        <motion.div layoutId={`card-msg-${id}`} className="text-foreground text-lg italic leading-relaxed min-h-[3rem] font-serif font-light">
          {displayedText || message} 
          {/* Fallback a message entero si se interrumpe y pre-render */}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
            {/* Fondo desenfocado con magia Disney */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* La tarjeta que crece (Mismo layoutId) */}
            <motion.div
              layoutId={`card-container-${id}`}
              className="relative w-full max-w-3xl bg-[#1d1519] rounded-3xl overflow-hidden glass-panel 
                         border border-yellow-400/50 shadow-[0_0_25px_rgba(255,215,0,0.3)] z-10 flex flex-col max-h-[90vh]"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {/* Botón Cerrar (X fina) */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white transition-all z-20 outline-none"
              >
                <X strokeWidth={1} size={28} />
              </motion.button>

              {/* Sello Mágico: Flor Amarilla incrustada en la tarjeta */}
              <motion.div 
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="absolute top-6 left-6 z-20"
              >
                <MagicYellowFlower size={35} delay={0} />
              </motion.div>
              
              <div className="p-8 md:p-12 overflow-y-auto overflow-x-hidden relative z-10 pt-20">
                <motion.div layoutId={`card-date-${id}`} className="text-quartz text-sm font-medium mb-4 tracking-widest uppercase font-sans">
                  {date}
                </motion.div>
                
                {title && (
                  <motion.h3 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl md:text-5xl font-serif text-yellow-100 mb-8 font-light"
                  >
                    {title}
                  </motion.h3>
                )}

                <motion.div layoutId={`card-msg-${id}`} className="text-foreground text-xl md:text-2xl italic leading-relaxed font-serif font-light mb-8 opacity-90">
                  {message}
                </motion.div>
                
                {/* Contenedor Visual (GIF / Foto) */}
                {gifUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
                    className="relative w-full h-56 md:h-80 rounded-2xl overflow-hidden mb-10 shadow-lg border border-white/10"
                  >
                    <Image src={gifUrl} alt="Memoria animada" fill className="object-cover" unoptimized />
                  </motion.div>
                )}

                {/* El Secreto / Historia Completa */}
                {fullSecretMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className="text-white/80 font-sans leading-relaxed text-base md:text-lg space-y-5"
                  >
                    {fullSecretMessage.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

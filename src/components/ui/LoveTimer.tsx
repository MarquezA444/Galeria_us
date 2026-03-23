'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicYellowFlower from '../effects/MagicYellowFlower';

// Función para calcular la diferencia de tiempo
const calculateTimeLeft = () => {
  // Fecha ancla: 1 de Noviembre de 2025, 00:00:00
  const startDate = new Date('2025-11-01T00:00:00').getTime();
  const now = new Date().getTime();
  const difference = now - startDate;

  if (difference < 0) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor((difference / 1000) % 60);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  
  // Aproximación elegante de meses y años
  const years = Math.floor(days / 365);
  const daysLeap = days % 365;
  const months = Math.floor(daysLeap / 30.44); // Escala promedio de días por mes
  const remainingDays = Math.floor(daysLeap % 30.44);

  return { years, months, days: remainingDays, hours, minutes, seconds };
};

// Componente individual para dígito animado (Tipografía Monospace y Glow Extremo)
const AnimatedDigit = ({ value, label }: { value: number, label: string }) => {
  return (
    <div className="flex flex-col items-center mx-[2px] sm:mx-2 md:mx-4 relative z-20">
      <div className="relative h-14 w-10 sm:h-20 sm:w-16 md:w-20 overflow-visible flex items-center justify-center">
        {/* popLayout asegura que la maquinaria se sienta conectada */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8 }}
            style={{ 
              color: '#FFD700',
              // Múltiples text-shadow para efecto tubo Neón real
              textShadow: '0 0 10px rgba(255,215,0,0.8), 0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,165,0,0.5)' 
            }}
            className="absolute font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold animate-pulse"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      {/* Etiquetas Sans-serif tenues para no competir visualmente */}
      <span className="font-sans text-[8px] sm:text-[9px] md:text-[10px] text-yellow-600/70 uppercase tracking-[0.3em] mt-3 font-semibold">
        {label}
      </span>
    </div>
  );
};

export default function LoveTimer() {
  const [timeLeft, setTimeLeft] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft()); 

    // Reloj a 1000ms
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 !my-12 md:!my-20 z-20">
      
      {/* Tarjeta Única de Vidrio (Glassmorphism Puesto al Mínimo para que parezca luz flotante) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="relative flex flex-col items-center justify-center p-8 md:p-16 bg-white/5 backdrop-blur-2xl border border-yellow-400/20 rounded-[2rem] md:rounded-[3rem] shadow-[0_0_50px_rgba(255,215,0,0.05)] overflow-hidden"
      >
        
        {/* EL HAZ DE LUZ RADIAL PROYECTADO DESDE ABAJO */}
        <div className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-[150%] h-[100%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-yellow-500/20 via-yellow-600/5 to-transparent blur-3xl pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="relative z-10 flex flex-col items-center w-full">
          
          {/* TÍTULO REFINADO: Blanco hueso tintado de rosa (#FFF5F7) con luz proyectada desde abajo */}
          <h3 
            className="font-serif text-lg sm:text-2xl lg:text-3xl font-extralight italic mb-8 sm:mb-12 text-center max-w-2xl leading-relaxed tracking-wide" 
            style={{ color: '#FFF5F7', textShadow: '0 4px 15px rgba(255,215,0,0.4)' }}
          >
            Tiempo floreciendo juntos desde el comienzo
          </h3>
          
          <div className="flex flex-row items-center justify-center w-full">
            
            {/* Secuencia Numérica Principal Flotando Libres */}
            <div className="flex flex-wrap items-center justify-center gap-y-6 flex-1 max-w-4xl">
              {timeLeft.years > 0 && <AnimatedDigit value={timeLeft.years} label="Años" />}
              {timeLeft.years > 0 && <span className="text-yellow-500/30 text-2xl mb-4 sm:mb-6 mx-1 font-light hidden sm:block">:</span>}
              
              {timeLeft.months > 0 && <AnimatedDigit value={timeLeft.months} label="Meses" />}
              {timeLeft.months > 0 && <span className="text-yellow-500/30 text-2xl mb-4 sm:mb-6 mx-1 font-light hidden sm:block">:</span>}
              
              <AnimatedDigit value={timeLeft.days} label="Días" />
              <span className="text-yellow-500/30 text-2xl md:text-4xl mb-6 sm:mb-8 font-light mx-1 md:mx-2">:</span>
              
              <AnimatedDigit value={timeLeft.hours} label="Hrs" />
              <span className="text-yellow-500/30 text-2xl md:text-4xl mb-6 sm:mb-8 font-light mx-1 md:mx-2">:</span>
              
              <AnimatedDigit value={timeLeft.minutes} label="Min" />
              <span className="text-yellow-500/30 text-2xl md:text-4xl mb-6 sm:mb-8 font-light mx-1 md:mx-2">:</span>
              
              <AnimatedDigit value={timeLeft.seconds} label="Seg" />
            </div>

          </div>

          {/* LA FLOR MAGICA PROYECTANDO LA LUZ */}
          <div className="mt-8 md:mt-12 flex items-center justify-center relative z-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 1 }}
            >
              <MagicYellowFlower size={80} delay={0.3} />
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}

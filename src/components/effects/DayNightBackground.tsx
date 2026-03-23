'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useThemeByTime } from '@/hooks/useThemeByTime';

export default function DayNightBackground() {
  const isNight = useThemeByTime();

  return (
    <motion.div
      initial={false}
      animate={{ 
        backgroundColor: isNight ? '#050505' : '#E8F0F2',
      }}
      transition={{ duration: 5, ease: 'easeInOut' }}
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden"
    >
      <AnimatePresence mode="popLayout">
        {isNight ? (
          <motion.div 
            key="night"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Gradiente súper sútil oscuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020101] via-[#050505] to-[#0a0709] pointer-events-none" />
            
            {/* Capa de Estrellas parpadeantes hecha con CSS radial-gradients puros */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(1px 1px at 10% 10%, #fff 100%, transparent), radial-gradient(1px 1px at 20% 40%, rgba(255,255,255,0.8) 100%, transparent), radial-gradient(2px 2px at 30% 70%, #fff 100%, transparent), radial-gradient(1.5px 1.5px at 50% 20%, rgba(255,215,0,0.8) 100%, transparent), radial-gradient(1px 1px at 70% 80%, #fff 100%, transparent), radial-gradient(1.5px 1.5px at 80% 30%, rgba(255,255,255,0.9) 100%, transparent), radial-gradient(1.5px 1.5px at 90% 60%, rgba(255,215,0,0.6) 100%, transparent)',
              backgroundSize: '300px 300px'
            }} />
          </motion.div>
        ) : (
          <motion.div 
            key="day"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Gradiente crema muy sutil y luminoso */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#E8F0F2] via-[#E8F0F2] to-[#f4f7f8] pointer-events-none" />
            
            {/* Efecto de rayo de sol diagonal */}
            <div className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] bg-gradient-to-b from-yellow-300/10 to-transparent rotate-45 transform pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

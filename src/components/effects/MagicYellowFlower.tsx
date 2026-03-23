'use client';

import { motion } from 'framer-motion';

interface MagicYellowFlowerProps {
  delay?: number;
  size?: number;
}

export default function MagicYellowFlower({ delay = 0, size = 40 }: MagicYellowFlowerProps) {
  return (
    <motion.div
      initial={{ opacity: 0.7, scale: 1 }}
      animate={{ 
        opacity: [0.7, 1, 0.7], 
        scale: [1, 1.05, 1],
        y: [0, -10, 0], // Movimiento flotante local sutil
        rotate: [0, 15, -5, 0] // Rotación suave e irregular
      }}
      transition={{
        duration: 5, // Ligeramente más lento para optimización
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      className="relative flex items-center justify-center transform-gpu"
      style={{ width: size, height: size }}
    >
      {/* 1. Resplandor Exterior (Aura Disney radial) */}
      <div 
        className="absolute inset-[10%] bg-yellow-400 rounded-full opacity-40 animate-pulse pointer-events-none" 
        style={{ filter: 'blur(15px)' }} // Reemplazado blur-[20px] de tailwind a inline para escalar mejor
      />
      
      {/* 2. Brillo Neón Central (Bloom) */}
      <div 
        className="absolute inset-[30%] bg-amber-200 rounded-full opacity-70 pointer-events-none" 
        style={{ filter: 'blur(6px)' }}
      />

      {/* 3. Estructura de la Flor (SVG para alta calidad) */}
      <svg
        viewBox="0 0 100 100"
        className="relative z-10 overflow-visible"
        style={{ filter: 'drop-shadow(0 0 8px rgba(255,223,0,0.8))' }}
      >
        {/* Pétalos Dorados */}
        <g fill="#FFD700">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx="50" cy="30" rx="12" ry="25"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>
        {/* Centro de la flor (Núcleo de energía) */}
        <circle cx="50" cy="50" r="14" fill="#FFFACD" />
        <circle cx="50" cy="50" r="8" fill="#FFFFFF" className="opacity-90" />
      </svg>

      {/* 4. Partículas satelitales de "Polvo de Hadas" */}
      <motion.div 
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: delay + 0.5 }}
        className="absolute -top-3 -right-3 w-[15%] h-[15%] rounded-full opacity-80"
        style={{ background: '#fff', boxShadow: '0 0 8px 2px rgba(255,255,255,0.8)' }}
      />
    </motion.div>
  );
}

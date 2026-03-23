'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import MagicYellowFlower from './MagicYellowFlower';
import { useThemeByTime } from '@/hooks/useThemeByTime';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  opacity: number;
  delay: number;
  isForeground: boolean;
  type: 'flower' | 'sparkle';
}

const HIDDEN_MESSAGES = [
  "Amo tu sonrisa", "Eres mi refugio", "Nuestro propio universo", 
  "Magia infinita", "Pétalos de luz", "Luz de mi vida", "Siempre juntos",
  "Te amo hasta las estrellas", "Mi lugar favorito eres tú", "Mi pedacito de cielo",
  "Eres magia pura", "Un amor de película", "Contigo el tiempo vuela",
  "El mejor de mis sueños", "Polvo de estrellas para ti", "Eres mi suerte",
  "Un universo en tus ojos", "Nuestra historia eterna", "Mi flor amarilla favorita",
  "Gracias por existir", "Contigo todo es brillante", "Destellos de ti"
];

// Tracker global para no sobrecargar los estados de renderizado
const globalMouse = { x: -1000, y: -1000 };
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    globalMouse.x = e.clientX;
    globalMouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      globalMouse.x = e.touches[0].clientX;
      globalMouse.y = e.touches[0].clientY;
    }
  }, { passive: true });
}

const InteractiveParticle = ({ p, triggerId, isNight }: { p: Particle, triggerId: number | null, isNight: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });
  const [message] = useState(() => HIDDEN_MESSAGES[Math.floor(Math.random() * HIDDEN_MESSAGES.length)]);

  // Disparador manual para Mobile Tap
  useEffect(() => {
    if (triggerId === p.id) {
       setIsHovered(true);
       const t = setTimeout(() => setIsHovered(false), 2500);
       return () => clearTimeout(t);
    }
  }, [triggerId, p.id]);

  // Hook nativo de Framer a 60fps, no causa React Re-renders
  useAnimationFrame(() => {
    if (!ref.current || p.type !== 'flower') return;
    
    // getBoundingClientRect no causa Layout Thrashing porque todo usa transform: translate
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = globalMouse.x - centerX;
    const dy = globalMouse.y - centerY;
    const dist = Math.hypot(dx, dy);
    
    // Si el 'Polvo de hadas' entra al campo magnético (120px)
    if (dist < 120) {
      if (!isHovered) setIsHovered(true);
      // Magnetismo: tirar de la flor hacia el mouse
      setMagnet({ x: dx * 0.4, y: dy * 0.4 });
    } else {
      if (isHovered) setIsHovered(false);
      setMagnet({ x: 0, y: 0 });
    }
  });

  return (
    <motion.div
      initial={{ x: p.x, y: '120vh', opacity: 0 }}
      animate={{ y: '-20vh', opacity: [0, p.opacity, p.opacity * 1.5, p.opacity, 0] }}
      transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
      className="absolute pointer-events-none mix-blend-screen will-change-transform flex items-center justify-center p-8"
    >
      {p.type === 'flower' ? (
        <motion.div 
          ref={ref}
          data-particle-id={p.id} // Para la búsqueda del click en Mobile
          className="relative flex items-center justify-center magic-flower-node pointer-events-none"
          animate={{ x: magnet.x, y: magnet.y, scale: isHovered ? 1.2 : 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <MagicYellowFlower delay={p.delay} size={p.size} />
          
          {/* Destello de intensidad térmica extra (Extra Glow) */}
          <AnimatePresence>
            {isHovered && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1.5 }}
                 exit={{ opacity: 0, scale: 0.5 }}
                 transition={{ duration: 0.3 }}
                 className="absolute inset-0 bg-yellow-300 rounded-full blur-[25px] mix-blend-screen"
               />
            )}
          </AnimatePresence>

          {/* Tooltip Etéreo Flotante Libre */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: -45, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute whitespace-nowrap pointer-events-none z-50"
              >
                 <span className="font-serif text-[#FFFACD] text-sm md:text-base tracking-widest drop-shadow-[0_0_12px_rgba(255,250,205,0.9)] font-medium">
                   {message}
                 </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div style={{ width: p.size, height: p.size, filter: isNight ? 'drop-shadow(0 0 6px #FFD700)' : 'drop-shadow(0 0 4px rgba(255,255,255,0.9))' }}>
          {isNight ? (
            <Sparkles className="w-full h-full text-yellow-100/70" strokeWidth={1.5} />
          ) : (
            <div className="w-full h-full bg-white/70 rounded-full blur-[2px]" />
          )}
        </div>
      )}
    </motion.div>
  );
};


export default function FloatingParticles() {
  const isNight = useThemeByTime();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [tappedParticleId, setTappedParticleId] = useState<number | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const bgX = useTransform(smoothX, (v) => v * 0.03);
  const bgY = useTransform(smoothY, (v) => v * 0.03);
  const fgX = useTransform(smoothX, (v) => v * 0.08);
  const fgY = useTransform(smoothY, (v) => v * 0.08);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Movimiento Parallax base
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Listener Global de Toques para Mobile (Busca la flor más cercana invisible)
  useEffect(() => {
    const handleGlobalTap = (e: MouseEvent | TouchEvent) => {
      if (!isMobile) return; // Solo aplicable si no hay mouse (en móvil)

      // Evitamos interceptar interacciones en modales u otros botones
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('.overflow-y-auto')) return;

      let tapX, tapY;
      if (e.type === 'touchstart') {
        const touch = (e as TouchEvent).touches[0];
        tapX = touch.clientX;
        tapY = touch.clientY;
      } else {
        tapX = (e as MouseEvent).clientX;
        tapY = (e as MouseEvent).clientY;
      }

      // Buscamos todas las flores activas en el DOM
      const nodes = Array.from(document.querySelectorAll('.magic-flower-node'));
      let closestId: number | null = null;
      let minDistance = 250; // Rango máximo de captación táctil (250px es enorme en celular)

      nodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(tapX - centerX, tapY - centerY);
        
        if (dist < minDistance) {
          minDistance = dist;
          closestId = Number(node.getAttribute('data-particle-id'));
        }
      });

      if (closestId !== null) {
        setTappedParticleId(closestId);
      }
    };

    window.addEventListener('click', handleGlobalTap, { passive: true });
    window.addEventListener('touchstart', handleGlobalTap, { passive: true });
    return () => {
      window.removeEventListener('click', handleGlobalTap);
      window.removeEventListener('touchstart', handleGlobalTap);
    };
  }, [isMobile]);

  useEffect(() => {
    const mobileCheck = window.innerWidth < 768;
    setIsMobile(mobileCheck);
    const count = mobileCheck ? 12 : 25; 
    
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const typeRand = Math.random();
      const isFlower = typeRand <= 0.7; // 70% flores, 30% chispas
      return {
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: isFlower ? Math.random() * 25 + 20 : Math.random() * 8 + 6, 
        duration: Math.random() * 15 + 20, 
        opacity: Math.random() * 0.5 + 0.3, 
        delay: Math.random() * 5,
        isForeground: Math.random() > 0.7, 
        type: (isFlower ? 'flower' : 'sparkle') as 'flower' | 'sparkle',
      };
    });
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  const bgParticles = particles.filter(p => !p.isForeground);
  const fgParticles = particles.filter(p => p.isForeground);

  return (
    <>
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ x: bgX, y: bgY }}
      >
        {bgParticles.map(p => <InteractiveParticle key={p.id} p={p} triggerId={tappedParticleId} isNight={isNight} />)}
      </motion.div>
      
      <motion.div 
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
        style={{ x: fgX, y: fgY }}
      >
        {fgParticles.map(p => <InteractiveParticle key={p.id} p={p} triggerId={tappedParticleId} isNight={isNight} />)}
      </motion.div>
    </>
  );
}

'use client';

import MasonryGrid from '@/components/gallery/MasonryGrid';
import BloomingTriggerModal from '@/components/timeline/BloomingTriggerModal';
import LoveTimer from '@/components/ui/LoveTimer';
import MagicLock from '@/components/ui/MagicLock';
import SeedPortal from '@/components/ui/SeedPortal';
import PushSubscription from '@/components/ui/PushSubscription';
import DayNightBackground from '@/components/effects/DayNightBackground';
import { useMemories } from '@/hooks/useMemories';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { gallery, timeline, isLoading } = useMemories();

  return (
    <MagicLock>
      <DayNightBackground />
      <div className="w-full max-w-7xl mx-auto pb-32 relative">
        <header className="pt-24 pb-12 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light font-serif text-quartz tracking-wider mb-4 drop-shadow-sm opacity-90">
            Nuestra Historia
          </h1>
          <p className="text-romantic-300 font-medium tracking-widest uppercase text-sm mb-12">
            Un espacio solo nuestro
          </p>
        </header>
        
        <LoveTimer />

        <section className="mb-24 relative z-10 w-full px-2 min-h-[50vh]">
          {isLoading ? (
            <div className="w-full h-64 flex items-center justify-center animate-pulse">
              <span className="text-yellow-500/50 font-serif tracking-[0.3em] uppercase text-xs">Cosechando memorias...</span>
            </div>
          ) : (
            <MasonryGrid images={gallery} />
          )}
        </section>

        <section className="px-4 py-8 text-center max-w-4xl mx-auto z-10 relative flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-light font-serif text-quartz tracking-widest mb-10 uppercase drop-shadow-md">
            Momentos Destacados
          </h2>
          
          {isLoading ? (
            <div className="animate-pulse text-yellow-500/50 font-serif tracking-widest text-xs uppercase">
              Desplegando pétalos...
            </div>
          ) : (
            <AnimatePresence>
              {timeline.map((memory, index) => (
                <motion.div 
                  key={memory.id} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center"
                >
                  <BloomingTriggerModal 
                    id={memory.id}
                    date={memory.date}
                    title={memory.title}
                    message={memory.message}
                    fullSecretMessage={memory.fullSecretMessage}
                    gifUrl={memory.gifUrl}
                    unlockDate={memory.unlockDate}
                  />
                  {index < timeline.length - 1 && (
                    <div className="w-px h-24 mx-auto bg-gradient-to-b from-yellow-500/0 via-yellow-500/20 to-yellow-500/0" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </section>
      </div>
      <SeedPortal />
      <PushSubscription />
    </MagicLock>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSWRConfig } from 'swr';
import MagicYellowFlower from '../effects/MagicYellowFlower';

export default function SeedPortal() {
  const { mutate } = useSWRConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  const [thought, setThought] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  // Funcionalidad extra para testear las Cápsulas del Tiempo
  const [unlockDate, setUnlockDate] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setStatus('loading');

    try {
      await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thought,
          photoBase64,
          unlockDate: unlockDate ? new Date(unlockDate).toISOString() : undefined
        })
      });

      setStatus('success');
      
      // Forzar a SWR a re-fetchear la data mágica de todo el sitio para inyectar el nuevo recuerdo sin F5
      mutate('/api/memories');
      
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setThought('');
        setPhotoBase64('');
        setUnlockDate('');
      }, 3000);

    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <>
      {/* Botón Flotante Semilla Dorada */}
      <motion.button
        className="fixed bottom-6 right-6 md:bottom-12 md:right-12 w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-300 shadow-[0_0_20px_rgba(255,215,0,0.5)] flex items-center justify-center z-[90] hover:scale-110 active:scale-95 transition-transform"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1 }}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <Plus className="text-black w-8 h-8 opacity-70" />
      </motion.button>

      {/* Portal Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => status !== 'loading' && setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              className="relative w-full max-w-md bg-[#0F0A0D]/90 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
              
              <h3 className="font-serif text-2xl text-yellow-100 font-light italic mb-6 text-center drop-shadow">
                Plantar una Semilla
              </h3>

              {status === 'loading' && (
                <div className="flex flex-col items-center justify-center py-10 h-64">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                    <MagicYellowFlower delay={0} size={60} />
                  </motion.div>
                  <span className="text-yellow-500/80 font-serif tracking-[0.2em] uppercase text-xs mt-6 animate-pulse">Nutriendo la tierra...</span>
                </div>
              )}

              {status === 'success' && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-10 h-64">
                  <CheckCircle2 className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] mb-6" />
                  <span className="text-yellow-100 font-serif text-lg text-center font-light">
                    Tu recuerdo ha sido plantado. <br/><span className="text-sm opacity-60">Mira cómo brota en el jardín.</span>
                  </span>
                </motion.div>
              )}

              {status === 'idle' && (
                <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                  
                  <div>
                    <label className="text-xs text-yellow-500/80 uppercase tracking-widest font-semibold mb-2 block">Un pensamiento</label>
                    <textarea 
                      required
                      value={thought}
                      onChange={(e) => setThought(e.target.value)}
                      className="w-full bg-black/40 border border-yellow-500/20 rounded-xl p-4 text-romantic-100 placeholder-white/20 focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/50 transition-all resize-none h-24 font-serif text-sm custom-scrollbar"
                      placeholder="Escribe lo que sientes en este momento..."
                    />
                  </div>

                  {/* Date Picker Mágico para simular Cápsulas del Tiempo */}
                  <div>
                    <label className="text-xs text-yellow-500/80 uppercase tracking-widest font-semibold mb-2 block flex items-center justify-between">
                      <span>Proteger (Cápsula del Tiempo)</span>
                      <span className="text-[9px] opacity-60 normal-case tracking-normal border border-yellow-500/30 px-2 rounded-full">Opcional</span>
                    </label>
                    <input 
                      type="date" 
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className="w-full bg-black/40 border border-yellow-500/20 rounded-xl px-4 py-3 text-romantic-100 focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/50 transition-all font-sans text-sm [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-yellow-500/80 uppercase tracking-widest font-semibold mb-2 block">Una foto</label>
                    <div className="relative group cursor-pointer border border-dashed border-yellow-500/30 rounded-xl h-16 flex items-center justify-center hover:bg-yellow-500/5 transition-colors overflow-hidden">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      {photoBase64 ? (
                        <div className="flex items-center text-yellow-200 text-sm">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Foto lista
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-500/50 text-sm font-medium group-hover:text-yellow-400/80 transition-colors">
                          <ImageIcon className="w-4 h-4 mr-2" /> Explorar universo
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!thought}
                    className="w-full py-4 mt-4 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-xl font-sans text-black tracking-widest uppercase text-xs font-bold flex items-center justify-center disabled:opacity-50 disabled:grayscale hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all"
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Sembrar en la eternidad
                  </button>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

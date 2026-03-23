'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import GalleryItem, { GalleryImage } from './GalleryItem';

interface MasonryGridProps {
  images: GalleryImage[];
}

export default function MasonryGrid({ images }: MasonryGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedImage = images.find(img => img.id === selectedId);

  useEffect(() => {
    // Bloquear el scroll de la página cuando el Lightbox está abierto
    if (selectedId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [selectedId]);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {images.map((image, i) => (
          <GalleryItem 
            key={image.id} 
            image={image} 
            index={i} 
            onClick={() => setSelectedId(image.id)} 
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 pointer-events-auto">
            {/* Fondo oscuro para Lightbox */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            {/* Imagen Expandida Mágicamente con Shared Element */}
            <motion.div
              layoutId={`gallery-image-${selectedImage.id}`}
              className="relative w-full max-w-5xl h-[80vh] rounded-3xl overflow-hidden glass-panel z-10 flex flex-col justify-end shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white transition-all z-20 outline-none border border-white/10"
              >
                <X strokeWidth={1} size={28} />
              </motion.button>

              <div className="absolute inset-0">
                <Image 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  fill 
                  unoptimized={selectedImage.isGif}
                  className="object-contain w-full h-full" 
                />
              </div>
              
              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-2xl md:text-4xl font-serif tracking-wide drop-shadow-lg font-light"
                >
                  {selectedImage.title}
                </motion.h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

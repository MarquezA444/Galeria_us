'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import SkeletonHeart from '../ui/SkeletonHeart';

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  isGif?: boolean;
  aspectRatio: 'square' | 'video' | 'portrait' | 'landscape';
}

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}

export default function GalleryItem({ image, index, onClick }: GalleryItemProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      layoutId={`gallery-image-${image.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: (index % 3) * 0.15,
      }}
      whileHover={{ 
        scale: 1.02,
        filter: 'brightness(1.10)',
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="relative mb-6 break-inside-avoid rounded-3xl overflow-hidden glass-panel group transition-shadow duration-500"
    >
      <div 
        className="relative w-full rounded-3xl overflow-hidden bg-romantic-50"
        style={{
          aspectRatio: 
            image.aspectRatio === 'square' ? '1/1' :
            image.aspectRatio === 'video' ? '16/9' :
            image.aspectRatio === 'portrait' ? '3/4' : '4/3'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 w-full h-full">
            <SkeletonHeart />
          </div>
        )}
        
        <Image
          src={image.url?.replace(/"/g, '') || ''}
          alt={image.title}
          fill
          priority={image.isGif || index < 4} // Soluciona warning de LCP
          className={`object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradiente sutil abajo para el texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-700 pointer-events-none flex items-center justify-between">
          <p className="text-white font-medium text-sm tracking-wide drop-shadow-md">
            {image.title}
          </p>
          {image.title === 'Recuerdos imborrables' && (
            <span className="text-yellow-400 text-lg drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">🌻</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

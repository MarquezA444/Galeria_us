import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export interface GalleryItemData {
  id: string;
  url: string;
  title: string;
  timestamp: string;
  dateString: string;
  aspectRatio: 'video' | 'square' | 'portrait' | 'landscape';
  isGif: boolean;
}

export interface TimelineData {
  id: string;
  date: string;
  timestamp: string;
  title: string;
  message: string;
  fullSecretMessage: string;
  gifUrl: string;
  unlockDate?: string; // Phase 10: Time capsules
}

export interface MemoriesData {
  gallery: GalleryItemData[];
  timeline: TimelineData[];
}

export function useMemories() {
  const { data, error, isLoading } = useSWR<MemoriesData>('/api/memories', fetcher, {
    refreshInterval: 3000, // Revalida cada 3 segundos para el efecto de "mágia instantánea"
    revalidateOnFocus: true,
  });

  // Ordenar fotos del Masonry Grid para que las más recientes aparezcan primero
  const sortedGallery = data?.gallery 
    ? [...data.gallery].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  // Ordenar Timeline para mantener la cronología original (antiguo a nuevo)
  const sortedTimeline = data?.timeline
    ? [...data.timeline].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  return {
    gallery: sortedGallery,
    timeline: sortedTimeline,
    isLoading,
    isError: error
  };
}

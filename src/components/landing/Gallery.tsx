
'use client';

import Image from 'next/image';
import type { GalleryItem } from '@/lib/types';
import { PlayCircle } from 'lucide-react';

interface GalleryProps {
  galleryItems: GalleryItem[];
}

export function Gallery({ galleryItems }: GalleryProps) {
  return (
    <section id="mis-trabajos" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-headline text-center mb-12">Mis Trabajos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-xl shadow-lg aspect-square">
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  data-ai-hint={item.alt.split(' ').slice(0, 2).join(' ')}
                />
              ) : (
                <>
                  <video
                    src={item.url}
                    title={item.alt}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    playsInline
                    loop
                    muted
                    controls
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <PlayCircle className="w-16 h-16 text-white/80" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

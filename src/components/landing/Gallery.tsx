
'use client';

import Image from 'next/image';
import type { GalleryItem } from '@/lib/types';
import { PlayCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface GalleryProps {
  galleryItems: GalleryItem[];
}

export function Gallery({ galleryItems }: GalleryProps) {
  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.hasAttribute('controls')) {
      return;
    }
    e.preventDefault();
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    video.setAttribute('controls', 'true');
  };

  return (
    <section id="mis-trabajos" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-headline text-center mb-12">Mis Trabajos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {galleryItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-square w-full">
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                      onClick={handleVideoClick}
                      onPause={(e) => e.currentTarget.setAttribute('controls', 'true')}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-data-[playing=true]:opacity-0">
                      <PlayCircle className="w-16 h-16 text-white/80" />
                    </div>
                  </>
                )}
                {/* Overlay for Title and Description */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CardContent className="p-4 absolute bottom-0 left-0 text-white w-full">
                    <h3 className="font-headline text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-white/90">{item.description}</p>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

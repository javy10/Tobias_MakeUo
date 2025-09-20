
'use client';

import Image from 'next/image';
import type { GalleryItem } from '@/lib/types';
import { PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface GalleryProps {
  galleryItems: GalleryItem[];
}

export function Gallery({ galleryItems }: GalleryProps) {
  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.hasAttribute('controls')) {
      // If controls are visible, let them handle the click
      return;
    }
    // If controls are not visible, toggle play/pause and show controls
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
            <Card key={item.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0">
                <div className="relative aspect-square w-full">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
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
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="font-headline text-xl mb-2">{item.title}</CardTitle>
                <CardDescription className="text-sm">{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

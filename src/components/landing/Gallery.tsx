'use client'

import type { GalleryItem } from '@/lib/types'
import { Card } from '../ui/card'
import { Media } from '../shared/Media'
import { Button } from '../ui/button'
import Link from 'next/link'

interface GalleryProps {
  galleryItems: GalleryItem[]
}

export function Gallery({ galleryItems }: GalleryProps) {
  return (
    <section id="mis-trabajos" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-center mb-8 sm:mb-12 lg:mb-16">
          Mis Trabajos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {galleryItems.map((item) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-square w-full">
                <Media
                  src={item.url}
                  alt={item.alt}
                  type={item.type}
                  fill
                  className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  style={{ objectFit: 'contain' as const }}
                />
                {/* Gradiente - visible solo en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Contenido - visible solo en hover */}
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Título siempre visible con sombra */}
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-lg">
                    {item.title}
                  </h3>
                  
                  {/* Elementos que aparecen en hover */}
                  <div className="space-y-3 transform transition-all duration-300">
                    <p className="text-sm sm:text-base text-white/90 line-clamp-2 sm:line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex justify-end pt-2">
                      <Button 
                        asChild 
                        className="rounded-full text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 hover:scale-105 transition-transform"
                      >
                        <Link href="#contacto">Contáctame</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

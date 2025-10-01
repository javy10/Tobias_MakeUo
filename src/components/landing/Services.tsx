'use client';
import { Card, CardTitle } from '@/components/ui/card';
import type { Service } from '@/lib/types';
import { Media } from '../shared/Media';
import { Button } from '../ui/button';
import Link from 'next/link';

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  return (
    <section id="servicios" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-center mb-8 sm:mb-12 lg:mb-16">
        Nuestros Servicios
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {services.map((service) => (
          <Card key={service.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative aspect-square w-full">
                <Media 
                    src={service.url} 
                    type={service.type}
                    alt={service.title} 
                    fill
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    style={{ objectFit: 'contain' as const }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay - visible on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content overlay - visible on hover */}
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <CardTitle className="font-headline text-xl sm:text-2xl text-white mb-2">{service.title}</CardTitle>
                    <p className="text-white/90 text-sm sm:text-base mb-4 line-clamp-3">{service.description}</p>
                    <div className="flex justify-end">
                        <Button asChild className="rounded-full text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                            <Link href="#contacto">Contáctame</Link>
                        </Button>
                    </div>
                </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
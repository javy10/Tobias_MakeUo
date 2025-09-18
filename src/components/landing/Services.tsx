
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import type { Service } from '@/lib/types';

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  return (
    <section id="servicios" className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-4xl font-bold font-headline text-center mb-12">Nuestros Servicios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.id} className="bg-card text-center shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 overflow-hidden">
             <div className="relative aspect-video w-full">
              <Image 
                src={service.imageUrl} 
                alt={service.title} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={service.title.split(' ').slice(0, 2).join(' ')}
              />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-foreground/80">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

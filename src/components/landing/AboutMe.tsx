
'use client';
import Image from 'next/image';
import type { AboutMeContent } from '@/lib/types';

interface AboutMeProps {
  content: AboutMeContent;
}

export function AboutMe({ content }: AboutMeProps) {
  const stats = [
    { value: content.happyClients, label: 'Clientes Felices' },
    { value: content.yearsOfExperience, label: 'Años Experiencia' },
    { value: content.events, label: 'Eventos' },
  ];

  return (
    <section id="sobre-mi" className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-4xl font-bold font-headline mb-6">Sobre Mí</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            {content.text}
          </p>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl">
            <Image
              src={content.imageUrl}
              alt="Foto de Tobias"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 400px"
              data-ai-hint="portrait professional"
            />
          </div>
        </div>
      </div>
      <div className="mt-16 md:mt-24 border-t border-border pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-4xl font-bold text-primary font-headline">{stat.value}</p>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

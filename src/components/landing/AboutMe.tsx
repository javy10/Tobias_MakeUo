
'use client';
import type { AboutMeContent } from '@/lib/types';
import { Media } from '../shared/Media';

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
    <section id="sobre-mi" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
        <div className="order-2 lg:order-1 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline">Sobre Mí</h2>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-prose">
            {content.text}
          </p>
        </div>
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <Media
              src={content.url}
              type={content.type}
              alt="Foto de Tobias"
              fill
              style={{ objectFit: 'cover' as const }}
              className="w-full h-full"
              sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
              data-ai-hint="portrait professional"
            />
          </div>
        </div>
      </div>
      <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 border-t border-border pt-8 sm:pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 sm:p-6 rounded-lg bg-background/50 backdrop-blur-sm shadow-sm">
              <p className="text-3xl sm:text-4xl font-bold text-primary font-headline mb-2">{stat.value}</p>
              <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


'use client';
import { Button } from '@/components/ui/button';
import type { HeroContent } from '@/lib/types';
import { Media } from '../shared/Media';

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  const heroImageHint = 'makeup artistry';

  return (
    <section id="inicio" className="relative h-[calc(100vh-64px)] min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Media
          src={content.url}
          type={content.type}
          alt={content.title}
          fill
          priority
          style={{ objectFit: 'cover' as const }}
          className="w-full h-full"
          data-ai-hint={heroImageHint}
          key={content.url}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-headline mb-6 drop-shadow-lg max-w-4xl mx-auto leading-tight">
            {content.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 max-w-3xl mx-auto drop-shadow-md font-light">
            {content.subtitle}
          </p>
          <Button 
            asChild 
            size="lg" 
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <a href="#servicios">Descubre Nuestros Servicios</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

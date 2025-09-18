'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { initialHeroContent } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const [content] = useState(initialHeroContent);
  const heroImageHint = PlaceHolderImages.find(img => img.id === 'hero-background')?.imageHint || 'makeup artistry';

  return (
    <section id="inicio" className="relative h-[calc(100dvh-64px)] min-h-[500px] flex items-center justify-center text-white">
      <Image
        src={content.imageUrl}
        alt={content.title}
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImageHint}
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="text-center z-10 p-4 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold font-headline mb-4 drop-shadow-lg">
          {content.title}
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
          {content.subtitle}
        </p>
        <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
          <a href="#servicios">Descubre Nuestros Servicios</a>
        </Button>
      </div>
    </section>
  );
}

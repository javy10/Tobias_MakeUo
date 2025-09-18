'use client';
import { useState } from 'react';
import Image from 'next/image';
import { initialAboutMeContent } from '@/lib/data';

export function AboutMe() {
  const [content] = useState(initialAboutMeContent);

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
    </section>
  );
}

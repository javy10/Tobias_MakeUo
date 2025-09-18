'use client';

import * as React from 'react';
import { initialTestimonials } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function Testimonials() {
  const approvedTestimonials = initialTestimonials.filter(t => t.status === 'approved');
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section id="testimonios" className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-4xl font-bold font-headline text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
      >
        <CarouselContent>
          {approvedTestimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <Card className="bg-card shadow-lg flex flex-col items-center text-center p-6 h-full">
                  <Quote className="w-8 h-8 text-primary/50 mb-4" />
                  <CardContent className="flex-grow flex items-center">
                    <p className="italic text-foreground/80">"{testimonial.text}"</p>
                  </CardContent>
                  <p className="mt-4 font-semibold text-primary font-headline">- {testimonial.author}</p>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}

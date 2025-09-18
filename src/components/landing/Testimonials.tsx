import { initialTestimonials } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section id="testimonios" className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-4xl font-bold font-headline text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="bg-card shadow-lg flex flex-col items-center text-center p-6">
            <Quote className="w-8 h-8 text-primary/50 mb-4" />
            <CardContent className="flex-grow">
              <p className="italic text-foreground/80">"{testimonial.text}"</p>
            </CardContent>
            <p className="mt-4 font-semibold text-primary font-headline">- {testimonial.author}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

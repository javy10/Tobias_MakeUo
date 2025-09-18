import { initialTestimonials } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, MessageSquarePlus } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export function Testimonials() {
  const approvedTestimonials = initialTestimonials.filter(t => t.status === 'approved');

  return (
    <section id="testimonios" className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-4xl font-bold font-headline text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {approvedTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="bg-card shadow-lg flex flex-col items-center text-center p-6">
            <Quote className="w-8 h-8 text-primary/50 mb-4" />
            <CardContent className="flex-grow">
              <p className="italic text-foreground/80">"{testimonial.text}"</p>
            </CardContent>
            <p className="mt-4 font-semibold text-primary font-headline">- {testimonial.author}</p>
          </Card>
        ))}
      </div>
       <div className="text-center mt-16">
        <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
          <Link href="/dejar-testimonio">
            <MessageSquarePlus className="mr-2 h-5 w-5" />
            Deja tu Propio Testimonio
          </Link>
        </Button>
      </div>
    </section>
  );
}

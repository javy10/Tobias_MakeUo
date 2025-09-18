'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LeaveTestimonialPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would add the new testimonial to your data source.
      setStatus('success');
    }, 1000);
  };

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/');
      }, 2000); // Redirect after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section id="dejar-testimonio" className="container mx-auto px-4 py-16 md:py-24">
          <Card className="max-w-xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-center">Comparte tu Experiencia</CardTitle>
              <CardDescription className="text-center">
                Tu opinión es muy importante para nosotros.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'success' ? (
                <div className="text-center p-8">
                  <h3 className="text-2xl font-semibold text-green-500 font-headline">¡Gracias por tu opinión!</h3>
                  <p className="mt-2 text-foreground/80">Hemos recibido tu mensaje. Serás redirigido a la página principal en un momento.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="author">Tu Nombre</Label>
                    <Input id="author" name="author" type="text" placeholder="Nombre y Apellido" required />
                  </div>
                   <div className="space-y-2">
                    <Label>Calificación</Label>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                          <button
                            type="button"
                            key={starValue}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(0)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={cn(
                                "h-8 w-8 transition-colors",
                                starValue <= (hover || rating) ? "text-primary fill-primary" : "text-muted-foreground"
                              )}
                            />
                          </button>
                        );
                      })}
                       <input type="hidden" name="rating" value={rating} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text">Tu Opinión</Label>
                    <Textarea id="text" name="text" placeholder="Cuéntanos cómo fue tu experiencia..." required rows={6} />
                  </div>
                  <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Enviando...' : 'Enviar Opinión'}
                  </Button>
                  {status === 'error' && (
                    <p className="text-center text-red-500">Hubo un error al enviar la opinión. Por favor, inténtalo de nuevo.</p>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}

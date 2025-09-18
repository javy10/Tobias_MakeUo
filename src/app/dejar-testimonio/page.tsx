'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LeaveTestimonialPage() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically send the data to your backend.
    // For this demo, we'll just simulate a success state.
    // In a real app, you would add the new testimonial to your data source with a 'pending' status.
    setStatus('success');
    event.currentTarget.reset();
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section id="dejar-testimonio" className="container mx-auto px-4 py-16 md:py-24">
          <Button asChild variant="outline" className="mb-8 rounded-full">
            <Link href="/#testimonios">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la página principal
            </Link>
          </Button>
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
                  <h3 className="text-2xl font-semibold text-green-600 font-headline">¡Gracias por tu testimonio!</h3>
                  <p className="mt-2 text-foreground/80">Hemos recibido tu mensaje. Será revisado por nuestro equipo antes de ser publicado.</p>
                   <Button asChild variant="default" className="mt-6 rounded-full">
                    <Link href="/">
                      Volver al Inicio
                    </Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="author">Tu Nombre</Label>
                    <Input id="author" name="author" type="text" placeholder="Nombre y Apellido" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text">Tu Testimonio</Label>
                    <Textarea id="text" name="text" placeholder="Cuéntanos cómo fue tu experiencia..." required rows={6} />
                  </div>
                  <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6">
                    Enviar Testimonio
                  </Button>
                  {status === 'error' && (
                    <p className="text-center text-red-500">Hubo un error al enviar el testimonio. Por favor, inténtalo de nuevo.</p>
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

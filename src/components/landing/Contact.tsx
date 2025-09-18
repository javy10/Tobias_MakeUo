'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, this would submit to a server.
    // For this example, we'll just simulate a successful submission.
    setStatus('success');
  };

  return (
    <section id="contacto" className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-4xl font-bold font-headline text-center mb-12">Contáctanos</h2>
      <Card className="max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">Envíanos un Mensaje</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold text-green-600">¡Mensaje enviado!</h3>
              <p className="mt-2 text-foreground/80">Gracias por contactarnos. Te responderemos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" type="text" placeholder="Tu nombre completo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea id="message" name="message" placeholder="¿En qué podemos ayudarte?" required rows={5} />
              </div>
              <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6">
                Enviar Mensaje
              </Button>
              {status === 'error' && (
                <p className="text-center text-red-500">Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.</p>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

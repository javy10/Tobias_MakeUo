'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export function Contact() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Por favor, completa todos los campos.",
      });
      return;
    }

    const phoneNumber = "50379467621"; // Reemplaza con tu número de WhatsApp
    const text = `Hola, soy ${name.trim()}. Mi mensaje es: ${message.trim()}`;
    
    // Codificación robusta para compatibilidad
    const encodedText = encodeURIComponent(text);
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contacto" className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-4xl font-bold font-headline text-center mb-12">Contáctanos</h2>
      <Card className="max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">Envíanos un Mensaje</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="Tu nombre completo" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="¿En qué podemos ayudarte?" 
                required 
                rows={5} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
              />
            </div>
            <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6">
              Enviar Mensaje por WhatsApp
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}


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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl">
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
        <div className="rounded-xl overflow-hidden shadow-xl aspect-video md:aspect-auto md:h-full">
           <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.13682974241!2d-89.56318602585255!3d13.987727386684079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f62e4c414995c63%3A0x633d93963428981!2sSal%C3%B3n%20de%20belleza%20y%20makeup!5e0!3m2!1sen!2sus!4v1722889601366!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Tobias MakeUp"
            ></iframe>
        </div>
      </div>
    </section>
  );
}

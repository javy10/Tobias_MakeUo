
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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
    const text = `Hola, soy ${name.trim()}. ${message.trim()}`;
    
    // Codificación robusta para compatibilidad
    const encodedText = encodeURIComponent(text);
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      id="contacto" 
      className="style-1-bg py-16 md:py-24 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Elementos flotantes decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-16 h-16 style-1-floating-circle rounded-full floating-element"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.5 }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-20 right-20 w-20 h-20 style-1-floating-circle rounded-full floating-element"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.7 }}
        ></motion.div>
        <motion.div 
          className="absolute top-1/2 right-10 w-12 h-12 style-1-floating-circle rounded-full floating-element"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.9 }}
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-4xl font-bold font-headline text-center mb-12 text-white style-1-shadow"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          Contáctanos
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.div variants={itemVariants}>
            <Card className="style-1-glass style-1-shadow hover-lift">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-center text-white">Envíanos un Mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nombre</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Tu nombre completo" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">Mensaje</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="¿En qué podemos ayudarte?" 
                    required 
                    rows={5} 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button type="submit" className="w-full rounded-full bg-white/20 hover:bg-white/30 text-white text-lg py-6 border border-white/30 transition-all duration-300">
                    Enviar Mensaje por WhatsApp
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
          </motion.div>
          <motion.div 
            className="rounded-xl overflow-hidden style-1-shadow aspect-video md:aspect-auto md:h-full"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}
            transition={{ duration: 0.3 }}
          >
             <iframe
                src="https://maps.google.com/maps?q=14.092523,-88.957206&t=k&z=19&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Tobias MakeUp"
              >             </iframe>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

'use client';

import { useState } from 'react';
import { initialHeroContent, initialServices, initialGalleryItems, initialTestimonials } from '@/lib/data';
import type { HeroContent, Service, GalleryItem, Testimonial } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AIContentGenerator } from './AIContentGenerator';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [hero, setHero] = useState<HeroContent>(initialHeroContent);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGalleryItems);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const { toast } = useToast();

  const handleHeroUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setHero({
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
    });
    toast({ title: "Éxito", description: "Contenido de la sección inicial actualizado." });
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newService: Service = {
      id: crypto.randomUUID(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    };
    setServices([...services, newService]);
    form.reset();
    toast({ title: "Éxito", description: "Nuevo servicio añadido." });
  };
  
  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast({ title: "Éxito", description: "Servicio eliminado." });
  };

  const handleAddGalleryItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newGalleryItem: GalleryItem = {
      id: crypto.randomUUID(),
      url: formData.get('url') as string,
      alt: formData.get('alt') as string,
    };
    setGallery([...gallery, newGalleryItem]);
    form.reset();
    toast({ title: "Éxito", description: "Nueva imagen añadida." });
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGallery(gallery.filter(g => g.id !== id));
    toast({ title: "Éxito", description: "Imagen eliminada." });
  };
  
  const handleAddTestimonial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newTestimonial: Testimonial = {
      id: crypto.randomUUID(),
      text: formData.get('text') as string,
      author: formData.get('author') as string,
    };
    setTestimonials([...testimonials, newTestimonial]);
    form.reset();
    toast({ title: "Éxito", description: "Nuevo testimonio añadido." });
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast({ title: "Éxito", description: "Testimonio eliminado." });
  };

  return (
    <div className="min-h-dvh bg-secondary p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-primary">Panel Administrativo</h1>
          <Button onClick={onLogout} variant="outline" className="rounded-full">Salir</Button>
        </header>

        <Tabs defaultValue="hero">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="hero">Sección Inicial</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="gallery">Galería</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
            <TabsTrigger value="ai-content">Ideas con IA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero">
            <Card>
              <CardHeader><CardTitle className="font-headline">Contenido de la Sección Inicial</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleHeroUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" name="title" defaultValue={hero.title} />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Textarea id="subtitle" name="subtitle" defaultValue={hero.subtitle} />
                  </div>
                  <Button type="submit" className="rounded-full">Actualizar</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Servicios</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddService} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nuevo Servicio</h3>
                  <Input name="title" placeholder="Título del servicio" required />
                  <Textarea name="description" placeholder="Descripción del servicio" required />
                  <Button type="submit" className="rounded-full">Añadir Servicio</Button>
                </form>
                <div className="space-y-2">
                  {services.map(service => (
                    <div key={service.id} className="flex justify-between items-center p-2 bg-background rounded">
                      <div>
                        <p className="font-bold">{service.title}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery">
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Galería</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddGalleryItem} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nueva Imagen</h3>
                  <Input name="url" type="url" placeholder="URL de la imagen" required />
                  <Input name="alt" placeholder="Descripción (texto alt)" required />
                  <Button type="submit" className="rounded-full">Añadir Imagen</Button>
                </form>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.map(item => (
                    <div key={item.id} className="relative group">
                      <Image src={item.url} alt={item.alt} width={200} height={200} className="rounded-md object-cover aspect-square" />
                       <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteGalleryItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Testimonios</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddTestimonial} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nuevo Testimonio</h3>
                  <Textarea name="text" placeholder="Texto del testimonio" required />
                  <Input name="author" placeholder="Autor del testimonio" required />
                  <Button type="submit" className="rounded-full">Añadir Testimonio</Button>
                </form>
                <div className="space-y-2">
                  {testimonials.map(testimonial => (
                    <div key={testimonial.id} className="flex justify-between items-center p-2 bg-background rounded">
                       <div>
                        <p className="italic">"{testimonial.text}"</p>
                        <p className="text-sm font-bold">- {testimonial.author}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTestimonial(testimonial.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-content">
            <AIContentGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

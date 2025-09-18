'use client';

import { useState } from 'react';
import { initialHeroContent, initialServices, initialGalleryItems, initialTestimonials, initialProducts } from '@/lib/data';
import type { HeroContent, Service, GalleryItem, Testimonial, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AIContentGenerator } from './AIContentGenerator';
import { Trash2, Check, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [hero, setHero] = useState<HeroContent>(initialHeroContent);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
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
      imageUrl: formData.get('imageUrl') as string,
    };
    setServices([...services, newService]);
    form.reset();
    toast({ title: "Éxito", description: "Nuevo servicio añadido." });
  };
  
  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast({ title: "Éxito", description: "Servicio eliminado." });
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrl: formData.get('imageUrl') as string,
    };
    setProducts([...products, newProduct]);
    form.reset();
    toast({ title: "Éxito", description: "Nuevo producto añadido." });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: "Éxito", description: "Producto eliminado." });
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
  
  const handleUpdateTestimonialStatus = (id: string, status: 'approved' | 'rejected') => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, status } : t));
    toast({ title: "Éxito", description: `Testimonio ${status === 'approved' ? 'aprobado' : 'rechazado'}.` });
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast({ title: "Éxito", description: "Testimonio eliminado." });
  };

  const testimonialsByStatus = (status: Testimonial['status']) => testimonials.filter(t => t.status === status);

  return (
    <div className="min-h-dvh bg-secondary p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-primary">Panel Administrativo</h1>
          <Button onClick={onLogout} variant="outline" className="rounded-full">Salir</Button>
        </header>

        <Tabs defaultValue="hero">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6">
            <TabsTrigger value="hero">Sección Inicial</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
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
                  <Input name="imageUrl" type="url" placeholder="URL de la imagen del servicio" required />
                  <Button type="submit" className="rounded-full">Añadir Servicio</Button>
                </form>
                <div className="space-y-2">
                  {services.map(service => (
                    <div key={service.id} className="flex justify-between items-center p-2 bg-background rounded">
                      <div className="flex items-center gap-4">
                        <Image src={service.imageUrl} alt={service.title} width={64} height={64} className="rounded object-cover aspect-square"/>
                        <div>
                          <p className="font-bold">{service.title}</p>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="products">
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Productos</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddProduct} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nuevo Producto</h3>
                  <Input name="name" placeholder="Nombre del producto" required />
                  <Textarea name="description" placeholder="Descripción del producto" required />
                  <Input name="price" type="number" step="0.01" placeholder="Precio (ej: 25.99)" required />
                  <Input name="imageUrl" type="url" placeholder="URL de la imagen del producto" required />
                  <Button type="submit" className="rounded-full">Añadir Producto</Button>
                </form>
                <div className="space-y-2">
                  {products.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-background rounded">
                      <div className="flex items-center gap-4">
                        <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="rounded object-cover aspect-square"/>
                        <div>
                          <p className="font-bold">{product.name} - ${product.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
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
              <CardHeader>
                <CardTitle className="font-headline">Gestionar Testimonios</CardTitle>
                <CardDescription>Revisa, aprueba, rechaza o elimina los testimonios enviados por los clientes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <Tabs defaultValue="pending">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Pendientes ({testimonialsByStatus('pending').length})</TabsTrigger>
                    <TabsTrigger value="approved">Aprobados ({testimonialsByStatus('approved').length})</TabsTrigger>
                    <TabsTrigger value="rejected">Rechazados ({testimonialsByStatus('rejected').length})</TabsTrigger>
                  </TabsList>
                  
                  {['pending', 'approved', 'rejected'].map(status => (
                    <TabsContent key={status} value={status}>
                      <div className="space-y-4 mt-4">
                        {testimonialsByStatus(status as Testimonial['status']).length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">No hay testimonios en esta categoría.</p>
                        ) : (
                          testimonialsByStatus(status as Testimonial['status']).map(testimonial => (
                            <div key={testimonial.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                              <div>
                                <div className='flex items-center gap-2 mb-2'>
                                  <p className="font-bold">- {testimonial.author}</p>
                                  <Badge variant={
                                    testimonial.status === 'approved' ? 'default' : testimonial.status === 'pending' ? 'secondary' : 'destructive'
                                  } className={cn(
                                    testimonial.status === 'approved' && 'bg-green-100 text-green-800',
                                  )}>
                                    {
                                      { 'pending': 'Pendiente', 'approved': 'Aprobado', 'rejected': 'Rechazado' }[testimonial.status]
                                    }
                                  </Badge>
                                </div>
                                <p className="italic">"{testimonial.text}"</p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                {testimonial.status === 'pending' && (
                                  <>
                                    <Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleUpdateTestimonialStatus(testimonial.id, 'approved')}>
                                      <ThumbsUp className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-orange-600 hover:bg-orange-100 hover:text-orange-700" onClick={() => handleUpdateTestimonialStatus(testimonial.id, 'rejected')}>
                                      <ThumbsDown className="w-5 h-5" />
                                    </Button>
                                  </>
                                )}
                                <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
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

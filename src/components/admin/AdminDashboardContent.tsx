
'use client';
import type { AppState, HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category } from '@/lib/types';
import { StatCard } from './StatCard';
import { Palette, ShoppingBag, Star, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';

interface AdminDashboardContentProps {
  appState: AppState;
  setHeroContent: React.Dispatch<React.SetStateAction<HeroContent>>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  setAboutMeContent: React.Dispatch<React.SetStateAction<AboutMeContent>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  loggedInUser: User;
}

const ProductsSummaryCard = ({ products, categories }: { products: Product[], categories: Category[] }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Resumen de Productos</CardTitle>
            <CardDescription>
                Vista rápida del inventario de productos.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Progreso de Stock</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.slice(0, 3).map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell><Progress value={product.stock} className="h-2" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const ServicesSummaryCard = ({ services }: { services: Service[] }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Resumen de Servicios</CardTitle>
             <CardDescription>
                Servicios ofrecidos actualmente.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {services.map((service) => (
                    <li key={service.id} className="flex items-start gap-3">
                        <div className="p-2 bg-muted rounded-full">
                           <Palette className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold">{service.title}</p>
                            <p className="text-sm text-muted-foreground break-words">{service.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);


export function AdminDashboardContent({ appState }: AdminDashboardContentProps) {
  const { products, services, testimonials, galleryItems, categories } = appState;
  
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  
  const testimonialsPending = testimonials.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Productos" 
          value={products.length.toString()}
          icon={ShoppingBag} 
          change={`${totalStock} en stock`}
          changeColor="text-gray-500"
        />
        <StatCard 
          title="Servicios Ofrecidos" 
          value={services.length.toString()}
          icon={Palette} 
          change="activos"
          changeColor="text-gray-500"
        />
        <StatCard 
          title="Testimonios" 
          value={testimonials.length.toString()}
          icon={Star} 
          change={`${testimonialsPending} pendientes`}
          changeColor={testimonialsPending > 0 ? "text-orange-500" : "text-gray-500"}
        />
        <StatCard 
          title="Galería" 
          value={galleryItems.length.toString()}
          icon={ImageIcon} 
          change="imágenes y videos"
          changeColor="text-gray-500"
        />
      </div>

      {/* Mid-level Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <ProductsSummaryCard products={products} categories={categories} />
        </div>
        <div>
           <ServicesSummaryCard services={services} />
        </div>
      </div>
    </div>
  );
}


'use client';
import type { AppState, HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category } from '@/lib/types';
import { StatCard } from './StatCard';
import { BarChart, Brush, FileText, ImageIcon, MessageSquare, Palette, ShoppingBag, Sparkles, Star, Users } from 'lucide-react';
import { ChartCard } from './ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import Image from 'next/image';
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

export function AdminDashboardContent({ appState }: AdminDashboardContentProps) {
  const { products, services, testimonials, galleryItems, categories, users } = appState;
  
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const productsInStock = products.filter(p => p.stock > 0).length;
  const stockPercentage = products.length > 0 ? (productsInStock / products.length) * 100 : 0;
  
  const testimonialsPending = testimonials.filter(t => t.status === 'pending').length;
  const testimonialsApproved = testimonials.filter(t => t.status === 'approved').length;
  const approvalRate = testimonials.length > 0 ? (testimonialsApproved / (testimonialsApproved + testimonials.filter(t => t.status === 'rejected').length)) * 100 : 0;

  const productStockData = categories.map(category => ({
    name: category.name,
    total: products
      .filter(p => p.categoryId === category.id)
      .reduce((acc, p) => acc + p.stock, 0)
  }));
  
  const testimonialStatusData = [
    { name: 'Aprobados', value: testimonialsApproved },
    { name: 'Pendientes', value: testimonialsPending },
    { name: 'Rechazados', value: testimonials.filter(t => t.status === 'rejected').length }
  ];

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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Stock de Productos por Categoría" chartData={productStockData} dataKey="total" />
        <ChartCard title="Estado de Testimonios" chartData={testimonialStatusData} dataKey="value" type="line" />
      </div>

       {/* Projects and Orders Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Progreso de Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.slice(0, 5).map(product => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image src={product.imageUrl} alt={product.name} width={36} height={36} className="rounded-md object-cover" />
                                        <span className="font-medium">{product.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    <div className="w-3/4">
                                        <Progress value={(product.stock / 50) * 100} className="h-2" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Resumen de Testimonios</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {testimonials.slice(0, 5).map(t => (
                         <li key={t.id} className="flex items-start gap-3">
                            <div>
                               <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'} className={cn('w-6 h-6 p-0 flex items-center justify-center', t.status === 'approved' && 'bg-green-500')}>{
                                    {'approved': <Star className="h-4 w-4"/>, 'pending': <MessageSquare className="h-4 w-4"/>, 'rejected': <Sparkles className="h-4 w-4"/>}[t.status]
                               }</Badge>
                            </div>
                            <div>
                                <p className="font-medium">{t.author}</p>
                                <p className="text-sm text-muted-foreground truncate">{t.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

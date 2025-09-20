
'use client';
import type { AppState, HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category } from '@/lib/types';
import { StatCard } from './StatCard';
import { BarChart, Brush, FileText, ImageIcon, MessageSquare, Palette, ShoppingBag, Sparkles, Star, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { ChartCard } from './ChartCard';

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

const UsersSummaryCard = ({ users }: { users: User[] }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Resumen de Usuarios</CardTitle>
            <CardDescription>
                Actualmente hay {users.length} usuarios registrados en el sistema.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {users.slice(0, 4).map((user) => (
                    <div key={user.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent text-primary-foreground flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const CategoriesSummaryCard = ({ categories }: { categories: Category[] }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Categorías de Productos</CardTitle>
            <CardDescription>
                Gestiona y organiza tus productos.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="text-sm">
                       {category.name}
                    </Badge>
                ))}
            </div>
        </CardContent>
    </Card>
);


export function AdminDashboardContent({ appState }: AdminDashboardContentProps) {
  const { products, services, testimonials, galleryItems, categories, users } = appState;
  
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  
  const testimonialsPending = testimonials.filter(t => t.status === 'pending').length;

  const productStockData = categories.map(category => ({
    name: category.name,
    total: products
      .filter(p => p.categoryId === category.id)
      .reduce((acc, p) => acc + 1, 0)
  }));

  const productInventoryData = products.slice(0, 5).map(product => ({
    name: product.name.split(' ')[0], // Shorten name for chart
    stock: product.stock
  }));


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
           <UsersSummaryCard users={users} />
        </div>
        <div>
           <CategoriesSummaryCard categories={categories} />
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
         <div className="lg:col-span-3">
          <ChartCard 
            title="Inventario de Productos" 
            chartData={productInventoryData} 
            dataKey="stock" 
            type="line" 
          />
         </div>
         <div className="lg:col-span-2">
           <ChartCard 
            title="Productos por Categoría" 
            chartData={productStockData} 
            dataKey="total" 
            type="bar"
            layout='vertical'
          />
         </div>
      </div>
    </div>
  );
}

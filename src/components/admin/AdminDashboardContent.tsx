
'use client';
import type { AppState, HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category } from '@/lib/types';
import { StatCard } from './StatCard';
import { BarChart, Brush, FileText, ImageIcon, MessageSquare, Palette, ShoppingBag, Sparkles, Star, Users } from 'lucide-react';
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
  
  const testimonialStatusData = [
    { name: 'Aprobados', value: testimonials.filter(t => t.status === 'approved').length },
    { name: 'Pendientes', value: testimonialsPending },
    { name: 'Rechazados', value: testimonials.filter(t => t.status === 'rejected').length }
  ];
  
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

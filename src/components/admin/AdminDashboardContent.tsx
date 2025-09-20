
'use client';
import type { AppState, HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category } from '@/lib/types';
import { StatCard } from './StatCard';
import { Palette, ShoppingBag, Star, ImageIcon, Users, BarChart2, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { ChartCard } from './ChartCard';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart as RechartsPieChart, Cell, Legend, CartesianGrid } from 'recharts';

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

  const productsByCategoryData = categories.map(category => ({
    name: category.name,
    total: products.filter(p => p.categoryId === category.id).length
  })).filter(c => c.total > 0);

  const testimonialStatusData = [
    { name: 'Aprobados', value: testimonials.filter(t => t.status === 'approved').length },
    { name: 'Pendientes', value: testimonials.filter(t => t.status === 'pending').length },
    { name: 'Rechazados', value: testimonials.filter(t => t.status === 'rejected').length },
  ];

  const stockByCategoryData = categories.map(category => ({
    name: category.name,
    stock: products
      .filter(p => p.categoryId === category.id)
      .reduce((acc, p) => acc + p.stock, 0),
  })).filter(c => c.stock > 0);

  const PIE_COLORS = ['hsl(var(--chart-2))', 'hsl(var(--chart-4))', 'hsl(var(--chart-1))'];

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

       {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Productos por Categoría"
          description="Distribución de productos en el catálogo."
          icon={BarChart2}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productsByCategoryData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Estado de Testimonios"
          description="Resumen de las opiniones de los clientes."
          icon={PieChart}
        >
          <ResponsiveContainer width="100%" height={300}>
             <RechartsPieChart>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
              <Pie data={testimonialStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                 {testimonialStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
              </Pie>
              <Legend iconSize={10} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>


      {/* Mid-level Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
              title="Resumen de Productos"
              description="Vista rápida del inventario de productos."
              icon={BarChart2}
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stockByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                   <Bar dataKey="stock" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
        </div>
        <div>
           <ServicesSummaryCard services={services} />
        </div>
      </div>
    </div>
  );
}

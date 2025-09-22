
'use client';
import type { AppState, HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category, Perfume } from '@/lib/types';
import { StatCard } from './StatCard';
import { Palette, ShoppingBag, Star, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartCard } from './ChartCard';
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Legend, CartesianGrid, YAxis, AreaChart, Area, Cell } from 'recharts';
import { PieChart3D } from './PieChart3D';


interface AdminDashboardContentProps {
  appState: AppState;
  setHeroContent: React.Dispatch<React.SetStateAction<HeroContent>>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setPerfumes: React.Dispatch<React.SetStateAction<Perfume[]>>;
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
  const { products, services, testimonials, galleryItems, categories, perfumes } = appState;
  
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  
  const testimonialsPending = testimonials.filter(t => t.status === 'pending').length;

  const productsByCategoryData = categories.map(category => ({
    name: category.name,
    value: products.filter(p => p.categoryId === category.id).length
  })).filter(c => c.value > 0);

  const testimonialStatusData = [
    { name: 'Aprobados', value: testimonials.filter(t => t.status === 'approved').length },
    { name: 'Pendientes', value: testimonials.filter(t => t.status === 'pending').length },
    { name: 'Rechazados', value: testimonials.filter(t => t.status === 'rejected').length },
  ];
  
  const BAR_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];
  const stockByProductData = products.map((product, index) => ({
    name: product.name,
    stock: product.stock,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  }));


  const PIE_COLORS = ['hsl(260, 80%, 60%)', 'hsl(330, 85%, 65%)', 'hsl(180, 70%, 45%)', 'hsl(30, 95%, 60%)', 'hsl(210, 90%, 55%)'];
  
  // Map colors to data for the 3D pie chart
  const productsByCategoryDataWithColors = productsByCategoryData.map((item, index) => ({
    ...item,
    color: PIE_COLORS[index % PIE_COLORS.length],
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

       {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Productos por Categoría"
          description={`${products.length} productos en total`}
        >
          <PieChart3D data={productsByCategoryDataWithColors} />
        </ChartCard>

        <ChartCard
          title="Estado de Testimonios"
          description={`${testimonialsPending} pendientes de revisión`}
        >
           <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={testimonialStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorTestimonials" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                    <Area type="monotone" dataKey="value" name="Cantidad" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorTestimonials)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
      </div>


      {/* Mid-level Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
              title="Resumen de Productos"
              description={`${totalStock} unidades en total`}
              icon={ShoppingBag}
              mainValue={totalStock.toString()}
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stockByProductData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                   <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={() => ''} />
                   <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                   <Legend />
                   <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                     {stockByProductData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.fill} />
                     ))}
                   </Bar>
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

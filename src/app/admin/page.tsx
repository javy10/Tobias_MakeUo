
'use client';
import { useState, useEffect } from 'react';
import { AdminDashboard as AdminDashboardComponent } from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initialUsers } from '@/lib/data';
import type { User, HeroContent, Service, Product, GalleryItem, Testimonial, AboutMeContent } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { appState } from '@/app/page';


interface AdminPageProps {
  heroContent?: HeroContent;
  setHeroContent?: React.Dispatch<React.SetStateAction<HeroContent>>;
  services?: Service[];
  setServices?: React.Dispatch<React.SetStateAction<Service[]>>;
  products?: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  galleryItems?: GalleryItem[];
  setGalleryItems?: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  testimonials?: Testimonial[];
  setTestimonials?: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  aboutMeContent?: AboutMeContent;
  setAboutMeContent?: React.Dispatch<React.SetStateAction<AboutMeContent>>;
}

export default function AdminPage(props: AdminPageProps) {
  const [internalHeroContent, setInternalHeroContent] = useState<HeroContent>(appState.heroContent);
  const [internalServices, setInternalServices] = useState<Service[]>(appState.services);
  const [internalProducts, setInternalProducts] = useState<Product[]>(appState.products);
  const [internalGalleryItems, setInternalGalleryItems] = useState<GalleryItem[]>(appState.galleryItems);
  const [internalTestimonials, setInternalTestimonials] = useState<Testimonial[]>(appState.testimonials);
  const [internalAboutMeContent, setInternalAboutMeContent] = useState<AboutMeContent>(appState.aboutMeContent);
  
  const heroContent = props.heroContent ?? internalHeroContent;
  const setHeroContent = props.setHeroContent ?? setInternalHeroContent;
  const services = props.services ?? internalServices;
  const setServices = props.setServices ?? setInternalServices;
  const products = props.products ?? internalProducts;
  const setProducts = props.setProducts ?? setInternalProducts;
  const galleryItems = props.galleryItems ?? internalGalleryItems;
  const setGalleryItems = props.setGalleryItems ?? setInternalGalleryItems;
  const testimonials = props.testimonials ?? internalTestimonials;
  const setTestimonials = props.setTestimonials ?? setInternalTestimonials;
  const aboutMeContent = props.aboutMeContent ?? internalAboutMeContent;
  const setAboutMeContent = props.setAboutMeContent ?? setInternalAboutMeContent;
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Persist state changes to the global object
  useEffect(() => {
    appState.heroContent = heroContent;
  }, [heroContent]);
  useEffect(() => {
    appState.services = services;
  }, [services]);
  useEffect(() => {
    appState.products = products;
  }, [products]);
  useEffect(() => {
    appState.galleryItems = galleryItems;
  }, [galleryItems]);
  useEffect(() => {
    appState.testimonials = testimonials;
  }, [testimonials]);
  useEffect(() => {
    appState.aboutMeContent = aboutMeContent;
  }, [aboutMeContent]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setAuthenticatedUser(user);
      setError('');
    } else {
      setError('Correo electrónico o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    router.push('/');
  };

  if (!authenticatedUser) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">Acceso Administrativo</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminDashboardComponent
      loggedInUser={authenticatedUser}
      users={users}
      setUsers={setUsers}
      onLogout={handleLogout}
      heroContent={heroContent}
      setHeroContent={setHeroContent}
      services={services}
      setServices={setServices}
      products={products}
      setProducts={setProducts}
      galleryItems={galleryItems}
      setGalleryItems={setGalleryItems}
      testimonials={testimonials}
      setTestimonials={setTestimonials}
      aboutMeContent={aboutMeContent}
      setAboutMeContent={setAboutMeContent}
    />
  );
}

'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import type { AboutMeContent, Category, GalleryItem, HeroContent, Product, Service, Testimonial, User, Perfume } from '@/lib/types';
import { initialAboutMeContent, initialCategories, initialGalleryItems, initialHeroContent, initialProducts, initialServices, initialTestimonials, initialUsers, initialPerfumes } from '@/lib/data';
import { seedDatabase, getAllItemsFromFirestore } from '@/lib/firebase';

interface AppState {
  heroContent: HeroContent;
  services: Service[];
  products: Product[];
  perfumes: Perfume[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
  aboutMeContent: AboutMeContent;
  users: User[];
  categories: Category[];
}

interface AppContextType {
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
  isStateLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  const [heroContent, setHeroContent] = useState<HeroContent>(initialHeroContent);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [perfumes, setPerfumes] = useState<Perfume[]>(initialPerfumes);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [aboutMeContent, setAboutMeContent] = useState<AboutMeContent>(initialAboutMeContent);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        if (!isMounted) return;
        
        await seedDatabase();

        const heroContent = await getAllItemsFromFirestore<HeroContent>('heroContent');
        const services = await getAllItemsFromFirestore<Service>('services');
        const products = await getAllItemsFromFirestore<Product>('products');
        const perfumes = await getAllItemsFromFirestore<Perfume>('perfumes');
        const galleryItems = await getAllItemsFromFirestore<GalleryItem>('galleryItems');
        const aboutContent = await getAllItemsFromFirestore<AboutMeContent>('aboutMeContent');
        const users = await getAllItemsFromFirestore<User>('users');
        const categories = await getAllItemsFromFirestore<Category>('categories');
        const testimonials = await getAllItemsFromFirestore<Testimonial>('testimonials');

        if (!isMounted) return;

        setHeroContent(heroContent[0] || initialHeroContent);
        setServices(services || initialServices);
        setProducts(products || initialProducts);
        setPerfumes(perfumes || initialPerfumes);
        setGalleryItems(galleryItems || initialGalleryItems);
        setAboutMeContent(aboutContent[0] || initialAboutMeContent);
        setUsers(users || initialUsers);
        setCategories(categories || initialCategories);
        setTestimonials(testimonials || initialTestimonials);

      } catch (error) {
          console.error('Failed to load data from Firestore, using initial data.', error);
      } finally {
        setIsStateLoaded(true);
      }
    };
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const appState: AppState = {
    heroContent,
    services,
    products,
    perfumes,
    galleryItems,
    testimonials,
    aboutMeContent,
    users,
    categories,
  };

  const contextValue: AppContextType = {
    appState,
    setHeroContent,
    setServices,
    setProducts,
    setPerfumes,
    setGalleryItems,
    setTestimonials,
    setAboutMeContent,
    setUsers,
    setCategories,
    isStateLoaded,
  };

  return (
    <html lang="en" className="!scroll-smooth dark">
      <head>
        <title>Tobias MakeUp</title>
        <meta name="description" content="Belleza que Transforma. Tu estilo personal, realzado con el arte del maquillaje profesional." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AppContext.Provider value={contextValue}>
          {isStateLoaded ? children : <div className="flex h-screen items-center justify-center">Cargando...</div>}
        </AppContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}
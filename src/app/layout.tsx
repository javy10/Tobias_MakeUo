'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import type { AboutMeContent, Category, GalleryItem, HeroContent, Product, Service, Testimonial, User, Perfume, Course } from '@/lib/types';
import { initialAboutMeContent, initialCategories, initialGalleryItems, initialHeroContent, initialProducts, initialServices, initialTestimonials, initialUsers, initialPerfumes, initialCourses } from '@/lib/data';
import { getAllItems } from '@/lib/supabase-db';
import { useRealtimeState, useRealtimeSingleton } from '@/hooks/use-realtime';
import { RealtimeNotification } from '@/components/shared/RealtimeNotification';
import { ConnectionStatus } from '@/components/shared/ConnectionStatus';
import { FastLoadingSpinner } from '@/components/ui/fast-loading-spinner';
import { testSupabaseConnection } from '@/lib/supabase-test';
import '@/lib/error-handler';
import { initializeGlobalErrorInterceptor } from '@/lib/global-error-interceptor';
import { initializeUniversalErrorCatcher } from '@/lib/universal-error-catcher';
import { UniversalErrorBoundary } from '@/lib/react-error-boundary';

interface AppState {
  heroContent: HeroContent;
  services: Service[];
  products: Product[];
  perfumes: Perfume[];
  courses: Course[];
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
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
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
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [aboutMeContent, setAboutMeContent] = useState<AboutMeContent>(initialAboutMeContent);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Configurar suscripciones de tiempo real para cada tabla
  const servicesRealtime = useRealtimeState<Service>('services', setServices);
  const productsRealtime = useRealtimeState<Product>('products', setProducts);
  const perfumesRealtime = useRealtimeState<Perfume>('perfumes', setPerfumes);
  const coursesRealtime = useRealtimeState<Course>('courses', setCourses);
  const galleryRealtime = useRealtimeState<GalleryItem>('gallery_items', setGalleryItems);
  const testimonialsRealtime = useRealtimeState<Testimonial>('testimonials', setTestimonials);
  const usersRealtime = useRealtimeState<User>('users', setUsers);
  const categoriesRealtime = useRealtimeState<Category>('categories', setCategories);
  
  // Suscripciones para contenido singleton
  const heroRealtime = useRealtimeSingleton<HeroContent>('hero_content', setHeroContent);
  const aboutMeRealtime = useRealtimeSingleton<AboutMeContent>('about_me_content', setAboutMeContent);

  // Determinar el estado general de conexión
  const isConnected = servicesRealtime.isConnected || 
                     productsRealtime.isConnected || 
                     perfumesRealtime.isConnected ||
                     coursesRealtime.isConnected ||
                     galleryRealtime.isConnected ||
                     testimonialsRealtime.isConnected ||
                     usersRealtime.isConnected ||
                     categoriesRealtime.isConnected ||
                     heroRealtime.isConnected ||
                     aboutMeRealtime.isConnected;

  // Obtener la última actualización
  const lastUpdate = servicesRealtime.lastUpdate || 
                    productsRealtime.lastUpdate || 
                    perfumesRealtime.lastUpdate ||
                    coursesRealtime.lastUpdate ||
                    galleryRealtime.lastUpdate ||
                    testimonialsRealtime.lastUpdate ||
                    usersRealtime.lastUpdate ||
                    categoriesRealtime.lastUpdate ||
                    heroRealtime.lastUpdate ||
                    aboutMeRealtime.lastUpdate;

  useEffect(() => {
    let isMounted = true;
    
    // Inicializar interceptores globales de errores
    initializeGlobalErrorInterceptor();
    initializeUniversalErrorCatcher();
    
    // CARGAR INMEDIATAMENTE - No esperar a Supabase
    console.log('🚀 Cargando aplicación instantáneamente...');
    setIsStateLoaded(true);
    
    // Cargar datos de Supabase en segundo plano (sin bloquear la UI)
    const loadDataInBackground = async () => {
      try {
        if (!isMounted) return;
        
        // Test de conexión a Supabase con timeout corto
        const connectionPromise = testSupabaseConnection();
        const timeoutPromise = new Promise<boolean>((resolve) => 
          setTimeout(() => resolve(false), 2000) // 2 segundos timeout
        );
        
        const isConnected = await Promise.race([connectionPromise, timeoutPromise]);
        
        if (!isConnected) {
          console.warn('⚠️ Supabase no disponible, usando datos iniciales');
          return;
        }
        
        console.log('🔄 Cargando datos desde Supabase en segundo plano...');
        
        // Cargar todos los datos en paralelo
        const allData = await Promise.allSettled([
          getAllItems<HeroContent>('hero_content'),
          getAllItems<Service>('services'),
          getAllItems<Product>('products'),
          getAllItems<Category>('categories'),
          getAllItems<Perfume>('perfumes'),
          getAllItems<Course>('courses'),
          getAllItems<GalleryItem>('gallery_items'),
          getAllItems<AboutMeContent>('about_me_content'),
          getAllItems<User>('users'),
          getAllItems<Testimonial>('testimonials')
        ]);

        if (!isMounted) return;

        const [
          heroContent,
          services,
          products,
          categories,
          perfumes,
          courses,
          galleryItems,
          aboutContent,
          users,
          testimonials
        ] = allData;

        // Actualizar estado solo si los datos son válidos
        if (heroContent.status === 'fulfilled' && heroContent.value[0]) {
          setHeroContent(heroContent.value[0]);
        }
        if (services.status === 'fulfilled') {
          setServices(services.value);
        }
        if (products.status === 'fulfilled') {
          setProducts(products.value);
        }
        if (categories.status === 'fulfilled') {
          setCategories(categories.value);
        }
        if (perfumes.status === 'fulfilled') {
          setPerfumes(perfumes.value);
        }
        if (courses.status === 'fulfilled') {
          setCourses(courses.value);
        }
        if (galleryItems.status === 'fulfilled') {
          setGalleryItems(galleryItems.value);
        }
        if (aboutContent.status === 'fulfilled' && aboutContent.value[0]) {
          setAboutMeContent(aboutContent.value[0]);
        }
        if (users.status === 'fulfilled') {
          setUsers(users.value);
        }
        if (testimonials.status === 'fulfilled') {
          setTestimonials(testimonials.value);
        }

        console.log('✅ Datos de Supabase cargados en segundo plano');

      } catch (error) {
        console.error('❌ Error al cargar datos desde Supabase:', error);
        // No hacer nada, mantener datos iniciales
      }
    };
    
    // Ejecutar carga en segundo plano
    loadDataInBackground();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Configurar suscripciones de tiempo real después de cargar los datos
  useEffect(() => {
    if (!isStateLoaded) return;

    console.log('🔌 Configurando suscripciones de tiempo real...');

    // Las suscripciones se configurarán automáticamente a través de los hooks
    // No necesitamos hacer nada aquí, los hooks se encargan de la suscripción
  }, [isStateLoaded]);

  const appState: AppState = {
    heroContent,
    services,
    products,
    perfumes,
    courses,
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
    setCourses,
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark transition-colors duration-300 antialiased" suppressHydrationWarning>
        <UniversalErrorBoundary>
          <AppContext.Provider value={contextValue}>
            {isStateLoaded ? children : (
              <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <FastLoadingSpinner text="Cargando aplicación..." size="lg" />
              </div>
            )}
          </AppContext.Provider>
        </UniversalErrorBoundary>
        <ConnectionStatus />
        <RealtimeNotification isConnected={isConnected} lastUpdate={lastUpdate} />
        <Toaster />
      </body>
    </html>
  );
}
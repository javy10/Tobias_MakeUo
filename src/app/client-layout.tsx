'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import type { AboutMeContent, Category, GalleryItem, HeroContent, Product, Service, Testimonial, User, Perfume, Course } from '@/lib/types';
import { initialAboutMeContent, initialCategories, initialGalleryItems, initialHeroContent, initialProducts, initialServices, initialTestimonials, initialUsers, initialPerfumes, initialCourses } from '@/lib/data';
import { getAllItems } from '@/lib/supabase-db';
import { useRealtimeState, useRealtimeSingleton } from '@/hooks/use-realtime';
import { RealtimeNotification } from '@/components/shared/RealtimeNotification';
import { ConnectionStatus } from '@/components/shared/ConnectionStatus';
import { LoadingSpinner } from '@/components/ui/dynamic-loading';
import { testRobustConnection } from '@/lib/robust-connection';
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

export function ClientLayoutProvider({ children }: { children: React.ReactNode }) {
  const [isStateLoaded, setIsStateLoaded] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataLoadAttempts, setDataLoadAttempts] = useState(0);

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
    
    // Función para cargar datos con retry logic
    const loadDataWithRetry = async (attempt: number = 1) => {
      try {
        if (!isMounted) return;
        
        console.log(`🔄 Intento ${attempt} de carga de datos desde Supabase...`);
        setIsDataLoading(true);
        
        // Test de conexión robusta a Supabase
        const isConnected = await testRobustConnection({
          maxRetries: 2,
          baseTimeout: 15000,
          retryDelay: 3000
        });
        
        if (!isConnected) {
          console.warn(`⚠️ Supabase no disponible en intento ${attempt}`);
          if (attempt < 3) {
            // Retry después de 2 segundos
            setTimeout(() => {
              if (isMounted) {
                setDataLoadAttempts(attempt + 1);
                loadDataWithRetry(attempt + 1);
              }
            }, 2000);
            return;
          } else {
            console.warn('⚠️ Máximo de intentos alcanzado, usando datos iniciales');
            setIsDataLoading(false);
            setIsStateLoaded(true);
            return;
          }
        }
        
        console.log('🔄 Cargando datos desde Supabase...');
        
        // Cargar todos los datos en paralelo con timeout individual
        const dataPromises = [
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
        ];

        // Agregar timeout a cada promesa
        const timeoutPromises = dataPromises.map(promise => 
          Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 15000) // 15 segundos por consulta
            )
          ])
        );

        const allData = await Promise.allSettled(timeoutPromises);

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

        // Verificar si al menos algunos datos se cargaron correctamente
        const successCount = allData.filter(result => result.status === 'fulfilled').length;
        console.log(`✅ ${successCount}/${allData.length} tablas cargadas exitosamente`);

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

        console.log('✅ Datos de Supabase cargados exitosamente');
        setIsDataLoading(false);
        setIsStateLoaded(true);

      } catch (error) {
        console.error(`❌ Error al cargar datos desde Supabase (intento ${attempt}):`, error);
        
        if (attempt < 3) {
          // Retry después de 2 segundos
          setTimeout(() => {
            if (isMounted) {
              setDataLoadAttempts(attempt + 1);
              loadDataWithRetry(attempt + 1);
            }
          }, 2000);
        } else {
          console.warn('⚠️ Máximo de intentos alcanzado, usando datos iniciales');
          setIsDataLoading(false);
          setIsStateLoaded(true);
        }
      }
    };
    
    // Iniciar carga de datos
    loadDataWithRetry();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Debug: Log cuando isStateLoaded cambia
  useEffect(() => {
    console.log('🔄 isStateLoaded cambió a:', isStateLoaded);
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
    <UniversalErrorBoundary>
      <AppContext.Provider value={contextValue}>
        {isStateLoaded ? (
          children
        ) : (
          <LoadingSpinner 
            text="Cargando datos de la base de datos..." 
            showAttempts={isDataLoading}
            attempt={dataLoadAttempts}
            maxAttempts={3}
          />
        )}
        <ConnectionStatus />
        <RealtimeNotification isConnected={isConnected} lastUpdate={lastUpdate} />
      </AppContext.Provider>
    </UniversalErrorBoundary>
  );
}

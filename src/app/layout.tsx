
'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import type { AboutMeContent, Category, GalleryItem, HeroContent, Product, Service, Testimonial, User, Perfume } from '@/lib/types';
import { initialAboutMeContent, initialCategories, initialGalleryItems, initialHeroContent, initialProducts, initialServices, initialTestimonials, initialUsers, initialPerfumes } from '@/lib/data';
import { getAllItemsFromDB, saveItemToDB } from '@/lib/db';

// Define the keys for localStorage
const LOCAL_STORAGE_KEYS = {
  testimonials: 'testimonials',
  users: 'users',
  categories: 'categories',
};

// Define the store names for IndexedDB
const DB_STORE_NAMES = {
  heroContent: 'heroContent',
  services: 'services',
  products: 'products',
  perfumes: 'perfumes',
  galleryItems: 'galleryItems',
  aboutMeContent: 'aboutMeContent',
};

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

const getInitialStateFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  // Initialize state with default values first
  const [heroContent, setHeroContent] = useState<HeroContent>(initialHeroContent);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [perfumes, setPerfumes] = useState<Perfume[]>(initialPerfumes);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [aboutMeContent, setAboutMeContent] = useState<AboutMeContent>(initialAboutMeContent);
  
  // State from localStorage
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getInitialStateFromLocalStorage(LOCAL_STORAGE_KEYS.testimonials, initialTestimonials));
  const [users, setUsers] = useState<User[]>(() => getInitialStateFromLocalStorage(LOCAL_STORAGE_KEYS.users, initialUsers));
  const [categories, setCategories] = useState<Category[]>(() => getInitialStateFromLocalStorage(LOCAL_STORAGE_KEYS.categories, initialCategories));


  // Effect to save simple data to localStorage
  useEffect(() => {
    if (isStateLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.testimonials, JSON.stringify(testimonials));
        localStorage.setItem(LOCAL_STORAGE_KEYS.users, JSON.stringify(users));
        localStorage.setItem(LOCAL_STORAGE_KEYS.categories, JSON.stringify(categories));
      } catch (error) {
        console.error('Failed to save state to localStorage:', error);
      }
    }
  }, [isStateLoaded, testimonials, users, categories]);


  // Effect to load data from IndexedDB on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadStore = async <T>(storeName: string, initialState: T[] | T, isArray = true): Promise<T | T[]> => {
          let dbItems = await getAllItemsFromDB<T>(storeName);
          // If the store is empty, populate it with initial data
          if (dbItems.length === 0) {
            const itemsToSave = Array.isArray(initialState) ? initialState : [initialState];
            for (const item of itemsToSave) {
              await saveItemToDB(item, storeName);
            }
            dbItems = await getAllItemsFromDB<T>(storeName);
          }
          return isArray ? dbItems : dbItems[0];
        };
        
        const [
            loadedHero, 
            loadedServices, 
            loadedProducts, 
            loadedPerfumes, 
            loadedGallery, 
            loadedAbout
        ] = await Promise.all([
            loadStore(DB_STORE_NAMES.heroContent, initialHeroContent, false) as Promise<HeroContent>,
            loadStore(DB_STORE_NAMES.services, initialServices) as Promise<Service[]>,
            loadStore(DB_STORE_NAMES.products, initialProducts) as Promise<Product[]>,
            loadStore(DB_STORE_NAMES.perfumes, initialPerfumes) as Promise<Perfume[]>,
            loadStore(DB_STORE_NAMES.galleryItems, initialGalleryItems) as Promise<GalleryItem[]>,
            loadStore(DB_STORE_NAMES.aboutMeContent, initialAboutMeContent, false) as Promise<AboutMeContent>,
        ]);
        
        setHeroContent(loadedHero);
        setServices(loadedServices);
        setProducts(loadedProducts);
        setPerfumes(loadedPerfumes);
        setGalleryItems(loadedGallery);
        setAboutMeContent(loadedAbout);

      } catch (error) {
          console.error('Failed to load data from IndexedDB, using initial data.', error);
          // Set initial data as fallback
          setHeroContent(initialHeroContent);
          setServices(initialServices);
          setProducts(initialProducts);
          setPerfumes(initialPerfumes);
          setGalleryItems(initialGalleryItems);
          setAboutMeContent(initialAboutMeContent);
      } finally {
        setIsStateLoaded(true);
      }
    };
    loadData();
  }, []);
  
  // Effect to listen for storage changes and update state in real-time
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || !event.newValue) return;
      try {
        const newValue = JSON.parse(event.newValue);
        switch (event.key) {
          case LOCAL_STORAGE_KEYS.testimonials:
            setTestimonials(newValue);
            break;
          case LOCAL_STORAGE_KEYS.users:
            setUsers(newValue);
            break;
          case LOCAL_STORAGE_KEYS.categories:
            setCategories(newValue);
            break;
          default:
            break;
        }
      } catch (error) {
        console.warn(`Error parsing storage change for key "${event.key}":`, error);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
      <body className="font-body antialiased">
        <AppContext.Provider value={contextValue}>
          {isStateLoaded ? children : <div className="flex h-screen items-center justify-center">Cargando...</div>}
        </AppContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}

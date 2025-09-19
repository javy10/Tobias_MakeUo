
'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import type { AboutMeContent, Category, GalleryItem, HeroContent, Product, Service, Testimonial, User } from '@/lib/types';
import { initialAboutMeContent, initialCategories, initialGalleryItems, initialHeroContent, initialProducts, initialServices, initialTestimonials, initialUsers } from '@/lib/data';
import { getAllItemsFromDB, saveItemToDB } from '@/lib/db';

// 1. Define the shape of our global state
interface AppState {
  heroContent: HeroContent;
  services: Service[];
  products: Product[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
  aboutMeContent: AboutMeContent;
  users: User[];
  categories: Category[];
}

// 2. Define the shape of our context, including setters
interface AppContextType {
  appState: AppState;
  setHeroContent: React.Dispatch<React.SetStateAction<HeroContent>>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  setAboutMeContent: React.Dispatch<React.SetStateAction<AboutMeContent>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isStateLoaded: boolean;
}

// 3. Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// 4. Create a custom hook for easy access to the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Helper function to get initial state from localStorage or defaults
const getInitialState = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
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

  // 5. Initialize the state here in the root layout, lazily from localStorage
  const [heroContent, setHeroContent] = useState<HeroContent>(() => getInitialState('heroContent', initialHeroContent));
  const [services, setServices] = useState<Service[]>(() => getInitialState('services', initialServices));
  const [products, setProducts] = useState<Product[]>(() => getInitialState('products', initialProducts));
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]); // Start with empty gallery
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getInitialState('testimonials', initialTestimonials));
  const [aboutMeContent, setAboutMeContent] = useState<AboutMeContent>(() => getInitialState('aboutMeContent', initialAboutMeContent));
  const [users, setUsers] = useState<User[]>(() => getInitialState('users', initialUsers));
  const [categories, setCategories] = useState<Category[]>(() => getInitialState('categories', initialCategories));


  const appState: AppState = {
    heroContent,
    services,
    products,
    galleryItems,
    testimonials,
    aboutMeContent,
    users,
    categories,
  };

  // Effect to save state to localStorage whenever it changes (excluding gallery)
  useEffect(() => {
    try {
      if (isStateLoaded) {
        localStorage.setItem('heroContent', JSON.stringify(heroContent));
        localStorage.setItem('services', JSON.stringify(services));
        localStorage.setItem('products', JSON.stringify(products));
        // Do not save galleryItems to localStorage
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        localStorage.setItem('aboutMeContent', JSON.stringify(aboutMeContent));
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('categories', JSON.stringify(categories));
      }
    } catch (error)
      {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [appState, isStateLoaded, heroContent, services, products, testimonials, aboutMeContent, users, categories]);
  
  // Effect to load data from localStorage and IndexedDB
  useEffect(() => {
    const loadData = async () => {
      // Load non-gallery items from localStorage
      setHeroContent(getInitialState('heroContent', initialHeroContent));
      setServices(getInitialState('services', initialServices));
      setProducts(getInitialState('products', initialProducts));
      setTestimonials(getInitialState('testimonials', initialTestimonials));
      setAboutMeContent(getInitialState('aboutMeContent', initialAboutMeContent));
      setUsers(getInitialState('users', initialUsers));
      setCategories(getInitialState('categories', initialCategories));

      // Load gallery items from IndexedDB
      try {
          let dbItems = await getAllItemsFromDB();

          // If DB has fewer items than initial data, it might be a fresh start
          // or a partial user-driven state. We'll populate missing initial items.
          if (dbItems.length < initialGalleryItems.length) {
              const dbItemIds = new Set(dbItems.map(item => item.id));
              const missingInitialItems = initialGalleryItems.filter(item => !dbItemIds.has(item.id));

              for (const item of missingInitialItems) {
                  await saveItemToDB(item);
              }
              // Re-fetch after potentially adding missing items
              dbItems = await getAllItemsFromDB();
          }
          setGalleryItems(dbItems);
      } catch (error) {
          console.error('Failed to load gallery from IndexedDB, using initial data.', error);
          setGalleryItems(initialGalleryItems);
      }
      
      setIsStateLoaded(true);
    };

    loadData();
  }, []);

  // 6. Assemble the state and setters into the context value
  const contextValue: AppContextType = {
    appState,
    setHeroContent,
    setServices,
    setProducts,
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
        {/* 7. Provide the context to all children */}
        <AppContext.Provider value={contextValue}>
          {isStateLoaded ? children : null /* Or a loading spinner */}
        </AppContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}

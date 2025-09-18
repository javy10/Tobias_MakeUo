
'use client';

import { useState, createContext, useContext } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import type { AboutMeContent, GalleryItem, HeroContent, Product, Service, Testimonial, User } from '@/lib/types';
import { initialAboutMeContent, initialGalleryItems, initialHeroContent, initialProducts, initialServices, initialTestimonials, initialUsers } from '@/lib/data';

// 1. Define the shape of our global state
interface AppState {
  heroContent: HeroContent;
  services: Service[];
  products: Product[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
  aboutMeContent: AboutMeContent;
  users: User[];
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 5. Initialize the state here in the root layout
  const [heroContent, setHeroContent] = useState<HeroContent>(initialHeroContent);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [aboutMeContent, setAboutMeContent] = useState<AboutMeContent>(initialAboutMeContent);
  const [users, setUsers] = useState<User[]>(initialUsers);

  // 6. Assemble the state and setters into the context value
  const contextValue: AppContextType = {
    appState: {
      heroContent,
      services,
      products,
      galleryItems,
      testimonials,
      aboutMeContent,
      users,
    },
    setHeroContent,
    setServices,
    setProducts,
    setGalleryItems,
    setTestimonials,
    setAboutMeContent,
    setUsers,
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
          {children}
        </AppContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}

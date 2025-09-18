
'use client';

import { useState } from 'react';
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Products } from "@/components/landing/Products";
import { Gallery } from "@/components/landing/Gallery";
import { AboutMe } from "@/components/landing/AboutMe";
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { initialAboutMeContent, initialGalleryItems, initialHeroContent, initialProducts, initialServices, initialTestimonials } from '@/lib/data';
import type { AboutMeContent, GalleryItem, HeroContent, Product, Service, Testimonial } from '@/lib/types';
import AdminPage from './admin/page';

// This is a global state store that can be accessed by both pages.
// In a real app, you'd use a state management library like Zustand or Redux.
export const appState = {
  heroContent: initialHeroContent,
  services: initialServices,
  products: initialProducts,
  galleryItems: initialGalleryItems,
  testimonials: initialTestimonials,
  aboutMeContent: initialAboutMeContent,
};

export default function Home() {
  const [heroContent, setHeroContent] = useState<HeroContent>(appState.heroContent);
  const [services, setServices] = useState<Service[]>(appState.services);
  const [products, setProducts] = useState<Product[]>(appState.products);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(appState.galleryItems);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(appState.testimonials);
  const [aboutMeContent, setAboutMeContent] = useState<AboutMeContent>(appState.aboutMeContent);
 
  // Update global state when local state changes
  appState.heroContent = heroContent;
  appState.services = services;
  appState.products = products;
  appState.galleryItems = galleryItems;
  appState.testimonials = testimonials;
  appState.aboutMeContent = aboutMeContent;


  // This is a simplified way to check for the admin route.
  // In a real app, you'd use Next.js router.
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return (
      <AdminPage
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

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <Hero content={heroContent} />
        <Services services={services} />
        <AboutMe content={aboutMeContent} />
        <Products products={products} />
        <Gallery galleryItems={galleryItems} />
        <Testimonials testimonials={testimonials} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

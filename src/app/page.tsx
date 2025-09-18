
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
import AdminDashboard from './admin/page';

export default function Home() {
  const [heroContent, setHeroContent] = useState<HeroContent>(initialHeroContent);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [aboutMeContent, setAboutMeContent] = useState<AboutMeContent>(initialAboutMeContent);
 
  // This is a simplified way to check for the admin route.
  // In a real app, you'd use Next.js router.
  if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
    return (
      <AdminDashboard
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


'use client';

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Products } from "@/components/landing/Products";
import { Gallery } from "@/components/landing/Gallery";
import { AboutMe } from "@/components/landing/AboutMe";
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { useAppContext } from './layout';

export default function Home() {
  const { appState, isStateLoaded } = useAppContext();
  
  if (!isStateLoaded) {
    // You can return a loading skeleton here
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <Hero content={appState.heroContent} />
        <AboutMe content={appState.aboutMeContent} />
        <Services services={appState.services} />
        <Products products={appState.products} categories={appState.categories} />
        <Gallery galleryItems={appState.galleryItems} />
        <Testimonials testimonials={appState.testimonials} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

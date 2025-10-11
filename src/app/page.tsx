
'use client';

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Products } from "@/components/landing/Products";
import { Perfumes } from "@/components/landing/Perfumes";
import { Gallery } from "@/components/landing/Gallery";
import { AboutMe } from "@/components/landing/AboutMe";
import { BeautyCourses } from '@/components/landing/BeautyCourses';
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { useAppContext } from './layout';
import { useVisibleSections } from '@/hooks/use-visible-sections';

export default function Home() {
  const { appState, isStateLoaded } = useAppContext();
  const sections = useVisibleSections(appState);
  
  if (!isStateLoaded) {
    // You can return a loading skeleton here
    return <div>Cargando...</div>;
  }

  // Función helper para verificar si una sección debe renderizarse
  const shouldRenderSection = (sectionId: string): boolean => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.hasData : false;
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <Hero content={appState.heroContent} />
        
        {shouldRenderSection('sobre-mi') && (
          <AboutMe content={appState.aboutMeContent} />
        )}
        
        {shouldRenderSection('servicios') && (
          <Services services={appState.services} />
        )}
        
        {shouldRenderSection('productos-de-belleza') && (
          <Products products={appState.products} categories={appState.categories} />
        )}
        
        {shouldRenderSection('perfumes') && (
          <Perfumes perfumes={appState.perfumes} />
        )}
        
        {shouldRenderSection('cursos') && (
          <BeautyCourses courses={appState.courses} />
        )}
        
        {shouldRenderSection('mis-trabajos') && (
          <Gallery galleryItems={appState.galleryItems} />
        )}
        
        {shouldRenderSection('testimonios') && (
          <Testimonials testimonials={appState.testimonials} />
        )}
        
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

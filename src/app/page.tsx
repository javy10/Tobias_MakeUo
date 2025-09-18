
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
  const { appState } = useAppContext();

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <Hero content={appState.heroContent} />
        <Services services={appState.services} />
        <AboutMe content={appState.aboutMeContent} />
        <Products products={appState.products} />
        <Gallery galleryItems={appState.galleryItems} />
        <Testimonials testimonials={appState.testimonials} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}


'use client';
import { Button } from '@/components/ui/button';
import type { HeroContent } from '@/lib/types';
import { Media } from '../shared/Media';
import { motion } from 'framer-motion';

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  const heroImageHint = 'makeup artistry';

  return (
    <motion.section 
      id="inicio" 
      className="relative h-[calc(100vh-64px)] min-h-[600px] w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Imagen de fondo de la base de datos */}
      {content.url && (
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Media
            src={content.url}
            type={content.type}
            alt="Imagen de fondo de Tobias MakeUp"
            fill
            style={{ objectFit: 'cover' as const }}
            className="w-full h-full"
            sizes="100vw"
            data-ai-hint="hero background image"
          />
        </motion.div>
      )}
      
      {/* Overlay oscuro para mejorar legibilidad */}
      <motion.div 
        className="absolute inset-0 bg-black/60 z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
      ></motion.div>
      
      {/* Patrones abstractos oscuros encima de la imagen */}
      <div className="absolute inset-0 overflow-hidden z-20">
        {/* Patrón izquierdo */}
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 opacity-20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.2, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
        {/* Patrón superior izquierdo */}
        <motion.div 
          className="absolute top-0 left-1/4 w-80 h-80 opacity-15"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-800/40 via-purple-700/20 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
        {/* Patrón derecho */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 opacity-20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.2, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="w-full h-full bg-gradient-to-bl from-purple-900/30 via-purple-800/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
        {/* Patrón inferior derecho */}
        <motion.div 
          className="absolute bottom-0 right-1/3 w-72 h-72 opacity-15"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="w-full h-full bg-gradient-to-tr from-purple-800/30 via-purple-700/15 to-transparent rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
        </motion.div>
        {/* Patrón central izquierdo */}
        <motion.div 
          className="absolute top-1/2 left-0 w-64 h-64 opacity-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-purple-900/25 via-purple-800/15 to-transparent rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
      </div>
      
      <div className="relative h-full flex items-center justify-center z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-headline mb-6 max-w-4xl mx-auto leading-tight text-white"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {content.title}
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 max-w-3xl mx-auto font-light text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {content.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="rounded-full text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 transition-all duration-300 bg-cyan-500 hover:bg-cyan-600 border-0"
              >
                <a href="#servicios">Descubre Nuestros Servicios</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

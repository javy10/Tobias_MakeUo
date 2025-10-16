'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Perfume } from '@/lib/types';
import Link from 'next/link';
import { Media } from '../shared/Media';
import { motion } from 'framer-motion';

interface PerfumesProps {
  perfumes: Perfume[];
}

export function Perfumes({ perfumes }: PerfumesProps) {
  const availablePerfumes = perfumes.filter(p => p.stock > 0);

  if (availablePerfumes.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      id="perfumes" 
      className="style-1-bg py-16 md:py-24 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Elementos flotantes decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 right-10 w-16 h-16 style-1-floating-circle rounded-full floating-element"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.5 }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-32 left-20 w-20 h-20 style-1-floating-circle rounded-full floating-element"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.7 }}
        ></motion.div>
        <motion.div 
          className="absolute top-1/2 right-1/4 w-12 h-12 style-1-floating-circle rounded-full floating-element"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.9 }}
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
            <motion.h2 
              className="text-4xl font-bold font-headline text-white style-1-shadow"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              Nuestra Colección de Perfumes
            </motion.h2>
            <motion.p 
              className="text-white/90 mt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Descubre fragancias que cautivan y definen tu estilo.
            </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          {availablePerfumes.map((perfume, index) => (
            <motion.div 
              key={perfume.id} 
              className="group relative overflow-hidden rounded-lg"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Imagen/Video de fondo */}
              <div className="relative w-full h-80 overflow-hidden">
                <Media
                  src={perfume.url}
                  type={perfume.type}
                  alt={perfume.name}
                  fill
                  style={{ objectFit: perfume.type === 'video' ? 'contain' : 'cover' }}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  data-ai-hint="perfume image"
                />
                
                {/* Overlay que aparece SOLO en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center mb-5">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mr-5 bg-white/20 backdrop-blur-sm">
                        <span className="text-lg font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <CardTitle className="font-headline text-2xl text-white">
                        {perfume.name}
                      </CardTitle>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4 line-clamp-3">
                      {perfume.description}
                    </p>
                    <div className="flex justify-between items-center mb-5">
                      <Badge variant="default" className='bg-green-500/20 text-green-300 border-green-500/50 text-sm'>
                        En Stock
                      </Badge>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button asChild className="rounded-full text-base px-8 py-4 bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300">
                        <Link href="#contacto">Consultar</Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

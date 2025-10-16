'use client';
import { Card, CardTitle } from '@/components/ui/card';
import type { Service } from '@/lib/types';
import { Media } from '../shared/Media';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
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
      id="servicios" 
      className="style-2-bg py-12 sm:py-16 md:py-20 lg:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-white"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            Nuestros Servicios
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Soluciones profesionales de belleza diseñadas para realzar tu estilo único
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.id} 
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
                  src={service.url}
                  type={service.type}
                  alt={service.title}
                  fill
                  style={{ objectFit: service.type === 'video' ? 'contain' : 'cover' }}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  data-ai-hint="service image"
                />
                
                {/* Overlay que aparece SOLO en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center mb-5">
                      <div className="style-2-icon-bg w-14 h-14 rounded-full flex items-center justify-center mr-5">
                        <span className="text-cyan-400 font-bold text-lg">{index + 1}</span>
                      </div>
                      <CardTitle className="font-headline text-2xl text-white">{service.title}</CardTitle>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6 line-clamp-3">{service.description}</p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button asChild className="rounded-full text-base px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-300">
                        <Link href="#contacto">Contáctame</Link>
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
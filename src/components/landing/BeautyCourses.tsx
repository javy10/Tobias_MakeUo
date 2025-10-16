'use client';
import { Card, CardTitle } from '@/components/ui/card';
import type { Course } from '@/lib/types';
import { Media } from '../shared/Media';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BeautyCoursesProps {
  courses: Course[];
}

export function BeautyCourses({ courses }: BeautyCoursesProps) {
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
      id="cursos" 
      className="style-3-bg py-12 sm:py-16 md:py-20 lg:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-gray-800 mb-4"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            Cursos de Belleza
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Aprende las técnicas más avanzadas de maquillaje y belleza con nuestros cursos especializados
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          {courses.map((course, index) => (
            <motion.div 
              key={course.id} 
              className="group relative overflow-hidden rounded-lg"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Imagen/Video de fondo */}
              <div className="relative w-full h-80 overflow-hidden">
                <Media 
                  src={course.url} 
                  type={course.type}
                  alt={course.name} 
                  fill
                  style={{ objectFit: course.type === 'video' ? 'contain' : 'cover' }}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  data-ai-hint="course image"
                />
                
                {/* Overlay que aparece SOLO en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center mb-5">
                      <div className="style-3-bullet w-14 h-14 rounded-full flex items-center justify-center mr-5">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <CardTitle className="font-headline text-2xl text-white">
                        {course.name}
                      </CardTitle>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-5 line-clamp-3">
                      {course.description}
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button asChild className="rounded-full text-base px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300">
                        <Link href="#contacto">Inscríbete ahora</Link>
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
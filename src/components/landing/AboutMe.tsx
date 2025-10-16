
'use client';
import type { AboutMeContent } from '@/lib/types';
import { Media } from '../shared/Media';
import { motion } from 'framer-motion';

interface AboutMeProps {
  content: AboutMeContent;
}

export function AboutMe({ content }: AboutMeProps) {
  const stats = [
    { value: content.happyClients, label: 'Clientes Felices' },
    { value: content.yearsOfExperience, label: 'Años Experiencia' },
    { value: content.events, label: 'Eventos' },
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      id="sobre-mi" 
      className="style-3-bg py-12 sm:py-16 md:py-20 lg:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-gray-800"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            Sobre Mí
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Conoce la historia detrás de mi pasión por la belleza
          </motion.p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <motion.div 
            className="order-2 lg:order-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-prose">
              {content.text}
            </p>
          </motion.div>
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden style-3-central-element border-4 border-gray-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Media
                src={content.url}
                type={content.type}
                alt="Foto de Tobias"
                fill
                style={{ objectFit: 'cover' as const }}
                className="w-full h-full"
                sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                data-ai-hint="portrait professional"
              />
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 border-t border-gray-200 pt-8 sm:pt-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="p-4 sm:p-6 rounded-lg style-3-card"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-3xl sm:text-4xl font-bold text-gray-800 font-headline mb-2">{stat.value}</p>
                <p className="text-sm sm:text-base text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

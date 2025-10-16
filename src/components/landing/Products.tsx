'use client'

import { useState } from 'react'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import type { Product, Category } from '@/lib/types'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import Link from 'next/link'
import { Media } from '../shared/Media'
import { motion } from 'framer-motion'

interface ProductsProps {
  products: Product[]
  categories: Category[]
}

export function Products({ products, categories }: ProductsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const availableProducts = products.filter(p => p.stock > 0)

  const filteredProducts = availableProducts
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product =>
      selectedCategory === 'all' ? true : product.categoryId === selectedCategory
    )

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
      id="productos-de-belleza" 
      className="style-4-bg py-12 sm:py-16 md:py-20 lg:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div 
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-sm font-semibold text-cyan-600 bg-cyan-100 px-3 py-1 rounded-full">2024</span>
          </motion.div>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-gray-800"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            Productos de Belleza
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explora nuestra selección de productos de alta calidad.
          </motion.p>
        </div>
        
        <motion.div 
          className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Input 
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
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
                    src={product.url}
                    type={product.type}
                    alt={product.name}
                    fill
                    style={{ objectFit: product.type === 'video' ? 'contain' : 'cover' }}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    data-ai-hint="product image"
                  />
                  
                  {/* Overlay que aparece SOLO en hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center mb-5">
                        <div className="style-4-icon w-14 h-14 rounded-full flex items-center justify-center mr-5">
                          <span className="text-lg font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <CardTitle className="font-headline text-2xl text-white">
                          {product.name}
                        </CardTitle>
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed mb-4 line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mb-5">
                        <Badge variant="outline" className="text-sm border-cyan-300 text-cyan-300 bg-cyan-500/20">
                          {categories.find(c => c.id === product.categoryId)?.name || 'General'}
                        </Badge>
                      </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        asChild 
                        className="rounded-full text-base px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-300"
                      >
                        <Link href="#contacto">Contáctame</Link>
                      </Button>
                    </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-base sm:text-lg text-gray-600">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

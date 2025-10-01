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

  return (
    <section id="productos-de-belleza" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline">Productos de Belleza</h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 sm:mt-4">Explora nuestra selección de productos de alta calidad.</p>
        </div>
        
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 mb-6 sm:mb-8">
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
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative aspect-square w-full">
                  <Media
                    src={product.url}
                    type={product.type}
                    alt={product.name}
                    fill
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    style={{ objectFit: 'contain' as const }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradiente - visible solo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Contenido - visible solo en hover */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Título siempre visible */}
                    <CardTitle className="font-headline text-lg sm:text-xl lg:text-2xl text-white mb-2 drop-shadow-lg">
                      {product.name}
                    </CardTitle>
                    
                    {/* Elementos que aparecen en hover */}
                    <div className="space-y-3 transform transition-all duration-300">
                      <Badge variant="outline" className="mb-2 border-white/50 text-white w-fit text-xs sm:text-sm">
                        {categories.find(c => c.id === product.categoryId)?.name || 'General'}
                      </Badge>
                      <CardDescription className="text-white/90 text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
                        {product.description}
                      </CardDescription>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Badge variant="default" className="bg-green-600/20 text-green-300 border-green-600/50 text-xs sm:text-sm">
                          En Stock
                        </Badge>
                        <Button 
                          asChild 
                          className="rounded-full text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 hover:scale-105 transition-transform"
                        >
                          <Link href="#contacto">Contáctame</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-base sm:text-lg text-muted-foreground">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Product, Category } from '@/lib/types';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Link from 'next/link';

interface ProductsProps {
  products: Product[];
  categories: Category[];
}

export function Products({ products, categories }: ProductsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const availableProducts = products.filter(p => p.stock > 0);

  const filteredProducts = availableProducts
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product =>
      selectedCategory === 'all' ? true : product.categoryId === selectedCategory
    );

  return (
    <section id="productos-de-belleza" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-headline">Productos de Belleza</h2>
            <p className="text-muted-foreground mt-2">Explora nuestra selección de productos de alta calidad.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Input 
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-1/2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-card text-left shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
                <CardHeader>
                    <div className="relative aspect-[4/3] w-full rounded-t-lg overflow-hidden">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        data-ai-hint={product.name.split(' ').slice(0, 2).join(' ')}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardTitle className="font-headline text-2xl text-primary mb-2">{product.name}</CardTitle>
                    <Badge variant="outline" className="mb-2">{categories.find(c => c.id === product.categoryId)?.name || 'General'}</Badge>
                    <CardDescription>{product.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Badge variant="default" className='bg-green-600/20 text-green-300 border-green-600/50'>
                        En Stock
                    </Badge>
                     <Button asChild className="rounded-full">
                        <Link href="#contacto">Contáctame</Link>
                    </Button>
                </CardFooter>
                </Card>
            ))}
            </div>
        ) : (
             <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
        )}
      </div>
    </section>
  );
}

import Image from 'next/image';
import { initialProducts } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';

export function Products() {
  return (
    <section id="productos" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-headline text-center mb-12">Nuestros Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialProducts.map((product) => (
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
                <CardDescription>{product.description}</CardDescription>
              </CardContent>
               <CardFooter className="flex justify-between items-center">
                <p className="text-2xl font-bold text-foreground">${product.price.toFixed(2)}</p>
                <Button className="rounded-full">
                  <ShoppingCart className="mr-2 h-4 w-4"/>
                  Añadir al Carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

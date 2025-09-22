
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Perfume } from '@/lib/types';
import Link from 'next/link';

interface PerfumesProps {
  perfumes: Perfume[];
}

export function Perfumes({ perfumes }: PerfumesProps) {
  const availablePerfumes = perfumes.filter(p => p.stock > 0);

  if (availablePerfumes.length === 0) {
    return null;
  }

  return (
    <section id="perfumes" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-headline">Nuestra Colección de Perfumes</h2>
            <p className="text-muted-foreground mt-2">Descubre fragancias que cautivan y definen tu estilo.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availablePerfumes.map((perfume) => (
            <Card key={perfume.id} className="bg-card text-left shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
              <CardHeader>
                <div className="relative aspect-[4/3] w-full rounded-t-lg overflow-hidden">
                  <Image
                    src={perfume.imageUrl}
                    alt={perfume.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint={perfume.name.split(' ').slice(0, 2).join(' ')}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="font-headline text-2xl text-primary mb-2">{perfume.name}</CardTitle>
                <CardDescription>{perfume.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Badge variant="default" className='bg-green-600/20 text-green-300 border-green-600/50'>
                    En Stock
                </Badge>
                  <Button asChild className="rounded-full">
                    <Link href="#contacto">Consultar</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

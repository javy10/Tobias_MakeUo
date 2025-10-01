'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Perfume } from '@/lib/types';
import Link from 'next/link';
import { Media } from '../shared/Media';

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
            <Card key={perfume.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-square w-full">
                    <Media
                        src={perfume.url}
                        type={perfume.type}
                        alt={perfume.name}
                        fill
                        className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content overlay */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <CardTitle className="font-headline text-2xl text-white mb-2">{perfume.name}</CardTitle>
                        <CardDescription className="text-white/90 mb-4">{perfume.description}</CardDescription>
                        
                        <div className="flex justify-between items-center">
                            <Badge variant="default" className='bg-green-600/20 text-green-300 border-green-600/50'>
                                En Stock
                            </Badge>
                            <Button asChild className="rounded-full">
                                <Link href="#contacto">Consultar</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';
import { Card, CardTitle } from '@/components/ui/card';
import type { Course } from '@/lib/types';
import { Media } from '../shared/Media';
import { Button } from '../ui/button';
import Link from 'next/link';

interface BeautyCoursesProps {
  courses: Course[];
}

export function BeautyCourses({ courses }: BeautyCoursesProps) {
  return (
    <section id="cursos" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background-light to-background-light/50 dark:from-background-dark dark:to-background-dark/50 rounded-3xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-primary mb-4">
          Cursos de Belleza
        </h2>
        <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-2xl mx-auto">
          Aprende las técnicas más avanzadas de maquillaje y belleza con nuestros cursos especializados
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {courses.map((course) => (
          <Card key={course.id} className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-800">
            <div className="relative aspect-video w-full">
                <Media 
                    src={course.url} 
                    type={course.type}
                    alt={course.name} 
                    fill
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    style={{ objectFit: 'cover' as const }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay - always visible but stronger on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

                {/* Content overlay - always visible */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <CardTitle className="font-headline text-xl sm:text-2xl text-white mb-2 drop-shadow-md">{course.name}</CardTitle>
                    <p className="text-white/90 text-sm sm:text-base mb-4 line-clamp-2 drop-shadow-md">{course.description}</p>
                    <div className="flex justify-end transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Button asChild className="rounded-full text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-white">
                            <Link href="#contacto">Inscríbete ahora</Link>
                        </Button>
                    </div>
                </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
import Image from 'next/image';
import { initialGalleryItems } from '@/lib/data';

export function Gallery() {
  return (
    <section id="mis-trabajos" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-headline text-center mb-12">Mis Trabajos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {initialGalleryItems.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-xl shadow-lg aspect-square">
              <Image
                src={item.url}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                data-ai-hint={item.alt.split(' ').slice(0, 2).join(' ')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { initialServices } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brush } from 'lucide-react';

export function Services() {
  return (
    <section id="servicios" className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-4xl font-bold font-headline text-center mb-12">Nuestros Servicios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialServices.map((service) => (
          <Card key={service.id} className="bg-card text-center shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                 <Brush className="w-8 h-8" />
              </div>
              <CardTitle className="font-headline text-2xl text-primary">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

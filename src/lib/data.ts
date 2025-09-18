import type { HeroContent, Service, GalleryItem, Testimonial } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const initialHeroContent: HeroContent = {
  title: "Belleza que Transforma",
  subtitle: "Tu estilo personal, realzado con el arte del maquillaje profesional."
};

export const initialServices: Service[] = [
  {
    id: '1',
    title: "Maquillaje Social",
    description: "Ideal para eventos, fiestas y ocasiones especiales. Resaltamos tu belleza natural para que luzcas radiante."
  },
  {
    id: '2',
    title: "Maquillaje de Novia",
    description: "Un servicio completo y personalizado para que en tu día más importante te sientas única y espectacular."
  },
  {
    id: '3',
    title: "Clases de Automaquillaje",
    description: "Aprende a maquillarte como una profesional. Clases personalizadas para sacar el máximo partido a tus rasgos."
  }
];

export const initialGalleryItems: GalleryItem[] = PlaceHolderImages.filter(img => img.id.startsWith('gallery-')).map(img => ({
  id: img.id,
  url: img.imageUrl,
  alt: img.description,
}));

export const initialTestimonials: Testimonial[] = [
  {
    id: '1',
    text: "¡El maquillaje fue increíble! Duró toda la noche y me sentí como una estrella. ¡Gracias, Tobias!",
    author: "Ana Pérez"
  },
  {
    id: '2',
    text: "La clase de automaquillaje fue súper útil. Aprendí trucos que uso todos los días. ¡Totalmente recomendado!",
    author: "Laura Gómez"
  },
  {
    id: '3',
    text: "El mejor servicio de maquillaje para novias. Me sentí tranquila y hermosa en mi boda. Profesionalismo y talento puro.",
    author: "Carla Rodriguez"
  }
];

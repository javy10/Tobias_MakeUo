import type { HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const initialHeroContent: HeroContent = {
  title: "Belleza que Transforma",
  subtitle: "Tu estilo personal, realzado con el arte del maquillaje profesional."
};

export const initialServices: Service[] = [
  {
    id: '1',
    title: "Maquillaje Social",
    description: "Ideal para eventos, fiestas y ocasiones especiales. Resaltamos tu belleza natural para que luzcas radiante.",
    imageUrl: "https://picsum.photos/seed/service1/600/400"
  },
  {
    id: '2',
    title: "Maquillaje de Novia",
    description: "Un servicio completo y personalizado para que en tu día más importante te sientas única y espectacular.",
    imageUrl: "https://picsum.photos/seed/service2/600/400"
  },
  {
    id: '3',
    title: "Clases de Automaquillaje",
    description: "Aprende a maquillarte como una profesional. Clases personalizadas para sacar el máximo partido a tus rasgos.",
    imageUrl: "https://picsum.photos/seed/service3/600/400"
  }
];

export const initialProducts: Product[] = [
  {
    id: '1',
    name: "Paleta de Sombras 'Ocaso'",
    description: "12 tonos cálidos y vibrantes para un look perfecto del día a la noche.",
    stock: 15,
    imageUrl: "https://picsum.photos/seed/product1/400/400"
  },
  {
    id: '2',
    name: "Base de Maquillaje 'Piel de Seda'",
    description: "Cobertura media y acabado natural para una piel impecable todo el día.",
    stock: 25,
    imageUrl: "https://picsum.photos/seed/product2/400/400"
  },
  {
    id: '3',
    name: "Labial Líquido Mate 'Rojo Pasión'",
    description: "Color intenso de larga duración que no reseca tus labios.",
    stock: 30,
    imageUrl: "https://picsum.photos/seed/product3/400/400"
  },
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
    author: "Ana Pérez",
    status: 'approved'
  },
  {
    id: '2',
    text: "La clase de automaquillaje fue súper útil. Aprendí trucos que uso todos los días. ¡Totalmente recomendado!",
    author: "Laura Gómez",
    status: 'approved'
  },
  {
    id: '3',
    text: "El mejor servicio de maquillaje para novias. Me sentí tranquila y hermosa en mi boda. Profesionalismo y talento puro.",
    author: "Carla Rodriguez",
    status: 'approved'
  },
  {
    id: '4',
    text: "Me encantó el look para mi graduación. Fue exactamente lo que pedí, pero mejor. ¡Volveré!",
    author: "Sofía Martínez",
    status: 'pending'
  }
];

export const initialAboutMeContent: AboutMeContent = {
  text: "¡Hola! Soy Tobias, un apasionado maquillador profesional con más de 5 años de experiencia en realzar la belleza única de cada persona. Mi objetivo es que te sientas segura y radiante en cualquier ocasión. Me especializo en maquillaje para novias, eventos sociales y clases personalizadas. ¡Espero conocerte pronto!",
  imageUrl: "https://picsum.photos/seed/aboutme/600/600"
};

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin', // This should be hashed in a real app
  },
];

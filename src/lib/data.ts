import type { HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category, Perfume } from './types';
import { PlaceHolderImages } from './placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');
const serviceImage1 = PlaceHolderImages.find(img => img.id === 'gallery-1');
const serviceImage2 = PlaceHolderImages.find(img => img.id === 'gallery-2');
const serviceImage3 = PlaceHolderImages.find(img => img.id === 'gallery-3');
const productImage1 = PlaceHolderImages.find(img => img.id === 'gallery-4');
const productImage2 = PlaceHolderImages.find(img => img.id === 'gallery-5');
const productImage3 = PlaceHolderImages.find(img => img.id === 'gallery-6');
const aboutMeImage = PlaceHolderImages.find(img => img.id === 'about-me');


export const initialHeroContent: HeroContent = {
  title: "Belleza que Transforma",
  subtitle: "Tu estilo personal, realzado con el arte del maquillaje profesional.",
  url: heroImage?.imageUrl || "https://picsum.photos/seed/makeup1/1920/1080",
  type: 'image',
};

export const initialServices: Service[] = [
  {
    id: '1',
    title: "Maquillaje Social",
    description: "Ideal para eventos, fiestas y ocasiones especiales. Resaltamos tu belleza natural para que luzcas radiante.",
    url: serviceImage1?.imageUrl || "https://picsum.photos/seed/service1/600/400",
    type: 'image',
  },
  {
    id: '2',
    title: "Maquillaje de Novia",
    description: "Un servicio completo y personalizado para que en tu día más importante te sientas única y espectacular.",
    url: serviceImage2?.imageUrl || "https://picsum.photos/seed/service2/600/400",
    type: 'image',
  },
  {
    id: '3',
    title: "Clases de Automaquillaje",
    description: "Aprende a maquillarte como una profesional. Clases personalizadas para sacar el máximo partido a tus rasgos.",
    url: serviceImage3?.imageUrl || "https://picsum.photos/seed/service3/600/400",
    type: 'image',
  }
];

export const initialCategories: Category[] = [
  { id: '1', name: 'Paletas de Sombras' },
  { id: '2', name: 'Bases' },
  { id: '3', name: 'Labiales' },
];

export const initialProducts: Product[] = [
  {
    id: '1',
    name: "Paleta de Sombras 'Ocaso'",
    description: "12 tonos cálidos y vibrantes para un look perfecto del día a la noche.",
    stock: 15,
    url: productImage1?.imageUrl || "https://picsum.photos/seed/product1/400/400",
    type: 'image',
    categoryId: '1',
  },
  {
    id: '2',
    name: "Base de Maquillaje 'Piel de Seda'",
    description: "Cobertura media y acabado natural para una piel impecable todo el día.",
    stock: 25,
    url: productImage2?.imageUrl || "https://picsum.photos/seed/product2/400/400",
    type: 'image',
    categoryId: '2',
  },
  {
    id: '3',
    name: "Labial Líquido Mate 'Rojo Pasión'",
    description: "Color intenso de larga duración que no reseca tus labios.",
    stock: 20,
    url: productImage3?.imageUrl || "https://picsum.photos/seed/product3/400/400",
    type: 'image',
    categoryId: '3',
  },
];

export const initialPerfumes: Perfume[] = [
  {
    id: '1',
    name: "Fragancia 'Aura Floral'",
    description: "Una esencia delicada con notas de jazmín y rosas, perfecta para el día a día.",
    stock: 30,
    url: "https://picsum.photos/seed/perfume1/400/400",
    type: 'image',
  },
  {
    id: '2',
    name: "Perfume 'Noche Intensa'",
    description: "Aroma amaderado y profundo con toques de sándalo, ideal para ocasiones especiales.",
    stock: 18,
    url: "https://picsum.photos/seed/perfume2/400/400",
    type: 'image',
  }
];

export const initialGalleryItems: GalleryItem[] = PlaceHolderImages.filter(img => img.id.startsWith('gallery-')).map(img => ({
  id: img.id,
  url: img.imageUrl,
  alt: img.description,
  type: 'image',
  title: img.description,
  description: "Un ejemplo de nuestro trabajo de alta calidad, enfocado en realzar la belleza natural.",
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
  },
    {
    id: '5',
    text: "Un trabajo impecable. Muy profesional y atento a los detalles. Lo recomiendo sin dudar.",
    author: "Valentina Torres",
    status: 'rejected'
  }
];

export const initialAboutMeContent: AboutMeContent = {
  text: "¡Hola! Soy Tobias, un apasionado maquillador profesional con más de 5 años de experiencia en realzar la belleza única de cada persona. Mi objetivo es que te sientas segura y radiante en cualquier ocasión. Me especializo en maquillaje para novias, eventos sociales y clases personalizadas. ¡Espero conocerte pronto!",
  url: aboutMeImage?.imageUrl || "https://picsum.photos/seed/aboutme/600/600",
  type: 'image',
  happyClients: "500+",
  yearsOfExperience: "5+",
  events: "100+",
};

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin', // This should be hashed in a real app
  },
  {
    id: '2',
    name: 'Test User',
    email: 'prueba@gmail.com',
    password: 'temporal123',
  }
];
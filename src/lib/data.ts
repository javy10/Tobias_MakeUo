import type { HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category, Perfume, Course } from './types';

// Datos iniciales vacíos - todo se carga desde la base de datos
export const initialHeroContent: HeroContent = {
  title: "",
  subtitle: "",
  url: "",
  type: 'image',
};

export const initialServices: Service[] = [];

export const initialCategories: Category[] = [];

export const initialProducts: Product[] = [];

export const initialPerfumes: Perfume[] = [];

export const initialGalleryItems: GalleryItem[] = [];

export const initialTestimonials: Testimonial[] = [];

export const initialAboutMeContent: AboutMeContent = {
  text: "",
  url: "",
  type: 'image',
  happyClients: "0",
  yearsOfExperience: "0",
  events: "0",
};

export const initialUsers: User[] = [];

export const initialCourses: Course[] = [];
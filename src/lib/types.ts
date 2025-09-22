
export interface Category {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  file?: File;
}

export interface GalleryItem {
  id: string;
  url: string; 
  alt: string;
  type: 'image' | 'video';
  file?: File; 
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  seen?: boolean;
}

export interface HeroContent {
  id?: 'singleton';
  title: string;
  subtitle: string;
  imageUrl: string;
  file?: File;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  imageUrl: string;
  categoryId: string;
  file?: File;
}

export interface Perfume {
  id: string;
  name: string;
  description: string;
  stock: number;
  imageUrl: string;
  file?: File;
}

export interface AboutMeContent {
  id?: 'singleton';
  text: string;
  imageUrl: string;
  happyClients: string;
  yearsOfExperience: string;
  events: string;
  file?: File;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

// Global App State
export interface AppState {
  heroContent: HeroContent;
  services: Service[];
  products: Product[];
  perfumes: Perfume[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
  aboutMeContent: AboutMeContent;
  users: User[];
  categories: Category[];
}

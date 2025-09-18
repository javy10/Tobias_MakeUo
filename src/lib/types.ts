export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface HeroContent {
  title: string;
  subtitle: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  imageUrl: string;
}

export interface AboutMeContent {
  text: string;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should be handled securely
}

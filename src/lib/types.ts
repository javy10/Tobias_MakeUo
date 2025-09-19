
export interface Category {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  url: string; // This will be an Object URL for files from IndexedDB
  alt: string;
  type: 'image' | 'video';
  file?: File; // The actual file, to be stored in IndexedDB
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
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  imageUrl: string;
  categoryId: string;
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

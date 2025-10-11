
import { Brush, FileText, Home, ImageIcon, MessageSquare, Palette, ShoppingBag, Sparkles, Star, Users, SprayCan, BookOpen, LayoutDashboard } from 'lucide-react';

export const pageConfig = [
  { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero', title: 'Sección Inicial', icon: Sparkles },
  { id: 'about', title: 'Sobre Mí', icon: FileText },
  { id: 'services', title: 'Servicios', icon: Palette },
  { id: 'categories', title: 'Categorías', icon: Brush },
  { id: 'products', title: 'Productos', icon: ShoppingBag },
  { id: 'perfumes', title: 'Perfumes', icon: SprayCan },
  { id: 'courses', title: 'Cursos de Belleza', icon: BookOpen },
  { id: 'gallery', title: 'Mis Trabajos', icon: ImageIcon },
  { id: 'testimonials', title: 'Testimonios', icon: Star },
  { id: 'users', title: 'Usuarios', icon: Users },
  // { id: 'ai-content', title: 'Ideas con IA', icon: MessageSquare }, // OCULTO
];

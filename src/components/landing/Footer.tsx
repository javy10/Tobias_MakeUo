import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Logo } from '../shared/Logo';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-background/60">
              Belleza que Transforma. Tu estilo personal, realzado con el arte del maquillaje profesional.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4 text-background">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#inicio" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="#servicios" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="#sobre-mi" className="hover:text-primary transition-colors">Sobre Mí</Link></li>
              <li><Link href="#productos" className="hover:text-primary transition-colors">Productos</Link></li>
              <li><Link href="#mis-trabajos" className="hover:text-primary transition-colors">Mis Trabajos</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-headline text-lg font-semibold mb-4 text-background">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de Cookies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4 text-background">Síguenos</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-primary transition-colors"><Youtube /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
          <p>&copy; {new Date().getFullYear()} Tobias MakeUp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

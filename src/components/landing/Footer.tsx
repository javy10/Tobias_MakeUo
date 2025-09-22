import { Facebook, Instagram } from 'lucide-react';
import { Logo } from '../shared/Logo';
import Link from 'next/link';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.52.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.38-6.75-1.77-2.05-1.51-3.2-3.9-3.2-6.32.01-4.42 3.6-7.99 8.04-7.99.12 0 .24.01.36.02v4.03c-1.31-.02-2.61-.01-3.91-.02-.25-.01-.5-.02-.75-.02-.03 1.15.22 2.31.81 3.36.53.94 1.34 1.63 2.34 1.95.95.31 2 .31 2.95.02.9-.27 1.71-.85 2.25-1.6s.8-1.67.74-2.72c-.05-1.29-.11-2.58-.17-3.87z" />
  </svg>
);


export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-12 mt-16 text-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 flex flex-col items-center">
            <Logo />
            <p className="text-sm text-background/60">
              Belleza que Transforma. Tu estilo personal, realzado con el arte del maquillaje profesional.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-headline text-lg font-semibold mb-4 text-background">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#inicio" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/#servicios" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="/#sobre-mi" className="hover:text-primary transition-colors">Sobre Mí</Link></li>
              <li><Link href="/#productos-de-belleza" className="hover:text-primary transition-colors">Productos de Belleza</Link></li>
              <li><Link href="/#perfumes" className="hover:text-primary transition-colors">Perfumes</Link></li>
              <li><Link href="/#mis-trabajos" className="hover:text-primary transition-colors">Mis Trabajos</Link></li>
            </ul>
          </div>
           <div className="flex flex-col items-center">
            <h3 className="font-headline text-lg font-semibold mb-4 text-background">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terminos-y-condiciones" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/politica-de-privacidad" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/politica-de-cookies" className="hover:text-primary transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-headline text-lg font-semibold mb-4 text-background">Síguenos</h3>
            <div className="flex justify-center space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100071055431299" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Facebook /></a>
              <a href="https://www.instagram.com/tobias_makeup95/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Instagram /></a>
              <a href="https://www.tiktok.com/@tobias_makeup95" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><TikTokIcon /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 pt-8 text-sm text-background/60">
          <p>&copy; {new Date().getFullYear()} Tobias MakeUp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#sobre-mi', label: 'Sobre Mí' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#productos-de-belleza', label: 'Productos de Belleza' },
  { href: '/#perfumes', label: 'Perfumes' },
  { href: '/#mis-trabajos', label: 'Mis Trabajos' },
  { href: '/#testimonios', label: 'Testimonios' },
  { href: '/#contacto', label: 'Contacto' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card/80 sticky top-0 z-50 shadow-md backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </div>
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background">
              <SheetHeader className="sr-only">
                <SheetTitle>Menú de Navegación</SheetTitle>
                <SheetDescription>
                  Selecciona una opción para navegar a la sección correspondiente del sitio.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                 <Logo />
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-2xl text-foreground/80 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

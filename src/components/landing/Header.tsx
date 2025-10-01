
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
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        <Logo className="w-32 sm:w-36 md:w-40" />
        
        {/* Menú para tablets y desktop */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="px-2 py-1 text-sm sm:text-base text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-primary/10"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Menú para tablets */}
        <div className="hidden md:flex lg:hidden items-center">
          <div className="flex items-center space-x-1">
            {navLinks.slice(0, 4).map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="px-2 py-1 text-sm text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-primary/10"
              >
                {link.label}
              </a>
            ))}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  Más <Menu className="h-4 w-4 ml-1" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.slice(4).map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-md hover:bg-primary/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-background/95 backdrop-blur-md">
              <SheetHeader>
                <SheetTitle className="text-2xl font-headline">Menú</SheetTitle>
                <SheetDescription>
                  Navega a través de nuestras secciones
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

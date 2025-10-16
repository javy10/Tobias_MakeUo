
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/app/layout';
import { useVisibleSectionsOnly } from '@/hooks/use-visible-sections';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { appState } = useAppContext();
  const visibleSections = useVisibleSectionsOnly(appState);

  return (
    <header className="glass-effect-dark sticky top-0 z-50 shadow-lg backdrop-blur-md border-b border-primary/20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        <Logo className="w-32 sm:w-36 md:w-40" />
        
        {/* Menú para tablets y desktop */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6">
            {visibleSections.map((section) => (
              <a 
                key={section.href} 
                href={section.href} 
                className="px-2 py-1 text-sm sm:text-base text-white/90 hover:text-accent transition-colors rounded-md hover:bg-primary/20 hover-lift"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>

        {/* Menú para tablets */}
        <div className="hidden md:flex lg:hidden items-center">
          <div className="flex items-center space-x-1">
            {visibleSections.slice(0, 4).map((section) => (
              <a 
                key={section.href} 
                href={section.href} 
                className="px-2 py-1 text-sm text-white/90 hover:text-accent transition-colors rounded-md hover:bg-primary/20 hover-lift"
              >
                {section.label}
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
                  {visibleSections.slice(4).map((section) => (
                    <a
                      key={section.href}
                      href={section.href}
                      className="text-white/90 hover:text-accent transition-colors px-4 py-2 rounded-md hover:bg-primary/20 hover-lift"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {section.label}
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
            <SheetContent side="right" className="w-full sm:w-80 glass-effect-dark backdrop-blur-md border-l border-primary/20">
              <SheetHeader>
                <SheetTitle className="text-2xl font-headline">Menú</SheetTitle>
                <SheetDescription>
                  Navega a través de nuestras secciones
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col items-center justify-start h-full space-y-4 pt-8">
                 <Logo />
                {visibleSections.map((section) => (
                  <a
                    key={section.href}
                    href={section.href}
                    className="text-xl text-white/90 hover:text-accent transition-colors hover-lift"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {section.label}
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


'use client';

import { Bell, FileText, LogOut, Menu, Settings, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from './AdminLayout';
import { useTheme } from '@/hooks/use-theme';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Testimonial } from '@/lib/types';

interface AdminHeaderProps {
  pageName: string;
  onLogout: () => void;
  loggedInUser: { name: string; email: string };
  testimonials: Testimonial[];
  setActiveSection: (section: string) => void;
  setTestimonials: (testimonials: Testimonial[] | ((prev: Testimonial[]) => Testimonial[])) => void;
}

export function AdminHeader({ 
  pageName, 
  onLogout, 
  loggedInUser, 
  testimonials, 
  setActiveSection,
  setTestimonials
}: AdminHeaderProps) {
    const { toggleSidebar } = useSidebarContext();
    const { theme, toggleTheme } = useTheme();
    const unseenPendingTestimonials = testimonials.filter(t => t.status === 'pending' && !t.seen);

    const handleNotificationClick = (testimonialId: string) => {
        // Mark the specific testimonial as seen
        setTestimonials(prev => 
            prev.map(t => t.id === testimonialId ? { ...t, seen: true } : t)
        );
        // Navigate to the testimonials section
        setActiveSection('testimonials');
    };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 sm:gap-4 border-b bg-background/80 backdrop-blur-sm px-3 sm:px-6">
       <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 flex-shrink-0" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 ml-1 sm:ml-0">
        <h1 className="text-sm sm:text-base md:text-lg font-semibold truncate">{pageName}</h1>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 sm:h-10 sm:w-10"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 sm:gap-1.5 h-9 sm:h-10 px-2 sm:px-2.5">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base truncate max-w-14 sm:max-w-18 md:max-w-none font-medium">{loggedInUser.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 sm:w-64">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveSection('about')}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                    <Bell className="h-4 w-4" />
                    {unseenPendingTestimonials.length > 0 && (
                       <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 sm:px-1.5 sm:py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[16px] sm:min-w-[18px]">
                         {unseenPendingTestimonials.length}
                       </span>
                    )}
                    <span className="sr-only">Notificaciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80 max-w-[calc(100vw-2rem)]">
                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {unseenPendingTestimonials.length > 0 ? (
                    unseenPendingTestimonials.map(t => (
                        <DropdownMenuItem key={t.id} onClick={() => handleNotificationClick(t.id)} className="flex flex-col items-start gap-1 whitespace-normal p-3">
                           <p className="font-semibold text-sm">{t.author}</p>
                           <p className="text-xs text-muted-foreground truncate w-full">"{t.text}"</p>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <p className="p-3 text-sm text-muted-foreground">No hay notificaciones nuevas.</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Configuración</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                 <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

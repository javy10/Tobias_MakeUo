
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
       <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{pageName}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    {/* <User className="h-5 w-5" /> */} {/* OCULTO */}
                    <span className="hidden md:inline">{loggedInUser.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unseenPendingTestimonials.length > 0 && (
                       <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                         {unseenPendingTestimonials.length}
                       </span>
                    )}
                    <span className="sr-only">Notificaciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {unseenPendingTestimonials.length > 0 ? (
                    unseenPendingTestimonials.map(t => (
                        <DropdownMenuItem key={t.id} onClick={() => handleNotificationClick(t.id)} className="flex flex-col items-start gap-1 whitespace-normal">
                           <p className="font-semibold">{t.author}</p>
                           <p className="text-xs text-muted-foreground truncate w-full">"{t.text}"</p>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <p className="p-2 text-sm text-muted-foreground">No hay notificaciones nuevas.</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
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

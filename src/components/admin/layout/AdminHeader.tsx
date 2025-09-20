
'use client';

import { Bell, FileText, LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from './AdminLayout';
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
}

export function AdminHeader({ pageName, onLogout, loggedInUser, testimonials, setActiveSection }: AdminHeaderProps) {
    const { toggleSidebar } = useSidebarContext();
    const pendingTestimonials = testimonials.filter(t => t.status === 'pending');

    const handleNotificationClick = () => {
        setActiveSection('testimonials');
    };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{pageName}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
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
                    {pendingTestimonials.length > 0 && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                    <span className="sr-only">Notificaciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {pendingTestimonials.length > 0 ? (
                    pendingTestimonials.map(t => (
                        <DropdownMenuItem key={t.id} onClick={handleNotificationClick} className="flex flex-col items-start gap-1 whitespace-normal">
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

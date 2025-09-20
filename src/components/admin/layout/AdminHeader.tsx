
'use client';

import { Bell, Menu, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from './AdminLayout';
import Link from 'next/link';

interface AdminHeaderProps {
  pageName: string;
  onLogout: () => void;
  loggedInUser: { name: string; email: string };
}

export function AdminHeader({ pageName, onLogout, loggedInUser }: AdminHeaderProps) {
    const { toggleSidebar } = useSidebarContext();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-4">
        <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div>
            <h1 className="text-lg font-semibold">{pageName}</h1>
            <p className="text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">Página Principal</Link> / {pageName}
            </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>{loggedInUser.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout}>
            <Bell className="h-5 w-5" />
            <span className="sr-only">Cerrar Sesión</span>
        </Button>
         <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configuración</span>
        </Button>
      </div>
    </header>
  );
}

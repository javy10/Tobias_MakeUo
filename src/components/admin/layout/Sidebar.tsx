
'use client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { X } from 'lucide-react';
import { useSidebarContext } from './AdminLayout';
import { cn } from '@/lib/utils';
import { pageConfig } from './pageConfig';
import Link from 'next/link';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebarContext();
  
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 md:hidden',
          isSidebarOpen ? 'block' : 'hidden'
        )}
        onClick={toggleSidebar}
      />
      <aside
        className={cn(
          'admin-sidebar fixed top-0 left-0 z-50 h-full w-72 sm:w-64 -translate-x-full transform bg-background shadow-lg transition-transform duration-300 md:translate-x-0',
          isSidebarOpen && 'translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
                <Logo />
                <Button variant="ghost" size="icon" className="md:hidden h-11 w-11" onClick={toggleSidebar}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <nav className="flex-1 space-y-2 p-3 sm:p-4">
            {pageConfig.filter(p => p.id !== 'about').map((page) => (
                <Button
                    key={page.id}
                    variant={activeSection === page.id ? 'default' : 'ghost'}
                    className={cn(
                        "w-full justify-start gap-3 h-12 sm:h-10 text-sm sm:text-base",
                        activeSection === page.id && "bg-gradient-to-tl from-purple-700 to-pink-500 text-white shadow-md"
                    )}
                    onClick={() => handleSectionClick(page.id)}
                >
                    <div className={cn(
                        "rounded-lg p-2 flex-shrink-0",
                         activeSection !== page.id && "bg-white shadow-sm"
                    )}>
                        <page.icon className={cn(
                            "h-4 w-4 sm:h-4 sm:w-4",
                            activeSection === page.id ? "text-white" : "text-primary"
                            )} />
                    </div>
                    <span className="truncate">{page.title}</span>
                </Button>
            ))}
            </nav>
            <div className="p-3 sm:p-4">
                 <Button asChild className="w-full h-12 sm:h-10 text-sm sm:text-base">
                    <Link href="/">Volver al Sitio</Link>
                </Button>
            </div>
            
            {/* Elemento oculto para prevenir que aparezca el ícono con "N" */}
            <div className="hidden n-icon" style={{ display: 'none !important' }}>
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                </div>
            </div>
        </div>
      </aside>
    </>
  );
}

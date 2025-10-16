
'use client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { X } from 'lucide-react';
import { useSidebarContext } from './AdminLayout';
import { cn } from '@/lib/utils';
import { pageConfig } from './pageConfig';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebarContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Solo cerrar el sidebar en dispositivos móviles
    if (isMobile && isSidebarOpen) {
      toggleSidebar();
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <motion.div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 md:hidden',
          isSidebarOpen ? 'block' : 'hidden'
        )}
        onClick={() => {
          console.log('Overlay clicked'); // Debug log
          toggleSidebar();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border shadow-lg',
          'md:relative md:translate-x-0 md:block' // Relativo en desktop, siempre visible
        )}
        initial={{ x: -300 }}
        animate={{ 
          x: isSidebarOpen ? 0 : -300
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex h-full flex-col">
            <motion.div 
              className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
                <Logo />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden h-11 w-11 text-foreground hover:bg-accent" 
                  onClick={() => {
                    console.log('X button clicked'); // Debug log
                    toggleSidebar();
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
            </motion.div>
            <motion.nav 
              className="flex-1 space-y-2 p-3 sm:p-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
            {pageConfig.filter(p => p.id !== 'about').map((page, index) => (
                <motion.div
                  key={page.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                      variant={activeSection === page.id ? 'default' : 'ghost'}
                        className={cn(
                            "w-full justify-start gap-3 h-12 sm:h-10 text-sm sm:text-base transition-all duration-300",
                            activeSection === page.id
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      onClick={() => handleSectionClick(page.id)}
                  >
                        <div className={cn(
                            "rounded-lg p-2 flex-shrink-0 transition-all duration-300",
                             activeSection === page.id
                               ? "bg-primary-foreground/20"
                               : "bg-muted hover:bg-muted/80"
                        )}>
                            <page.icon className={cn(
                                "h-4 w-4 sm:h-4 sm:w-4 transition-colors duration-300",
                                activeSection === page.id ? "text-primary-foreground" : "text-muted-foreground"
                                )} />
                        </div>
                      <span className="truncate">{page.title}</span>
                  </Button>
                </motion.div>
            ))}
            </motion.nav>
            <motion.div 
              className="p-3 sm:p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   transition={{ duration: 0.2 }}
                 >
                     <Button asChild className="w-full h-12 sm:h-10 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300">
                      <Link href="/">Volver al Sitio</Link>
                  </Button>
                 </motion.div>
            </motion.div>
            
            {/* Elemento oculto para prevenir que aparezca el ícono con "N" */}
            <div className="hidden n-icon" style={{ display: 'none !important' }}>
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                </div>
            </div>
        </div>
      </motion.aside>
    </>
  );
}

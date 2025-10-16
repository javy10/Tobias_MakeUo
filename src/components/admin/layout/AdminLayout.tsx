
'use client';

import { useState, createContext, useContext, type ReactNode, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import type { User, AppState, Testimonial } from '@/lib/types';
import { pageConfig } from './pageConfig';
import { ThemeProvider } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

interface SidebarContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext must be used within a SidebarProvider');
    }
    return context;
}

interface AdminLayoutProps {
  children: ReactNode;
  loggedInUser: User;
  onLogout: () => void;
  appState: AppState;
  activeSection: string;
  setActiveSection: (section: string) => void;
  setTestimonials: (testimonials: Testimonial[] | ((prev: Testimonial[]) => Testimonial[])) => void;
}

export function AdminLayout({ children, loggedInUser, onLogout, appState, activeSection, setActiveSection, setTestimonials }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const currentPage = pageConfig.find(p => p.id === activeSection) || pageConfig[0];

  return (
    <ThemeProvider>
      <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
          <motion.div 
            className="flex min-h-screen w-full bg-background text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
              <Sidebar 
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
              />
              <motion.div 
                className="flex flex-1 flex-col transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                  <AdminHeader 
                      pageName={currentPage.title}
                      onLogout={onLogout}
                      loggedInUser={loggedInUser}
                      testimonials={appState.testimonials}
                      setActiveSection={setActiveSection}
                      setTestimonials={setTestimonials}
                  />
                  <motion.main 
                    className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                      <div className="max-w-full">
                          {children}
                      </div>
                  </motion.main>
              </motion.div>
          </motion.div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
}

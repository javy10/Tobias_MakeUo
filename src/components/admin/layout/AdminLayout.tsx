
'use client';

import { useState, createContext, useContext, type ReactNode, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import type { User, AppState, Testimonial } from '@/lib/types';
import { pageConfig } from './pageConfig';
import { ThemeProvider } from '@/hooks/use-theme';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const currentPage = pageConfig.find(p => p.id === activeSection) || pageConfig[0];

  return (
    <ThemeProvider>
      <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
          <div className="flex min-h-screen w-full bg-secondary">
              <Sidebar 
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
              />
              <div className="flex flex-1 flex-col transition-all duration-300 md:ml-64">
                  <AdminHeader 
                      pageName={currentPage.title}
                      onLogout={onLogout}
                      loggedInUser={loggedInUser}
                      testimonials={appState.testimonials}
                      setActiveSection={setActiveSection}
                      setTestimonials={setTestimonials}
                  />
                  <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-auto">
                      <div className="max-w-full">
                          {children}
                      </div>
                  </main>
              </div>
          </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
}

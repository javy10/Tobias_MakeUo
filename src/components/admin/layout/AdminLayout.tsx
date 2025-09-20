
'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import type { User } from '@/lib/types';
import { pageConfig } from './pageConfig';

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
}

export function AdminLayout({ children, loggedInUser, onLogout }: AdminLayoutProps) {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const currentPage = pageConfig.find(p => p.id === activeSection) || pageConfig[0];

  return (
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
                />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    </SidebarContext.Provider>
  );
}

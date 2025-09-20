
'use client';
import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../layout';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const { 
    appState, 
    setHeroContent,
    setServices,
    setProducts,
    setGalleryItems,
    setTestimonials,
    setAboutMeContent,
    setUsers,
    setCategories,
    isStateLoaded
  } = useAppContext();
  
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // State for the active section, managed here
  const [activeSection, setActiveSection] = useState('dashboard');

  // Effect to check for a logged-in user in localStorage on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('authenticatedUser');
      if (storedUser) {
        setAuthenticatedUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('authenticatedUser');
    }
    setIsLoadingSession(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = appState.users.find(u => u.email === email && u.password === password);

    if (user) {
      const userToStore = { id: user.id, name: user.name, email: user.email }; // Don't store password
      localStorage.setItem('authenticatedUser', JSON.stringify(userToStore));
      setAuthenticatedUser(userToStore);
      setError('');
    } else {
      setError('Correo electrónico o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticatedUser');
    setAuthenticatedUser(null);
    router.push('/');
  };
  
  if (isLoadingSession || !isStateLoaded) {
    // Show a loader while checking session and loading app state
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  if (!authenticatedUser) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">Acceso Administrativo</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      return (
        <AdminDashboardContent
          appState={appState}
          setHeroContent={setHeroContent}
          setServices={setServices}
          setProducts={setProducts}
          setGalleryItems={setGalleryItems}
          setTestimonials={setTestimonials}
          setAboutMeContent={setAboutMeContent}
          setUsers={setUsers}
          setCategories={setCategories}
          loggedInUser={authenticatedUser}
        />
      );
    }
    // For all other sections, render the management component
    return (
      <AdminDashboard
        section={activeSection}
        appState={appState}
        setHeroContent={setHeroContent}
        setServices={setServices}
        setProducts={setProducts}
        setGalleryItems={setGalleryItems}
        setTestimonials={setTestimonials}
        setAboutMeContent={setAboutMeContent}
        setUsers={setUsers}
        setCategories={setCategories}
        loggedInUser={authenticatedUser}
      />
    );
  };


  return (
    <AdminLayout 
      loggedInUser={authenticatedUser} 
      onLogout={handleLogout} 
      appState={appState}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
       {renderContent()}
    </AdminLayout>
  );
}

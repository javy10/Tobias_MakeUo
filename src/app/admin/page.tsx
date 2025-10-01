
'use client';
import { useState, useEffect } from 'react';
import type { User, Perfume, Service, Product, HeroContent, AboutMeContent, GalleryItem, Testimonial } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../layout';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { fileToStorable, saveItemToDB, deleteItemFromDB } from '@/lib/db';
import { showSuccessAlert, showErrorAlert } from '@/lib/alerts';


export default function AdminPage() {
  const {
    appState,
    setHeroContent,
    setServices,
    setProducts,
    setPerfumes,
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

  const [activeSection, setActiveSection] = useState('dashboard');

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
      const userToStore = { id: user.id, name: user.name, email: user.email };
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
  
  const handleAddPerfume = async (newPerfumeData: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, mediaFile: File) => {
    try {
      const { file, type } = await fileToStorable(mediaFile);
      const newPerfume: Perfume = {
        id: crypto.randomUUID(),
        ...newPerfumeData,
        url: URL.createObjectURL(file),
        type: type,
        file: file,
      };
      await saveItemToDB(newPerfume, 'perfumes');
      setPerfumes(prev => [...prev, newPerfume]);
      showSuccessAlert('Perfume añadido', 'El nuevo perfume se ha guardado correctamente.');
      return true;
    } catch (error) {
      console.error("Error adding perfume:", error);
      showErrorAlert('Error al añadir', 'No se pudo añadir el perfume.');
      return false;
    }
  };

  const handleDeletePerfume = async (id: string) => {
    try {
      await deleteItemFromDB(id, 'perfumes');
      setPerfumes(prev => prev.filter(p => p.id !== id));
      showSuccessAlert('Perfume eliminado', 'El perfume ha sido eliminado.');
    } catch (error) {
       console.error("Error deleting perfume:", error);
       showErrorAlert('Error al eliminar', 'No se pudo eliminar el perfume.');
    }
  };

  const handleUpdatePerfume = async (id: string, updatedData: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, newMediaFile?: File) => {
    const currentPerfume = appState.perfumes.find(p => p.id === id);
    if (!currentPerfume) return;
    let updatedPerfume: Perfume = { ...currentPerfume, ...updatedData };
    if (newMediaFile) {
        try {
            const { file, type } = await fileToStorable(newMediaFile);
            updatedPerfume = { ...updatedPerfume, url: URL.createObjectURL(file), type, file };
        } catch {
            showErrorAlert('Error de archivo', 'No se pudo cargar el nuevo archivo.');
            return;
        }
    }
    await saveItemToDB(updatedPerfume, 'perfumes');
    setPerfumes(prev => prev.map(p => p.id === id ? updatedPerfume : p));
    showSuccessAlert('Perfume actualizado', 'Los datos del perfume se han actualizado.');
  };


  const handleAddService = async (newServiceData: Omit<Service, 'id' | 'url' | 'type' | 'file'>, mediaFile: File) => {
    try {
        const { file, type } = await fileToStorable(mediaFile);
        const newService: Service = {
            id: crypto.randomUUID(),
            ...newServiceData,
            url: URL.createObjectURL(file),
            type: type,
            file: file,
        };
        await saveItemToDB(newService, 'services');
        setServices(prev => [...prev, newService]);
        showSuccessAlert('Servicio añadido', 'El nuevo servicio se ha guardado correctamente.');
        return true;
    } catch (error) {
        console.error("Error adding service:", error);
        showErrorAlert('Error al añadir', 'No se pudo añadir el servicio.');
        return false;
    }
  };

  const handleDeleteService = async (id: string) => {
      try {
        await deleteItemFromDB(id, 'services');
        setServices(prev => prev.filter(s => s.id !== id));
        showSuccessAlert('Servicio eliminado', 'El servicio ha sido eliminado.');
      } catch (error) {
        console.error("Error deleting service:", error);
        showErrorAlert('Error al eliminar', 'No se pudo eliminar el servicio.');
      }
  };

  const handleUpdateService = async (id: string, updatedData: Omit<Service, 'id' | 'url' | 'type' | 'file'>, newMediaFile?: File) => {
      const currentService = appState.services.find(s => s.id === id);
      if (!currentService) return;
      let updatedService: Service = { ...currentService, ...updatedData };
      if (newMediaFile) {
          try {
              const { file, type } = await fileToStorable(newMediaFile);
              updatedService = { ...updatedService, url: URL.createObjectURL(file), type, file };
          } catch {
              showErrorAlert('Error de archivo', 'No se pudo cargar el nuevo archivo.');
              return;
          }
      }
      await saveItemToDB(updatedService, 'services');
      setServices(prev => prev.map(s => s.id === id ? updatedService : s));
      showSuccessAlert('Servicio actualizado', 'Los datos del servicio se han actualizado.');
  };

  const handleAddProduct = async (newProductData: Omit<Product, 'id' | 'url' | 'type' | 'file'>, mediaFile: File) => {
    try {
        const { file, type } = await fileToStorable(mediaFile);
        const newProduct: Product = {
            id: crypto.randomUUID(),
            ...newProductData,
            url: URL.createObjectURL(file),
            type: type,
            file: file,
        };
        await saveItemToDB(newProduct, 'products');
        setProducts(prev => [...prev, newProduct]);
        showSuccessAlert('Producto añadido', 'El nuevo producto se ha guardado correctamente.');
        return true;
    } catch (error) {
        console.error("Error adding product:", error);
        showErrorAlert('Error al añadir', 'No se pudo añadir el producto.');
        return false;
    }
  };

  const handleDeleteProduct = async (id: string) => {
      try {
        await deleteItemFromDB(id, 'products');
        setProducts(prev => prev.filter(p => p.id !== id));
        showSuccessAlert('Producto eliminado', 'El producto ha sido eliminado.');
      } catch (error) {
        console.error("Error deleting product:", error);
        showErrorAlert('Error al eliminar', 'No se pudo eliminar el producto.');
      }
  };

  const handleUpdateProduct = async (id: string, updatedData: Omit<Product, 'id' | 'url' | 'type' | 'file'>, newMediaFile?: File) => {
      const currentProduct = appState.products.find(p => p.id === id);
      if (!currentProduct) return;
      let updatedProduct: Product = { ...currentProduct, ...updatedData };
      if (newMediaFile) {
          try {
              const { file, type } = await fileToStorable(newMediaFile);
              updatedProduct = { ...updatedProduct, url: URL.createObjectURL(file), type, file };
          } catch {
              showErrorAlert('Error de archivo', 'No se pudo cargar el nuevo archivo.');
              return;
          }
      }
      await saveItemToDB(updatedProduct, 'products');
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      showSuccessAlert('Producto actualizado', 'Los datos del producto se han actualizado.');
  };
  
    const handleHeroUpdate = async (updatedData: Omit<HeroContent, 'id' | 'url' | 'type' | 'file'>, mediaFile?: File) => {
        let updatedHeroContent: HeroContent = { ...appState.heroContent, ...updatedData };
        if (mediaFile) {
            try {
                const { file, type } = await fileToStorable(mediaFile);
                updatedHeroContent = { ...updatedHeroContent, url: URL.createObjectURL(file), type, file };
            } catch {
                showErrorAlert('Error de archivo', 'No se pudo cargar el archivo.');
                return;
            }
        }
        await saveItemToDB(updatedHeroContent, 'heroContent');
        setHeroContent(updatedHeroContent);
        showSuccessAlert('Sección actualizada', 'El contenido de la sección inicial ha sido actualizado.');
    };

    const handleAboutMeUpdate = async (updatedData: Omit<AboutMeContent, 'id' | 'url' | 'type' | 'file'>, mediaFile?: File) => {
        let updatedAboutMeContent: AboutMeContent = { ...appState.aboutMeContent, ...updatedData };
        if (mediaFile) {
            try {
                const { file, type } = await fileToStorable(mediaFile);
                updatedAboutMeContent = { ...updatedAboutMeContent, url: URL.createObjectURL(file), type, file };
            } catch {
                showErrorAlert('Error de archivo', 'No se pudo cargar el archivo.');
                return;
            }
        }
        await saveItemToDB(updatedAboutMeContent, 'aboutMeContent');
        setAboutMeContent(updatedAboutMeContent);
        showSuccessAlert('Sección actualizada', "La sección 'Sobre Mí' ha sido actualizada.");
    };

    const handleAddGalleryItem = async (newItemData: Omit<GalleryItem, 'id' | 'url' | 'file' | 'type' | 'alt'>, mediaFile: File) => {
      try {
        const { file, type } = await fileToStorable(mediaFile);
        const newGalleryItem: GalleryItem = {
          id: crypto.randomUUID(),
          ...newItemData,
          alt: newItemData.title,
          url: URL.createObjectURL(file),
          type: type,
          file: file,
        };
        await saveItemToDB(newGalleryItem, 'galleryItems');
        setGalleryItems(prev => [...prev, newGalleryItem]);
        showSuccessAlert('Elemento añadido', 'El nuevo elemento se ha guardado en la galería.');
        return true;
      } catch (error) {
        console.error("Error adding gallery item:", error);
        showErrorAlert('Error al añadir', 'No se pudo añadir el elemento a la galería.');
        return false;
      }
    };

    const handleDeleteGalleryItem = async (id: string) => {
        try {
            await deleteItemFromDB(id, 'galleryItems');
            setGalleryItems(prev => prev.filter(g => g.id !== id));
            showSuccessAlert('Elemento eliminado', 'El elemento ha sido eliminado de la galería.');
        } catch (error) {
            console.error('Failed to delete gallery item:', error);
            showErrorAlert('Error al eliminar', 'No se pudo eliminar el elemento de la galería.');
        }
    };

    const handleUpdateGalleryItem = async (id: string, updatedData: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, newMediaFile?: File) => {
        const currentItem = appState.galleryItems.find(item => item.id === id);
        if (!currentItem) return;
        let updatedGalleryItem: GalleryItem = { ...currentItem, ...updatedData, alt: updatedData.title };
        if (newMediaFile) {
            try {
                const { file, type } = await fileToStorable(newMediaFile);
                updatedGalleryItem = { ...updatedGalleryItem, url: URL.createObjectURL(file), type, file };
            } catch (error) {
                showErrorAlert('Error de archivo', 'No se pudo procesar el nuevo archivo.');
                return;
            }
        }
        await saveItemToDB(updatedGalleryItem, 'galleryItems');
        setGalleryItems(prev => prev.map(item => item.id === id ? updatedGalleryItem : item));
        showSuccessAlert('Elemento actualizado', 'El elemento de la galería se ha actualizado.');
    };

    const handleUpdateTestimonialStatus = (id: string, status: 'approved' | 'rejected') => {
        const updatedTestimonials = appState.testimonials.map(t => t.id === id ? { ...t, status } : t);
        setTestimonials(updatedTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
        const statusText = status === 'approved' ? 'aprobado' : 'rechazado';
        showSuccessAlert('Estado actualizado', `El testimonio ha sido ${statusText}.`);
    };

    const handleDeleteTestimonial = (id: string) => {
        const updatedTestimonials = appState.testimonials.filter(t => t.id !== id);
        setTestimonials(updatedTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
        showSuccessAlert('Testimonio eliminado', 'El testimonio ha sido eliminado.');
    };


  if (isLoadingSession || !isStateLoaded) {
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
        />
      );
    }
    return (
      <AdminDashboard
        section={activeSection}
        appState={appState}
        onUpdateHeroContent={handleHeroUpdate}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddPerfume={handleAddPerfume}
        onUpdatePerfume={handleUpdatePerfume}
        onDeletePerfume={handleDeletePerfume}
        onAddGalleryItem={handleAddGalleryItem}
        onUpdateGalleryItem={handleUpdateGalleryItem}
        onDeleteGalleryItem={handleDeleteGalleryItem}
        onUpdateTestimonialStatus={handleUpdateTestimonialStatus}
        onDeleteTestimonial={handleDeleteTestimonial}
        setTestimonials={setTestimonials}
        onUpdateAboutMeContent={handleAboutMeUpdate}
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
      setTestimonials={setTestimonials}
    >
       {renderContent()}
    </AdminLayout>
  );
}

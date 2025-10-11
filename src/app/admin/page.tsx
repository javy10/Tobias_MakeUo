'use client';
import { useState, useEffect } from 'react';
import type { User, Perfume, Service, Product, HeroContent, AboutMeContent, GalleryItem, Testimonial, Course } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../layout';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { showSuccessAlert, showErrorAlert } from '@/lib/alerts';
// Importar hooks con sincronización en tiempo real
import { 
  useRealtimeCrud, 
  useRealtimeSingleton
} from '@/hooks/use-realtime-crud';
import { optimizeFile } from '@/lib/file-optimization';
import { updateItemOptimistic, deleteItemOptimistic } from '@/lib/optimized-db';
import { supabase } from '@/lib/supabase';


export default function AdminPage() {
  const {
    appState,
    setHeroContent,
    setServices,
    setProducts,
    setPerfumes,
    setCourses,
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

  // Hooks con sincronización en tiempo real para operaciones CRUD
  const servicesCrud = useRealtimeCrud({
    tableName: 'services',
    setState: setServices,
    currentItems: appState.services
  });

  const productsCrud = useRealtimeCrud({
    tableName: 'products',
    setState: setProducts,
    currentItems: appState.products,
    silent: true // Silenciar mensajes automáticos para usar el sistema de loading global
  });

  const perfumesCrud = useRealtimeCrud({
    tableName: 'perfumes',
    setState: setPerfumes,
    currentItems: appState.perfumes,
    silent: true // Silenciar mensajes automáticos para usar el sistema de loading global
  });

  const coursesCrud = useRealtimeCrud({
    tableName: 'courses',
    setState: setCourses,
    currentItems: appState.courses,
    silent: true // Silenciar mensajes automáticos para usar el sistema de loading global
  });

  const galleryCrud = useRealtimeCrud({
    tableName: 'gallery_items',
    setState: setGalleryItems,
    currentItems: appState.galleryItems,
    silent: true
  });

  const heroCrud = useRealtimeSingleton({
    tableName: 'hero_content',
    setState: setHeroContent,
    currentItem: appState.heroContent
  });

  const aboutMeCrud = useRealtimeSingleton({
    tableName: 'about_me_content',
    setState: setAboutMeContent,
    currentItem: appState.aboutMeContent
  });

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
  
  // Funciones optimizadas para perfumes
  const handleAddPerfume = async (newPerfumeData: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, mediaFile: File) => {
    try {
      // Para imágenes pequeñas (< 2MB), usar directamente sin optimización
      if (mediaFile.size < 2 * 1024 * 1024) {
        return await perfumesCrud.addItem(newPerfumeData, mediaFile);
      }
      
      // Para archivos grandes, optimizar en segundo plano
      const optimizedFile = await optimizeFile(mediaFile);
      return await perfumesCrud.addItem(newPerfumeData, optimizedFile);
    } catch (error) {
      console.error("Error adding perfume:", error);
      showErrorAlert('Error al añadir', 'No se pudo añadir el perfume.');
      return false;
    }
  };

  const handleDeletePerfume = async (id: string) => {
    try {
      // Eliminación optimista: mostrar mensaje inmediatamente
      showSuccessAlert('¡Perfume eliminado!', 'El perfume ha sido eliminado exitosamente.');
      
      // Ejecutar eliminación en segundo plano (sin await)
      perfumesCrud.deleteItem(id).catch(error => {
        console.error("Error deleting perfume:", error);
        showErrorAlert('Error al eliminar', 'No se pudo eliminar el perfume.');
      });
    } catch (error) {
      console.error("Error deleting perfume:", error);
      showErrorAlert('Error al eliminar', 'No se pudo eliminar el perfume.');
    }
  };

  const handleUpdatePerfume = async (id: string, updatedData: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, newMediaFile?: File) => {
    try {
      const optimizedFile = newMediaFile ? await optimizeFile(newMediaFile) : undefined;
      await perfumesCrud.updateItem(id, updatedData, optimizedFile);
    } catch (error) {
      console.error("Error updating perfume:", error);
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el perfume.');
    }
  };


  // Funciones optimizadas para servicios
  const handleAddService = async (newServiceData: Omit<Service, 'id' | 'url' | 'type' | 'file'>, mediaFile: File) => {
    try {
      const optimizedFile = await optimizeFile(mediaFile);
      return await servicesCrud.addItem(newServiceData, optimizedFile);
    } catch (error) {
      console.error("Error adding service:", error);
      showErrorAlert('Error al añadir', 'No se pudo añadir el servicio.');
      return false;
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await servicesCrud.deleteItem(id);
      showSuccessAlert('¡Servicio eliminado!', 'El servicio ha sido eliminado exitosamente.');
    } catch (error) {
      console.error("Error deleting service:", error);
      showErrorAlert('Error al eliminar', 'No se pudo eliminar el servicio.');
    }
  };

  const handleUpdateService = async (id: string, updatedData: Omit<Service, 'id' | 'url' | 'type' | 'file'>, newMediaFile?: File) => {
    try {
      const optimizedFile = newMediaFile ? await optimizeFile(newMediaFile) : undefined;
      await servicesCrud.updateItem(id, updatedData, optimizedFile);
      showSuccessAlert('¡Servicio actualizado!', 'El servicio ha sido actualizado exitosamente.');
    } catch (error) {
      console.error("Error updating service:", error);
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el servicio.');
    }
  };

  // Funciones optimizadas para cursos
  const handleAddCourse = async (newCourseData: Omit<Course, 'id' | 'url' | 'type' | 'file'>, mediaFile: File) => {
    try {
      // Para imágenes pequeñas (< 2MB), usar directamente sin optimización
      if (mediaFile.size < 2 * 1024 * 1024) {
        return await coursesCrud.addItem(newCourseData, mediaFile);
      }
      
      // Para archivos grandes, optimizar en segundo plano
      const optimizedFile = await optimizeFile(mediaFile);
      return await coursesCrud.addItem(newCourseData, optimizedFile);
    } catch (error) {
      console.error("Error adding course:", error);
      showErrorAlert('Error al añadir', `No se pudo añadir el curso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      return false;
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      // Eliminación optimista: mostrar mensaje inmediatamente
      showSuccessAlert('¡Curso eliminado!', 'El curso ha sido eliminado exitosamente.');
      
      // Ejecutar eliminación en segundo plano (sin await)
      coursesCrud.deleteItem(id).catch(error => {
        console.error("Error deleting course:", error);
        showErrorAlert('Error al eliminar', 'No se pudo eliminar el curso.');
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      showErrorAlert('Error al eliminar', 'No se pudo eliminar el curso.');
    }
  };

  const handleUpdateCourse = async (id: string, updatedData: Omit<Course, 'id' | 'url' | 'type' | 'file'>, newMediaFile?: File) => {
    try {
      const optimizedFile = newMediaFile ? await optimizeFile(newMediaFile) : undefined;
      await coursesCrud.updateItem(id, updatedData, optimizedFile);
    } catch (error) {
      console.error("Error updating course:", error);
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el curso.');
    }
  };

  // Funciones optimizadas para productos
  const handleAddProduct = async (newProductData: Omit<Product, 'id' | 'url' | 'type' | 'file'>, mediaFile: File) => {
    try {
      // Para imágenes pequeñas (< 2MB), usar directamente sin optimización
      if (mediaFile.size < 2 * 1024 * 1024) {
        return await productsCrud.addItem(newProductData, mediaFile);
      }
      
      // Para archivos grandes, optimizar en segundo plano
      const optimizedFile = await optimizeFile(mediaFile);
      return await productsCrud.addItem(newProductData, optimizedFile);
    } catch (error) {
      console.error("Error adding product:", error);
      showErrorAlert('Error al añadir', 'No se pudo añadir el producto.');
      return false;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      // Eliminación optimista: mostrar mensaje inmediatamente
      showSuccessAlert('¡Producto eliminado!', 'El producto ha sido eliminado exitosamente.');
      
      // Ejecutar eliminación en segundo plano (sin await)
      productsCrud.deleteItem(id).catch(error => {
        console.error("Error deleting product:", error);
        showErrorAlert('Error al eliminar', 'No se pudo eliminar el producto.');
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      showErrorAlert('Error al eliminar', 'No se pudo eliminar el producto.');
    }
  };

  const handleUpdateProduct = async (id: string, updatedData: Omit<Product, 'id' | 'url' | 'type' | 'file'>, newMediaFile?: File) => {
    try {
      const optimizedFile = newMediaFile ? await optimizeFile(newMediaFile) : undefined;
      await productsCrud.updateItem(id, updatedData, optimizedFile);
    } catch (error) {
      console.error("Error updating product:", error);
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el producto.');
    }
  };
  
  // Funciones optimizadas para contenido singleton
  const handleHeroUpdate = async (updatedData: Omit<HeroContent, 'id' | 'url' | 'type' | 'file'>, mediaFile?: File) => {
    try {
      const optimizedFile = mediaFile ? await optimizeFile(mediaFile) : undefined;
      await heroCrud.updateItem(updatedData, optimizedFile);
    } catch (error) {
      console.error('Error updating hero content:', error);
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el contenido de la sección inicial.');
    }
  };

  const handleAboutMeUpdate = async (updatedData: Omit<AboutMeContent, 'id' | 'url' | 'type' | 'file'>, mediaFile?: File) => {
    try {
      const optimizedFile = mediaFile ? await optimizeFile(mediaFile) : undefined;
      await aboutMeCrud.updateItem(updatedData, optimizedFile);
    } catch (error) {
      console.error('Error updating about me content:', error);
      showErrorAlert('Error al actualizar', "No se pudo actualizar la sección 'Sobre Mí'.");
    }
  };

  // Funciones optimizadas para galería
  const handleAddGalleryItem = async (newItemData: Omit<GalleryItem, 'id' | 'url' | 'file' | 'type' | 'alt'>, mediaFile: File) => {
    try {
      const optimizedFile = await optimizeFile(mediaFile);
      const itemDataWithAlt = { ...newItemData, alt: newItemData.title };
      return await galleryCrud.addItem(itemDataWithAlt, optimizedFile);
    } catch (error) {
      console.error("Error adding gallery item:", error);
      showErrorAlert('Error al añadir', 'No se pudo añadir el elemento a la galería.');
      return false;
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    // Mostrar mensaje de confirmación al instante
    showSuccessAlert('¡Éxito!', 'Elemento de galería eliminado exitosamente');
    
    // Ejecutar eliminación en segundo plano
    galleryCrud.deleteItem(id).catch(error => {
      console.error('Error deleting gallery item:', error);
      showErrorAlert('Error al eliminar', 'No se pudo eliminar el elemento de la galería.');
    });
  };

  const handleUpdateGalleryItem = async (id: string, updatedData: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, newMediaFile?: File) => {
    try {
      const optimizedFile = newMediaFile ? await optimizeFile(newMediaFile) : undefined;
      const itemDataWithAlt = { ...updatedData, alt: updatedData.title };
      
      // Mostrar mensaje de confirmación al instante
      showSuccessAlert('¡Éxito!', 'Elemento de galería actualizado exitosamente');
      
      // Ejecutar actualización en segundo plano
      await galleryCrud.updateItem(id, itemDataWithAlt, optimizedFile);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el elemento de la galería.');
    }
  };

  // Funciones optimizadas para testimonios
  const handleUpdateTestimonial = async (id: string, data: any) => {
    try {
      // Actualización optimista
      const updatedTestimonials = appState.testimonials.map(t => t.id === id ? { ...t, ...data } : t);
      setTestimonials(updatedTestimonials);
      
      // Operación en background
      await updateItemOptimistic('testimonials', id, data);
      
      showSuccessAlert('Testimonio actualizado', 'El testimonio se ha actualizado exitosamente.');
    } catch (error) {
      console.error('Error updating testimonial:', error);
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el testimonio.');
    }
  };

  const handleUpdateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      // Actualización optimista
      const updatedTestimonials = appState.testimonials.map(t => t.id === id ? { ...t, status } : t);
      setTestimonials(updatedTestimonials);
      
      // Operación en background
      const testimonial = appState.testimonials.find(t => t.id === id);
      if (testimonial) {
        await updateItemOptimistic('testimonials', id, { ...testimonial, status });
      }
      
      const statusText = status === 'approved' ? 'aprobado' : 'rechazado';
      showSuccessAlert('Estado actualizado', `El testimonio ha sido ${statusText}.`);
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el estado del testimonio.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      // Actualización optimista
      const updatedTestimonials = appState.testimonials.filter(t => t.id !== id);
      setTestimonials(updatedTestimonials);
      
      // Operación en background
      const testimonial = appState.testimonials.find(t => t.id === id);
      if (testimonial) {
        await deleteItemOptimistic('testimonials', id, testimonial);
      }
      
      showSuccessAlert('Testimonio eliminado', 'El testimonio ha sido eliminado.');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showErrorAlert('Error al eliminar', 'No se pudo eliminar el testimonio.');
    }
  };

  // Funciones con sincronización en tiempo real para categorías
  const handleAddCategory = async (data: { name: string }): Promise<boolean> => {
    try {
      const id = crypto.randomUUID();
      const newCategory = { ...data, id };
      
      // Actualización optimista
      setCategories(prev => [...prev, newCategory]);
      
      // Operación real con sincronización
      const { error } = await supabase.from('categories').insert(newCategory);
      
      if (error) throw error;
      
      showSuccessAlert('Categoría añadida', 'La nueva categoría se ha guardado y sincronizado correctamente.');
      return true;
    } catch (error) {
      console.error("Error adding category:", error);
      // Revertir cambios
      setCategories(prev => prev.filter(c => c.id !== id));
      showErrorAlert('Error al añadir', 'No se pudo añadir la categoría.');
      return false;
    }
  };

  const handleUpdateCategory = async (id: string, data: { name: string }): Promise<void> => {
    try {
      const currentCategory = appState.categories.find(c => c.id === id);
      if (!currentCategory) throw new Error('Categoría no encontrada');
      
      // Actualización optimista
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      
      // Operación real con sincronización
      const { error } = await supabase.from('categories').update(data).eq('id', id);
      
      if (error) throw error;
      
      showSuccessAlert('Categoría actualizada', 'Los datos de la categoría se han actualizado y sincronizado correctamente.');
    } catch (error) {
      console.error("Error updating category:", error);
      // Revertir cambios
      setCategories(prev => prev.map(c => c.id === id ? currentCategory : c));
      showErrorAlert('Error al actualizar', 'No se pudo actualizar la categoría.');
    }
  };

  const handleDeleteCategory = async (id: string): Promise<void> => {
    try {
      const currentCategory = appState.categories.find(c => c.id === id);
      if (!currentCategory) throw new Error('Categoría no encontrada');
      
      // Actualización optimista
      setCategories(prev => prev.filter(c => c.id !== id));
      
      // Operación real con sincronización
      const { error } = await supabase.from('categories').delete().eq('id', id);
      
      if (error) throw error;
      
      showSuccessAlert('Categoría eliminada', 'La categoría ha sido eliminada y sincronizada correctamente.');
    } catch (error) {
      console.error("Error deleting category:", error);
      // Revertir cambios
      if (currentCategory) {
        setCategories(prev => [...prev, currentCategory]);
      }
      showErrorAlert('Error al eliminar', 'No se pudo eliminar la categoría.');
    }
  };

  // Función para generar contraseña temporal
  const generateTemporaryPassword = (): string => {
    const currentYear = new Date().getFullYear();
    return `temporal${currentYear}`;
  };

  // Funciones con sincronización en tiempo real para usuarios
  const handleAddUser = async (data: { name: string; email: string; password?: string }): Promise<{ success: boolean; temporaryPassword?: string; error?: string }> => {
    const id = crypto.randomUUID();
    
    try {
      // Generar contraseña temporal automáticamente
      const temporaryPassword = generateTemporaryPassword();
      
      // Preparar datos del usuario
      const userData: any = {
        id,
        name: data.name,
        email: data.email,
        password: temporaryPassword
      };
      
      // Validar que los datos no estén vacíos
      if (!userData.name || !userData.email) {
        throw new Error('Nombre y email son requeridos');
      }
      
      console.log('Datos del usuario a insertar:', { ...userData, password: '[TEMPORAL]' });
      
      // Operación real con sincronización (SIN actualización optimista)
      const { error } = await supabase.from('users').insert(userData);
      
      if (error) throw error;
      
      return { success: true, temporaryPassword };
    } catch (error) {
      console.error("Error adding user:", error);
      
      // Revertir cambios
      setUsers(prev => prev.filter(u => u.id !== id));
      
      // Mostrar mensaje de error específico
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: errorMessage };
    }
  };

  const handleUpdateUser = async (id: string, data: { name: string; email: string; password?: string }): Promise<void> => {
    try {
      const currentUser = appState.users.find(u => u.id === id);
      if (!currentUser) throw new Error('Usuario no encontrado');
      
      // Preparar datos de actualización, excluyendo password vacío
      const updateData: any = {
        name: data.name,
        email: data.email
      };
      
      // Solo incluir password si no está vacío
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }
      
      // Actualización optimista
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updateData } : u));
      
      // Operación real con sincronización
      const { error } = await supabase.from('users').update(updateData).eq('id', id);
      
      if (error) throw error;
      
      showSuccessAlert('Usuario actualizado', 'Los datos del usuario se han actualizado y sincronizado correctamente.');
    } catch (error) {
      console.error("Error updating user:", error);
      // Revertir cambios
      setUsers(prev => prev.map(u => u.id === id ? currentUser : u));
      showErrorAlert('Error al actualizar', 'No se pudo actualizar el usuario.');
    }
  };

  const handleDeleteUser = async (id: string): Promise<void> => {
    try {
      const currentUser = appState.users.find(u => u.id === id);
      if (!currentUser) throw new Error('Usuario no encontrado');
      
      // Actualización optimista
      setUsers(prev => prev.filter(u => u.id !== id));
      
      // Operación real con sincronización
      const { error } = await supabase.from('users').delete().eq('id', id);
      
      if (error) throw error;
      
      showSuccessAlert('Usuario eliminado', 'El usuario ha sido eliminado y sincronizado correctamente.');
    } catch (error) {
      console.error("Error deleting user:", error);
      // Revertir cambios
      if (currentUser) {
        setUsers(prev => [...prev, currentUser]);
      }
      showErrorAlert('Error al eliminar', 'No se pudo eliminar el usuario.');
    }
  };


  if (isLoadingSession || !isStateLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Cargando panel administrativo...</p>
          <p className="text-sm text-muted-foreground mt-2">
            {!process.env.NEXT_PUBLIC_SUPABASE_URL && "⚠️ Configurando conexión a base de datos..."}
          </p>
        </div>
      </div>
    );
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
        onAddCourse={handleAddCourse}
        onUpdateCourse={handleUpdateCourse}
        onDeleteCourse={handleDeleteCourse}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddPerfume={handleAddPerfume}
        onUpdatePerfume={handleUpdatePerfume}
        onDeletePerfume={handleDeletePerfume}
        onAddGalleryItem={handleAddGalleryItem}
        onUpdateGalleryItem={handleUpdateGalleryItem}
        onDeleteGalleryItem={handleDeleteGalleryItem}
        onUpdateTestimonial={handleUpdateTestimonial}
        onUpdateTestimonialStatus={handleUpdateTestimonialStatus}
        onDeleteTestimonial={handleDeleteTestimonial}
        setTestimonials={setTestimonials}
        onUpdateAboutMeContent={handleAboutMeUpdate}
        setUsers={setUsers}
        setCategories={setCategories}
        loggedInUser={authenticatedUser}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
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

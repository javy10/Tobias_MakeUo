
'use client';

import { useState } from 'react';
import type { HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AIContentGenerator } from './AIContentGenerator';
import { Trash2, Check, X, ThumbsUp, ThumbsDown, UserPlus, KeyRound, Pencil, Video, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { deleteItemFromDB, fileToStorable, saveItemToDB } from '@/lib/db';

// Function to read a file as a Data URL (Base64) - ONLY FOR IMAGES
const readImageAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export function AdminDashboard({
  loggedInUser,
  onLogout,
  users,
  setUsers,
  heroContent,
  setHeroContent,
  services,
  setServices,
  products,
  setProducts,
  galleryItems,
  setGalleryItems,
  testimonials,
  setTestimonials,
  aboutMeContent,
  setAboutMeContent,
  categories,
  setCategories
}: AdminDashboardProps) {
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentUserForPasswordChange, setCurrentUserForPasswordChange] = useState<User | null>(null);

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategoryToEdit, setCurrentCategoryToEdit] = useState<Category | null>(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const { toast } = useToast();
  
  // State for image previews
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [serviceImagePreview, setServiceImagePreview] = useState<string | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [galleryMediaPreview, setGalleryMediaPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [aboutMeImagePreview, setAboutMeImagePreview] = useState<string | null>(null);

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setter(url);
    } else {
      setter(null);
      if (file) {
        toast({
          variant: 'destructive',
          title: 'Archivo inválido',
          description: 'Por favor, selecciona un archivo de imagen.',
        });
      }
    }
  };

  const handleMediaFilePreview = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<{ url: string; type: 'image' | 'video' } | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
      if (fileType) {
        const url = URL.createObjectURL(file);
        setter({ url, type: fileType });
      } else {
        setter(null);
        toast({
          variant: 'destructive',
          title: 'Archivo inválido',
          description: 'Por favor, selecciona un archivo de imagen o video.',
        });
      }
    } else {
      setter(null);
    }
  };

  const handleHeroUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('imageFile') as File;
    
    let newImageUrl = heroContent.imageUrl;
    if (imageFile && imageFile.size > 0) {
      try {
        newImageUrl = await readImageAsDataURL(imageFile);
      } catch {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la imagen.' });
        return;
      }
    }
    
    setHeroContent({
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      imageUrl: newImageUrl,
    });
    toast({ title: 'Éxito', description: 'Contenido de la sección inicial actualizado.' });
    setHeroImagePreview(null);
    (e.target as HTMLFormElement).reset();
  };
  
  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('imageFile') as File;

    if (!imageFile || imageFile.size === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes seleccionar una imagen para el servicio.' });
      return;
    }
    
    try {
      const imageUrl = await readImageAsDataURL(imageFile);
      const newService: Service = {
        id: crypto.randomUUID(),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        imageUrl,
      };
      setServices([...services, newService]);
      form.reset();
      setServiceImagePreview(null);
      toast({ title: 'Éxito', description: 'Nuevo servicio añadido.' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la imagen.' });
    }
  };
  
  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast({ title: 'Éxito', description: 'Servicio eliminado.' });
  };
  
  const handleUpdateService = async (id: string, updatedService: Omit<Service, 'id' | 'imageUrl'>, newImageFile?: File) => {
    let imageUrl = services.find(s => s.id === id)?.imageUrl;
    if (!imageUrl) return;

    if (newImageFile) {
      try {
        imageUrl = await readImageAsDataURL(newImageFile);
      } catch {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la imagen.' });
        return;
      }
    }
    
    setServices(services.map(s => s.id === id ? { ...s, ...updatedService, imageUrl: imageUrl! } : s));
    toast({ title: 'Éxito', description: 'Servicio actualizado.' });
  };
  
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('imageFile') as File;
    
    if (!imageFile || imageFile.size === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes seleccionar una imagen para el producto.' });
      return;
    }

    try {
      const imageUrl = await readImageAsDataURL(imageFile);
      const newProduct: Product = {
        id: crypto.randomUUID(),
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        stock: parseInt(formData.get('stock') as string, 10),
        imageUrl: imageUrl,
        categoryId: formData.get('categoryId') as string,
      };
      setProducts([...products, newProduct]);
      form.reset();
      setProductImagePreview(null);
      toast({ title: 'Éxito', description: 'Nuevo producto añadido.' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la imagen.' });
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: 'Éxito', description: 'Producto eliminado.' });
  };

  const handleUpdateProduct = async (id: string, updatedProduct: Omit<Product, 'id' | 'imageUrl'>, newImageFile?: File) => {
    let imageUrl = products.find(p => p.id === id)?.imageUrl;
    if (!imageUrl) return;

    if (newImageFile) {
      try {
        imageUrl = await readImageAsDataURL(newImageFile);
      } catch {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la imagen.' });
        return;
      }
    }
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct, imageUrl: imageUrl! } : p));
    toast({ title: 'Éxito', description: 'Producto actualizado.' });
  };

  const handleAddGalleryItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const mediaFile = formData.get('mediaFile') as File;
    
    if (!mediaFile || mediaFile.size === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes seleccionar una imagen o video para la galería.' });
      return;
    }
    
    try {
        const { file, type } = await fileToStorable(mediaFile);
        const newGalleryItem: GalleryItem = {
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file), // Create a temporary URL for immediate display
            alt: formData.get('alt') as string,
            type: type,
            file: file, // Include the file object for DB storage
        };

        await saveItemToDB(newGalleryItem); // Save to IndexedDB
        setGalleryItems([...galleryItems, newGalleryItem]); // Update state

        form.reset();
        setGalleryMediaPreview(null);
        toast({ title: 'Éxito', description: 'Nuevo elemento añadido a la galería.' });
    } catch (error) {
        console.error('Failed to add gallery item:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el elemento en la galería.' });
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    try {
        await deleteItemFromDB(id);
        setGalleryItems(galleryItems.filter(g => g.id !== id));
        toast({ title: 'Éxito', description: 'Elemento eliminado de la galería.' });
    } catch (error) {
        console.error('Failed to delete gallery item:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el elemento de la galería.' });
    }
  };
  
  const handleUpdateGalleryItem = async (id: string, updatedItem: Omit<GalleryItem, 'id' | 'url' | 'type'>, newMediaFile?: File) => {
    const currentItem = galleryItems.find(item => item.id === id);
    if (!currentItem) return;

    let updatedGalleryItem: GalleryItem = { ...currentItem, ...updatedItem };

    if (newMediaFile) {
        try {
            const { file, type } = await fileToStorable(newMediaFile);
            updatedGalleryItem = {
                ...updatedGalleryItem,
                url: URL.createObjectURL(file),
                type,
                file,
            };
        } catch (error) {
            console.error('Failed to process new media file:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo procesar el nuevo archivo.' });
            return;
        }
    }
    
    try {
        await saveItemToDB(updatedGalleryItem);
        setGalleryItems(galleryItems.map(item => item.id === id ? updatedGalleryItem : item));
        toast({ title: 'Éxito', description: 'Elemento de la galería actualizado.' });
    } catch (error) {
        console.error('Failed to update gallery item:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el elemento en la galería.' });
    }
  };

  const handleUpdateTestimonialStatus = (id: string, status: 'approved' | 'rejected') => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, status } : t));
    toast({ title: 'Éxito', description: `Testimonio ${status === 'approved' ? 'aprobado' : 'rechazado'}.` });
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast({ title: 'Éxito', description: 'Testimonio eliminado.' });
  };

  const handleAboutMeUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('imageFile') as File;

    let newImageUrl = aboutMeContent.imageUrl;
    if (imageFile && imageFile.size > 0) {
        try {
            newImageUrl = await readImageAsDataURL(imageFile);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la imagen.' });
            return;
        }
    }
    
    setAboutMeContent({
        text: formData.get('text') as string,
        imageUrl: newImageUrl,
    });
    toast({ title: 'Éxito', description: "La sección 'Sobre Mí' ha sido actualizada." });
    setAboutMeImagePreview(null);
    (e.target as HTMLFormElement).reset();
  };

  const handleAddOrUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (isEditingUser && currentUserToEdit) {
        const updatedUser: User = {
            ...currentUserToEdit,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
        };
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast({ title: 'Éxito', description: `Usuario ${updatedUser.name} actualizado.` });
    } else {
        const newUser: User = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: 'temporal123',
        };
        setUsers([...users, newUser]);
        toast({
            title: 'Éxito',
            description: `Usuario ${newUser.name} añadido con contraseña temporal 'temporal123'.`
        });
    }

    setOpenUserDialog(false);
    setIsEditingUser(false);
    setCurrentUserToEdit(null);
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    if (currentUserForPasswordChange) {
      setUsers(users.map(u => u.id === currentUserForPasswordChange.id ? { ...u, password: newPassword } : u));
      setOpenPasswordDialog(false);
      setCurrentUserForPasswordChange(null);
      toast({ title: 'Éxito', description: 'Contraseña actualizada.' });
    }
  };

  const handleDeleteUser = (id: string) => {
    if (id === loggedInUser.id) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No puedes eliminar tu propia cuenta.',
        });
        return;
    }
    setUsers(users.filter(u => u.id !== id));
    toast({ title: 'Éxito', description: 'Usuario eliminado.' });
  };
  
  const handleAddOrUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    if (isEditingCategory && currentCategoryToEdit) {
        setCategories(categories.map(c => c.id === currentCategoryToEdit.id ? { ...c, name } : c));
        toast({ title: 'Éxito', description: 'Categoría actualizada.' });
    } else {
        const newCategory: Category = { id: crypto.randomUUID(), name };
        setCategories([...categories, newCategory]);
        toast({ title: 'Éxito', description: 'Categoría añadida.' });
    }

    setOpenCategoryDialog(false);
    setIsEditingCategory(false);
    setCurrentCategoryToEdit(null);
  };

  const handleDeleteCategory = (id: string) => {
      setCategories(categories.filter(c => c.id !== id));
      toast({ title: 'Éxito', description: 'Categoría eliminada.' });
  };

  const testimonialsByStatus = (status: Testimonial['status']) => testimonials.filter(t => t.status === status);

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <div key={testimonial.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
      <div>
        <div className='flex items-center gap-2 mb-2'>
          <p className="font-bold">- {testimonial.author}</p>
          <Badge variant={
            testimonial.status === 'approved' ? 'default' : testimonial.status === 'pending' ? 'secondary' : 'destructive'
          } className={cn(
            testimonial.status === 'approved' && 'bg-green-100 text-green-800',
          )}>
            {
              { 'pending': 'Pendiente', 'approved': 'Aprobado', 'rejected': 'Rechazado' }[testimonial.status]
            }
          </Badge>
        </div>
        <p className="italic">"{testimonial.text}"</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {testimonial.status !== 'approved' && (
          <Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleUpdateTestimonialStatus(testimonial.id, 'approved')}>
            <ThumbsUp className="w-5 h-5" />
          </Button>
        )}
        {testimonial.status !== 'rejected' && (
          <Button variant="ghost" size="icon" className="text-orange-600 hover:bg-orange-100 hover:text-orange-700" onClick={() => handleUpdateTestimonialStatus(testimonial.id, 'rejected')}>
            <ThumbsDown className="w-5 h-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="text-destructive-foreground/50 hover:bg-destructive/80 hover:text-destructive-foreground" onClick={() => handleDeleteTestimonial(testimonial.id)}>
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
  
  const EditServiceDialog = ({ service, onSave }: { service: Service; onSave: (id: string, data: Omit<Service, 'id' | 'imageUrl'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
        };
        const imageFile = formData.get('imageFile') as File;
        onSave(service.id, updatedData, imageFile && imageFile.size > 0 ? imageFile : undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Editar Servicio</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" defaultValue={service.title} />
                    <Textarea name="description" defaultValue={service.description} />
                    <Input name="imageFile" type="file" accept="image/*" onChange={(e) => handleFilePreview(e, setPreview)} />
                    {preview && <Image src={preview} alt="Preview" width={100} height={100} />}
                    <DialogFooter>
                        <Button type="submit">Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditProductDialog = ({ product, onSave }: { product: Product; onSave: (id: string, data: Omit<Product, 'id' | 'imageUrl'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            stock: parseInt(formData.get('stock') as string, 10),
            categoryId: formData.get('categoryId') as string,
        };
        const imageFile = formData.get('imageFile') as File;
        onSave(product.id, updatedData, imageFile && imageFile.size > 0 ? imageFile : undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Editar Producto</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" defaultValue={product.name} />
                    <Textarea name="description" defaultValue={product.description} />
                    <Input name="stock" type="number" defaultValue={product.stock} />
                     <Select name="categoryId" defaultValue={product.categoryId}>
                        <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input name="imageFile" type="file" accept="image/*" onChange={(e) => handleFilePreview(e, setPreview)} />
                    {preview && <Image src={preview} alt="Preview" width={100} height={100} />}
                    <DialogFooter>
                        <Button type="submit">Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditGalleryItemDialog = ({ item, onSave }: { item: GalleryItem; onSave: (id: string, data: Omit<GalleryItem, 'id' | 'url' | 'type'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            alt: formData.get('alt') as string,
        };
        const mediaFile = formData.get('mediaFile') as File;
        onSave(item.id, updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button variant="secondary" size="icon" className="absolute top-2 right-12 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"><Pencil className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Editar Elemento de Galería</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="alt" defaultValue={item.alt} />
                    <Input name="mediaFile" type="file" accept="image/*,video/*" onChange={(e) => handleMediaFilePreview(e, setPreview)} />
                    {preview && (
                        preview.type === 'image' ? (
                          <Image src={preview.url} alt="Preview" width={100} height={100} />
                        ) : (
                          <video src={preview.url} width={200} controls />
                        )
                    )}
                    <DialogFooter>
                        <Button type="submit">Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };


  return (
    <div className="min-h-dvh bg-secondary p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary">Panel Administrativo</h1>
            <p className="text-muted-foreground">Bienvenido, {loggedInUser.name}</p>
          </div>
          <Button onClick={onLogout} variant="outline" className="rounded-full">Salir</Button>
        </header>

        <Tabs defaultValue="hero">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-9 mb-6">
            <TabsTrigger value="hero">Sección Inicial</TabsTrigger>
            <TabsTrigger value="about">Sobre Mí</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="gallery">Mis Trabajos</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="ai-content">Ideas con IA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero">
            <Card>
              <CardHeader><CardTitle className="font-headline">Contenido de la Sección Inicial</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleHeroUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" name="title" defaultValue={heroContent.title} />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Textarea id="subtitle" name="subtitle" defaultValue={heroContent.subtitle} />
                  </div>
                  <div>
                    <Label htmlFor="imageFile">Imagen de Fondo</Label>
                    <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={(e) => handleFilePreview(e, setHeroImagePreview)} />
                    <p className="text-sm text-muted-foreground mt-2">Sube una nueva imagen para reemplazar la actual. Si no seleccionas ninguna, se mantendrá la imagen existente.</p>
                     {heroImagePreview && (
                        <div className="mt-4 relative aspect-video w-full max-w-sm rounded-md overflow-hidden">
                          <Image src={heroImagePreview} alt="Vista previa de la imagen de fondo" fill className="object-cover" />
                        </div>
                      )}
                  </div>
                  <Button type="submit" className="rounded-full">Actualizar</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="about">
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar 'Sobre Mí'</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAboutMeUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="about-text">Texto de Presentación</Label>
                    <Textarea id="about-text" name="text" defaultValue={aboutMeContent.text} rows={6} />
                  </div>
                  <div>
                    <Label htmlFor="about-imageFile">Foto</Label>
                    <Input id="about-imageFile" name="imageFile" type="file" accept="image/*" onChange={(e) => handleFilePreview(e, setAboutMeImagePreview)} />
                     <p className="text-sm text-muted-foreground mt-2">Sube una nueva foto para reemplazar la actual. Si no seleccionas ninguna, se mantendrá la foto existente.</p>
                      {aboutMeImagePreview && (
                        <div className="mt-4 relative aspect-square w-40 h-40 rounded-full overflow-hidden">
                          <Image src={aboutMeImagePreview} alt="Vista previa de la foto" fill className="object-cover" />
                        </div>
                      )}
                  </div>
                  <Button type="submit" className="rounded-full">Actualizar 'Sobre Mí'</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Servicios</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddService} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nuevo Servicio</h3>
                  <Input name="title" placeholder="Título del servicio" required />
                  <Textarea name="description" placeholder="Descripción del servicio" required />
                  <div className="space-y-2">
                    <Label htmlFor="service-imageFile">Imagen del servicio</Label>
                    <Input id="service-imageFile" name="imageFile" type="file" accept="image/*" required onChange={(e) => handleFilePreview(e, setServiceImagePreview)} />
                     {serviceImagePreview && (
                      <div className="mt-4 relative aspect-video w-full max-w-sm rounded-md overflow-hidden">
                        <Image src={serviceImagePreview} alt="Vista previa del servicio" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="rounded-full">Añadir Servicio</Button>
                </form>
                <div className="space-y-2">
                  {services.map(service => (
                    <div key={service.id} className="flex justify-between items-center p-2 bg-background rounded">
                      <div className="flex items-center gap-4">
                        <Image src={service.imageUrl} alt={service.title} width={64} height={64} className="rounded object-cover aspect-square"/>
                        <div>
                          <p className="font-bold">{service.title}</p>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                       <div className="flex items-center gap-2">
                          <EditServiceDialog service={service} onSave={handleUpdateService} />
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}><Trash2 className="w-4 h-4 text-destructive-foreground/50" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline">Gestionar Categorías de Productos</CardTitle>
                      <Button onClick={() => { setIsEditingCategory(false); setCurrentCategoryToEdit(null); setOpenCategoryDialog(true); }}>Añadir Categoría</Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                      {categories.map(category => (
                          <div key={category.id} className="flex justify-between items-center p-2 bg-background rounded">
                              <p className="font-bold">{category.name}</p>
                              <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" onClick={() => { setIsEditingCategory(true); setCurrentCategoryToEdit(category); setOpenCategoryDialog(true); }}><Pencil className="w-4 h-4" /></Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}><Trash2 className="w-4 h-4 text-destructive-foreground/50" /></Button>
                              </div>
                          </div>
                      ))}
                  </CardContent>
                  <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
                      <DialogContent>
                          <DialogHeader><DialogTitle>{isEditingCategory ? 'Editar' : 'Añadir'} Categoría</DialogTitle></DialogHeader>
                          <form onSubmit={handleAddOrUpdateCategory} className="space-y-4">
                              <Input name="name" placeholder="Nombre de la categoría" defaultValue={currentCategoryToEdit?.name || ''} required />
                              <DialogFooter><Button type="submit">Guardar</Button></DialogFooter>
                          </form>
                      </DialogContent>
                  </Dialog>
              </Card>
          </TabsContent>


           <TabsContent value="products">
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Productos</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddProduct} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nuevo Producto</h3>
                  <Input name="name" placeholder="Nombre del producto" required />
                  <Textarea name="description" placeholder="Descripción del producto" required />
                  <Input name="stock" type="number" placeholder="Stock disponible (ej: 25)" required />
                  <Select name="categoryId" required>
                    <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="space-y-2">
                    <Label htmlFor="product-imageFile">Imagen del producto</Label>
                    <Input id="product-imageFile" name="imageFile" type="file" accept="image/*" required onChange={(e) => handleFilePreview(e, setProductImagePreview)} />
                      {productImagePreview && (
                        <div className="mt-4 relative aspect-square w-40 h-40 rounded-md overflow-hidden">
                          <Image src={productImagePreview} alt="Vista previa del producto" fill className="object-cover" />
                        </div>
                      )}
                  </div>
                  <Button type="submit" className="rounded-full">Añadir Producto</Button>
                </form>
                <div className="space-y-2">
                  {products.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-background rounded">
                      <div className="flex items-center gap-4">
                        <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="rounded object-cover aspect-square"/>
                        <div>
                          <p className="font-bold">{product.name} - Stock: {product.stock}</p>
                           <p className="text-sm text-muted-foreground">Categoría: {categories.find(c => c.id === product.categoryId)?.name || 'Sin categoría'}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <EditProductDialog product={product} onSave={handleUpdateProduct} />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="w-4 h-4 text-destructive-foreground/50" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery">
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Mis Trabajos</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddGalleryItem} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nuevo Elemento (Imagen o Video)</h3>
                   <div className="space-y-2">
                    <Label htmlFor="gallery-mediaFile">Archivo (Imagen o Video)</Label>
                    <Input id="gallery-mediaFile" name="mediaFile" type="file" accept="image/*,video/*" required onChange={(e) => handleMediaFilePreview(e, setGalleryMediaPreview)} />
                     {galleryMediaPreview && (
                      <div className="mt-4">
                        {galleryMediaPreview.type === 'image' ? (
                          <div className="relative aspect-square w-40 h-40 rounded-md overflow-hidden">
                            <Image src={galleryMediaPreview.url} alt="Vista previa" fill className="object-cover" />
                          </div>
                        ) : (
                          <video src={galleryMediaPreview.url} className="rounded-md w-full max-w-sm" controls />
                        )}
                      </div>
                    )}
                  </div>
                  <Input name="alt" placeholder="Descripción (texto alternativo)" required />
                  <Button type="submit" className="rounded-full">Añadir a la Galería</Button>
                </form>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryItems.map(item => (
                    <div key={item.id} className="relative group aspect-square">
                       <div className="absolute top-1 left-1 z-10 bg-black/50 text-white rounded-full p-1">
                          {item.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </div>
                      {item.type === 'image' ? (
                         <Image src={item.url} alt={item.alt} fill className="rounded-md object-cover w-full h-full" />
                      ) : (
                        <video src={item.url} className="rounded-md object-cover w-full h-full" loop muted playsInline />
                      )}
                      <EditGalleryItemDialog item={item} onSave={handleUpdateGalleryItem} />
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteGalleryItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Gestionar Testimonios</CardTitle>
                <CardDescription>Revisa, aprueba, rechaza o elimina los testimonios enviados por los clientes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <Tabs defaultValue="pending">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Pendientes ({testimonialsByStatus('pending').length})</TabsTrigger>
                    <TabsTrigger value="approved">Aprobados ({testimonialsByStatus('approved').length})</TabsTrigger>
                    <TabsTrigger value="rejected">Rechazados ({testimonialsByStatus('rejected').length})</TabsTrigger>
                  </TabsList>
                  
                  {['pending', 'approved', 'rejected'].map(status => (
                    <TabsContent key={status} value={status}>
                      <div className="space-y-4 mt-4">
                        {testimonialsByStatus(status as Testimonial['status']).length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">No hay testimonios en esta categoría.</p>
                        ) : (
                          testimonialsByStatus(status as Testimonial['status']).map(testimonial => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                          ))
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline">Gestionar Usuarios</CardTitle>
                  <CardDescription>Añade, elimina y gestiona los usuarios del panel.</CardDescription>
                </div>
                 <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
                  <DialogTrigger asChild>
                    <Button className="rounded-full" onClick={() => { setIsEditingUser(false); setCurrentUserToEdit(null); }}><UserPlus className="mr-2 h-4 w-4" />Añadir Usuario</Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>{isEditingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</DialogTitle>
                          <DialogDescription>
                              {isEditingUser ? 'Modifica los datos del usuario.' : 'Se creará un nuevo usuario con una contraseña temporal.'}
                          </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
                          <div className="space-y-2">
                              <Label htmlFor="user-name">Nombre</Label>
                              <Input id="user-name" name="name" required defaultValue={currentUserToEdit?.name || ''} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="user-email">Email</Label>
                              <Input id="user-email" name="email" type="email" required defaultValue={currentUserToEdit?.email || ''} />
                          </div>
                          <DialogFooter>
                              <Button type="submit">{isEditingUser ? 'Guardar Cambios' : 'Crear Usuario'}</Button>
                          </DialogFooter>
                      </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-2 bg-background rounded">
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <Button 
                           variant="outline" 
                           size="icon" 
                           onClick={() => { setIsEditingUser(true); setCurrentUserToEdit(user); setOpenUserDialog(true); }}
                           disabled={user.id !== loggedInUser.id}
                           title={user.id !== loggedInUser.id ? 'Solo puedes editar tu propio usuario' : 'Editar usuario'}
                         >
                             <Pencil className="w-4 h-4" />
                         </Button>
                         <Dialog open={openPasswordDialog && currentUserForPasswordChange?.id === user.id} onOpenChange={(isOpen) => { if (!isOpen) setCurrentUserForPasswordChange(null); setOpenPasswordDialog(isOpen); }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => { setCurrentUserForPasswordChange(user); setOpenPasswordDialog(true); }}
                              disabled={user.id !== loggedInUser.id}
                              title={user.id !== loggedInUser.id ? 'Solo puedes cambiar tu propia contraseña' : 'Cambiar contraseña'}
                              >
                              <KeyRound className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cambiar Contraseña para {user.name}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="new-password">Nueva Contraseña</Label>
                                <Input id="new-password" name="newPassword" type="password" required />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Actualizar Contraseña</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.id === loggedInUser.id}
                          title={user.id === loggedInUser.id ? 'No puedes eliminar tu propia cuenta' : 'Eliminar usuario'}
                        >
                          <Trash2 className="w-4 h-4 text-destructive-foreground/50" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-content">
            <AIContentGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

    

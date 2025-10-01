'use client';

import { useState } from 'react';
import type { HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category, AppState, Perfume } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Media } from '@/components/shared/Media';
import { AIContentGenerator } from './AIContentGenerator';
import { Trash2, Pencil, Video, Image as ImageIcon, UserPlus, KeyRound, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { showErrorAlert, showDeleteConfirm } from '@/lib/alerts';
import { CameraFileInput } from './CameraFileInput';

// Define a reusable type for media previews
type MediaPreview = { url: string; type: 'image' | 'video' } | null;

interface AdminDashboardProps {
  section: string;
  appState: AppState;
  loggedInUser: User;
  
  onUpdateHeroContent: (data: Omit<HeroContent, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  
  onAddService: (data: Omit<Service, 'id' | 'url' | 'type' | 'file'>, file: File) => Promise<boolean>;
  onUpdateService: (id: string, data: Omit<Service, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  onDeleteService: (id: string) => void;

  onAddProduct: (data: Omit<Product, 'id' | 'url' | 'type' | 'file'>, file: File) => Promise<boolean>;
  onUpdateProduct: (id: string, data: Omit<Product, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  onDeleteProduct: (id: string) => void;

  onAddPerfume: (data: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, file: File) => Promise<boolean>;
  onUpdatePerfume: (id: string, data: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  onDeletePerfume: (id: string) => void;

  onAddGalleryItem: (data: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, file: File) => Promise<boolean>;
  onUpdateGalleryItem: (id: string, data: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, file?: File) => void;
  onDeleteGalleryItem: (id: string) => void;
  
  onUpdateTestimonialStatus: (id: string, status: 'approved' | 'rejected') => void;
  onDeleteTestimonial: (id: string) => void;

  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  onUpdateAboutMeContent: (data: Omit<AboutMeContent, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export function AdminDashboard({
  section,
  appState,
  loggedInUser,
  onUpdateHeroContent,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddPerfume,
  onUpdatePerfume,
  onDeletePerfume,
  onAddGalleryItem,
  onUpdateGalleryItem,
  onDeleteGalleryItem,
  onUpdateTestimonialStatus,
  onDeleteTestimonial,
  setTestimonials,
  onUpdateAboutMeContent,
  setUsers,
  setCategories,
}: AdminDashboardProps) {
  const { heroContent, services, products, perfumes, galleryItems, testimonials, aboutMeContent, users, categories } = appState;
  
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentUserForPasswordChange, setCurrentUserForPasswordChange] = useState<User | null>(null);

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategoryToEdit, setCurrentCategoryToEdit] = useState<Category | null>(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  // Unified state for media previews
  const [heroPreview, setHeroPreview] = useState<MediaPreview>(null);
  const [servicePreview, setServicePreview] = useState<MediaPreview>(null);
  const [productPreview, setProductPreview] = useState<MediaPreview>(null);
  const [perfumePreview, setPerfumePreview] = useState<MediaPreview>(null);
  const [galleryMediaPreview, setGalleryMediaPreview] = useState<MediaPreview>(null);
  const [aboutMePreview, setAboutMePreview] = useState<MediaPreview>(null);

  const handleMediaFilePreview = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<MediaPreview>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
      if (fileType) {
        const url = URL.createObjectURL(file);
        setter({ url, type: fileType });
      } else {
        setter(null);
        showErrorAlert('Archivo inválido', 'Por favor, selecciona un archivo de imagen o video.');
      }
    } else {
      setter(null);
    }
  };

  const handleHeroUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
    };
    const mediaFile = formData.get('mediaFile') as File;
    onUpdateHeroContent(updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
    setHeroPreview(null);
    (e.target as HTMLFormElement).reset();
  };
  
  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const mediaFile = formData.get('mediaFile') as File;
    if (!mediaFile || mediaFile.size === 0) {
      showErrorAlert('Archivo requerido', 'Debes seleccionar un archivo para el servicio.');
      return;
    }
    const newServiceData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    };
    const success = await onAddService(newServiceData, mediaFile);
    if (success) {
      form.reset();
      setServicePreview(null);
    }
  };
  
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const mediaFile = formData.get('mediaFile') as File;
    if (!mediaFile || mediaFile.size === 0) {
      showErrorAlert('Archivo requerido', 'Debes seleccionar un archivo para el producto.');
      return;
    }
    const newProductData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      stock: parseInt(formData.get('stock') as string, 10),
      categoryId: formData.get('categoryId') as string,
    };
    const success = await onAddProduct(newProductData, mediaFile);
    if (success) {
      form.reset();
      setProductPreview(null);
    }
  };
  
  const handleAddPerfume = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const mediaFile = formData.get('mediaFile') as File;

    if (!mediaFile || mediaFile.size === 0) {
      showErrorAlert('Archivo requerido', 'Debes seleccionar un archivo para el perfume.');
      return;
    }

    const newPerfumeData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      stock: parseInt(formData.get('stock') as string, 10),
    };

    const success = await onAddPerfume(newPerfumeData, mediaFile);
    if (success) {
      form.reset();
      setPerfumePreview(null);
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const mediaFile = formData.get('mediaFile') as File;
    if (!mediaFile || mediaFile.size === 0) {
      showErrorAlert('Archivo requerido', 'Debes seleccionar una imagen o video para la galería.');
      return;
    }
    const newItemData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    };
    const success = await onAddGalleryItem(newItemData, mediaFile);
    if (success) {
        form.reset();
        setGalleryMediaPreview(null);
    }
  };

  const handleAboutMeUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
        text: formData.get('text') as string,
        happyClients: formData.get('happyClients') as string,
        yearsOfExperience: formData.get('yearsOfExperience') as string,
        events: formData.get('events') as string,
    };
    const mediaFile = formData.get('mediaFile') as File;
    onUpdateAboutMeContent(updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
    setAboutMePreview(null);
    (e.target as HTMLFormElement).reset();
  };

  // Placeholder functions for user/category management which happens in page.tsx
  const handleAddOrUpdateUser = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
  const handleDeleteUser = (id: string) => {};
  const handleAddOrUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
  const handleDeleteCategory = (id: string) => {};
  
  // Reusable component for rendering media in tables
  const MediaCell = ({ item }: { item: { url: string, type: 'image' | 'video', title?: string, name?: string } }) => (
    <div className="flex items-center gap-4">
        {item.type === 'image' ? 
            <Image src={item.url} alt={item.title || item.name || ''} width={40} height={40} className="rounded-md object-cover"/> :
            <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center"><Video className="w-5 h-5"/></div>
        }
        <div>
            <p className="font-bold">{item.title || item.name}</p>
            {/* For items with descriptions */}
            {'description' in item && <p className="text-sm text-muted-foreground">{(item as any).description}</p>}
        </div>
    </div>
  );

  // Reusable component for rendering media previews in forms
  const MediaPreview = ({ preview, onRemove }: { preview: MediaPreview, onRemove: () => void }) => {
    if (!preview) return null;
    return (
      <div className="relative w-fit mt-2">
        {preview.type === 'image' 
          ? <Image src={preview.url} alt="Vista previa" width={100} height={100} className="rounded-md object-cover" />
          : <video src={preview.url} width={160} controls className="rounded-md" />}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const EditServiceDialog = ({ service, onSave }: { service: Service; onSave: (id: string, data: Omit<Service, 'id' | 'url' | 'type' | 'file'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<MediaPreview>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
        };
        const mediaFile = formData.get('mediaFile') as File;
        onSave(service.id, updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Servicio</DialogTitle>
                  <DialogDescription>Modifica los detalles de este servicio.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" defaultValue={service.title} />
                    <Textarea name="description" defaultValue={service.description} />
                    <CameraFileInput name="mediaFile" accept="image/*,video/*" onChange={(e) => handleMediaFilePreview(e, setPreview)} />
                    <MediaPreview preview={preview} onRemove={() => setPreview(null)} />
                    <DialogFooter><Button type="submit">Guardar Cambios</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditProductDialog = ({ product, onSave }: { product: Product; onSave: (id: string, data: Omit<Product, 'id' | 'url' | 'type' | 'file'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<MediaPreview>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            stock: parseInt(formData.get('stock') as string, 10),
            categoryId: formData.get('categoryId') as string,
        };
        const mediaFile = formData.get('mediaFile') as File;
        onSave(product.id, updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Producto</DialogTitle>
                  <DialogDescription>Modifica los detalles de este producto.</DialogDescription>
                </DialogHeader>
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
                    <CameraFileInput name="mediaFile" accept="image/*,video/*" onChange={(e) => handleMediaFilePreview(e, setPreview)} />
                    <MediaPreview preview={preview} onRemove={() => setPreview(null)} />
                    <DialogFooter><Button type="submit">Guardar Cambios</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditPerfumeDialog = ({ perfume, onSave }: { perfume: Perfume; onSave: (id: string, data: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<MediaPreview>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            stock: parseInt(formData.get('stock') as string, 10),
        };
        const mediaFile = formData.get('mediaFile') as File;
        onSave(perfume.id, updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Perfume</DialogTitle>
                   <DialogDescription>Modifica los detalles de este perfume.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" defaultValue={perfume.name} />
                    <Textarea name="description" defaultValue={perfume.description} />
                    <Input name="stock" type="number" defaultValue={perfume.stock} />
                    <CameraFileInput name="mediaFile" accept="image/*,video/*" onChange={(e) => handleMediaFilePreview(e, setPreview)} />
                    <MediaPreview preview={preview} onRemove={() => setPreview(null)} />
                    <DialogFooter><Button type="submit">Guardar Cambios</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditGalleryItemDialog = ({ item, onSave }: { item: GalleryItem; onSave: (id: string, data: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<MediaPreview>(null);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
        };
        const mediaFile = formData.get('mediaFile') as File;
        onSave(item.id, updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Elemento de Galería</DialogTitle>
                  <DialogDescription>Modifica los detalles de este elemento.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" placeholder="Título" defaultValue={item.title} required/>
                    <Textarea name="description" placeholder="Descripción Breve" defaultValue={item.description} required />
                    <CameraFileInput name="mediaFile" accept="image/*,video/*" onChange={(e) => handleMediaFilePreview(e, setPreview)} />
                    <MediaPreview preview={preview} onRemove={() => setPreview(null)} />
                    <DialogFooter><Button type="submit">Guardar Cambios</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };
  
    const statusTranslations: { [key in Testimonial['status']]: string } = {
        pending: 'Pendiente',
        approved: 'Aprobado',
        rejected: 'Rechazado',
    };
    
    const TestimonialsTable = ({ list, title }: { list: Testimonial[], title: string }) => {
        if (list.length === 0) return null;
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">{title}</h3>
                {/* Mobile view: Cards */}
                <div className="grid gap-4 md:hidden">
                    {list.map(t => (
                        <Card key={t.id} className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm shrink-0">
                                    {t.author.charAt(0)}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold">{t.author}</p>
                                    <p className="text-sm text-muted-foreground break-words">"{t.text}"</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                                <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'} className={cn(
                                    {'bg-green-100 text-green-800': t.status === 'approved'},
                                    {'bg-yellow-100 text-yellow-800': t.status === 'pending'},
                                    {'bg-red-100 text-red-800': t.status === 'rejected'}
                                )}>{statusTranslations[t.status]}</Badge>
                                <div className="flex items-center">
                                    {t.status !== 'approved' && <Button variant="ghost" size="icon" onClick={() => onUpdateTestimonialStatus(t.id, 'approved')}><ThumbsUp className="w-4 h-4 text-green-600"/></Button>}
                                    {t.status !== 'rejected' && <Button variant="ghost" size="icon" onClick={() => onUpdateTestimonialStatus(t.id, 'rejected')}><ThumbsDown className="w-4 h-4 text-orange-600"/></Button>}
                                    <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeleteTestimonial(t.id))}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* Desktop view: Table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Autor</TableHead>
                                <TableHead className="hidden lg:table-cell">Testimonio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-bold">{t.author}</TableCell>
                                    <TableCell className="hidden lg:table-cell max-w-sm">
                                        <p className="truncate">{t.text}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'} className={cn(
                                            {'bg-green-100 text-green-800': t.status === 'approved'},
                                            {'bg-yellow-100 text-yellow-800': t.status === 'pending'},
                                            {'bg-red-100 text-red-800': t.status === 'rejected'}
                                        )}>{statusTranslations[t.status]}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end">
                                            {t.status !== 'approved' && <Button variant="ghost" size="icon" onClick={() => onUpdateTestimonialStatus(t.id, 'approved')}><ThumbsUp className="w-4 h-4 text-green-600"/></Button>}
                                            {t.status !== 'rejected' && <Button variant="ghost" size="icon" onClick={() => onUpdateTestimonialStatus(t.id, 'rejected')}><ThumbsDown className="w-4 h-4 text-orange-600"/></Button>}
                                            <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeleteTestimonial(t.id))}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    };


  const renderContent = () => {
    switch (section) {
      case 'hero':
        return (
            <Card>
              <CardHeader><CardTitle className="font-headline">Contenido de la Sección Inicial</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleHeroUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input name="title" defaultValue={heroContent.title} />
                    </div>
                    <div>
                      <Label>Subtítulo</Label>
                      <Textarea name="subtitle" defaultValue={heroContent.subtitle} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Imagen Actual</Label>
                      <div className="mt-2 relative w-full max-w-sm h-[150px] rounded-lg overflow-hidden border border-border">
                        <Media
                          src={heroContent.url}
                          type={heroContent.type}
                          alt="Imagen actual de la sección inicial"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Nueva Imagen (opcional)</Label>
                      <CameraFileInput name="mediaFile" accept="image/*,video/*" onChange={(e) => handleMediaFilePreview(e, setHeroPreview)} />
                      {heroPreview && (
                        <div className="mt-2">
                          <Label>Vista previa de la nueva imagen</Label>
                          <div className="w-full max-w-sm">
                            <MediaPreview preview={heroPreview} onRemove={() => setHeroPreview(null)} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <Button type="submit">Actualizar Sección Inicial</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
        );
      case 'about':
        return (
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar 'Sobre Mí'</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAboutMeUpdate} className="space-y-4">
                  <Textarea name="text" defaultValue={aboutMeContent.text} rows={6} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input name="happyClients" defaultValue={aboutMeContent.happyClients} />
                    <Input name="yearsOfExperience" defaultValue={aboutMeContent.yearsOfExperience} />
                    <Input name="events" defaultValue={aboutMeContent.events} />
                  </div>
                  <CameraFileInput name="mediaFile" accept="image/*,video/*" onChange={(e) => handleMediaFilePreview(e, setAboutMePreview)} />
                  <MediaPreview preview={aboutMePreview} onRemove={() => setAboutMePreview(null)} />
                  <Button type="submit">Actualizar 'Sobre Mí'</Button>
                </form>
              </CardContent>
            </Card>
        );
      case 'services':
        return (
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Servicios</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddService} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nuevo Servicio</h3>
                  <Input name="title" placeholder="Título" required />
                  <Textarea name="description" placeholder="Descripción" required />
                  <CameraFileInput name="mediaFile" accept="image/*,video/*" required onChange={(e) => handleMediaFilePreview(e, setServicePreview)} />
                  <MediaPreview preview={servicePreview} onRemove={() => setServicePreview(null)} />
                  <Button type="submit">Añadir</Button>
                </form>
                <Table>
                  <TableHeader><TableRow><TableHead>Servicio</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {services.map(service => (
                      <TableRow key={service.id}>
                        <TableCell><MediaCell item={service} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <EditServiceDialog service={service} onSave={onUpdateService} />
                            <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeleteService(service.id))}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        );
      case 'categories':
         return (
             <Card>
                  <CardHeader className="flex flex-row justify-between items-center">
                      <CardTitle className="font-headline">Categorías de Productos</CardTitle>
                      <Button onClick={() => { setIsEditingCategory(false); setCurrentCategoryToEdit(null); setOpenCategoryDialog(true); }}>Añadir Categoría</Button>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                          <TableBody>
                              {categories.map(category => (
                                  <TableRow key={category.id}>
                                      <TableCell className="font-bold">{category.name}</TableCell>
                                      <TableCell className="text-right">
                                          <Button variant="outline" size="icon" onClick={() => { setIsEditingCategory(true); setCurrentCategoryToEdit(category); setOpenCategoryDialog(true); }}><Pencil className="w-4 h-4" /></Button>
                                           <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => handleDeleteCategory(category.id))}>
                                              <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
                  <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
                      <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{isEditingCategory ? 'Editar' : 'Añadir'} Categoría</DialogTitle>
                            <DialogDescription>{isEditingCategory ? 'Modifica el nombre de la categoría.' : 'Crea una nueva categoría para tus productos.'}</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddOrUpdateCategory} className="space-y-4">
                              <Input name="name" placeholder="Nombre de la categoría" defaultValue={currentCategoryToEdit?.name || ''} required />
                              <DialogFooter><Button type="submit">Guardar</Button></DialogFooter>
                          </form>
                      </DialogContent>
                  </Dialog>
              </Card>
         );
      case 'products':
        return (
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Productos</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddProduct} className="bg-muted p-4 rounded-lg space-y-4">
                   <h3 className="font-semibold">Añadir Nuevo Producto</h3>
                  <Input name="name" placeholder="Nombre del producto" required />
                  <Textarea name="description" placeholder="Descripción del producto" required />
                  <Input name="stock" type="number" placeholder="Stock disponible" required />
                  <Select name="categoryId" required><SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger><SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent></Select>
                  <CameraFileInput name="mediaFile" accept="image/*,video/*" required onChange={(e) => handleMediaFilePreview(e, setProductPreview)} />
                  <MediaPreview preview={productPreview} onRemove={() => setProductPreview(null)} />
                  <Button type="submit">Añadir</Button>
                </form>
                {/* Mobile view: Cards */}
                <div className="grid gap-4 md:hidden">
                    {products.map(product => (
                        <Card key={product.id} className="p-4 space-y-3">
                            <MediaCell item={product} />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Stock: {product.stock}</span>
                                <Badge variant="outline">{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</Badge>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <EditProductDialog product={product} onSave={onUpdateProduct} />
                                <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeleteProduct(product.id))}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* Desktop view: Table */}
                <div className="hidden md:block">
                    <Table>
                      <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Stock</TableHead><TableHead>Categoría</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {products.map(product => (
                          <TableRow key={product.id}>
                            <TableCell><MediaCell item={product} /></TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center gap-2 justify-end">
                                    <EditProductDialog product={product} onSave={onUpdateProduct} />
                                    <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeleteProduct(product.id))}>
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
        );
      case 'perfumes':
        return (
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar Perfumes</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddPerfume} className="bg-muted p-4 rounded-lg space-y-4">
                   <h3 className="font-semibold">Añadir Nuevo Perfume</h3>
                  <Input name="name" placeholder="Nombre del perfume" required />
                  <Textarea name="description" placeholder="Descripción del perfume" required />
                  <Input name="stock" type="number" placeholder="Stock disponible" required />
                  <CameraFileInput name="mediaFile" accept="image/*,video/*" required onChange={(e) => handleMediaFilePreview(e, setPerfumePreview)} />
                  <MediaPreview preview={perfumePreview} onRemove={() => setPerfumePreview(null)} />
                  <Button type="submit">Añadir</Button>
                </form>
                {/* Mobile view: Cards */}
                <div className="grid gap-4 md:hidden">
                    {perfumes.map(perfume => (
                        <Card key={perfume.id} className="p-4 space-y-3">
                            <MediaCell item={perfume} />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Stock: {perfume.stock}</span>
                                <div className="flex items-center justify-end gap-2">
                                    <EditPerfumeDialog perfume={perfume} onSave={onUpdatePerfume} />
                                    <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeletePerfume(perfume.id))}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* Desktop view: Table */}
                <div className="hidden md:block">
                    <Table>
                      <TableHeader><TableRow><TableHead>Perfume</TableHead><TableHead>Stock</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {perfumes.map(perfume => (
                          <TableRow key={perfume.id}>
                            <TableCell><MediaCell item={perfume} /></TableCell>
                            <TableCell>{perfume.stock}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center gap-2 justify-end">
                                    <EditPerfumeDialog perfume={perfume} onSave={onUpdatePerfume} />
                                    <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeletePerfume(perfume.id))}>
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
        );
      case 'gallery':
        return (
            <Card>
              <CardHeader><CardTitle className="font-headline">Gestionar "Mis Trabajos"</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddGalleryItem} className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Añadir Nuevo Elemento</h3>
                  <CameraFileInput name="mediaFile" accept="image/*,video/*" required onChange={(e) => handleMediaFilePreview(e, setGalleryMediaPreview)} />
                  <MediaPreview preview={galleryMediaPreview} onRemove={() => setGalleryMediaPreview(null)} />
                  <Input name="title" placeholder="Título" required />
                  <Textarea name="description" placeholder="Descripción" required />
                  <Button type="submit">Añadir</Button>
                </form>
                {/* Mobile view: Cards */}
                <div className="grid gap-4 md:hidden">
                    {galleryItems.map(item => (
                        <Card key={item.id} className="p-4 space-y-3">
                            <MediaCell item={item} />
                            <div className="flex items-center justify-between">
                                <Badge variant="outline">
                                    {item.type === 'image' ? <ImageIcon className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                                    {item.type}
                                </Badge>
                                <div className="flex items-center justify-end gap-2">
                                    <EditGalleryItemDialog item={item} onSave={onUpdateGalleryItem} />
                                    <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeleteGalleryItem(item.id))}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* Desktop view: Table */}
                <div className="hidden md:block">
                    <Table>
                      <TableHeader><TableRow><TableHead>Elemento</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {galleryItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell><MediaCell item={item} /></TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {item.type === 'image' ? <ImageIcon className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                                    {item.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <EditGalleryItemDialog item={item} onSave={onUpdateGalleryItem} />
                                <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => onDeleteGalleryItem(item.id))}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
        );
        case 'testimonials':
            const pendingTestimonials = testimonials.filter(t => t.status === 'pending');
            const approvedTestimonials = testimonials.filter(t => t.status === 'approved');
            const rejectedTestimonials = testimonials.filter(t => t.status === 'rejected');
            return (
                <Card>
                    <CardHeader><CardTitle className="font-headline">Gestionar Testimonios</CardTitle></CardHeader>
                    <CardContent className="space-y-8">
                        <TestimonialsTable list={pendingTestimonials} title="Pendientes" />
                        <TestimonialsTable list={approvedTestimonials} title="Aprobados" />
                        <TestimonialsTable list={rejectedTestimonials} title="Rechazados" />
                    </CardContent>
                </Card>
            );
      case 'users':
        return (
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="font-headline">Gestionar Usuarios</CardTitle>
              <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setIsEditingUser(false); setCurrentUserToEdit(null); }}><UserPlus className="mr-2 h-4 w-4" />Añadir Usuario</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</DialogTitle>
                        <DialogDescription>{isEditingUser ? 'Modifica los datos del usuario.' : 'Se creará un nuevo usuario con una contraseña temporal.'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
                        <Input name="name" required defaultValue={currentUserToEdit?.name || ''} placeholder="Nombre" />
                        <Input name="email" type="email" required defaultValue={currentUserToEdit?.email || ''} placeholder="Email" />
                        <DialogFooter><Button type="submit">{isEditingUser ? 'Guardar Cambios' : 'Crear Usuario'}</Button></DialogFooter>
                    </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Usuario</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="icon" onClick={() => { setIsEditingUser(true); setCurrentUserToEdit(user); setOpenUserDialog(true); }} disabled={user.id !== loggedInUser.id}><Pencil className="w-4 h-4" /></Button>
                        <Dialog open={openPasswordDialog && currentUserForPasswordChange?.id === user.id} onOpenChange={(isOpen) => { if (!isOpen) setCurrentUserForPasswordChange(null); setOpenPasswordDialog(isOpen); }}>
                          <DialogTrigger asChild><Button variant="outline" size="icon" onClick={() => { setCurrentUserForPasswordChange(user); setOpenPasswordDialog(true); }} disabled={user.id !== loggedInUser.id}><KeyRound className="w-4 h-4" /></Button></DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Cambiar Contraseña para {user.name}</DialogTitle>
                                <DialogDescription>Introduce la nueva contraseña para el usuario.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                              <Input name="newPassword" type="password" required placeholder="Nueva Contraseña"/>
                              <DialogFooter><Button type="submit">Actualizar</Button></DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" disabled={user.id === loggedInUser.id} onClick={() => showDeleteConfirm(() => handleDeleteUser(user.id))}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case 'ai-content':
        return <AIContentGenerator />;
      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderContent()}</div>;
}

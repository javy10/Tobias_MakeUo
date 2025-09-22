
'use client';

import { useState } from 'react';
import type { HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category, AppState, Perfume } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AIContentGenerator } from './AIContentGenerator';
import { Trash2, Pencil, Video, Image as ImageIcon, UserPlus, KeyRound, ThumbsUp, ThumbsDown } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { deleteItemFromDB, fileToStorable, saveItemToDB } from '@/lib/db';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AdminSectionProps {
  appState: AppState;
  setHeroContent: React.Dispatch<React.SetStateAction<HeroContent>>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setPerfumes: React.Dispatch<React.SetStateAction<Perfume[]>>;
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  setAboutMeContent: React.Dispatch<React.SetStateAction<AboutMeContent>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  loggedInUser: User;
  section: string;
}

// Function to read a file as a Data URL (Base64) - ONLY FOR IMAGES
const readImageAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
        return reject(new Error('File is not an image.'));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export function AdminDashboard({
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
  loggedInUser,
  section,
}: AdminSectionProps) {
  const { heroContent, services, products, perfumes, galleryItems, testimonials, aboutMeContent, users, categories } = appState;
  const { toast } = useToast();
  
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentUserForPasswordChange, setCurrentUserForPasswordChange] = useState<User | null>(null);

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategoryToEdit, setCurrentCategoryToEdit] = useState<Category | null>(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  // State for image previews
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [serviceImagePreview, setServiceImagePreview] = useState<string | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [perfumeImagePreview, setPerfumeImagePreview] = useState<string | null>(null);
  const [galleryMediaPreview, setGalleryMediaPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [aboutMeImagePreview, setAboutMeImagePreview] = useState<string | null>(null);

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setter(url);
    } else {
      setter(null);
      if (file) toast({ variant: 'destructive', title: 'Archivo inválido', description: 'Por favor, selecciona un archivo de imagen.' });
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
        toast({ variant: 'destructive', title: 'Archivo inválido', description: 'Por favor, selecciona un archivo de imagen o video.' });
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
  
  const handleAddPerfume = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('imageFile') as File;
    if (!imageFile || imageFile.size === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes seleccionar una imagen para el perfume.' });
      return;
    }
    try {
      const imageUrl = await readImageAsDataURL(imageFile);
      const newPerfume: Perfume = {
        id: crypto.randomUUID(),
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        stock: parseInt(formData.get('stock') as string, 10),
        imageUrl: imageUrl,
      };
      setPerfumes([...perfumes, newPerfume]);
      form.reset();
      setPerfumeImagePreview(null);
      toast({ title: 'Éxito', description: 'Nuevo perfume añadido.' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la imagen.' });
    }
  };

  const handleDeletePerfume = (id: string) => {
    setPerfumes(perfumes.filter(p => p.id !== id));
    toast({ title: 'Éxito', description: 'Perfume eliminado.' });
  };

  const handleUpdatePerfume = async (id: string, updatedPerfume: Omit<Perfume, 'id' | 'imageUrl'>, newImageFile?: File) => {
    let imageUrl = perfumes.find(p => p.id === id)?.imageUrl;
    if (!imageUrl) return;
    if (newImageFile) {
      try {
        imageUrl = await readImageAsDataURL(newImageFile);
      } catch {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la imagen.' });
        return;
      }
    }
    setPerfumes(perfumes.map(p => p.id === id ? { ...p, ...updatedPerfume, imageUrl: imageUrl! } : p));
    toast({ title: 'Éxito', description: 'Perfume actualizado.' });
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
            url: URL.createObjectURL(file),
            alt: formData.get('title') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            type: type,
            file: file,
        };
        await saveItemToDB(newGalleryItem);
        setGalleryItems([...galleryItems, newGalleryItem]);
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
  
  const handleUpdateGalleryItem = async (id: string, updatedItem: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, newMediaFile?: File) => {
    const currentItem = galleryItems.find(item => item.id === id);
    if (!currentItem) return;
    let updatedGalleryItem: GalleryItem = { ...currentItem, ...updatedItem, alt: updatedItem.title };
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
        happyClients: formData.get('happyClients') as string,
        yearsOfExperience: formData.get('yearsOfExperience') as string,
        events: formData.get('events') as string,
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
        toast({ title: 'Éxito', description: `Usuario ${newUser.name} añadido con contraseña temporal 'temporal123'.` });
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
        toast({ variant: 'destructive', title: 'Error', description: 'No puedes eliminar tu propia cuenta.' });
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
            <DialogTrigger asChild><Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Editar Servicio</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" defaultValue={service.title} />
                    <Textarea name="description" defaultValue={service.description} />
                    <Input name="imageFile" type="file" accept="image/*" onChange={(e) => handleFilePreview(e, setPreview)} />
                    {preview && <Image src={preview} alt="Preview" width={100} height={100} />}
                    <DialogFooter><Button type="submit">Guardar Cambios</Button></DialogFooter>
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
            <DialogTrigger asChild><Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
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
                    <DialogFooter><Button type="submit">Guardar Cambios</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditPerfumeDialog = ({ perfume, onSave }: { perfume: Perfume; onSave: (id: string, data: Omit<Perfume, 'id' | 'imageUrl'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            stock: parseInt(formData.get('stock') as string, 10),
        };
        const imageFile = formData.get('imageFile') as File;
        onSave(perfume.id, updatedData, imageFile && imageFile.size > 0 ? imageFile : undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="icon"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Editar Perfume</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" defaultValue={perfume.name} />
                    <Textarea name="description" defaultValue={perfume.description} />
                    <Input name="stock" type="number" defaultValue={perfume.stock} />
                    <Input name="imageFile" type="file" accept="image/*" onChange={(e) => handleFilePreview(e, setPreview)} />
                    {preview && <Image src={preview} alt="Preview" width={100} height={100} />}
                    <DialogFooter><Button type="submit">Guardar Cambios</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditGalleryItemDialog = ({ item, onSave }: { item: GalleryItem; onSave: (id: string, data: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
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
                <DialogHeader><DialogTitle>Editar Elemento de Galería</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" placeholder="Título" defaultValue={item.title} required/>
                    <Textarea name="description" placeholder="Descripción Breve" defaultValue={item.description} required />
                    <Input name="mediaFile" type="file" accept="image/*,video/*" onChange={(e) => handleMediaFilePreview(e, setPreview)} />
                    {preview && ( preview.type === 'image' ? <Image src={preview.url} alt="Preview" width={100} height={100} /> : <video src={preview.url} width={200} controls /> )}
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Autor</TableHead>
                            <TableHead>Testimonio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {list.map(t => (
                            <TableRow key={t.id}>
                                <TableCell className="font-bold">{t.author}</TableCell>
                                <TableCell className="max-w-xs truncate">{t.text}</TableCell>
                                <TableCell>
                                    <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'} className={cn(
                                        {'bg-green-100 text-green-800': t.status === 'approved'},
                                        {'bg-yellow-100 text-yellow-800': t.status === 'pending'},
                                        {'bg-red-100 text-red-800': t.status === 'rejected'}
                                    )}>{statusTranslations[t.status]}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {t.status !== 'approved' && <Button variant="ghost" size="icon" onClick={() => handleUpdateTestimonialStatus(t.id, 'approved')}><ThumbsUp className="w-4 h-4 text-green-600"/></Button>}
                                    {t.status !== 'rejected' && <Button variant="ghost" size="icon" onClick={() => handleUpdateTestimonialStatus(t.id, 'rejected')}><ThumbsDown className="w-4 h-4 text-orange-600"/></Button>}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el testimonio.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteTestimonial(t.id)}>Eliminar</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                <form onSubmit={handleHeroUpdate} className="space-y-4">
                  <Input name="title" defaultValue={heroContent.title} />
                  <Textarea name="subtitle" defaultValue={heroContent.subtitle} />
                  <Input name="imageFile" type="file" accept="image/*" onChange={(e) => handleFilePreview(e, setHeroImagePreview)} />
                  {heroImagePreview && <Image src={heroImagePreview} alt="Vista previa" width={200} height={100} className="rounded-md object-cover" />}
                  <Button type="submit">Actualizar</Button>
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
                  <Input name="imageFile" type="file" accept="image/*" onChange={(e) => handleFilePreview(e, setAboutMeImagePreview)} />
                  {aboutMeImagePreview && <Image src={aboutMeImagePreview} alt="Vista previa" width={100} height={100} className="rounded-full object-cover" />}
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
                  <Input name="imageFile" type="file" accept="image/*" required onChange={(e) => handleFilePreview(e, setServiceImagePreview)} />
                  {serviceImagePreview && <Image src={serviceImagePreview} alt="Vista previa" width={100} height={100} />}
                  <Button type="submit">Añadir</Button>
                </form>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map(service => (
                      <TableRow key={service.id}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Image src={service.imageUrl} alt={service.title} width={40} height={40} className="rounded-md object-cover"/>
                                <div>
                                    <p className="font-bold">{service.title}</p>
                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <EditServiceDialog service={service} onSave={handleUpdateService} />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteService(service.id)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Nombre</TableHead>
                                  <TableHead className="text-right">Acciones</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {categories.map(category => (
                                  <TableRow key={category.id}>
                                      <TableCell className="font-bold">{category.name}</TableCell>
                                      <TableCell className="text-right">
                                          <Button variant="outline" size="icon" onClick={() => { setIsEditingCategory(true); setCurrentCategoryToEdit(category); setOpenCategoryDialog(true); }}><Pencil className="w-4 h-4" /></Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría y desasignará los productos asociados.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Eliminar</AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
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
                  <Input name="imageFile" type="file" accept="image/*" required onChange={(e) => handleFilePreview(e, setProductImagePreview)} />
                  {productImagePreview && <Image src={productImagePreview} alt="Vista previa" width={100} height={100} />}
                  <Button type="submit">Añadir</Button>
                </form>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-md object-cover"/>
                                <div>
                                    <p className="font-bold">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.description}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <EditProductDialog product={product} onSave={handleUpdateProduct} />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el producto.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Eliminar</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                  <Input name="imageFile" type="file" accept="image/*" required onChange={(e) => handleFilePreview(e, setPerfumeImagePreview)} />
                  {perfumeImagePreview && <Image src={perfumeImagePreview} alt="Vista previa" width={100} height={100} />}
                  <Button type="submit">Añadir</Button>
                </form>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Perfume</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perfumes.map(perfume => (
                      <TableRow key={perfume.id}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Image src={perfume.imageUrl} alt={perfume.name} width={40} height={40} className="rounded-md object-cover"/>
                                <div>
                                    <p className="font-bold">{perfume.name}</p>
                                    <p className="text-sm text-muted-foreground">{perfume.description}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{perfume.stock}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <EditPerfumeDialog perfume={perfume} onSave={handleUpdatePerfume} />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el perfume.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeletePerfume(perfume.id)}>Eliminar</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                  <Input name="mediaFile" type="file" accept="image/*,video/*" required onChange={(e) => handleMediaFilePreview(e, setGalleryMediaPreview)} />
                  {galleryMediaPreview && (galleryMediaPreview.type === 'image' ? <Image src={galleryMediaPreview.url} alt="Vista previa" width={100} height={100} /> : <video src={galleryMediaPreview.url} width={160} controls />)}
                  <Input name="title" placeholder="Título" required />
                  <Textarea name="description" placeholder="Descripción" required />
                  <Button type="submit">Añadir</Button>
                </form>
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Elemento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {galleryItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            {item.type === 'image' ? 
                                <Image src={item.url} alt={item.title} width={40} height={40} className="rounded-md object-cover"/> :
                                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center"><Video className="w-5 h-5"/></div>
                            }
                            <div>
                                <p className="font-bold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">
                                {item.type === 'image' ? <ImageIcon className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                                {item.type}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <EditGalleryItemDialog item={item} onSave={handleUpdateGalleryItem} />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el elemento de la galería.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteGalleryItem(item.id)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                            <DialogHeader><DialogTitle>Cambiar Contraseña para {user.name}</DialogTitle></DialogHeader>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                              <Input name="newPassword" type="password" required placeholder="Nueva Contraseña"/>
                              <DialogFooter><Button type="submit">Actualizar</Button></DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={user.id === loggedInUser.id}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

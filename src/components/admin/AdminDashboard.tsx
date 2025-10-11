'use client';

import { useState, useEffect, useRef } from 'react';
import type { HeroContent, Service, GalleryItem, Testimonial, Product, AboutMeContent, User, Category, AppState, Perfume, Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Media } from '@/components/shared/Media';
import { AIContentGenerator } from './AIContentGenerator';
import { Trash2, Pencil, Video, Image as ImageIcon, UserPlus, KeyRound, ThumbsUp, ThumbsDown, X, Save } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { showDeleteConfirm, showSuccessAlert } from '@/lib/alerts';
import { showErrorAlert } from '@/lib/error-alerts';

// Función para mostrar contraseña temporal por 5 segundos
const showTemporaryPassword = (password: string) => {
  // Crear elemento de notificación temporal
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #10b981;
    color: white;
    padding: 20px 30px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    text-align: center;
    min-width: 300px;
  `;
  
  notification.innerHTML = `
    <div style="margin-bottom: 10px;">✅ Usuario creado exitosamente</div>
    <div style="font-size: 24px; font-weight: bold; margin: 10px 0; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px;">
      ${password}
    </div>
    <div style="font-size: 14px; opacity: 0.9;">Comparte esta contraseña con el usuario</div>
  `;
  
  document.body.appendChild(notification);
  
  // Remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
};
import { DragDropUpload } from '../ui/drag-drop-upload';
import { useTheme } from '@/hooks/use-theme';
import { NoPreviewUpload } from '../ui/no-preview-upload';
import { ServiceImage } from '../ui/service-image';

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

  onAddCourse: (data: Omit<Course, 'id' | 'url' | 'type' | 'file'>, file: File) => Promise<boolean>;
  onUpdateCourse: (id: string, data: Omit<Course, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  onDeleteCourse: (id: string) => void;

  onAddProduct: (data: Omit<Product, 'id' | 'url' | 'type' | 'file'>, file: File) => Promise<boolean>;
  onUpdateProduct: (id: string, data: Omit<Product, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  onDeleteProduct: (id: string) => void;

  onAddPerfume: (data: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, file: File) => Promise<boolean>;
  onUpdatePerfume: (id: string, data: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  onDeletePerfume: (id: string) => void;

  onAddGalleryItem: (data: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, file: File) => Promise<boolean>;
  onUpdateGalleryItem: (id: string, data: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, file?: File) => void;
  onDeleteGalleryItem: (id: string) => void;
  
  onUpdateTestimonial: (id: string, data: any) => void;
  onUpdateTestimonialStatus: (id: string, status: 'approved' | 'rejected') => void;
  onDeleteTestimonial: (id: string) => void;

  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  onUpdateAboutMeContent: (data: Omit<AboutMeContent, 'id' | 'url' | 'type' | 'file'>, file?: File) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onAddCategory: (data: { name: string }) => Promise<boolean>;
  onUpdateCategory: (id: string, data: { name: string }) => void;
  onDeleteCategory: (id: string) => void;
  
  onAddUser: (data: { name: string; email: string; password?: string }) => Promise<{ success: boolean; temporaryPassword?: string; error?: string }>;
  onUpdateUser: (id: string, data: { name: string; email: string; password?: string }) => void;
  onDeleteUser: (id: string) => void;
}

export function AdminDashboard({
  section,
  appState,
  loggedInUser,
  onUpdateHeroContent,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddPerfume,
  onUpdatePerfume,
  onDeletePerfume,
  onAddGalleryItem,
  onUpdateGalleryItem,
  onDeleteGalleryItem,
  onUpdateTestimonial,
  onUpdateTestimonialStatus,
  onDeleteTestimonial,
  setTestimonials,
  onUpdateAboutMeContent,
  setUsers,
  setCategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: AdminDashboardProps) {
  const { theme } = useTheme();
  const { heroContent, services, products, perfumes, galleryItems, testimonials, aboutMeContent, users, categories, courses } = appState;

  // Helper functions for theme-based styling
  const getCardClasses = () => {
    return theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200';
  };

  const getFormClasses = () => {
    return theme === 'dark' 
      ? 'bg-gray-700 border-gray-600' 
      : 'bg-gray-50 border-gray-300';
  };

  const getInputClasses = () => {
    return theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-teal-400 h-12 sm:h-11 text-base' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-500 h-12 sm:h-11 text-base';
  };

  const getTextClasses = () => {
    return {
      primary: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
      label: theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
    };
  };

  const getButtonClasses = () => {
    return {
      primary: 'bg-teal-600 hover:bg-teal-700 text-white',
      ghost: theme === 'dark' 
        ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
      danger: theme === 'dark'
        ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
    };
  };

  const getTableClasses = () => {
    return {
      header: theme === 'dark' ? 'border-gray-600' : 'border-gray-200',
      row: theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50',
      cell: theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
    };
  };
  
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentUserForPasswordChange, setCurrentUserForPasswordChange] = useState<User | null>(null);

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategoryToEdit, setCurrentCategoryToEdit] = useState<Category | null>(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  // Unified state for media previews for ADD FORMS
  const [heroPreview, setHeroPreview] = useState<MediaPreview>(null);
  const [servicePreview, setServicePreview] = useState<MediaPreview>(null);
  const [productPreview, setProductPreview] = useState<MediaPreview>(null);
  const [perfumePreview, setPerfumePreview] = useState<MediaPreview>(null);
  const [galleryMediaPreview, setGalleryMediaPreview] = useState<MediaPreview>(null);
  
  // Estados para modo de edición
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [serviceMediaFile, setServiceMediaFile] = useState<File | undefined>(undefined);
  
  
  // Estados para el formulario de agregar
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Función para cargar datos del servicio en el formulario
  const loadServiceForEdit = (service: Service) => {
    setEditingService(service);
    setIsEditMode(true);
    
    // Cargar la imagen actual si existe
    if (service.url) {
      setServicePreview({ url: service.url, type: service.type as 'image' | 'video' });
    } else {
      setServicePreview(null);
    }
    setServiceMediaFile(undefined);
  };

  // Función para cancelar edición
  const cancelEdit = () => {
    setEditingService(null);
    setIsEditMode(false);
    setServicePreview(null);
    setServiceMediaFile(undefined);
    
    // Limpiar los estados del formulario
    setFormTitle('');
    setFormDescription('');
    
    // Limpiar el formulario
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };
  const [aboutMePreview, setAboutMePreview] = useState<MediaPreview>(null);
  const [coursePreview, setCoursePreview] = useState<MediaPreview>(null);
  
  // State for editing course
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({ name: '', description: '' });
  const [courseMediaFile, setCourseMediaFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  

  useEffect(() => {
    if (editingCourse) {
      setCourseForm({ name: editingCourse.name, description: editingCourse.description });
      setCoursePreview({ url: editingCourse.url, type: editingCourse.type as 'image' | 'video' });
      setCourseMediaFile(null);
    } else {
      // Reset form when not editing
      setCourseForm({ name: '', description: '' });
      setCoursePreview(null);
      setCourseMediaFile(null);
      formRef.current?.reset();
    }
  }, [editingCourse]);


  const handleMediaFilePreview = (file: File | null, setter: React.Dispatch<React.SetStateAction<MediaPreview>>) => {
    if (file) {
      console.log('📁 Archivo seleccionado:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Detección del tipo de archivo más robusta
      let fileType: 'image' | 'video' | null = null;
      
      // Verificar por MIME type primero
      if (file.type.startsWith('image/')) {
        fileType = 'image';
        console.log('✅ Tipo detectado por MIME: imagen');
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
        console.log('✅ Tipo detectado por MIME: video');
      } else {
        // Verificar por extensión si MIME type no es confiable
        const extension = file.name.split('.').pop()?.toLowerCase();
        console.log('🔍 Verificando por extensión:', extension);
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'].includes(extension || '')) {
          fileType = 'image';
          console.log('✅ Tipo detectado por extensión: imagen');
        } else if (['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'flv', 'wmv', '3gp'].includes(extension || '')) {
          fileType = 'video';
          console.log('✅ Tipo detectado por extensión: video');
        }
      }
      
      if (fileType) {
        try {
          // Crear URL de objeto
          const url = URL.createObjectURL(file);
          console.log('🔗 URL de preview creada:', url.substring(0, 50) + '...');
          
          // Actualizar de manera estable
          setter(prev => {
            // Limpiar URL anterior si existe
            if (prev?.url && prev.url.startsWith('blob:')) {
              URL.revokeObjectURL(prev.url);
              console.log('🗑️ URL anterior limpiada');
            }
            return { url, type: fileType };
          });
        } catch (error) {
          console.error('❌ Error creando URL de preview:', error);
          setter(null);
          showErrorAlert('Error de preview', 'No se pudo crear la vista previa del archivo.');
        }
      } else {
        console.warn('⚠️ Tipo de archivo no soportado:', file.name, file.type);
        setter(null);
        showErrorAlert('Archivo inválido', 'Por favor, selecciona un archivo de imagen o video válido.');
      }
    } else {
      console.log('🗑️ Limpiando preview');
      setter(null);
    }
  };

  const handleHeroUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const subtitle = formData.get('subtitle') as string;
      
      // Validar que los campos requeridos no estén vacíos
      if (!title || !subtitle) {
        showErrorAlert('Error de validación', 'El título y subtítulo son campos requeridos.');
        return;
      }
      
      const updatedData = {
        title: title.trim(),
        subtitle: subtitle.trim(),
      };
      
      const mediaFile = formData.get('mediaFile') as File;
      
      console.log('🔄 Actualizando sección hero con datos:', { updatedData, hasMediaFile: !!mediaFile });
      
      await onUpdateHeroContent(updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
      
      setHeroPreview(null);
      (e.target as HTMLFormElement).reset();
      
      console.log('✅ Sección hero actualizada exitosamente');
    } catch (error) {
      console.error('❌ Error al actualizar sección inicial:', error);
      showErrorAlert(
        'Error al actualizar', 
        `No se pudo actualizar la sección inicial: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    } finally {
    }
  };
  
  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    await executeWithGlobalLoading(async () => {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const mediaFile = formData.get('mediaFile') as File;
      
      // Validaciones para servicios
      if (isEditMode) {
        // Modo edición - validar campos del formulario
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        
        if (!title || !title.trim()) {
          throw new Error('El título del servicio es requerido.');
        }
        
        if (!description || !description.trim()) {
          throw new Error('La descripción del servicio es requerida.');
        }
      } else {
        // Modo agregar - validar campos del estado
        if (!formTitle || !formTitle.trim()) {
          throw new Error('El título del servicio es requerido.');
        }
        
        if (!formDescription || !formDescription.trim()) {
          throw new Error('La descripción del servicio es requerida.');
        }
      }
      
      let serviceData;
      
      if (isEditMode && editingService) {
        // Modo edición - usar valores del estado
        serviceData = {
          title: editingService.title,
          description: editingService.description,
        };
        
        if (!mediaFile || mediaFile.size === 0) {
          // Si no hay archivo nuevo, usar el archivo actual
          await onUpdateService(editingService.id, serviceData);
        } else {
          // Si hay archivo nuevo, usarlo
          await onUpdateService(editingService.id, serviceData, mediaFile);
        }
        cancelEdit();
      } else {
        // Modo agregar - usar valores del estado
        serviceData = {
          title: formTitle,
          description: formDescription,
        };
        
        if (!mediaFile || mediaFile.size === 0) {
          throw new Error('Debes seleccionar un archivo para el servicio.');
        }
        const success = await onAddService(serviceData, mediaFile);
        if (success) {
          form.reset();
          setServicePreview(null);
          setFormTitle('');
          setFormDescription('');
        }
      }
    }, isEditMode ? 'Servicio actualizado exitosamente' : 'Servicio agregado exitosamente', isEditMode ? 'Actualizando...' : 'Guardando...');
  };

  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const isEditMode = !!editingCourse;
    const loadingMessage = isEditMode ? 'Actualizando...' : 'Guardando...';
    const successMessage = isEditMode ? 'Curso actualizado exitosamente' : 'Curso agregado exitosamente';
    
    // Validaciones para cursos
    if (!courseForm.name || !courseForm.name.trim()) {
      showErrorAlert('Error de validación', 'El nombre del curso es requerido.');
      return;
    }
    
    if (!courseForm.description || !courseForm.description.trim()) {
      showErrorAlert('Error de validación', 'La descripción del curso es requerida.');
      return;
    }
    
    await executeWithGlobalLoading(async () => {
      if (editingCourse) {
        // Update logic
        const updatedData = { name: courseForm.name, description: courseForm.description };
        await onUpdateCourse(editingCourse.id, updatedData, courseMediaFile || undefined);
        setEditingCourse(null); // Reset after update
      } else {
        // Create logic
        if (!courseMediaFile) {
          throw new Error('Debes seleccionar un archivo para el curso.');
        }
        const newCourseData = { name: courseForm.name, description: courseForm.description };
        const success = await onAddCourse(newCourseData, courseMediaFile);
        if (success) {
          setEditingCourse(null); // Reset form
        }
      }
    }, successMessage, loadingMessage);
  };
  
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    await executeWithGlobalLoading(async () => {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const mediaFile = formData.get('mediaFile') as File;
      
      // Validaciones para productos
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const stock = formData.get('stock') as string;
      const categoryId = formData.get('categoryId') as string;
      
      if (!name || !name.trim()) {
        throw new Error('El nombre del producto es requerido.');
      }
      
      if (!description || !description.trim()) {
        throw new Error('La descripción del producto es requerida.');
      }
      
      if (!stock || isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0) {
        throw new Error('El stock debe ser un número válido mayor o igual a 0.');
      }
      
      if (!categoryId) {
        throw new Error('Debes seleccionar una categoría para el producto.');
      }
      
      if (!mediaFile || mediaFile.size === 0) {
        throw new Error('Debes seleccionar un archivo para el producto.');
      }
      
      const newProductData = {
        name: name.trim(),
        description: description.trim(),
        stock: parseInt(stock, 10),
        categoryId: categoryId,
      };
      const success = await onAddProduct(newProductData, mediaFile);
      if (success) {
        form.reset();
        setProductPreview(null);
      }
    }, 'Producto agregado exitosamente', 'Guardando...');
  };
  
  const handleAddPerfume = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    await executeWithGlobalLoading(async () => {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const mediaFile = formData.get('mediaFile') as File;

      // Validaciones para perfumes
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const stock = formData.get('stock') as string;

      if (!name || !name.trim()) {
        throw new Error('El nombre del perfume es requerido.');
      }
      
      if (!description || !description.trim()) {
        throw new Error('La descripción del perfume es requerida.');
      }
      
      if (!stock || isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0) {
        throw new Error('El stock debe ser un número válido mayor o igual a 0.');
      }

      if (!mediaFile || mediaFile.size === 0) {
        throw new Error('Debes seleccionar un archivo para el perfume.');
      }

      const newPerfumeData = {
        name: name.trim(),
        description: description.trim(),
        stock: parseInt(stock, 10),
      };

      const success = await onAddPerfume(newPerfumeData, mediaFile);
      if (success) {
        form.reset();
        setPerfumePreview(null);
      }
    }, 'Perfume agregado exitosamente', 'Guardando...');
  };

  const handleAddGalleryItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const mediaFile = formData.get('mediaFile') as File;
    
    // Validaciones para galería
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    if (!title || !title.trim()) {
      showErrorAlert('Error de validación', 'El título del elemento de galería es requerido.');
      return;
    }
    
    if (!description || !description.trim()) {
      showErrorAlert('Error de validación', 'La descripción del elemento de galería es requerida.');
      return;
    }
    
    if (!mediaFile || mediaFile.size === 0) {
      showErrorAlert('Error de validación', 'Debes seleccionar una imagen o video para la galería.');
      return;
    }
    
    const newItemData = {
      title: title.trim(),
      description: description.trim(),
    };
    
    // Mostrar mensaje de confirmación al instante
    showSuccessAlert('¡Éxito!', 'Elemento de galería agregado exitosamente');
    
    // Limpiar el formulario inmediatamente
    form.reset();
    setGalleryMediaPreview(null);
    
    // Ejecutar agregado en segundo plano
    try {
      await onAddGalleryItem(newItemData, mediaFile);
    } catch (error) {
      console.error('Error adding gallery item:', error);
      showErrorAlert('Error al agregar', 'No se pudo agregar el elemento a la galería.');
    }
  };

  const handleAboutMeUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.currentTarget);
      const text = formData.get('text') as string;
      const happyClients = formData.get('happyClients') as string;
      const yearsOfExperience = formData.get('yearsOfExperience') as string;
      const events = formData.get('events') as string;
      
      // Validaciones para "Sobre Mí"
      if (!text || !text.trim()) {
        showErrorAlert('Error de validación', 'El texto de la sección "Sobre Mí" es requerido.');
        return;
      }
      
      if (!happyClients || !happyClients.trim()) {
        showErrorAlert('Error de validación', 'El número de clientes felices es requerido.');
        return;
      }
      
      if (!yearsOfExperience || !yearsOfExperience.trim()) {
        showErrorAlert('Error de validación', 'Los años de experiencia son requeridos.');
        return;
      }
      
      if (!events || !events.trim()) {
        showErrorAlert('Error de validación', 'El número de eventos es requerido.');
        return;
      }
      
      // Validar que los números sean válidos
      if (isNaN(parseInt(happyClients, 10)) || parseInt(happyClients, 10) < 0) {
        showErrorAlert('Error de validación', 'El número de clientes felices debe ser un número válido.');
        return;
      }
      
      if (isNaN(parseInt(yearsOfExperience, 10)) || parseInt(yearsOfExperience, 10) < 0) {
        showErrorAlert('Error de validación', 'Los años de experiencia deben ser un número válido.');
        return;
      }
      
      if (isNaN(parseInt(events, 10)) || parseInt(events, 10) < 0) {
        showErrorAlert('Error de validación', 'El número de eventos debe ser un número válido.');
        return;
      }
      
      const updatedData = {
          text: text.trim(),
          happyClients: happyClients.trim(),
          yearsOfExperience: yearsOfExperience.trim(),
          events: events.trim(),
      };
      const mediaFile = formData.get('mediaFile') as File;
      await onUpdateAboutMeContent(updatedData, mediaFile && mediaFile.size > 0 ? mediaFile : undefined);
      setAboutMePreview(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error al actualizar sección Sobre Mí:', error);
      showErrorAlert('Error', 'No se pudo actualizar la sección Sobre Mí.');
    } finally {
    }
  };

  // Placeholder functions for user/category management which happens in page.tsx
  const handleAddOrUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const form = e.currentTarget;
      if (!form) {
        console.error('Form element not found');
        return;
      }
      
      const formData = new FormData(form);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      
      console.log('🔍 Datos del formulario:', { name, email, password });
      
      // Validar datos requeridos
      if (!name || !name.trim()) {
        showErrorAlert('Error de validación', 'El nombre de usuario es requerido.');
        return;
      }
      
      if (!email || !email.trim()) {
        showErrorAlert('Error de validación', 'El correo electrónico es requerido.');
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showErrorAlert('Error de validación', 'Por favor ingresa un correo electrónico válido.');
        return;
      }
      
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password: password || '',
      };
      
      console.log('🔍 userData preparado:', userData);
      
            if (isEditingUser && currentUserToEdit) {
              await onUpdateUser(currentUserToEdit.id, userData);
            } else {
              // Para nuevos usuarios, no se requiere contraseña (se genera automáticamente)
              const result = await onAddUser(userData);
              
              if (result.success && result.temporaryPassword) {
                // 1. Primero: Mostrar mensaje de confirmación de guardado
                showSuccessAlert('Usuario guardado', 'El usuario se ha creado exitosamente.');
                
                // 2. Después: Mostrar la contraseña temporal por 5 segundos (con delay)
                setTimeout(() => {
                  showTemporaryPassword(result.temporaryPassword!);
                  
                  // 3. Finalmente: Agregar usuario al listado después de mostrar la contraseña
                  setTimeout(() => {
                    // Recargar la lista de usuarios para mostrar el nuevo usuario
                    // Solo recargar si estamos en el contexto de creación de usuario
                    if (!isEditingUser) {
                      window.location.reload();
                    }
                  }, 5000); // 5 segundos después de mostrar la contraseña
                  
                }, 1000); // 1 segundo de delay después del mensaje de confirmación
                
              } else if (result.error) {
                showErrorAlert('Error al crear usuario', result.error);
                return; // No continuar si hay error
              }
            }
      
      setIsEditingUser(false);
      setCurrentUserToEdit(null);
      if (form) {
        form.reset();
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      showErrorAlert('Error al guardar', 'No se pudo guardar el usuario. Inténtalo de nuevo.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Obtener el formulario desde el botón
      const form = e.currentTarget.closest('form');
      if (!form) {
        throw new Error('No se pudo encontrar el formulario');
      }
      
      const formData = new FormData(form);
      const newPassword = formData.get('newPassword') as string;
      
      if (currentUserForPasswordChange) {
        await onUpdateUser(currentUserForPasswordChange.id, { 
          ...currentUserForPasswordChange, 
          password: newPassword 
        });
        
        // Mostrar mensaje de confirmación
        showSuccessAlert('Contraseña actualizada', 'La contraseña del usuario se ha actualizado exitosamente.');
        
        setOpenPasswordDialog(false);
        setCurrentUserForPasswordChange(null);
        
        // Resetear el formulario
        form.reset();
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      showErrorAlert({
        title: 'Error al Cambiar Contraseña',
        message: 'No se pudo cambiar la contraseña del usuario.',
        solution: `
          1. Verifica que la nueva contraseña sea válida
          2. Asegúrate de que el usuario exista
          3. Comprueba tu conexión a internet
          4. Intenta cambiar la contraseña nuevamente
          5. Si el problema persiste, contacta al soporte técnico
        `,
        error
      });
    } finally {
    }
  };

  const handleDeleteUser = async (id: string) => {
    
    try {
      await onDeleteUser(id);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    } finally {
    }
  };

  // Testimonial handlers with loading
  const handleUpdateTestimonial = async (id: string, data: any) => {
    try {
      if (!onUpdateTestimonial) {
        throw new Error('Función onUpdateTestimonial no está disponible');
      }
      await onUpdateTestimonial(id, data);
      showSuccessAlert('Testimonio actualizado', 'El testimonio se ha actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar testimonio:', error);
      showErrorAlert({
        title: 'Error al Actualizar Testimonio',
        message: 'No se pudo actualizar el testimonio. Inténtalo de nuevo.',
        solution: `
          1. Verifica tu conexión a internet
          2. Intenta actualizar el testimonio nuevamente
          3. Si el problema persiste, contacta al soporte técnico
          4. Recarga la página si es necesario
        `,
        error
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    await executeWithGlobalLoading(async () => {
      await onDeleteTestimonial(id);
    }, 'Testimonio eliminado exitosamente', 'Eliminando...');
  };

  const handleUpdateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    const statusText = status === 'approved' ? 'aprobado' : 'rechazado';
    await executeWithGlobalLoading(async () => {
      await onUpdateTestimonialStatus(id, status);
    }, `Testimonio ${statusText} exitosamente`, 'Actualizando...');
  };
  const handleAddOrUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const isEditMode = isEditingCategory && currentCategoryToEdit;
    const loadingMessage = isEditMode ? 'Actualizando...' : 'Guardando...';
    const successMessage = isEditMode ? 'Categoría actualizada exitosamente' : 'Categoría agregada exitosamente';
    
    // Validaciones para categorías
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    
    if (!name || !name.trim()) {
      showErrorAlert('Error de validación', 'El nombre de la categoría es requerido.');
      return;
    }
    
    await executeWithGlobalLoading(async () => {
      const categoryData = {
        name: name.trim(),
      };
      
      if (isEditMode) {
        await onUpdateCategory(currentCategoryToEdit!.id, categoryData);
      } else {
        await onAddCategory(categoryData);
      }
      
      // Limpiar estados después de la operación
      setCurrentCategoryToEdit(null);
      setIsEditingCategory(false);
      (e.target as HTMLFormElement).reset();
    }, successMessage, loadingMessage, () => {
      // Función para cerrar el modal
      setOpenCategoryDialog(false);
    });
  };

  const handleDeleteCategory = async (id: string) => {
    await executeWithGlobalLoading(async () => {
      await onDeleteCategory(id);
    }, 'Categoría eliminada exitosamente', 'Eliminando...');
  };
  
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

  // Reusable component for rendering media info without preview (simple and stable)
  const MediaPreview = ({ preview, onRemove }: { preview: MediaPreview, onRemove: () => void }) => {
    return (
      <NoPreviewUpload 
        preview={preview} 
        onRemove={onRemove}
      />
    );
  };


  const EditProductDialog = ({ product, onSave }: { product: Product; onSave: (id: string, data: Omit<Product, 'id' | 'url' | 'type' | 'file'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<MediaPreview>(null);
    const [newMediaFile, setNewMediaFile] = useState<File | undefined>(undefined);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
      if (open) {
        // Solo establecemos la vista previa si no hay un archivo nuevo seleccionado
        if (!newMediaFile) {
          setPreview({ url: product.url, type: product.type as 'image' | 'video' });
        }
        // No reseteamos newMediaFile para mantener la selección del usuario
      }
    }, [open, product]);

    const handleFileChange = (file: File) => {
      handleMediaFilePreview(file, setPreview);
      setNewMediaFile(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Usar referencia del formulario en lugar de e.currentTarget
        if (!formRef.current) {
            console.error('Form reference not found');
            return;
        }
        
        const formData = new FormData(formRef.current);
        const updatedData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            stock: parseInt(formData.get('stock') as string, 10),
            categoryId: formData.get('categoryId') as string,
        };
        
        await executeWithGlobalLoading(async () => {
            onSave(product.id, updatedData, newMediaFile);
        }, 'Producto actualizado exitosamente', 'Actualizando...', () => {
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="icon" className="h-10 w-10 sm:h-11 sm:w-11"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Producto</DialogTitle>
                  <DialogDescription>Modifica los detalles de este producto.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" defaultValue={product.name} />
                    <Textarea name="description" defaultValue={product.description} />
                    <Input name="stock" type="number" defaultValue={product.stock} />
                     <Select name="categoryId" defaultValue={product.categoryId}>
                        <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <DragDropUpload name="mediaFile" accept="image/*,video/*" onFileSelect={handleFileChange} />
                    <MediaPreview preview={preview} onRemove={() => setPreview(null)} />
                    <DialogFooter><Button type="submit" className="h-12 w-full sm:w-auto sm:px-8">Guardar Cambios</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditPerfumeDialog = ({ perfume, onSave }: { perfume: Perfume; onSave: (id: string, data: Omit<Perfume, 'id' | 'url' | 'type' | 'file'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<MediaPreview>(null);
    const [newMediaFile, setNewMediaFile] = useState<File | undefined>(undefined);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
      if (open) {
        // Solo establecemos la vista previa si no hay un archivo nuevo seleccionado
        if (!newMediaFile) {
          setPreview({ url: perfume.url, type: perfume.type as 'image' | 'video' });
        }
        // No reseteamos newMediaFile para mantener la selección del usuario
      }
    }, [open, perfume]);

    const handleFileChange = (file: File) => {
      handleMediaFilePreview(file, setPreview);
      setNewMediaFile(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Usar referencia del formulario en lugar de e.currentTarget
        if (!formRef.current) {
            console.error('Form reference not found');
            return;
        }
        
        const formData = new FormData(formRef.current);
        const updatedData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            stock: parseInt(formData.get('stock') as string, 10),
        };
        
        await executeWithGlobalLoading(async () => {
            onSave(perfume.id, updatedData, newMediaFile);
        }, 'Perfume actualizado exitosamente', 'Actualizando...', () => {
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="icon" className="h-10 w-10 sm:h-11 sm:w-11"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Perfume</DialogTitle>
                   <DialogDescription>Modifica los detalles de este perfume.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" defaultValue={perfume.name} />
                    <Textarea name="description" defaultValue={perfume.description} />
                    <Input name="stock" type="number" defaultValue={perfume.stock} />
                    <DragDropUpload name="mediaFile" accept="image/*,video/*" onFileSelect={handleFileChange} />
                    <MediaPreview preview={preview} onRemove={() => setPreview(null)} />
                    <DialogFooter><Button type="submit" className="h-12 w-full sm:w-auto sm:px-8">Guardar Cambios</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  };

  const EditGalleryItemDialog = ({ item, onSave }: { item: GalleryItem; onSave: (id: string, data: Omit<GalleryItem, 'id' | 'url' | 'type' | 'file' | 'alt'>, file?: File) => void }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<MediaPreview>(null);
    const [newMediaFile, setNewMediaFile] = useState<File | undefined>(undefined);

    useEffect(() => {
      if (open) {
        // Solo establecemos la vista previa si no hay un archivo nuevo seleccionado
        if (!newMediaFile) {
          setPreview({ url: item.url, type: item.type as 'image' | 'video' });
        }
        // No reseteamos newMediaFile para mantener la selección del usuario
      }
    }, [open, item]);

    const handleFileChange = (file: File) => {
      handleMediaFilePreview(file, setPreview);
      setNewMediaFile(file);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
        };
        onSave(item.id, updatedData, newMediaFile);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="icon" className="h-10 w-10 sm:h-11 sm:w-11"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Elemento de Galería</DialogTitle>
                  <DialogDescription>Modifica los detalles de este elemento.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" placeholder="Título" defaultValue={item.title} required/>
                    <Textarea name="description" placeholder="Descripción Breve" defaultValue={item.description} required />
                    <DragDropUpload name="mediaFile" accept="image/*,video/*" onFileSelect={handleFileChange} />
                    <MediaPreview preview={preview} onRemove={() => setPreview(null)} />
                    <DialogFooter><Button type="submit" className="h-12 w-full sm:w-auto sm:px-8">Guardar Cambios</Button></DialogFooter>
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
                <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
                {/* Mobile view: Cards */}
                <div className="grid gap-4 md:hidden">
                    {list.map(t => (
                        <Card key={t.id} className="p-4 space-y-3 bg-gray-700 border-gray-600">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-sm shrink-0 text-gray-200">
                                    {t.author.charAt(0)}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-gray-200">{t.author}</p>
                                    <p className="text-sm text-gray-400 break-words">"{t.text}"</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-600">
                                <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'} className={cn(
                                    {'bg-green-900/30 text-green-400 border-green-400': t.status === 'approved'},
                                    {'bg-yellow-900/30 text-yellow-400 border-yellow-400': t.status === 'pending'},
                                    {'bg-red-900/30 text-red-400 border-red-400': t.status === 'rejected'}
                                )}>{statusTranslations[t.status]}</Badge>
                                <div className="flex items-center">
                                    {t.status !== 'approved' && <Button variant="ghost" size="icon" onClick={() => handleUpdateTestimonialStatus(t.id, 'approved')} className="text-green-400 hover:text-green-300 hover:bg-green-900/20"><ThumbsUp className="w-4 h-4"/></Button>}
                                    {t.status !== 'rejected' && <Button variant="ghost" size="icon" onClick={() => handleUpdateTestimonialStatus(t.id, 'rejected')} className="text-orange-400 hover:text-orange-300 hover:bg-orange-900/20"><ThumbsDown className="w-4 h-4"/></Button>}
                                    <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => handleDeleteTestimonial(t.id))} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                        <Trash2 className="w-4 h-4" />
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
                            <TableRow className="border-gray-600">
                                <TableHead className="text-gray-300">Autor</TableHead>
                                <TableHead className="hidden lg:table-cell text-gray-300">Testimonio</TableHead>
                                <TableHead className="text-gray-300">Estado</TableHead>
                                <TableHead className="text-right text-gray-300">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.map(t => (
                                <TableRow key={t.id} className="border-gray-700 hover:bg-gray-700">
                                    <TableCell className="font-bold text-gray-200">{t.author}</TableCell>
                                    <TableCell className="hidden lg:table-cell max-w-sm">
                                        <p className="truncate text-gray-300">{t.text}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'} className={cn(
                                            {'bg-green-900/30 text-green-400 border-green-400': t.status === 'approved'},
                                            {'bg-yellow-900/30 text-yellow-400 border-yellow-400': t.status === 'pending'},
                                            {'bg-red-900/30 text-red-400 border-red-400': t.status === 'rejected'}
                                        )}>{statusTranslations[t.status]}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end">
                                            {t.status !== 'approved' && <Button variant="ghost" size="icon" onClick={() => handleUpdateTestimonialStatus(t.id, 'approved')} className="text-green-400 hover:text-green-300 hover:bg-green-900/20"><ThumbsUp className="w-4 h-4"/></Button>}
                                            {t.status !== 'rejected' && <Button variant="ghost" size="icon" onClick={() => handleUpdateTestimonialStatus(t.id, 'rejected')} className="text-orange-400 hover:text-orange-300 hover:bg-orange-900/20"><ThumbsDown className="w-4 h-4"/></Button>}
                                            <Button variant="ghost" size="icon" onClick={() => showDeleteConfirm(() => handleDeleteTestimonial(t.id))} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                                <Trash2 className="w-4 h-4" />
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
          <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'} py-8`}>
            <div className="max-w-4xl mx-auto px-4">
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="text-center pb-6">
                  <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-teal-700'} mb-2`}>
                    Contenido de la Sección Inicial
                  </CardTitle>
                  <p className={`text-sm ${getTextClasses().secondary}`}>
                    Actualiza los elementos visuales y de texto de tu página principal
                  </p>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleHeroUpdate} className="space-y-8">
                    {/* Text Fields Section */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className={`text-sm font-medium ${getTextClasses().label}`}>Titulo</Label>
                        <Input 
                          name="title" 
                          defaultValue={heroContent.title} 
                          className={`w-full ${getInputClasses()}`}
                        />
                    </div>
                      <div className="space-y-2">
                        <Label className={`text-sm font-medium ${getTextClasses().label}`}>Subtitulo</Label>
                        <Textarea 
                          name="subtitle" 
                          defaultValue={heroContent.subtitle} 
                          rows={3}
                          className={`w-full ${getInputClasses()} resize-none`}
                        />
                    </div>
                  </div>
                  
                    {/* Image Section */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className={`text-sm font-medium ${getTextClasses().label}`}>Imagen Actual</Label>
                        <div className={`relative w-full max-w-md h-48 rounded-lg overflow-hidden border ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                        <Media
                          src={heroContent.url}
                          type={heroContent.type}
                          alt="Imagen actual de la sección inicial"
                          fill
                            className="object-cover"
                        />
                      </div>
                    </div>
                    
                      <div className="space-y-3">
                        <Label className={`text-sm font-medium ${getTextClasses().label}`}>Nueva Imagen (opcional)</Label>
                        <DragDropUpload 
                          name="mediaFile" 
                          accept="image/*,video/*" 
                          onFileSelect={(file) => handleMediaFilePreview(file, setHeroPreview)}
                        />
                      {heroPreview && (
                          <div className="mt-4">
                            <Label className={`text-sm font-medium ${getTextClasses().label}`}>Vista previa de la nueva imagen</Label>
                            <div className="mt-2 w-full max-w-md">
                            <MediaPreview preview={heroPreview} onRemove={() => setHeroPreview(null)} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                    {/* Submit Button */}
                    <div className="flex justify-center pt-4">
                      <Button 
                        type="submit" 
                        className={`${getButtonClasses().primary} px-8 py-3 rounded-lg flex items-center gap-2 font-medium`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Actualizar Sección Inicial
                      </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            </div>
          </div>
        );
      case 'about':
        return (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader><CardTitle className="font-headline text-gray-200">Gestionar 'Sobre Mí'</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAboutMeUpdate} className="space-y-4">
                  <Textarea name="text" defaultValue={aboutMeContent.text} rows={6} className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-teal-400" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input name="happyClients" defaultValue={aboutMeContent.happyClients} className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-teal-400" />
                    <Input name="yearsOfExperience" defaultValue={aboutMeContent.yearsOfExperience} className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-teal-400" />
                    <Input name="events" defaultValue={aboutMeContent.events} className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-teal-400" />
                  </div>
                  <DragDropUpload name="mediaFile" accept="image/*,video/*" onFileSelect={(file) => handleMediaFilePreview(file, setAboutMePreview)} />
                  <MediaPreview preview={aboutMePreview} onRemove={() => setAboutMePreview(null)} />
                  <Button type="submit" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white h-12 w-full sm:w-auto sm:px-8">
                    Actualizar 'Sobre Mí'
                  </Button>
                </form>
              </CardContent>
            </Card>
        );
      case 'services':
        return (
          <div className="w-full max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className={`text-3xl font-bold ${getTextClasses().primary}`}>Gestionar Servicios</h1>
              <p className={`text-lg ${getTextClasses().secondary}`}>Añade, edita y elimina los servicios que ofreces.</p>
            </div>

            {/* Two Column Layout */}
            <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Panel - Add New Service */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>
                    {isEditMode ? `Editar Servicio: ${editingService?.title}` : 'Añadir Nuevo Servicio'}
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-6">
                  <form onSubmit={handleAddService} className="space-y-4">
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${getTextClasses().label}`}>Titulo</label>
                      <Input 
                        name="title" 
                        placeholder="Ej: Diseño Web Moderno" 
                        value={isEditMode ? editingService?.title || '' : formTitle}
                        onChange={(e) => {
                          if (isEditMode && editingService) {
                            setEditingService({ ...editingService, title: e.target.value });
                          } else {
                            setFormTitle(e.target.value);
                          }
                        }}
                        required 
                        className={`w-full ${getInputClasses()}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${getTextClasses().label}`}>Descripción</label>
                      <Textarea 
                        name="description" 
                        placeholder="Describe los detalles del servicio..." 
                        value={isEditMode ? editingService?.description || '' : formDescription}
                        onChange={(e) => {
                          if (isEditMode && editingService) {
                            setEditingService({ ...editingService, description: e.target.value });
                          } else {
                            setFormDescription(e.target.value);
                          }
                        }}
                        required 
                        rows={4}
                        className={`w-full ${getInputClasses()}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${getTextClasses().label}`}>Imagen del Servicio</label>
                      {isEditMode && editingService?.url && !serviceMediaFile && (
                        <div className="mb-2 p-2 bg-gray-700 rounded text-xs text-gray-400">
                          Imagen actual: {editingService.title}
                        </div>
                      )}
                      <DragDropUpload 
                        name="mediaFile" 
                        accept="image/*,video/*" 
                        required={!isEditMode}
                        onFileSelect={(file) => {
                          handleMediaFilePreview(file, setServicePreview);
                          setServiceMediaFile(file);
                        }}
                      />
                  <MediaPreview preview={servicePreview} onRemove={() => {
                    setServicePreview(null);
                    setServiceMediaFile(undefined);
                  }} />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="submit" 
                        className={`w-full sm:flex-1 ${getButtonClasses().primary} font-semibold py-3 sm:py-2.5 rounded-lg flex items-center justify-center space-x-2 h-12 sm:h-11 text-base sm:text-lg`}
                      >
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span>{isEditMode ? 'Actualizar Servicio' : 'Añadir Servicio'}</span>
                      </Button>
                      
                      {isEditMode && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={cancelEdit}
                          className="w-full sm:w-auto sm:px-6 border-gray-600 text-gray-300 hover:bg-gray-700 py-3 text-base sm:text-lg rounded-lg flex items-center justify-center space-x-2 h-12 sm:h-11"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Cancelar Edición</span>
                        </Button>
                      )}
                    </div>
                </form>
                </CardContent>
              </Card>

              {/* Right Panel - Active Services */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>Servicios Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mobile view: Cards */}
                    <div className="grid gap-4 md:hidden">
                      {services.map((service) => (
                        <Card key={service.id} className={`p-4 space-y-3 ${getCardClasses()}`}>
                          <div className="flex items-start gap-3">
                            <ServiceImage service={service} />
                            <div className="flex-grow min-w-0">
                              <h3 className={`font-semibold ${getTextClasses().primary} text-base`}>{service.title}</h3>
                              <p className={`text-sm ${getTextClasses().secondary} line-clamp-2 mt-1`}>{service.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => loadServiceForEdit(service)}
                              className={`h-10 w-10 text-gray-400 hover:text-gray-300 hover:bg-gray-700`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => showDeleteConfirm(() => onDeleteService(service.id))}
                              className={`h-10 w-10 ${getButtonClasses().danger}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                      
                      {services.length === 0 && (
                        <div className={`text-center py-8 ${getTextClasses().muted}`}>
                          <p>No hay servicios activos</p>
                        </div>
                      )}
                    </div>

                    {/* Desktop view: Table */}
                    <div className="hidden md:block">
                      {/* Table Headers */}
                      <div className={`grid grid-cols-12 gap-4 pb-2 border-b ${getTableClasses().header}`}>
                        <div className="col-span-8">
                          <span className={`text-sm font-medium ${getTextClasses().label}`}>Servicio</span>
                        </div>
                        <div className="col-span-4 text-right">
                          <span className={`text-sm font-medium ${getTextClasses().label}`}>Acciones</span>
                        </div>
                      </div>
                      
                      {/* Services List */}
                      <div className="space-y-3">
                        {services.map((service, index) => (
                          <div key={service.id} className={`flex items-center space-x-4 py-3 border-b ${getTableClasses().row} last:border-b-0`}>
                            {/* Service Icon */}
                            <ServiceImage service={service} />
                            
                            {/* Service Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold ${getTextClasses().primary} truncate`}>{service.title}</h3>
                              <p className={`text-sm ${getTextClasses().secondary} line-clamp-2`}>{service.description}</p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => loadServiceForEdit(service)}
                                className="text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => showDeleteConfirm(() => onDeleteService(service.id))}
                                className={getButtonClasses().danger}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {services.length === 0 && (
                          <div className={`text-center py-8 ${getTextClasses().muted}`}>
                            <p>No hay servicios activos</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
              </CardContent>
            </Card>
            
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className={`text-3xl font-bold ${getTextClasses().primary} mb-2`}>Gestionar Cursos de Belleza</h1>
              <p className={`text-lg ${getTextClasses().secondary}`}>Añade, visualiza y gestiona tus cursos de belleza.</p>
            </div>

            {/* Two Column Layout */}
            <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Panel - Add Course Form */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary} flex items-center gap-2`}>
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    Añadir Curso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleCourseSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label} flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Nombre del Curso
                      </Label>
                      <Input 
                        name="name" 
                        placeholder="Ej. Maquillaje Profesional Avanzado" 
                        required 
                        className={`w-full h-12 text-lg ${getInputClasses()}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label} flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descripción
                      </Label>
                      <Textarea 
                        name="description" 
                        placeholder="Describe los temas, duración y objetivos del curso..." 
                        required 
                        className={`w-full text-lg ${getInputClasses()}`}
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label} flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Imagen del Curso
                      </Label>
                      <DragDropUpload
                        name="mediaFile"
                        accept="image/*,video/*"
                        onFileSelect={(file) => {
                          if (file) {
                            handleMediaFilePreview(file, setCoursePreview);
                            setCourseMediaFile(file);
                          }
                        }}
                      />
                      {coursePreview && (
                        <div className="mt-4">
                          <MediaPreview preview={coursePreview} onRemove={() => {
                            setCoursePreview(null);
                            setCourseMediaFile(null);
                          }} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="submit" 
                        className={`w-full sm:flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 sm:py-3 text-base sm:text-lg rounded-lg flex items-center justify-center space-x-2 h-12 sm:h-11`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Añadir Curso</span>
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setCoursePreview(null);
                          setCourseMediaFile(null);
                        }}
                        className={`w-full sm:w-auto sm:px-6 py-4 sm:py-3 text-base sm:text-lg h-12 sm:h-11 ${getButtonClasses().secondary}`}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Limpiar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Right Panel - Course Inventory */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>Inventario de Cursos</CardTitle>
                  <p className={`text-sm ${getTextClasses().secondary}`}>Lista de todos los cursos disponibles.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mobile view: Cards */}
                    <div className="grid gap-4 md:hidden">
                      {courses.map((course) => (
                        <Card key={course.id} className={`p-4 space-y-3 ${getCardClasses()}`}>
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {course.url && course.url.trim() !== '' ? (
                                <img 
                                  src={course.url} 
                                  alt={course.name}
                                  className="w-full h-full object-cover rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`w-full h-full rounded flex items-center justify-center ${course.url && course.url.trim() !== '' ? 'hidden' : 'flex'}`}
                                style={{ backgroundColor: '#10b981' }}
                              >
                                <span className="text-sm font-semibold text-white">
                                  {course.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-grow min-w-0">
                              <h3 className={`font-semibold ${getTextClasses().primary} text-base`}>{course.name}</h3>
                              <p className={`text-sm ${getTextClasses().secondary} line-clamp-2 mt-1`}>{course.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setEditingCourse(course)}
                              className={`h-10 w-10 ${getButtonClasses().primary}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => showDeleteConfirm(() => onDeleteCourse(course.id))}
                              className={`h-10 w-10 ${getButtonClasses().danger}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                      
                      {courses.length === 0 && (
                        <div className={`text-center py-8 ${getTextClasses().muted}`}>
                          <p>No hay cursos en el inventario</p>
                        </div>
                      )}
                    </div>

                    {/* Desktop view: Table */}
                    <div className="hidden md:block">
                      {/* Table Headers */}
                      <div className={`grid grid-cols-12 gap-4 pb-3 border-b ${getTableClasses().header}`}>
                        <div className="col-span-8">
                          <span className={`text-sm font-medium ${getTextClasses().label}`}>CURSO</span>
                        </div>
                        <div className="col-span-4 text-right">
                          <span className={`text-sm font-medium ${getTextClasses().label}`}>ACCIONES</span>
                        </div>
                      </div>
                      
                      {/* Courses List */}
                      <div className="space-y-0">
                        {courses.map((course, index) => {
                          return (
                            <div key={course.id} className={`grid grid-cols-12 gap-4 items-center py-4 ${index < courses.length - 1 ? `border-b ${getTableClasses().row}` : ''}`}>
                              {/* Course Info */}
                              <div className="col-span-8 flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {course.url && course.url.trim() !== '' ? (
                                    <img 
                                      src={course.url} 
                                      alt={course.name}
                                      className="w-full h-full object-cover rounded"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div 
                                    className={`w-full h-full rounded flex items-center justify-center ${course.url && course.url.trim() !== '' ? 'hidden' : 'flex'}`}
                                    style={{ backgroundColor: '#10b981' }}
                                  >
                                    <span className="text-xs font-semibold text-white">
                                      {course.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className={`font-semibold ${getTextClasses().primary} truncate`}>{course.name}</h3>
                                  <p className={`text-xs ${getTextClasses().muted} truncate`}>{course.description}</p>
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="col-span-4 flex items-center justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => setEditingCourse(course)}
                                  className={getButtonClasses().primary}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => showDeleteConfirm(() => onDeleteCourse(course.id))}
                                  className={getButtonClasses().danger}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        
                        {courses.length === 0 && (
                          <div className={`text-center py-8 ${getTextClasses().muted}`}>
                            <p>No hay cursos en el inventario</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'categories':
         return (
             <div className="relative">
             <Card className={`shadow-lg ${getCardClasses()}`}>
                  <CardHeader className="flex flex-row justify-between items-center">
                      <div>
                          <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>Categorías de Productos</CardTitle>
                          <p className={`text-sm ${getTextClasses().secondary} mt-1`}>Gestiona las categorías de tus productos.</p>
                      </div>
                      <Button 
                          onClick={() => { setIsEditingCategory(false); setCurrentCategoryToEdit(null); setOpenCategoryDialog(true); }}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Añadir Categoría
                      </Button>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-0">
                          {/* Table Headers */}
                          <div className={`grid grid-cols-12 gap-4 pb-3 border-b ${getTableClasses().header}`}>
                              <div className="col-span-8">
                                  <span className={`text-sm font-medium ${getTextClasses().label}`}>NOMBRE</span>
                              </div>
                              <div className="col-span-4 text-right">
                                  <span className={`text-sm font-medium ${getTextClasses().label}`}>ACCIONES</span>
                              </div>
                          </div>
                          
                          {/* Categories List */}
                          <div className="space-y-0">
                              {categories.map((category, index) => (
                                  <div key={category.id} className={`flex items-center justify-between py-4 ${index < categories.length - 1 ? `border-b ${getTableClasses().row}` : ''}`}>
                                      <div className="flex-1">
                                          <span className={`font-medium ${getTextClasses().primary}`}>{category.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              onClick={() => { setIsEditingCategory(true); setCurrentCategoryToEdit(category); setOpenCategoryDialog(true); }}
                                              className={getButtonClasses().ghost}
                                          >
                                              <Pencil className="w-4 h-4" />
                                            </Button>
                                          <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              onClick={() => showDeleteConfirm(() => handleDeleteCategory(category.id))}
                                              className={getButtonClasses().danger}
                                          >
                                              <Trash2 className="w-4 h-4" />
                                          </Button>
                                      </div>
                                  </div>
                              ))}
                              
                              {categories.length === 0 && (
                                  <div className={`text-center py-8 ${getTextClasses().muted}`}>
                                      <p>No hay categorías creadas</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </CardContent>
                  <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
                      <DialogContent className={`w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto ${getCardClasses()}`}>
                          <DialogHeader>
                            <DialogTitle className={getTextClasses().primary}>{isEditingCategory ? 'Editar' : 'Añadir'} Categoría</DialogTitle>
                            <DialogDescription className={getTextClasses().secondary}>
                                {isEditingCategory ? 'Modifica el nombre de la categoría.' : 'Crea una nueva categoría para tus productos.'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddOrUpdateCategory} className="space-y-4">
                              <Input 
                                  name="name" 
                                  placeholder="Nombre de la categoría" 
                                  defaultValue={currentCategoryToEdit?.name || ''} 
                                  required 
                                  className={getInputClasses()}
                              />
                              <DialogFooter>
                                  <Button type="submit" className={getButtonClasses().primary}>
                                      {isEditingCategory ? 'Actualizar' : 'Guardar'}
                                  </Button>
                              </DialogFooter>
                          </form>
                      </DialogContent>
                  </Dialog>
              </Card>
              
             </div>
         );
      case 'products':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className={`text-3xl font-bold ${getTextClasses().primary} mb-2`}>Gestionar Productos</h1>
              <p className={`text-lg ${getTextClasses().secondary}`}>Añade, visualiza y gestiona el inventario de tus productos.</p>
            </div>

            {/* Two Column Layout */}
            <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Panel - Add New Product */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>Añadir Nuevo Producto</CardTitle>
                </CardHeader>
              <CardContent className="space-y-6">
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Nombre del producto</Label>
                      <Input 
                        name="name" 
                        placeholder="Ej: Camiseta de Algodón" 
                        required 
                        className={`w-full ${getInputClasses()}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Descripción del producto</Label>
                      <Textarea 
                        name="description" 
                        placeholder="Describe las características principales" 
                        required 
                        rows={4}
                        className={`w-full ${getInputClasses()} resize-none`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Stock disponible</Label>
                      <Input 
                        name="stock" 
                        type="number" 
                        placeholder="Ej: 100" 
                        required 
                        className={`w-full ${getInputClasses()}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Categoría</Label>
                      <Select name="categoryId" required>
                        <SelectTrigger className={getInputClasses()}>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent className={`${getCardClasses()}`}>
                          {categories.map(cat => (
                            <SelectItem 
                              key={cat.id} 
                              value={cat.id} 
                              className={`${getTextClasses().primary} hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Imagen del producto</Label>
                      <DragDropUpload 
                        name="mediaFile" 
                        accept="image/*,video/*" 
                        required 
                        onFileSelect={(file) => handleMediaFilePreview(file, setProductPreview)}
                      />
                  <MediaPreview preview={productPreview} onRemove={() => setProductPreview(null)} />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-2.5 rounded-lg flex items-center justify-center space-x-2 h-12 sm:h-11 text-base sm:text-lg`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Añadir Producto</span>
                    </Button>
                </form>
                </CardContent>
              </Card>

              {/* Right Panel - Active Products */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>Productos Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mobile view: Cards */}
                    <div className="grid gap-4 md:hidden">
                      {products.map((product) => {
                        const category = categories.find(cat => cat.id === product.categoryId);
                        const stockLevel = product.stock >= 6 ? 'high' : 'low';
                        const stockColor = stockLevel === 'high' ? 'bg-green-100 text-green-800' : 
                                         'bg-red-100 text-red-800';
                        
                        return (
                          <Card key={product.id} className={`p-4 space-y-3 ${getCardClasses()}`}>
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                {product.url && product.url.trim() !== '' ? (
                                  <img 
                                    src={product.url} 
                                    alt={product.name}
                                    className="w-10 h-10 rounded object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallback = target.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center"
                                  style={{ display: product.url && product.url.trim() !== '' ? 'none' : 'flex' }}
                                >
                                  <span className="text-sm font-semibold text-white">
                                    {product.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-grow min-w-0">
                                <h3 className={`font-semibold ${getTextClasses().primary} text-base`}>{product.name}</h3>
                                <p className={`text-xs ${getTextClasses().muted} mt-1`}>#{product.id.slice(-6).toUpperCase()}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockColor}`}>
                                    {product.stock} Unidades
                                  </span>
                                  <span className={`text-xs ${getTextClasses().secondary}`}>
                                    {category?.name || 'Sin categoría'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                              <EditProductDialog product={product} onSave={onUpdateProduct} />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => showDeleteConfirm(() => onDeleteProduct(product.id))}
                                className={`h-10 w-10 ${getButtonClasses().danger}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                      
                      {products.length === 0 && (
                        <div className={`text-center py-8 ${getTextClasses().muted}`}>
                          <p>No hay productos activos</p>
                        </div>
                      )}
                    </div>

                    {/* Desktop view: Table */}
                    <div className="hidden md:block">
                      {/* Table Headers */}
                      <div className={`grid grid-cols-12 gap-4 pb-3 border-b ${getTableClasses().header}`}>
                        <div className="col-span-5">
                          <span className={`text-sm font-medium ${getTextClasses().label}`}>PRODUCTO</span>
                        </div>
                        <div className="col-span-2">
                          <span className={`text-sm font-medium ${getTextClasses().label}`}>STOCK</span>
                        </div>
                        <div className="col-span-3">
                          <span className={`text-sm font-medium ${getTextClasses().label}`}>CATEGORÍA</span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className={`text-sm font-medium ${getTextClasses().label}`}>ACCIONES</span>
                        </div>
                      </div>
                      
                      {/* Products List */}
                      <div className="space-y-0">
                        {products.map((product, index) => {
                          const category = categories.find(cat => cat.id === product.categoryId);
                          const stockLevel = product.stock >= 6 ? 'high' : 'low';
                          const stockColor = stockLevel === 'high' ? 'bg-green-100 text-green-800' : 
                                           'bg-red-100 text-red-800';
                          
                          return (
                            <div key={product.id} className={`grid grid-cols-12 gap-4 items-center py-4 ${index < products.length - 1 ? `border-b ${getTableClasses().row}` : ''}`}>
                              {/* Product Info */}
                              <div className="col-span-5 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {product.url && product.url.trim() !== '' ? (
                                    <img 
                                      src={product.url} 
                                      alt={product.name}
                                      className="w-8 h-8 rounded object-cover"
                                      onError={(e) => {
                                        // Si falla la imagen, mostrar fallback
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div 
                                    className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center"
                                    style={{ display: product.url && product.url.trim() !== '' ? 'none' : 'flex' }}
                                  >
                                    <span className="text-xs font-semibold text-white">
                                      {product.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className={`font-semibold ${getTextClasses().primary} truncate`}>{product.name}</h3>
                                  <p className={`text-xs ${getTextClasses().muted}`}>#{product.id.slice(-6).toUpperCase()}</p>
                                </div>
                              </div>
                              
                              {/* Stock */}
                              <div className="col-span-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockColor}`}>
                                  {product.stock} Unidades
                                </span>
                              </div>
                              
                              {/* Category */}
                              <div className="col-span-3">
                                <span className={`text-sm ${getTextClasses().secondary}`}>
                                  {category?.name || 'Sin categoría'}
                                </span>
                              </div>
                              
                              {/* Actions */}
                              <div className="col-span-2 flex items-center justify-end space-x-2">
                                      <EditProductDialog product={product} onSave={onUpdateProduct} />
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => showDeleteConfirm(() => onDeleteProduct(product.id))}
                                  className={getButtonClasses().danger}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        
                        {products.length === 0 && (
                          <div className={`text-center py-8 ${getTextClasses().muted}`}>
                            <p>No hay productos activos</p>
                          </div>
                        )}
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>
            
            </div>
          </div>
        );
      case 'perfumes':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className={`text-3xl font-bold ${getTextClasses().primary} mb-2`}>Gestionar Perfumes</h1>
              <p className={`text-lg ${getTextClasses().secondary}`}>Añade, visualiza y gestiona el inventario de tus perfumes.</p>
            </div>

            {/* Two Column Layout */}
            <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Panel - Add New Perfume */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary} flex items-center gap-2`}>
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    Añadir Perfume
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-6">
                  <form onSubmit={handleAddPerfume} className="space-y-4">
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label} flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Nombre del Perfume
                      </Label>
                      <Input 
                        name="name" 
                        placeholder="Ej. Chanel N°5" 
                        required 
                        className={`w-full h-12 text-lg ${getInputClasses()}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label} flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Stock Disponible
                      </Label>
                      <Input 
                        name="stock" 
                        type="number" 
                        placeholder="0" 
                        defaultValue="0"
                        required 
                        className={`w-full h-12 text-lg ${getInputClasses()}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Descripción</Label>
                      <Textarea 
                        name="description" 
                        placeholder="Describe las notas, la ocasión de uso, etc." 
                        required 
                        rows={6}
                        className={`w-full text-lg ${getInputClasses()} resize-none`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Imagen del Perfume</Label>
                      <DragDropUpload 
                        name="mediaFile" 
                        accept="image/*,video/*" 
                        required 
                        onFileSelect={(file) => handleMediaFilePreview(file, setPerfumePreview)}
                      />
                  <MediaPreview preview={perfumePreview} onRemove={() => setPerfumePreview(null)} />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="submit" 
                        className={`w-full sm:flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 sm:py-3 text-base sm:text-lg rounded-lg flex items-center justify-center space-x-2 h-12 sm:h-11`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span>Añadir Perfume</span>
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          const form = document.querySelector('form');
                          if (form) form.reset();
                          setPerfumePreview(null);
                        }}
                        className={`w-full sm:w-auto sm:px-6 py-4 sm:py-3 text-base sm:text-lg rounded-lg flex items-center justify-center space-x-2 border-pink-300 text-pink-600 hover:bg-pink-50 h-12 sm:h-11 ${theme === 'dark' ? 'border-pink-600 text-pink-400 hover:bg-pink-900/20' : ''}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Limpiar</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
                        </Card>

              {/* Right Panel - Perfume Inventory */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>Inventario de Perfumes</CardTitle>
                  <p className={`text-sm ${getTextClasses().secondary}`}>Lista de todos los perfumes disponibles.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {/* Table Headers */}
                    <div className={`grid grid-cols-12 gap-4 pb-3 border-b ${getTableClasses().header}`}>
                      <div className="col-span-6">
                        <span className={`text-sm font-medium ${getTextClasses().label}`}>PERFUME</span>
                </div>
                      <div className="col-span-3">
                        <span className={`text-sm font-medium ${getTextClasses().label}`}>STOCK</span>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className={`text-sm font-medium ${getTextClasses().label}`}>ACCIONES</span>
                      </div>
                    </div>
                    
                    {/* Perfumes List */}
                    <div className="space-y-0">
                      {perfumes.map((perfume, index) => {
                        // Lógica de colores igual que productos: verde ≥6, rojo ≤5
                        const stockLevel = perfume.stock >= 6 ? 'high' : 'low';
                        const stockColor = stockLevel === 'high' ? 'bg-green-100 text-green-800' : 
                                         'bg-red-100 text-red-800';
                        
                        return (
                          <div key={perfume.id} className={`grid grid-cols-12 gap-4 items-center py-4 ${index < perfumes.length - 1 ? `border-b ${getTableClasses().row}` : ''}`}>
                            {/* Perfume Info */}
                            <div className="col-span-6 flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {perfume.url && perfume.url.trim() !== '' ? (
                                  <img 
                                    src={perfume.url} 
                                    alt={perfume.name}
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallback = target.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className={`w-full h-full rounded flex items-center justify-center ${perfume.url && perfume.url.trim() !== '' ? 'hidden' : 'flex'}`}
                                  style={{ backgroundColor: '#ec4899' }}
                                >
                                  <span className="text-xs font-semibold text-white">
                                    {perfume.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold ${getTextClasses().primary} truncate`}>{perfume.name}</h3>
                                <p className={`text-xs ${getTextClasses().muted} truncate`}>{perfume.description}</p>
                              </div>
                            </div>
                            
                            {/* Stock */}
                            <div className="col-span-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockColor}`}>
                                {perfume.stock} Unidades
                              </span>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-3 flex items-center justify-end space-x-2">
                              <EditPerfumeDialog perfume={perfume} onSave={onUpdatePerfume} />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => showDeleteConfirm(() => onDeletePerfume(perfume.id))}
                                className={getButtonClasses().danger}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      
                      {perfumes.length === 0 && (
                        <div className={`text-center py-8 ${getTextClasses().muted}`}>
                          <p>No hay perfumes en el inventario</p>
                        </div>
                      )}
                    </div>
                </div>
              </CardContent>
            </Card>
            
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className={`text-3xl font-bold ${getTextClasses().primary} mb-2`}>Gestionar Mis Trabajos</h1>
              <p className={`text-lg ${getTextClasses().secondary}`}>Añade y administra tus proyectos creativos con facilidad.</p>
            </div>

            {/* Two Column Layout */}
            <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Panel - Add New Work */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary} flex items-center gap-2`}>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    Añadir Nuevo Trabajo
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-6">
                  <form onSubmit={handleAddGalleryItem} className="space-y-4">
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Título</Label>
                      <Input 
                        name="title" 
                        placeholder="Ej: Diseño de Landing Page" 
                        required 
                        className={`w-full ${getInputClasses()}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Descripción</Label>
                      <Textarea 
                        name="description" 
                        placeholder="Describe brevemente tu trabajo..." 
                        required 
                        rows={4}
                        className={`w-full ${getInputClasses()} resize-none`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Archivo del proyecto</Label>
                      <DragDropUpload 
                        name="mediaFile" 
                        accept="image/*,video/*" 
                        required 
                        onFileSelect={(file) => handleMediaFilePreview(file, setGalleryMediaPreview)}
                      />
                  <MediaPreview preview={galleryMediaPreview} onRemove={() => setGalleryMediaPreview(null)} />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-2.5 rounded-lg flex items-center justify-center space-x-2 h-12 sm:h-11 text-base sm:text-lg`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Añadir Trabajo</span>
                    </Button>
                </form>
                </CardContent>
              </Card>

              {/* Right Panel - My Works */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary} flex items-center gap-2`}>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                                </div>
                    Mis Trabajos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {/* Table Headers */}
                    <div className={`grid grid-cols-12 gap-4 pb-3 border-b ${getTableClasses().header}`}>
                      <div className="col-span-8">
                        <span className={`text-sm font-medium ${getTextClasses().label}`}>TRABAJO</span>
                      </div>
                      <div className="col-span-4 text-right">
                        <span className={`text-sm font-medium ${getTextClasses().label}`}>ACCIONES</span>
                      </div>
                    </div>
                    
                    {/* Works List */}
                    <div className="space-y-0">
                      {galleryItems.map((work, index) => {
                        return (
                          <div key={work.id} className={`grid grid-cols-12 gap-4 items-center py-4 ${index < galleryItems.length - 1 ? `border-b ${getTableClasses().row}` : ''}`}>
                            {/* Work Info */}
                            <div className="col-span-8 flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {work.url && work.url.trim() !== '' ? (
                                  work.type === 'video' ? (
                                    <video 
                                      src={work.url} 
                                      className="w-full h-full object-cover rounded"
                                      muted
                                      onError={(e) => {
                                        const target = e.target as HTMLVideoElement;
                                        target.style.display = 'none';
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                  ) : (
                                    <img 
                                      src={work.url} 
                                      alt={work.title}
                                      className="w-full h-full object-cover rounded"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                  )
                                ) : null}
                                <div 
                                  className={`w-full h-full rounded flex items-center justify-center ${work.url && work.url.trim() !== '' ? 'hidden' : 'flex'}`}
                                  style={{ backgroundColor: '#10b981' }}
                                >
                                  <span className="text-xs font-semibold text-white">
                                    {work.title.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold ${getTextClasses().primary} truncate`}>{work.title}</h3>
                                <p className={`text-xs ${getTextClasses().muted} truncate`}>{work.description}</p>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-4 flex items-center justify-end space-x-2">
                              <EditGalleryItemDialog item={work} onSave={onUpdateGalleryItem} />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => showDeleteConfirm(() => onDeleteGalleryItem(work.id))}
                                className={getButtonClasses().danger}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      
                      {galleryItems.length === 0 && (
                        <div className={`text-center py-8 ${getTextClasses().muted}`}>
                          <p>No hay trabajos en el inventario</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'testimonials':
            const pendingTestimonials = testimonials.filter(t => t.status === 'pending');
            const approvedTestimonials = testimonials.filter(t => t.status === 'approved');
            const rejectedTestimonials = testimonials.filter(t => t.status === 'rejected');
        
            return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className={`text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2`}>Gestionar Testimonios</h1>
              <p className={`text-lg ${getTextClasses().secondary}`}>Administra los testimonios de tus clientes de forma sencilla y eficiente.</p>
            </div>

            {/* Approved Section */}
            <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'} border ${theme === 'dark' ? 'border-green-800' : 'border-green-200'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-green-600 dark:text-green-400">• Aprobados</h2>
              </div>
              
              {approvedTestimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedTestimonials.map((testimonial) => (
                    <Card key={testimonial.id} className={`shadow-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <CardContent className="p-4 space-y-3">
                        <h3 className={`font-semibold ${getTextClasses().primary}`}>{testimonial.author}</h3>
                        <p className={`text-sm ${getTextClasses().secondary} italic`}>"{testimonial.text}"</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateTestimonial(testimonial.id, { ...testimonial, status: 'pending' })}
                          className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 h-10 sm:h-9 text-sm sm:text-base"
                        >
                          {
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                            </svg>
                          }
                          Desaprobar
                        </Button>
                    </CardContent>
                </Card>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${getTextClasses().muted}`}>No hay testimonios aprobados</p>
              )}
            </div>

            {/* Pending Section */}
            <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'} border ${theme === 'dark' ? 'border-yellow-800' : 'border-yellow-200'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{pendingTestimonials.length}</span>
                </div>
                <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{pendingTestimonials.length} Pendientes</h2>
              </div>
              
              {pendingTestimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingTestimonials.map((testimonial) => (
                    <Card key={testimonial.id} className={`shadow-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <CardContent className="p-4 space-y-3">
                        <h3 className={`font-semibold ${getTextClasses().primary}`}>{testimonial.author}</h3>
                        <p className={`text-sm ${getTextClasses().secondary} italic`}>"{testimonial.text}"</p>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateTestimonial(testimonial.id, { ...testimonial, status: 'approved' })}
                            className="w-full border-green-300 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 h-10 text-sm"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V5a2 2 0 012-2h2.343M11 5.882l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 7l3 3" />
                            </svg>
                            Aprobar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateTestimonial(testimonial.id, { ...testimonial, status: 'rejected' })}
                            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 h-10 text-sm"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                            </svg>
                            Desaprobar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${getTextClasses().muted}`}>No hay testimonios pendientes</p>
              )}
            </div>

            {/* Rejected Section */}
            <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-800' : 'border-red-200'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">• Desaprobados</h2>
              </div>
              
              {rejectedTestimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rejectedTestimonials.map((testimonial) => (
                    <Card key={testimonial.id} className={`shadow-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <CardContent className="p-4 space-y-3">
                        <h3 className={`font-semibold ${getTextClasses().primary}`}>{testimonial.author}</h3>
                        <p className={`text-sm ${getTextClasses().secondary} italic`}>"{testimonial.text}"</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => showDeleteConfirm(() => handleDeleteTestimonial(testimonial.id))}
                          className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-900/20"
                        >
                          {
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          }
                          Eliminar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${getTextClasses().muted}`}>No hay testimonios desaprobados</p>
              )}
            </div>
            
          </div>
            );
      case 'users':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className={`text-3xl font-bold ${getTextClasses().primary} mb-2`}>Panel de Gestión de Usuarios</h1>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Add New User */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>Añadir Nuevo Usuario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Nombre de usuario</Label>
                      <Input 
                        name="name" 
                        placeholder="p. ej. juan.perez" 
                        required 
                        defaultValue={currentUserToEdit?.name || ''}
                        className={`w-full ${getInputClasses()}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${getTextClasses().label}`}>Correo</Label>
                      <Input 
                        name="email" 
                        type="email" 
                        placeholder="nombre@compania.com" 
                        required 
                        defaultValue={currentUserToEdit?.email || ''}
                        className={`w-full ${getInputClasses()}`}
                      />
                    </div>
                    
                    {isEditingUser && (
                      <div className="space-y-2">
                        <Label className={`text-sm font-medium ${getTextClasses().label}`}>Nueva Contraseña</Label>
                        <Input 
                          name="password" 
                          type="password" 
                          placeholder="Dejar vacío para mantener la actual" 
                          className={`w-full ${getInputClasses()}`}
                        />
                        <p className={`text-xs ${getTextClasses().muted}`}>Deja este campo vacío si no quieres cambiar la contraseña</p>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="submit" 
                        className={`w-full sm:flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 sm:py-2.5 rounded-lg flex items-center justify-center space-x-2 h-12 sm:h-11 text-base sm:text-lg`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{isEditingUser ? 'Guardar Cambios' : 'Añadir Usuario'}</span>
                      </Button>
                      {isEditingUser && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setIsEditingUser(false);
                            setCurrentUserToEdit(null);
                            const form = document.querySelector('form');
                            if (form) form.reset();
                          }}
                          className={`w-full sm:w-auto sm:px-6 py-3 text-base sm:text-lg rounded-lg flex items-center justify-center space-x-2 h-12 sm:h-11 border-teal-300 text-teal-600 hover:bg-teal-50 ${theme === 'dark' ? 'border-teal-600 text-teal-400 hover:bg-teal-900/20' : ''}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Cancelar</span>
                        </Button>
                      )}
                    </div>
                    </form>
                </CardContent>
              </Card>

              {/* Right Panel - Existing Users */}
              <Card className={`shadow-lg ${getCardClasses()}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold ${getTextClasses().primary}`}>Usuarios Existentes</CardTitle>
            </CardHeader>
            <CardContent>
                  {/* Headers */}
                  <div className={`grid grid-cols-12 gap-4 p-4 rounded-lg border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'} mb-4`}>
                    <div className="col-span-1">
                      <span className={`text-sm font-semibold ${getTextClasses().label}`}>Avatar</span>
                    </div>
                    <div className="col-span-4 pl-4 sm:pl-6">
                      <span className={`text-sm font-semibold ${getTextClasses().label}`}>Nombre</span>
                    </div>
                    <div className="col-span-4">
                      <span className={`text-sm font-semibold ${getTextClasses().label}`}>Email</span>
                    </div>
                    <div className="col-span-3">
                      <span className={`text-sm font-semibold ${getTextClasses().label}`}>Acciones</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {users.map((user, index) => (
                      <div key={user.id} className={`grid grid-cols-12 gap-4 p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} shadow-sm hover:${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'} transition-colors`}>
                        {/* Avatar Column */}
                        <div className="col-span-1 flex items-center">
                          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Name Column */}
                        <div className="col-span-4 flex items-center pl-4 sm:pl-6">
                          <h3 className={`font-semibold ${getTextClasses().primary} truncate`}>{user.name}</h3>
                        </div>
                        
                        {/* Email Column */}
                        <div className="col-span-4 flex items-center">
                          <p className={`text-sm ${getTextClasses().secondary} truncate`}>{user.email}</p>
                        </div>
                        
                        {/* Actions Column */}
                        <div className="col-span-3 flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => { 
                                setIsEditingUser(true); 
                                setCurrentUserToEdit(user); 
                              }} 
                              disabled={user.id !== loggedInUser.id}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            
                        <Dialog open={openPasswordDialog && currentUserForPasswordChange?.id === user.id} onOpenChange={(isOpen) => { if (!isOpen) setCurrentUserForPasswordChange(null); setOpenPasswordDialog(isOpen); }}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => { setCurrentUserForPasswordChange(user); setOpenPasswordDialog(true); }} 
                                  disabled={user.id !== loggedInUser.id}
                                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/20"
                                >
                                  <KeyRound className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Cambiar Contraseña para {user.name}</DialogTitle>
                                <DialogDescription>Introduce la nueva contraseña para el usuario.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                  <Input name="newPassword" type="password" required placeholder="Nueva Contraseña" className={getInputClasses()}/>
                              <DialogFooter><Button type="button" onClick={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget.closest('form');
                                if (form) {
                                  handleChangePassword(e as any);
                                }
                              }} className="h-12 w-full sm:w-auto sm:px-8">Actualizar</Button></DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={user.id === loggedInUser.id} 
                              onClick={() => showDeleteConfirm(() => handleDeleteUser(user.id))}
                              className={getButtonClasses().danger}
                            >
                              <Trash2 className="w-4 h-4" />
                        </Button>
                        </div>
                      </div>
                    ))}
                    
                    {users.length === 0 && (
                      <div className={`text-center py-8 ${getTextClasses().muted}`}>
                        <p>No hay usuarios registrados</p>
                      </div>
                    )}
                  </div>
            </CardContent>
          </Card>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                  </svg>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300">Admin User</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Total de Productos */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Total de Productos</p>
                    <p className="text-3xl font-bold text-white">1,250</p>
                    <p className="text-sm text-green-500 mt-1">+15% vs mes anterior</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total de Perfumes */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Total de Perfumes</p>
                    <p className="text-3xl font-bold text-white">320</p>
                    <p className="text-sm text-red-500 mt-1">-5% vs mes anterior</p>
                  </div>
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Ventas del Mes */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Ventas del Mes</p>
                    <p className="text-3xl font-bold text-white">$5,820</p>
                    <p className="text-sm text-green-500 mt-1">+20% vs mes anterior</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Nuevos Clientes */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Nuevos Clientes</p>
                    <p className="text-3xl font-bold text-white">45</p>
                    <p className="text-sm text-green-500 mt-1">+10% vs mes anterior</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stock Bajo */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Stock Bajo</p>
                    <p className="text-3xl font-bold text-white">12</p>
                    <p className="text-xs text-gray-400 mt-1">Productos con &lt; 5 unidades</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ventas Mensuales */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Ventas Mensuales</h3>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-32 h-32 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg text-gray-300">Gráfico de Ventas</p>
                    <p className="text-sm text-gray-500">Los datos se mostrarán aquí</p>
                  </div>
                </div>
              </div>

              {/* Distribución de Productos */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Distribución de Productos</h3>
                <div className="h-80 flex flex-col items-center justify-center">
                  {/* Donut Chart */}
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Perfumes - Pink */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="8"
                        strokeDasharray={`${Math.round((320/1570) * 251.2 * 100) / 100} 251.2`}
                        strokeDashoffset="0"
                      />
                      {/* Maquillaje - Gray */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="8"
                        strokeDasharray={`${Math.round((850/1570) * 251.2 * 100) / 100} 251.2`}
                        strokeDashoffset={`-${Math.round((320/1570) * 251.2 * 100) / 100}`}
                      />
                      {/* Cuidado Piel - Blue */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={`${Math.round((400/1570) * 251.2 * 100) / 100} 251.2`}
                        strokeDashoffset={`-${Math.round(((320+850)/1570) * 251.2 * 100) / 100}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">1,570</span>
                      <span className="text-sm text-gray-400">Total</span>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Perfumes: 320</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Maquillaje: 850</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Cuidado Piel: 400</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ai-content':
        return <AIContentGenerator />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-6">{renderContent()}</div>
    </>
  );
}
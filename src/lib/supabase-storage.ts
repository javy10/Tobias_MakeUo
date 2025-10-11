// src/lib/supabase-storage.ts
// Funciones para manejar archivos en Supabase Storage

import { supabase } from './supabase';

/**
 * Sube un archivo a Supabase Storage
 * @param file - Archivo a subir
 * @param bucket - Nombre del bucket (ej: 'courses', 'products')
 * @param path - Ruta donde se guardará el archivo (ej: 'curso-123/imagen.jpg')
 * @returns URL pública del archivo subido
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string
): Promise<string> => {
  try {
    // Subir el archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true, // Sobrescribir si ya existe
      });

    if (error) {
      console.error('Error al subir archivo:', error);
      throw new Error(`No se pudo subir el archivo: ${error.message}`);
    }

    // Obtener la URL pública del archivo
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    console.log('Archivo subido exitosamente:', publicData.publicUrl);
    return publicData.publicUrl;
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw new Error('No se pudo subir el archivo a Supabase Storage');
  }
};

/**
 * Elimina un archivo de Supabase Storage
 * @param bucket - Nombre del bucket
 * @param path - Ruta del archivo a eliminar
 */
export const deleteFile = async (bucket: string, path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Error al eliminar archivo:', error);
      // No lanzamos error para no bloquear la eliminación del registro
    } else {
      console.log('Archivo eliminado exitosamente');
    }
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    // No lanzamos error para no bloquear la eliminación del registro
  }
};

/**
 * Extrae la ruta del archivo desde una URL de Supabase
 * @param fileURL - URL completa del archivo
 * @param bucket - Nombre del bucket
 * @returns Ruta del archivo
 */
export const extractPathFromURL = (fileURL: string, bucket: string): string => {
  try {
    // Formato de URL de Supabase: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = fileURL.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length > 1) {
      return urlParts[1];
    }
    return '';
  } catch (error) {
    console.error('Error al extraer ruta de URL:', error);
    return '';
  }
};

/**
 * Genera un nombre único para el archivo
 * @param originalName - Nombre original del archivo
 * @returns Nombre único con timestamp
 */
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExtension = originalName.replace(`.${extension}`, '');
  const sanitizedName = nameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '_');

  return `${sanitizedName}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Determina el tipo de archivo (imagen o video)
 * @param file - Archivo a analizar
 * @returns 'image' o 'video'
 */
export const getFileType = (file: File): 'image' | 'video' => {
  return file.type.startsWith('image/') ? 'image' : 'video';
};

/**
 * Obtiene el nombre del bucket según el tipo de colección
 * @param collectionName - Nombre de la colección
 * @returns Nombre del bucket
 */
export const getBucketName = (collectionName: string): string => {
  // Mapeo de nombres de colecciones a buckets
  const bucketMap: Record<string, string> = {
    courses: 'courses',
    services: 'services',
    products: 'products',
    perfumes: 'perfumes',
    galleryItems: 'gallery',
    gallery_items: 'gallery',
    heroContent: 'hero',
    hero_content: 'hero',
    aboutMeContent: 'about',
    about_me_content: 'about',
  };

  return bucketMap[collectionName] || collectionName;
};

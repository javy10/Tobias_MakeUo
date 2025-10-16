// src/lib/supabase-db.ts
// Funciones para manejar datos en Supabase Database

import { supabase } from './supabase';
import {
  uploadFile,
  deleteFile,
  extractPathFromURL,
  generateUniqueFileName,
  getFileType,
  getBucketName,
} from './supabase-storage';
import { showDatabaseError, showNetworkError } from './error-alerts';

/**
 * Obtiene todos los documentos de una tabla
 * @param tableName - Nombre de la tabla
 * @returns Array de documentos
 */
export const getAllItems = async <T>(tableName: string): Promise<T[]> => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn(`⚠️ Variables de entorno de Supabase no configuradas. Usando datos iniciales para ${tableName}.`);
      return [];
    }

    // Crear promesa con timeout
    const queryPromise = supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout de consulta')), 15000) // 15 segundos
    );

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

    if (error) {
      console.error(`❌ Error al obtener items de ${tableName}:`, error);
      
      // Manejar errores específicos de conexión
      if (error.message?.includes('Failed to fetch') || 
          error.message?.includes('NetworkError') ||
          error.message?.includes('Timeout')) {
        console.error('🌐 Error de red o timeout detectado.');
        return [];
      }
      
      // No mostrar error al usuario durante la carga inicial
      return [];
    }

    console.log(`✅ Obtenidos ${data?.length || 0} items de ${tableName}`);
    const camelCaseData = data?.map(item => convertToCamelCase(item)) || [];
    return (camelCaseData as T[]) || [];
  } catch (error) {
    console.error(
      `❌ Error al obtener items de ${tableName}:`,
      error instanceof Error ? error.message : 'Error desconocido'
    );
    // No mostrar error al usuario durante la carga inicial
    return [];
  }
};

/**
 * Obtiene un documento específico por ID
 * @param tableName - Nombre de la tabla
 * @param id - ID del documento
 * @returns Documento o null si no existe
 */
export const getItemById = async <T>(
  tableName: string,
  id: string
): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Si el error es porque no se encontró el recurso, no es un error real
      if (error.code !== 'PGRST116') {
        console.error(`Error al obtener documento ${id} de ${tableName}:`, error);
      }
      return null;
    }

    return convertToCamelCase(data) as T;
  } catch (error) {
    console.error(`Error al obtener documento ${id} de ${tableName}:`, error);
    showDatabaseError(error, `Obtener documento ${id} de ${tableName}`);
    return null;
  }
};

/**
 * Guarda o actualiza un documento en Supabase usando `upsert`
 * @param tableName - Nombre de la tabla
 * @param item - Datos del documento
 * @param id - ID del documento (opcional)
 * @param includeUpdatedAt - Si incluir el campo updated_at (por defecto true)
 * @returns ID del documento guardado
 */
export const saveItem = async <T extends Record<string, any>>(
  tableName: string,
  item: T,
  id?: string,
  includeUpdatedAt: boolean = true
): Promise<string> => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Variables de entorno de Supabase no configuradas');
    }

    const documentId = id || item.id || crypto.randomUUID();

    // Preparar los datos (eliminar el campo 'file' si existe)
    const { file, ...dataToSave } = item;

    // Convertir nombres de campos de camelCase a snake_case para Supabase
    const snakeCaseData = convertToSnakeCase(dataToSave);

    // Preparar los datos para upsert
    const upsertData: any = {
      id: documentId,
      ...snakeCaseData,
    };

    // Solo agregar updated_at si se especifica y la tabla lo soporta
    if (includeUpdatedAt) {
      upsertData.updated_at = new Date().toISOString();
    }

    // Usar upsert para insertar o actualizar
    const { error } = await supabase.from(tableName).upsert(
      upsertData,
      { onConflict: 'id' }
    );

    if (error) {
      console.error(`Error al guardar (upsert) documento en ${tableName}:`, error);
      throw new Error(`No se pudo guardar el documento: ${error.message}`);
    }

    console.log(`Documento guardado en ${tableName} con ID: ${documentId}`);
    return documentId;
  } catch (error) {
    console.error(`Error al guardar documento en ${tableName}:`, error);
    throw new Error('No se pudo guardar el documento en Supabase');
  }
};

/**
 * Función específica para guardar categorías (sin updated_at)
 * @param item - Datos de la categoría
 * @param id - ID de la categoría (opcional)
 * @returns ID de la categoría guardada
 */
export const saveCategory = async (
  item: { name: string; id?: string },
  id?: string
): Promise<string> => {
  return saveItem('categories', item, id, false);
};

/**
 * Función específica para guardar usuarios (sin updated_at)
 * @param item - Datos del usuario
 * @param id - ID del usuario (opcional)
 * @returns ID del usuario guardado
 */
export const saveUser = async (
  item: { name: string; email: string; password: string; id?: string },
  id?: string
): Promise<string> => {
  return saveItem('users', item, id, false);
};

/**
 * Elimina un documento de Supabase
 * @param tableName - Nombre de la tabla
 * @param id - ID del documento a eliminar
 */
export const deleteItem = async (tableName: string, id: string): Promise<void> => {
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id);

    if (error) {
      console.error(`Error al eliminar documento ${id} de ${tableName}:`, error);
      throw new Error(`No se pudo eliminar el documento: ${error.message}`);
    }

    console.log(`Documento ${id} eliminado de ${tableName}`);
  } catch (error) {
    console.error(`Error al eliminar documento ${id} de ${tableName}:`, error);
    throw new Error('No se pudo eliminar el documento de Supabase');
  }
};

/**
 * Agrega un nuevo item con archivo (imagen o video)
 * @param tableName - Nombre de la tabla
 * @param itemData - Datos del item
 * @param mediaFile - Archivo a subir
 * @param itemId - ID del item (opcional)
 * @returns Item completo con URL del archivo
 */
export const addItemWithFile = async <T extends Record<string, any>>(
  tableName: string,
  itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
  mediaFile: File,
  itemId?: string
): Promise<T> => {
  try {
    const id = itemId || crypto.randomUUID();
    const bucket = getBucketName(tableName);

    // Generar nombre único para el archivo
    const uniqueFileName = generateUniqueFileName(mediaFile.name);
    const filePath = `${id}/${uniqueFileName}`;

    // Subir archivo a Storage
    const fileURL = await uploadFile(mediaFile, bucket, filePath);

    // Determinar tipo de archivo
    const fileType = getFileType(mediaFile);

    // Crear el item completo
    const newItem = {
      ...itemData,
      id,
      url: fileURL,
      type: fileType,
    } as unknown as T;

    // Guardar en Database
    await saveItem(tableName, newItem, id);

    console.log(`Item con archivo agregado a ${tableName}`);
    return newItem;
  } catch (error) {
    console.error(`Error al agregar item con archivo a ${tableName}:`, error);
    throw new Error('No se pudo agregar el item con archivo');
  }
};

/**
 * Actualiza un item, opcionalmente con un nuevo archivo
 * @param tableName - Nombre de la tabla
 * @param id - ID del item a actualizar
 * @param itemData - Datos actualizados del item
 * @param newMediaFile - Nuevo archivo (opcional)
 * @returns Item actualizado
 */
export const updateItemWithFile = async <T extends Record<string, any>>(
  tableName: string,
  id: string,
  itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
  newMediaFile?: File
): Promise<T> => {
  try {
    // Obtener el item actual
    const currentItem = await getItemById<T>(tableName, id);
    if (!currentItem) {
      throw new Error(`Item ${id} no encontrado en ${tableName}`);
    }

    let updatedItem = { ...currentItem, ...itemData };
    let oldFileUrl: string | undefined;

    // Si hay un nuevo archivo, prepararlo para la subida
    if (newMediaFile) {
      const bucket = getBucketName(tableName);
      oldFileUrl = currentItem.url; // Guardar la URL del archivo antiguo

      // Subir el nuevo archivo
      const uniqueFileName = generateUniqueFileName(newMediaFile.name);
      const filePath = `${id}/${uniqueFileName}`;
      const fileURL = await uploadFile(newMediaFile, bucket, filePath);
      const fileType = getFileType(newMediaFile);

      updatedItem = {
        ...updatedItem,
        url: fileURL,
        type: fileType,
      };
    }

    // 1. Actualizar en Database PRIMERO
    await saveItem(tableName, updatedItem, id);

    // 2. Si la actualización fue exitosa y había un archivo antiguo, eliminarlo
    if (newMediaFile && oldFileUrl) {
      try {
        const bucket = getBucketName(tableName);
        const oldPath = extractPathFromURL(oldFileUrl, bucket);
        if (oldPath) {
          await deleteFile(bucket, oldPath);
        }
      } catch (error) {
        console.warn('No se pudo eliminar el archivo anterior:', error);
      }
    }

    console.log(`Item ${id} actualizado en ${tableName}`);
    return updatedItem as T;
  } catch (error) {
    console.error(`Error al actualizar item ${id} en ${tableName}:`, error);
    throw new Error('No se pudo actualizar el item');
  }
};

/**
 * Elimina un item y su archivo asociado
 * @param tableName - Nombre de la tabla
 * @param id - ID del item a eliminar
 */
export const deleteItemWithFile = async (
  tableName: string,
  id: string
): Promise<void> => {
  try {
    // Obtener el item para obtener la URL del archivo
    const item = await getItemById<any>(tableName, id);

    // Eliminar el archivo de Storage si existe
    if (item && item.url) {
      try {
        const bucket = getBucketName(tableName);
        const path = extractPathFromURL(item.url, bucket);
        if (path) {
          await deleteFile(bucket, path);
        }
      } catch (error) {
        console.warn('No se pudo eliminar el archivo:', error);
      }
    }

    // Eliminar el documento de Database
    await deleteItem(tableName, id);

    console.log(`Item ${id} y su archivo eliminados de ${tableName}`);
  } catch (error) {
    console.error(`Error al eliminar item ${id} de ${tableName}:`, error);
    throw new Error('No se pudo eliminar el item');
  }
};

/**
 * Convierte un objeto de camelCase a snake_case
 * @param obj - Objeto a convertir
 * @returns Objeto convertido
 */
export function convertToSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = obj[key];
    }
  }

  return result;
}

/**
 * Convierte un objeto de snake_case a camelCase
 * @param obj - Objeto a convertir
 * @returns Objeto convertido
 */
export function convertToCamelCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  }

  return result;
}


// src/lib/realtime-sync.ts
// Sistema de sincronización en tiempo real que combina actualizaciones optimistas con Supabase Realtime

import { supabase } from './supabase';
import {
  uploadFile,
  deleteFile,
  extractPathFromURL,
  generateUniqueFileName,
  getFileType,
  getBucketName,
} from './supabase-storage';

/**
 * Agrega un item con sincronización en tiempo real
 * Actualiza el estado local inmediatamente Y dispara eventos de Supabase
 */
export const addItemWithRealtimeSync = async <T extends Record<string, any>>(
  tableName: string,
  itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
  mediaFile: File,
  itemId?: string
): Promise<T> => {
  const id = itemId || crypto.randomUUID();
  const bucket = getBucketName(tableName);
  
  // Generar nombre único para el archivo
  const uniqueFileName = generateUniqueFileName(mediaFile.name);
  const filePath = `${id}/${uniqueFileName}`;

  // Subir archivo
  const fileURL = await uploadFile(mediaFile, bucket, filePath);
  const fileType = getFileType(mediaFile);

  // Crear el item completo
  const newItem = {
    ...itemData,
    id,
    url: fileURL,
    type: fileType,
  } as unknown as T;

  // Guardar en Database (esto disparará eventos de Supabase Realtime)
  const { file, ...dataToSave } = newItem;
  const snakeCaseData = convertToSnakeCase(dataToSave);
  
  const upsertData = {
    id,
    ...snakeCaseData,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(tableName).upsert(upsertData, { onConflict: 'id' });

  if (error) {
    console.error(`Error al guardar item en ${tableName}:`, error);
    throw new Error(`No se pudo guardar el item: ${error.message}`);
  }

  console.log(`✅ Item ${id} guardado en ${tableName} y sincronizado en tiempo real`);
  return newItem;
};

/**
 * Actualiza un item con sincronización en tiempo real
 */
export const updateItemWithRealtimeSync = async <T extends Record<string, any>>(
  tableName: string,
  id: string,
  itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
  newMediaFile?: File,
  currentItem?: T
): Promise<T> => {
  let updatedItem = { ...currentItem, ...itemData } as T;

  // Si hay un nuevo archivo, manejarlo
  if (newMediaFile) {
    const bucket = getBucketName(tableName);
    const uniqueFileName = generateUniqueFileName(newMediaFile.name);
    const filePath = `${id}/${uniqueFileName}`;

    // Subir el nuevo archivo
    const fileURL = await uploadFile(newMediaFile, bucket, filePath);
    const fileType = getFileType(newMediaFile);

    updatedItem = {
      ...updatedItem,
      url: fileURL,
      type: fileType,
    } as T;

    // Eliminar archivo anterior en background
    if (currentItem?.url) {
      try {
        const oldPath = extractPathFromURL(currentItem.url, bucket);
        if (oldPath) {
          await deleteFile(bucket, oldPath);
        }
      } catch (error) {
        console.warn('No se pudo eliminar el archivo anterior:', error);
      }
    }
  }

  // Actualizar en Database (esto disparará eventos de Supabase Realtime)
  const { file, ...dataToSave } = updatedItem;
  const snakeCaseData = convertToSnakeCase(dataToSave);
  
  const upsertData = {
    id,
    ...snakeCaseData,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(tableName).upsert(upsertData, { onConflict: 'id' });

  if (error) {
    console.error(`Error al actualizar item ${id} en ${tableName}:`, error);
    throw new Error(`No se pudo actualizar el item: ${error.message}`);
  }

  console.log(`✅ Item ${id} actualizado en ${tableName} y sincronizado en tiempo real`);
  return updatedItem;
};

/**
 * Elimina un item con sincronización en tiempo real
 */
export const deleteItemWithRealtimeSync = async (
  tableName: string,
  id: string,
  currentItem?: any
): Promise<void> => {
  // Eliminar archivo en background si existe
  if (currentItem?.url) {
    try {
      const bucket = getBucketName(tableName);
      const path = extractPathFromURL(currentItem.url, bucket);
      if (path) {
        await deleteFile(bucket, path);
      }
    } catch (error) {
      console.warn('No se pudo eliminar el archivo:', error);
    }
  }

  // Eliminar de Database (esto disparará eventos de Supabase Realtime)
  const { error } = await supabase.from(tableName).delete().eq('id', id);

  if (error) {
    console.error(`Error al eliminar item ${id} de ${tableName}:`, error);
    throw new Error(`No se pudo eliminar el item: ${error.message}`);
  }

  console.log(`✅ Item ${id} eliminado de ${tableName} y sincronizado en tiempo real`);
};

/**
 * Actualiza contenido singleton con sincronización en tiempo real
 */
export const updateSingletonWithRealtimeSync = async <T extends Record<string, any>>(
  tableName: string,
  itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
  mediaFile?: File,
  currentItem?: T
): Promise<T> => {
  const id = 'singleton';
  let updatedItem = { ...currentItem, ...itemData } as T;

  // Si hay un nuevo archivo, manejarlo
  if (mediaFile) {
    const bucket = getBucketName(tableName);
    const uniqueFileName = generateUniqueFileName(mediaFile.name);
    const filePath = `${id}/${uniqueFileName}`;

    const fileURL = await uploadFile(mediaFile, bucket, filePath);
    const fileType = getFileType(mediaFile);

    updatedItem = {
      ...updatedItem,
      url: fileURL,
      type: fileType,
    } as T;

    // Eliminar archivo anterior en background
    if (currentItem?.url) {
      try {
        const oldPath = extractPathFromURL(currentItem.url, bucket);
        if (oldPath) {
          await deleteFile(bucket, oldPath);
        }
      } catch (error) {
        console.warn('No se pudo eliminar el archivo anterior:', error);
      }
    }
  }

  // Actualizar en Database (esto disparará eventos de Supabase Realtime)
  const { file, ...dataToSave } = updatedItem;
  const snakeCaseData = convertToSnakeCase(dataToSave);
  
  const upsertData = {
    id,
    ...snakeCaseData,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(tableName).upsert(upsertData, { onConflict: 'id' });

  if (error) {
    console.error(`Error al actualizar singleton en ${tableName}:`, error);
    throw new Error(`No se pudo actualizar el contenido: ${error.message}`);
  }

  console.log(`✅ Singleton actualizado en ${tableName} y sincronizado en tiempo real`);
  return updatedItem;
};

/**
 * Convierte un objeto de camelCase a snake_case
 */
function convertToSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = obj[key];
    }
  }

  return result;
}





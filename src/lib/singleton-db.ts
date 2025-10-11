// src/lib/singleton-db.ts
// Funciones específicas para manejar singletons en Supabase

import { supabase } from './supabase';
import { getBucketName, uploadFile, deleteFile, extractPathFromURL, generateUniqueFileName, getFileType } from './supabase-storage';
import { convertToSnakeCase, convertToCamelCase } from './supabase-db';

/**
 * Función específica para manejar singletons (hero_content, about_me_content)
 * Crea el registro si no existe, o lo actualiza si ya existe
 */
export const upsertSingletonItem = async <T extends Record<string, any>>(
  tableName: string,
  id: string,
  itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
  newMediaFile?: File
): Promise<T> => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Variables de entorno de Supabase no configuradas');
    }

    console.log(`🔄 Iniciando upsert para ${tableName} con ID: ${id}`);
    
    // Intentar obtener el item actual
    const { data: currentData, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    let currentItem = fetchError?.code === 'PGRST116' ? null : currentData;
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.warn(`⚠️ Error al obtener item actual de ${tableName}:`, fetchError);
    }
    
    let updatedItem: any = {
      id,
      ...itemData,
    };

    // Si hay un nuevo archivo, prepararlo para la subida
    if (newMediaFile) {
      const bucket = getBucketName(tableName);
      const oldFileUrl = currentItem?.url; // Guardar la URL del archivo antiguo si existe

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

      // Si había un archivo anterior, eliminarlo después de subir el nuevo
      if (oldFileUrl) {
        try {
          const oldPath = extractPathFromURL(oldFileUrl, bucket);
          if (oldPath) {
            await deleteFile(bucket, oldPath);
          }
        } catch (error) {
          console.warn('No se pudo eliminar el archivo anterior:', error);
        }
      }
    } else if (currentItem) {
      // Si no hay nuevo archivo pero existe el item, mantener el archivo actual
      updatedItem = {
        ...updatedItem,
        url: currentItem.url,
        type: currentItem.type,
      };
    }

    // Usar upsert para crear o actualizar
    const snakeCaseData = convertToSnakeCase(updatedItem);
    const { data, error } = await supabase
      .from(tableName)
      .upsert(snakeCaseData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error al hacer upsert en ${tableName}:`, error);
      throw new Error(`No se pudo guardar el documento en ${tableName}: ${error.message}`);
    }

    const result = convertToCamelCase(data);
    console.log(`✅ Singleton ${id} upserted exitosamente en ${tableName}`);
    return result as T;
  } catch (error) {
    console.error(`❌ Error al hacer upsert del singleton ${id} en ${tableName}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`No se pudo guardar el documento en ${tableName}: ${error}`);
  }
};


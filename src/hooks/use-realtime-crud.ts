// src/hooks/use-realtime-crud.ts
// Hook que combina actualizaciones optimistas con sincronización en tiempo real

import { useCallback } from 'react';
import { 
  addItemWithFastRealtimeSync, 
  updateItemWithFastRealtimeSync, 
  deleteItemWithRealtimeSync,
  updateSingletonWithRealtimeSync
} from '@/lib/fast-realtime-sync';
import { showSuccessAlert, showErrorAlert } from '@/lib/alerts';
import { optimizeFile } from '@/lib/file-optimization';

interface UseRealtimeCrudOptions<T> {
  tableName: string;
  setState: React.Dispatch<React.SetStateAction<T[]>>;
  currentItems: T[];
  silent?: boolean; // Opción para silenciar mensajes automáticos
}

interface UseRealtimeSingletonOptions<T> {
  tableName: string;
  setState: React.Dispatch<React.SetStateAction<T>>;
  currentItem: T;
}

export function useRealtimeCrud<T extends Record<string, any>>({
  tableName,
  setState,
  currentItems,
  silent = false
}: UseRealtimeCrudOptions<T>) {

  const addItem = useCallback(async (
    itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
    mediaFile: File
  ): Promise<boolean> => {
    try {
      // Operación real con sincronización en tiempo real (sin actualización optimista)
      const newItem = await addItemWithFastRealtimeSync<T>(tableName, itemData, mediaFile);
      
      // Agregar a la lista solo después de confirmar que se guardó correctamente
      setState(prev => [...prev, newItem]);

      if (!silent) {
        showSuccessAlert(
          'Elemento agregado', 
          `El nuevo ${tableName.slice(0, -1)} se ha guardado y sincronizado correctamente.`
        );
      }
      
      return true;
    } catch (error) {
      console.error(`Error adding ${tableName.slice(0, -1)}:`, error);
      
      if (!silent) {
        showErrorAlert(
          'Error al agregar', 
          `No se pudo agregar el ${tableName.slice(0, -1)}.`
        );
      }
      return false;
    }
  }, [tableName, setState]);

  const updateItem = useCallback(async (
    id: string,
    itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
    newMediaFile?: File
  ): Promise<void> => {
    try {
      const currentItem = currentItems.find(item => item.id === id);
      if (!currentItem) {
        throw new Error('Item no encontrado');
      }

      let tempPreview: string | null = null;

      // Actualización optimista: mostrar preview temporal si hay nuevo archivo
      const optimisticUpdate = {
        ...currentItem,
        ...itemData,
        ...(newMediaFile && {
          url: (() => {
            tempPreview = URL.createObjectURL(newMediaFile);
            return tempPreview;
          })(),
          type: newMediaFile.type.startsWith('image/') ? 'image' : 'video',
        })
      };

      setState(prev => prev.map(item => 
        item.id === id ? optimisticUpdate : item
      ));

      // Operación real con sincronización en tiempo real
      const updatedItem = await updateItemWithFastRealtimeSync<T>(
        tableName, 
        id, 
        itemData, 
        newMediaFile, 
        currentItem
      );

      // Actualizar con el item real (esto se sincronizará automáticamente con otras pestañas)
      setState(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));

      // Limpiar el preview temporal
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview);
      }

      if (!silent) {
        showSuccessAlert(
          'Elemento actualizado', 
          `Los datos del ${tableName.slice(0, -1)} se han actualizado y sincronizado correctamente.`
        );
      }
    } catch (error) {
      console.error(`Error updating ${tableName.slice(0, -1)}:`, error);
      
      // Revertir cambios en caso de error
      setState(prev => prev.map(item => 
        item.id === id ? currentItem : item
      ));
      
      if (!silent) {
        showErrorAlert(
          'Error al actualizar', 
          `No se pudo actualizar el ${tableName.slice(0, -1)}.`
        );
      }
    }
  }, [tableName, setState, currentItems]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    try {
      const currentItem = currentItems.find(item => item.id === id);
      if (!currentItem) {
        throw new Error('Item no encontrado');
      }

      // Actualización optimista: eliminar inmediatamente
      setState(prev => prev.filter(item => item.id !== id));

      // Operación real con sincronización en tiempo real
      await deleteItemWithRealtimeSync(tableName, id, currentItem);

      if (!silent) {
        showSuccessAlert(
          'Elemento eliminado', 
          `El ${tableName.slice(0, -1)} ha sido eliminado y sincronizado correctamente.`
        );
      }
    } catch (error) {
      console.error(`Error deleting ${tableName.slice(0, -1)}:`, error);
      
      // Revertir cambios en caso de error
      if (currentItem) {
        setState(prev => [...prev, currentItem]);
      }
      
      showErrorAlert(
        'Error al eliminar', 
        `No se pudo eliminar el ${tableName.slice(0, -1)}.`
      );
    }
  }, [tableName, setState, currentItems]);

  return {
    addItem,
    updateItem,
    deleteItem
  };
}

export function useRealtimeSingleton<T extends Record<string, any>>({
  tableName,
  setState,
  currentItem
}: UseRealtimeSingletonOptions<T>) {

  const updateItem = useCallback(async (
    itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
    mediaFile?: File
  ): Promise<void> => {
    try {
      let tempPreview: string | null = null;

      // Actualización optimista: mostrar preview temporal si hay nuevo archivo
      const optimisticUpdate = {
        ...currentItem,
        ...itemData,
        ...(mediaFile && {
          url: (() => {
            tempPreview = URL.createObjectURL(mediaFile);
            return tempPreview;
          })(),
          type: mediaFile.type.startsWith('image/') ? 'image' : 'video',
        })
      };

      setState(optimisticUpdate);

      // Operación real con sincronización en tiempo real
      const optimizedFile = mediaFile ? await optimizeFile(mediaFile) : undefined;
      const updatedItem = await updateSingletonWithRealtimeSync<T>(
        tableName, 
        itemData, 
        optimizedFile, 
        currentItem
      );

      // Actualizar con el item real (esto se sincronizará automáticamente con otras pestañas)
      setState(updatedItem);

      // Limpiar el preview temporal
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview);
      }

      showSuccessAlert(
        'Contenido actualizado', 
        `El contenido de ${tableName} se ha actualizado y sincronizado correctamente.`
      );
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      
      // Revertir cambios en caso de error
      setState(currentItem);
      
      showErrorAlert(
        'Error al actualizar', 
        `No se pudo actualizar el contenido de ${tableName}.`
      );
    }
  }, [tableName, setState, currentItem]);

  return {
    updateItem
  };
}

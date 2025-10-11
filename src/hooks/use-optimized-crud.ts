// src/hooks/use-optimized-crud.ts
// Hook para operaciones CRUD optimizadas con actualizaciones optimistas

import { useCallback } from 'react';
import { 
  addItemOptimistic, 
  updateItemOptimistic, 
  deleteItemOptimistic,
  updateSingletonOptimistic,
  saveSimpleItemOptimistic
} from '@/lib/optimized-db';
import { showSuccessAlert, showErrorAlert } from '@/lib/alerts';

interface UseOptimizedCrudOptions<T> {
  tableName: string;
  setState: React.Dispatch<React.SetStateAction<T[]>>;
  currentItems: T[];
}

interface UseOptimizedSingletonOptions<T> {
  tableName: string;
  setState: React.Dispatch<React.SetStateAction<T>>;
  currentItem: T;
}

export function useOptimizedCrud<T extends Record<string, any>>({
  tableName,
  setState,
  currentItems
}: UseOptimizedCrudOptions<T>) {

  const addItem = useCallback(async (
    itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
    mediaFile: File
  ): Promise<boolean> => {
    try {
      
      // Crear preview temporal para mostrar inmediatamente
      const tempId = crypto.randomUUID();
      const tempPreview = URL.createObjectURL(mediaFile);
      const tempItem = {
        ...itemData,
        id: tempId,
        url: tempPreview, // Usar preview temporal
        type: mediaFile.type.startsWith('image/') ? 'image' : 'video',
      } as T;

      setState(prev => [...prev, tempItem]);

      // Operación real en background
      const newItem = await addItemOptimistic<T>(tableName, itemData, mediaFile, tempId);
      
      // Actualizar con el item real (con URL correcta)
      setState(prev => prev.map(item => 
        item.id === tempId ? newItem : item
      ));

      // Limpiar el preview temporal
      URL.revokeObjectURL(tempPreview);

      showSuccessAlert(
        'Elemento agregado', 
        `El nuevo ${tableName.slice(0, -1)} se ha guardado correctamente.`
      );
      
      return true;
    } catch (error) {
      console.error(`Error adding ${tableName.slice(0, -1)}:`, error);
      
      // Revertir cambios en caso de error
      setState(prev => prev.filter(item => item.id !== tempId));
      
      showErrorAlert(
        'Error al agregar', 
        `No se pudo agregar el ${tableName.slice(0, -1)}.`
      );
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

      // Actualización optimista: actualizar estado local inmediatamente
      const optimisticUpdate = {
        ...currentItem,
        ...itemData,
        // Si hay un nuevo archivo, crear preview temporal
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

      // Operación real en background
      const updatedItem = await updateItemOptimistic<T>(
        tableName, 
        id, 
        itemData, 
        newMediaFile, 
        currentItem
      );

      // Actualizar con el item real
      setState(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));

      // Limpiar el preview temporal
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview);
      }

      showSuccessAlert(
        'Elemento actualizado', 
        `Los datos del ${tableName.slice(0, -1)} se han actualizado correctamente.`
      );
    } catch (error) {
      console.error(`Error updating ${tableName.slice(0, -1)}:`, error);
      
      // Revertir cambios en caso de error
      setState(prev => prev.map(item => 
        item.id === id ? currentItem : item
      ));
      
      showErrorAlert(
        'Error al actualizar', 
        `No se pudo actualizar el ${tableName.slice(0, -1)}.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [tableName, setState, currentItems]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    try {
      
      const currentItem = currentItems.find(item => item.id === id);
      if (!currentItem) {
        throw new Error('Item no encontrado');
      }

      // Actualización optimista: eliminar del estado local inmediatamente
      setState(prev => prev.filter(item => item.id !== id));

      // Operación real en background
      await deleteItemOptimistic(tableName, id, currentItem);

      showSuccessAlert(
        'Elemento eliminado', 
        `El ${tableName.slice(0, -1)} ha sido eliminado correctamente.`
      );
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
    } finally {
      setIsLoading(false);
    }
  }, [tableName, setState, currentItems]);

  return {
    addItem,
    updateItem,
    deleteItem,
  };
}

export function useOptimizedSingleton<T extends Record<string, any>>({
  tableName,
  setState,
  currentItem
}: UseOptimizedSingletonOptions<T>) {

  const updateItem = useCallback(async (
    itemData: Omit<T, 'id' | 'url' | 'type' | 'file'>,
    mediaFile?: File
  ): Promise<void> => {
    try {
      
      let tempPreview: string | null = null;

      // Actualización optimista: actualizar estado local inmediatamente
      const optimisticUpdate = {
        ...currentItem,
        ...itemData,
        // Si hay un nuevo archivo, crear preview temporal
        ...(mediaFile && {
          url: (() => {
            tempPreview = URL.createObjectURL(mediaFile);
            return tempPreview;
          })(),
          type: mediaFile.type.startsWith('image/') ? 'image' : 'video',
        })
      };

      setState(optimisticUpdate);

      // Operación real en background
      const updatedItem = await updateSingletonOptimistic<T>(
        tableName, 
        itemData, 
        mediaFile, 
        currentItem
      );

      // Actualizar con el item real
      setState(updatedItem);

      // Limpiar el preview temporal
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview);
      }

      showSuccessAlert(
        'Contenido actualizado', 
        `El contenido de ${tableName} se ha actualizado correctamente.`
      );
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      
      // Revertir cambios en caso de error
      setState(currentItem);
      
      showErrorAlert(
        'Error al actualizar', 
        `No se pudo actualizar el contenido de ${tableName}.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [tableName, setState, currentItem]);

  return {
    updateItem,
  };
}

export function useOptimizedSimpleCrud<T extends Record<string, any>>({
  tableName,
  setState,
  currentItems
}: UseOptimizedCrudOptions<T>) {

  const addItem = useCallback(async (itemData: T): Promise<boolean> => {
    try {
      
      // Actualización optimista
      const newItem = await saveSimpleItemOptimistic<T>(tableName, itemData);
      setState(prev => [...prev, newItem]);

      showSuccessAlert(
        'Elemento agregado', 
        `El nuevo ${tableName.slice(0, -1)} se ha guardado correctamente.`
      );
      
      return true;
    } catch (error) {
      console.error(`Error adding ${tableName.slice(0, -1)}:`, error);
      showErrorAlert(
        'Error al agregar', 
        `No se pudo agregar el ${tableName.slice(0, -1)}.`
      );
      return false;
    }
  }, [tableName, setState]);

  const updateItem = useCallback(async (id: string, itemData: Partial<T>): Promise<void> => {
    try {
      
      const currentItem = currentItems.find(item => item.id === id);
      if (!currentItem) {
        throw new Error('Item no encontrado');
      }

      // Actualización optimista
      const updatedItem = { ...currentItem, ...itemData };
      setState(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));

      // Operación real en background
      await saveSimpleItemOptimistic<T>(tableName, updatedItem, id);

      showSuccessAlert(
        'Elemento actualizado', 
        `Los datos del ${tableName.slice(0, -1)} se han actualizado correctamente.`
      );
    } catch (error) {
      console.error(`Error updating ${tableName.slice(0, -1)}:`, error);
      
      // Revertir cambios en caso de error
      setState(prev => prev.map(item => 
        item.id === id ? currentItem : item
      ));
      
      showErrorAlert(
        'Error al actualizar', 
        `No se pudo actualizar el ${tableName.slice(0, -1)}.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [tableName, setState, currentItems]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    try {
      
      const currentItem = currentItems.find(item => item.id === id);
      if (!currentItem) {
        throw new Error('Item no encontrado');
      }

      // Actualización optimista
      setState(prev => prev.filter(item => item.id !== id));

      // Operación real en background
      await deleteItemOptimistic(tableName, id, currentItem);

      showSuccessAlert(
        'Elemento eliminado', 
        `El ${tableName.slice(0, -1)} ha sido eliminado correctamente.`
      );
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
    } finally {
      setIsLoading(false);
    }
  }, [tableName, setState, currentItems]);

  return {
    addItem,
    updateItem,
    deleteItem,
  };
}

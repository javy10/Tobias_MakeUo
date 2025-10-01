// src/lib/firebase.ts
// Este archivo proporciona una implementación temporal en memoria
// para simular la funcionalidad de almacenamiento de datos

import { 
    initialAboutMeContent, 
    initialCategories, 
    initialGalleryItems, 
    initialHeroContent, 
    initialProducts, 
    initialServices, 
    initialTestimonials, 
    initialUsers, 
    initialPerfumes 
} from './data';

// Almacenamiento temporal en memoria
const memoryDB = new Map<string, any[]>();
const singletonDocs = new Map<string, any>();

// Inicializar la base de datos con datos iniciales
export const seedDatabase = async (): Promise<void> => {
    try {
        // Colecciones
        memoryDB.set('services', [...initialServices]);
        memoryDB.set('products', [...initialProducts]);
        memoryDB.set('perfumes', [...initialPerfumes]);
        memoryDB.set('galleryItems', [...initialGalleryItems]);
        memoryDB.set('testimonials', [...initialTestimonials]);
        memoryDB.set('categories', [...initialCategories]);
        memoryDB.set('users', [...initialUsers]);

        // Documentos únicos
        singletonDocs.set('heroContent', { ...initialHeroContent });
        singletonDocs.set('aboutMeContent', { ...initialAboutMeContent });

        console.log('Base de datos temporal inicializada con datos iniciales');
    } catch (error) {
        console.error('Error al inicializar la base de datos temporal:', error);
    }
};

// Obtener todos los items de una colección
export const getAllItemsFromFirestore = async <T>(collectionName: string): Promise<T[]> => {
    try {
        // Para documentos únicos
        if (singletonDocs.has(collectionName)) {
            return [singletonDocs.get(collectionName)] as T[];
        }
        
        // Para colecciones
        return [...(memoryDB.get(collectionName) || [])] as T[];
    } catch (error) {
        console.error(`Error al obtener items de ${collectionName}:`, error);
        return [];
    }
};

// Guardar un item
export const saveItemToFirestore = async <T extends Record<string, any>>(
    collectionName: string,
    item: T,
    id?: string
): Promise<string> => {
    try {
        if (id && (collectionName === 'heroContent' || collectionName === 'aboutMeContent')) {
            singletonDocs.set(collectionName, { ...item });
            return id;
        }

        const collection = memoryDB.get(collectionName) || [];
        const newItem = { ...item };
        
        if (id) {
            const index = collection.findIndex(item => item.id === id);
            if (index >= 0) {
                collection[index] = { ...newItem, id };
            } else {
                collection.push({ ...newItem, id });
            }
        } else {
            const newId = Date.now().toString();
            collection.push({ ...newItem, id: newId });
            memoryDB.set(collectionName, collection);
            return newId;
        }
        
        memoryDB.set(collectionName, collection);
        return id || collection[collection.length - 1].id;
    } catch (error) {
        console.error(`Error al guardar item en ${collectionName}:`, error);
        throw error;
    }
};

// Eliminar un item
export const deleteItemFromFirestore = async (collectionName: string, id: string): Promise<void> => {
    try {
        const collection = memoryDB.get(collectionName) || [];
        const filtered = collection.filter(item => item.id !== id);
        memoryDB.set(collectionName, filtered);
    } catch (error) {
        console.error(`Error al eliminar item de ${collectionName}:`, error);
        throw error;
    }
};

// Simulación de subida de archivo
export const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
    try {
        // Simplemente devolvemos una URL falsa para simular el almacenamiento
        return `https://fake-storage.com/${path}/${file.name}`;
    } catch (error) {
        console.error('Error al subir archivo:', error);
        throw error;
    }
};
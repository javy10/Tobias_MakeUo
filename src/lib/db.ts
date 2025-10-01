
'use client';

import type { GalleryItem } from './types';

const DB_NAME = 'TobiasMakeUpDB';
const DB_VERSION = 2; // Incremented version to trigger onupgradeneeded

const STORE_NAMES = {
  galleryItems: 'galleryItems',
  heroContent: 'heroContent',
  services: 'services',
  products: 'products',
  perfumes: 'perfumes',
  aboutMeContent: 'aboutMeContent'
};

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      
      Object.values(STORE_NAMES).forEach(storeName => {
        if (!dbInstance.objectStoreNames.contains(storeName)) {
            // HeroContent and AboutMeContent are single objects, not arrays.
            // We'll store them with a predictable key like 'singleton'.
            const keyPath = (storeName === STORE_NAMES.heroContent || storeName === STORE_NAMES.aboutMeContent) ? 'id' : 'id';
            dbInstance.createObjectStore(storeName, { keyPath });
        }
      });
    };
  });
};

export const saveItemToDB = async (item: any, storeName: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // For single-item stores, we give them a consistent ID
    if (storeName === STORE_NAMES.heroContent || storeName === STORE_NAMES.aboutMeContent) {
        item.id = 'singleton';
    }

    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error(`Error saving item to ${storeName}:`, request.error);
        reject(request.error);
    };
  });
};

export const deleteItemFromDB = async (id: string, storeName: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error(`Error deleting item from ${storeName}:`, request.error);
            reject(request.error);
        };
    });
};

export const getAllItemsFromDB = async <T>(storeName: string): Promise<T[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
        const items = request.result.map((item: any) => {
            // If it has a file, it's the new format (or being loaded from a save)
            if (item.file) {
                const type = item.type || (item.file.type.startsWith('image/') ? 'image' : 'video');
                return { ...item, url: URL.createObjectURL(item.file), type: type };
            }
            // If it has imageUrl, it's the old format that needs migration
            if (item.imageUrl) {
                const newItem = { ...item, url: item.imageUrl, type: 'image' as const };
                delete newItem.imageUrl;
                return newItem;
            }
            return item;
        });
        resolve(items);
    };
    request.onerror = () => {
        console.error(`Error getting items from ${storeName}:`, request.error);
        reject(request.error);
    };
  });
};

// Helper to convert a file to a serializable format for IndexedDB
export const fileToStorable = async (file: File): Promise<{ file: File; type: 'image' | 'video' }> => {
    return {
        file, // Store the actual file/blob object
        type: file.type.startsWith('image/') ? 'image' : 'video',
    };
};

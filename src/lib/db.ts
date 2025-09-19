
'use client';

import type { GalleryItem } from './types';

const DB_NAME = 'TobiasMakeUpDB';
const DB_VERSION = 1;
const STORE_NAME = 'galleryStore';

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
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveItemToDB = async (item: GalleryItem): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error saving item to DB:', request.error)
        reject(request.error)
    };
  });
};

export const deleteItemFromDB = async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error('Error deleting item from DB:', request.error);
            reject(request.error);
        };
    });
};


export const getAllItemsFromDB = async (): Promise<GalleryItem[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
        // Blobs/Files from IndexedDB need to be converted to Object URLs to be used in src attributes
        const items = request.result.map(item => {
            if (item.file) {
                return { ...item, url: URL.createObjectURL(item.file) };
            }
            return item;
        });
        resolve(items);
    };
    request.onerror = () => {
        console.error('Error getting items from DB:', request.error);
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

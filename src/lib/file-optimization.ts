// src/lib/file-optimization.ts
// Utilidades para optimizar archivos antes de subirlos

/**
 * Comprime una imagen antes de subirla
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1200, // Reducido para ser más rápido
  maxHeight: number = 800,  // Reducido para ser más rápido
  quality: number = 0.7     // Reducido para ser más rápido
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo la proporción
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Configurar canvas
      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx?.drawImage(img, 0, 0, width, height);

      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Error al comprimir la imagen'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Valida el tamaño y tipo de archivo
 */
export const validateFile = (
  file: File,
  maxSizeMB: number = 10,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
): { isValid: boolean; error?: string } => {
  // Validar tipo de archivo
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
    };
  }

  // Validar tamaño
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
};

/**
 * Crea una vista previa de un archivo
 */
export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Error al leer la imagen'));
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL());
      };
      video.onerror = () => reject(new Error('Error al cargar el video'));
      video.src = URL.createObjectURL(file);
    } else {
      reject(new Error('Tipo de archivo no soportado para vista previa'));
    }
  });
};

/**
 * Optimiza un archivo antes de subirlo
 */
export const optimizeFile = async (file: File): Promise<File> => {
  // Validar archivo
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Para archivos muy pequeños, no optimizar
  if (file.size < 500 * 1024) { // < 500KB
    return file;
  }

  // Comprimir si es una imagen
  if (file.type.startsWith('image/')) {
    return await compressImage(file);
  }

  // Para videos, devolver el archivo original
  return file;
};

/**
 * Genera un hash simple para el archivo (para cache)
 */
export const generateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Verifica si un archivo ya existe en cache
 */
export const getCachedFile = (hash: string): File | null => {
  const cached = localStorage.getItem(`file_cache_${hash}`);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      return new File([data.content], data.name, { type: data.type });
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Guarda un archivo en cache
 */
export const cacheFile = async (file: File, hash: string): Promise<void> => {
  try {
    const content = await file.arrayBuffer();
    const cacheData = {
      name: file.name,
      type: file.type,
      content: Array.from(new Uint8Array(content))
    };
    localStorage.setItem(`file_cache_${hash}`, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('No se pudo guardar el archivo en cache:', error);
  }
};


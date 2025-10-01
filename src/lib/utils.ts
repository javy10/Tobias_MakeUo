import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte una URL de imagen/video en un objeto File
 */
export const urlToFile = async (url: string, filename: string): Promise<File> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error al convertir URL a File:', error);
    throw new Error('No se pudo procesar el archivo multimedia');
  }
};

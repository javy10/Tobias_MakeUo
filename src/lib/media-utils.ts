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

/**
 * Procesa un archivo multimedia desde un media object
 */
export const processMediaFile = async (
  media: { url: string; type: 'image' | 'video' } | null,
  filename: string
): Promise<File | undefined> => {
  if (!media?.url) return undefined;
  try {
    return await urlToFile(media.url, filename);
  } catch (error) {
    console.error('Error al procesar el archivo multimedia:', error);
    throw new Error('No se pudo procesar el archivo multimedia');
  }
};
// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Función para subir archivo a Cloudinary
export const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
  try {
    // Convertir el archivo a base64
    const base64Data = await fileToBase64(file);
    
    // Subir a Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        {
          folder: 'tobias-makeup', // Carpeta en Cloudinary
          resource_type: 'auto', // Detecta automáticamente si es imagen o video
          transformation: [
            { quality: 'auto' }, // Optimización automática de calidad
            { fetch_format: 'auto' }, // Formato automático según el navegador
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error al subir archivo a Cloudinary:', error);
    throw new Error('Error al subir el archivo');
  }
};

// Función para eliminar archivo de Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
        if (error) reject(error);
        else resolve();
      });
    });
  } catch (error) {
    console.error('Error al eliminar archivo de Cloudinary:', error);
    throw new Error('Error al eliminar el archivo');
  }
};

// Función auxiliar para convertir File a base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
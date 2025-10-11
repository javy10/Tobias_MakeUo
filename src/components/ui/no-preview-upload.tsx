// src/components/ui/no-preview-upload.tsx
// Componente simple sin preview - solo muestra información del archivo

import React from 'react';
import { Upload, File, Image, Video, X } from 'lucide-react';

type MediaPreview = { url: string; type: 'image' | 'video' } | null;

interface NoPreviewUploadProps {
  preview: MediaPreview;
  onRemove: () => void;
  className?: string;
}

export function NoPreviewUpload({ 
  preview, 
  onRemove,
  className = ""
}: NoPreviewUploadProps) {
  // Solo mostrar cuando hay un archivo seleccionado
  if (!preview) {
    return null;
  }

  // Determinar tipo de manera simple
  const isImage = preview.type === 'image' || 
    preview.url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico)$/);

  return (
    <div className={`relative w-fit mt-2 ${className}`}>
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
            {isImage ? (
              <Image className="w-5 h-5 text-blue-500" />
            ) : (
              <Video className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {isImage ? 'Imagen' : 'Video'} seleccionado
            </p>
            <p className="text-xs text-blue-500">
              Archivo listo para subir
            </p>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-0 right-0 -mt-2 -mr-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-20"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

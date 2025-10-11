// src/components/ui/simple-media-preview.tsx
// Componente simple y directo para preview de medios

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

type MediaPreview = { url: string; type: 'image' | 'video' } | null;

interface SimpleMediaPreviewProps {
  preview: MediaPreview;
  onRemove: () => void;
  imageWidth?: number;
  imageHeight?: number;
  videoWidth?: number;
  videoHeight?: number;
  className?: string;
}

export function SimpleMediaPreview({ 
  preview, 
  onRemove,
  imageWidth = 100,
  imageHeight = 100,
  videoWidth = 160,
  videoHeight = 120,
  className = ""
}: SimpleMediaPreviewProps) {
  if (!preview) return null;

  if (preview.type === 'image') {
    return (
      <div className={`relative w-fit mt-2 ${className}`}>
        <Image 
          src={preview.url} 
          alt="Vista previa" 
          width={imageWidth} 
          height={imageHeight} 
          className="rounded-md object-cover"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (preview.type === 'video') {
    return (
      <div className={`relative w-fit mt-2 ${className}`}>
        <video
          src={preview.url}
          width={videoWidth}
          height={videoHeight}
          controls
          preload="metadata"
          className="rounded-md bg-black"
          style={{ objectFit: 'cover' }}
          onLoadedData={() => {
            // Asegurar que el video se muestre correctamente
            console.log('Video loaded successfully');
          }}
          onError={(e) => {
            // Manejar el error de manera segura sin causar errores en la consola
            try {
              const target = e.target as HTMLVideoElement;
              const error = target.error;
              if (error) {
                console.warn('Video loading error:', {
                  code: error.code,
                  message: error.message || 'Unknown video error',
                  src: target.src || 'Unknown source'
                });
              } else {
                console.warn('Video loading error: Unknown error');
              }
            } catch (err) {
              // Fallback silencioso para evitar errores en la consola
              console.warn('Video loading error: Could not determine error details');
            }
          }}
        >
          Tu navegador no soporta el elemento video.
        </video>
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return null;
}

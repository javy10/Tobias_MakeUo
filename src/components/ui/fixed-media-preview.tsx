// src/components/ui/fixed-media-preview.tsx
// Componente corregido para preview de medios que detecta correctamente el tipo

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

type MediaPreview = { url: string; type: 'image' | 'video' } | null;

interface FixedMediaPreviewProps {
  preview: MediaPreview;
  onRemove: () => void;
  imageWidth?: number;
  imageHeight?: number;
  videoWidth?: number;
  videoHeight?: number;
  className?: string;
}

export function FixedMediaPreview({ 
  preview, 
  onRemove,
  imageWidth = 100,
  imageHeight = 100,
  videoWidth = 160,
  videoHeight = 120,
  className = ""
}: FixedMediaPreviewProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Debug logging para identificar el problema
  console.log('FixedMediaPreview received:', {
    preview,
    type: preview?.type,
    url: preview?.url,
    urlType: preview?.url ? (preview.url.startsWith('blob:') ? 'blob' : 'http') : 'none'
  });

  if (!preview) return null;

  const handleVideoError = () => {
    console.warn('Video failed to load, showing error state');
    setVideoError(true);
  };

  const handleImageError = () => {
    console.warn('Image failed to load, showing error state');
    setImageError(true);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoError(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageError(false);
  };

  // Determinar el tipo basándose en la URL si el tipo no es confiable
  const determineActualType = (url: string, declaredType: string): 'image' | 'video' => {
    // Si la URL es un blob, intentar determinar el tipo por la extensión
    if (url.startsWith('blob:')) {
      // Para blobs, confiar en el tipo declarado
      return declaredType as 'image' | 'video';
    }
    
    // Para URLs HTTP, verificar la extensión
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    }
    if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension || '')) {
      return 'video';
    }
    
    // Fallback al tipo declarado
    return declaredType as 'image' | 'video';
  };

  const actualType = determineActualType(preview.url, preview.type);
  
  console.log('Determined actual type:', {
    declared: preview.type,
    actual: actualType,
    url: preview.url
  });

  if (actualType === 'image') {
    if (imageError) {
      return (
        <div className={`relative w-fit mt-2 ${className}`}>
          <div 
            className="bg-gray-200 flex items-center justify-center text-gray-500 rounded-md"
            style={{ width: imageWidth, height: imageHeight }}
          >
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs">Error al cargar imagen</p>
            </div>
          </div>
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

    return (
      <div className={`relative w-fit mt-2 ${className}`}>
        <Image 
          src={preview.url} 
          alt="Vista previa" 
          width={imageWidth} 
          height={imageHeight} 
          className="rounded-md object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
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

  if (actualType === 'video') {
    if (videoError) {
      return (
        <div className={`relative w-fit mt-2 ${className}`}>
          <div 
            className="bg-gray-200 flex items-center justify-center text-gray-500 rounded-md"
            style={{ width: videoWidth, height: videoHeight }}
          >
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs">Error al cargar video</p>
            </div>
          </div>
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

    return (
      <div className={`relative w-fit mt-2 ${className}`}>
        <video
          ref={videoRef}
          src={preview.url}
          width={videoWidth}
          height={videoHeight}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="rounded-md bg-black"
          style={{ objectFit: 'cover' }}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
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

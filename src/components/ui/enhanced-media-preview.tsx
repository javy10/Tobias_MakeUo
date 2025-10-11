// src/components/ui/enhanced-media-preview.tsx
// Componente mejorado para preview de medios sin parpadeo

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { StableVideoPreview } from './stable-video-preview';

type MediaPreview = { url: string; type: 'image' | 'video' } | null;

interface EnhancedMediaPreviewProps {
  preview: MediaPreview;
  onRemove: () => void;
  imageWidth?: number;
  imageHeight?: number;
  videoWidth?: number;
  videoHeight?: number;
  className?: string;
}

export function EnhancedMediaPreview({ 
  preview, 
  onRemove,
  imageWidth = 100,
  imageHeight = 100,
  videoWidth = 160,
  videoHeight = 120,
  className = ""
}: EnhancedMediaPreviewProps) {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const previousUrlRef = useRef<string>('');

  // Evitar re-renders innecesarios cuando la URL no cambia
  useEffect(() => {
    if (preview?.url && preview.url !== previousUrlRef.current) {
      previousUrlRef.current = preview.url;
      setIsImageLoading(true);
      setImageError(false);
    }
  }, [preview?.url]);

  if (!preview) return null;

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  if (preview.type === 'image') {
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
        <div className="relative" style={{ width: imageWidth, height: imageHeight }}>
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10 rounded-md">
              <div className="text-center text-gray-500">
                <div className="w-4 h-4 mx-auto mb-1 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <p className="text-xs">Cargando...</p>
              </div>
            </div>
          )}
          
          <Image 
            src={preview.url} 
            alt="Vista previa" 
            width={imageWidth} 
            height={imageHeight} 
            className="rounded-md object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              display: isImageLoading ? 'none' : 'block'
            }}
          />
        </div>
        
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors z-20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (preview.type === 'video') {
    return (
      <StableVideoPreview
        src={preview.url}
        onRemove={onRemove}
        width={videoWidth}
        height={videoHeight}
        className={className}
      />
    );
  }

  return null;
}

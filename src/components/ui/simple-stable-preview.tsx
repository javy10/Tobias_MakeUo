// src/components/ui/simple-stable-preview.tsx
// Componente simplificado para preview de medios sin errores de SVG

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

type MediaPreview = { url: string; type: 'image' | 'video' } | null;

interface SimpleStablePreviewProps {
  preview: MediaPreview;
  onRemove: () => void;
  imageWidth?: number;
  imageHeight?: number;
  videoWidth?: number;
  videoHeight?: number;
  className?: string;
}

export function SimpleStablePreview({ 
  preview, 
  onRemove,
  imageWidth = 100,
  imageHeight = 100,
  videoWidth = 160,
  videoHeight = 120,
  className = ""
}: SimpleStablePreviewProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousUrlRef = useRef<string>('');

  // Evitar re-renders innecesarios
  useEffect(() => {
    if (preview?.url !== previousUrlRef.current) {
      previousUrlRef.current = preview?.url || '';
      setVideoError(false);
      setImageError(false);
      setIsLoading(true);
    }
  }, [preview?.url]);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setVideoError(false);
    setIsLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
    setIsLoading(false);
  }, []);

  if (!preview) return null;

  // Determinar el tipo de manera simple y estable
  const isImage = preview.type === 'image' || 
    (preview.url && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].some(ext => 
      preview.url.toLowerCase().includes(`.${ext}`)
    ));

  if (isImage) {
    if (imageError) {
      return (
        <div className={`relative w-fit mt-2 ${className}`}>
          <div 
            className="bg-gray-200 flex items-center justify-center text-gray-500 rounded-md"
            style={{ width: imageWidth, height: imageHeight }}
          >
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs">📷</span>
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
        {isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white rounded-md z-10"
            style={{ width: imageWidth, height: imageHeight }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-xs mt-2">Cargando...</p>
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
          style={{ display: isLoading ? 'none' : 'block' }}
        />
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

  // Es video
  if (videoError) {
    return (
      <div className={`relative w-fit mt-2 ${className}`}>
        <div 
          className="bg-gray-200 flex items-center justify-center text-gray-500 rounded-md"
          style={{ width: videoWidth, height: videoHeight }}
        >
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs">🎥</span>
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
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white rounded-md z-10"
          style={{ width: videoWidth, height: videoHeight }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-xs mt-2">Cargando video...</p>
          </div>
        </div>
      )}
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
        style={{ 
          objectFit: 'cover',
          display: isLoading ? 'none' : 'block'
        }}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
      >
        Tu navegador no soporta el elemento video.
      </video>
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




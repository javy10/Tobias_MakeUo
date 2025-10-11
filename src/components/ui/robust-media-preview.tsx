// src/components/ui/robust-media-preview.tsx
// Componente robusto para preview de medios con debugging mejorado

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

type MediaPreview = { url: string; type: 'image' | 'video' } | null;

interface RobustMediaPreviewProps {
  preview: MediaPreview;
  onRemove: () => void;
  imageWidth?: number;
  imageHeight?: number;
  videoWidth?: number;
  videoHeight?: number;
  className?: string;
}

export function RobustMediaPreview({ 
  preview, 
  onRemove,
  imageWidth = 100,
  imageHeight = 100,
  videoWidth = 160,
  videoHeight = 120,
  className = ""
}: RobustMediaPreviewProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousUrlRef = useRef<string>('');

  // Debug logging
  useEffect(() => {
    if (preview) {
      const info = `Preview: ${preview.type} - ${preview.url.substring(0, 50)}...`;
      setDebugInfo(info);
      console.log('RobustMediaPreview - Preview recibido:', {
        type: preview.type,
        url: preview.url,
        urlType: preview.url.startsWith('blob:') ? 'blob' : 'http'
      });
    } else {
      setDebugInfo('No preview');
      console.log('RobustMediaPreview - Sin preview');
    }
  }, [preview]);

  // Evitar re-renders innecesarios
  useEffect(() => {
    if (preview?.url !== previousUrlRef.current) {
      previousUrlRef.current = preview?.url || '';
      setVideoError(false);
      setImageError(false);
      setIsLoading(true);
      console.log('RobustMediaPreview - URL cambió, reseteando estados');
    }
  }, [preview?.url]);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('RobustMediaPreview - Error en video:', e);
    setVideoError(true);
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('RobustMediaPreview - Error en imagen:', e);
    setImageError(true);
    setIsLoading(false);
  }, []);

  const handleVideoLoad = useCallback(() => {
    console.log('RobustMediaPreview - Video cargado exitosamente');
    setVideoError(false);
    setIsLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    console.log('RobustMediaPreview - Imagen cargada exitosamente');
    setImageError(false);
    setIsLoading(false);
  }, []);

  if (!preview) {
    return (
      <div className={`relative w-fit mt-2 ${className}`}>
        <div 
          className="bg-gray-200 flex items-center justify-center text-gray-500 rounded-md border-2 border-dashed border-gray-300"
          style={{ width: imageWidth, height: imageHeight }}
        >
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs">📁</span>
            </div>
            <p className="text-xs">Sin preview</p>
          </div>
        </div>
      </div>
    );
  }

  // Determinar el tipo de manera más robusta
  const determineType = (url: string, declaredType: string): 'image' | 'video' => {
    // Si la URL es blob, confiar en el tipo declarado
    if (url.startsWith('blob:')) {
      return declaredType as 'image' | 'video';
    }
    
    // Para URLs HTTP, verificar la extensión
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '')) {
      return 'image';
    }
    if (['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'flv'].includes(extension || '')) {
      return 'video';
    }
    
    // Fallback al tipo declarado
    return declaredType as 'image' | 'video';
  };

  const actualType = determineType(preview.url, preview.type);
  
  console.log('RobustMediaPreview - Tipo determinado:', {
    declared: preview.type,
    actual: actualType,
    url: preview.url
  });

  if (actualType === 'image') {
    if (imageError) {
      return (
        <div className={`relative w-fit mt-2 ${className}`}>
          <div 
            className="bg-red-100 flex items-center justify-center text-red-500 rounded-md border-2 border-red-300"
            style={{ width: imageWidth, height: imageHeight }}
          >
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-red-200 rounded-full flex items-center justify-center">
                <span className="text-xs">❌</span>
              </div>
              <p className="text-xs">Error al cargar imagen</p>
              <p className="text-xs text-red-400 mt-1">{debugInfo}</p>
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
              <p className="text-xs mt-2">Cargando imagen...</p>
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
          unoptimized={preview.url.startsWith('blob:')} // Deshabilitar optimización para blobs
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors z-20"
        >
          <X className="h-4 w-4" />
        </button>
        {/* Debug info */}
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
          {debugInfo}
        </div>
      </div>
    );
  }

  if (actualType === 'video') {
    if (videoError) {
      return (
        <div className={`relative w-fit mt-2 ${className}`}>
          <div 
            className="bg-red-100 flex items-center justify-center text-red-500 rounded-md border-2 border-red-300"
            style={{ width: videoWidth, height: videoHeight }}
          >
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-red-200 rounded-full flex items-center justify-center">
                <span className="text-xs">❌</span>
              </div>
              <p className="text-xs">Error al cargar video</p>
              <p className="text-xs text-red-400 mt-1">{debugInfo}</p>
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
        {/* Debug info */}
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
          {debugInfo}
        </div>
      </div>
    );
  }

  // Tipo no reconocido
  return (
    <div className={`relative w-fit mt-2 ${className}`}>
      <div 
        className="bg-yellow-100 flex items-center justify-center text-yellow-500 rounded-md border-2 border-yellow-300"
        style={{ width: imageWidth, height: imageHeight }}
      >
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-yellow-200 rounded-full flex items-center justify-center">
            <span className="text-xs">⚠️</span>
          </div>
          <p className="text-xs">Tipo no reconocido</p>
          <p className="text-xs text-yellow-400 mt-1">{debugInfo}</p>
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
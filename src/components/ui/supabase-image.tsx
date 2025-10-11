// src/components/ui/supabase-image.tsx
// Componente para mostrar imágenes de Supabase Storage con manejo robusto

import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface SupabaseImageProps {
  src: string;
  alt: string;
  fallbackText?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function SupabaseImage({ 
  src, 
  alt, 
  fallbackText, 
  className = "w-8 h-8 rounded object-cover",
  width,
  height
}: SupabaseImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Función para validar si es una URL válida
  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Función para verificar si es un archivo de video
  const isVideoFile = (url: string): boolean => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.3gp'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  useEffect(() => {
    if (src && src.trim() !== '' && isValidUrl(src) && !isVideoFile(src)) {
      setImageSrc(src);
      setImageError(false);
      setIsLoading(true);
    } else {
      setImageSrc(''); // Asegurar que imageSrc esté vacío
      setImageError(true);
      setIsLoading(false);
    }
  }, [src]);

  const handleImageError = () => {
    console.error('Error cargando imagen:', src);
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Si no hay src válido, es video, o hay error, mostrar fallback
  if (!src || !isValidUrl(src) || isVideoFile(src) || imageError || src.trim() === '') {
    return (
      <div className={`w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
        <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
          {fallbackText ? (
            <span className="text-xs font-semibold text-white">
              {fallbackText.charAt(0).toUpperCase()}
            </span>
          ) : (
            <ImageIcon className="w-4 h-4 text-white" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-teal-600 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {imageSrc && imageSrc.trim() !== '' && isValidUrl(imageSrc) && imageSrc !== '' && (
        <img 
          src={imageSrc} 
          alt={alt}
          className={className}
          width={width}
          height={height}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ 
            display: isLoading ? 'none' : 'block',
            width: width || '32px',
            height: height || '32px'
          }}
        />
      )}
    </div>
  );
}

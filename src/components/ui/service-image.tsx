// src/components/ui/service-image.tsx
// Componente para mostrar imágenes de servicios con manejo de errores

import React from 'react';
import { SupabaseImage } from './supabase-image';

interface ServiceImageProps {
  service: {
    id: string;
    title: string;
    url?: string;
    type?: 'image' | 'video';
  };
  className?: string;
}

export function ServiceImage({ service, className = "" }: ServiceImageProps) {
  // Solo mostrar imagen si es realmente una imagen y tiene URL válida
  if (service.type === 'video' || !service.url || service.url.trim() === '' || service.url === '') {
    return (
      <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
          <span className="text-xs font-semibold text-white">
            {service.title.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  // Validación adicional antes de pasar a SupabaseImage
  if (typeof service.url !== 'string' || service.url.length === 0) {
    return (
      <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
          <span className="text-xs font-semibold text-white">
            {service.title.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <SupabaseImage 
      src={service.url} 
      alt={service.title}
      fallbackText={service.title}
      className="w-8 h-8 rounded object-cover"
    />
  );
}

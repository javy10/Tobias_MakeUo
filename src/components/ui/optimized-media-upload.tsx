// src/components/ui/optimized-media-upload.tsx
// Componente optimizado para subida de medios con preview estable

import React, { useState, useCallback } from 'react';
import { DragDropUpload } from './drag-drop-upload';
import { EnhancedMediaPreview } from './enhanced-media-preview';
import { useStableMediaPreview } from '@/hooks/use-stable-media-preview';

interface OptimizedMediaUploadProps {
  name: string;
  accept?: string;
  required?: boolean;
  onFileSelect?: (file: File) => void;
  existingUrl?: string;
  existingType?: 'image' | 'video';
  label?: string;
  className?: string;
}

export function OptimizedMediaUpload({
  name,
  accept = "image/*,video/*",
  required = false,
  onFileSelect,
  existingUrl,
  existingType,
  label = "Archivo multimedia",
  className = ""
}: OptimizedMediaUploadProps) {
  const { preview, setMediaPreview, clearPreview, setExistingPreview } = useStableMediaPreview();
  const [hasNewFile, setHasNewFile] = useState(false);

  // Establecer preview existente cuando se monta el componente
  React.useEffect(() => {
    if (existingUrl && existingType && !hasNewFile) {
      setExistingPreview(existingUrl, existingType);
    }
  }, [existingUrl, existingType, hasNewFile, setExistingPreview]);

  const handleFileSelect = useCallback((file: File) => {
    setMediaPreview(file);
    setHasNewFile(true);
    onFileSelect?.(file);
  }, [setMediaPreview, onFileSelect]);

  const handleRemove = useCallback(() => {
    clearPreview();
    setHasNewFile(false);
    // Si había un archivo existente, restaurarlo
    if (existingUrl && existingType) {
      setExistingPreview(existingUrl, existingType);
    }
  }, [clearPreview, existingUrl, existingType, setExistingPreview]);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <DragDropUpload 
        name={name}
        accept={accept}
        required={required}
        onFileSelect={handleFileSelect}
      />
      
      {preview && (
        <div className="mt-2">
          <EnhancedMediaPreview 
            preview={preview} 
            onRemove={handleRemove}
            imageWidth={100}
            imageHeight={100}
            videoWidth={160}
            videoHeight={120}
          />
        </div>
      )}
    </div>
  );
}





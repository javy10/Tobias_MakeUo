'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface DragDropUploadProps {
  name: string;
  accept: string;
  required?: boolean;
  onFileSelect: (file: File) => void;
  className?: string;
  id?: string;
  placeholder?: string;
  description?: string;
}

export function DragDropUpload({ 
  name, 
  accept, 
  required, 
  onFileSelect, 
  className, 
  id,
  placeholder = "Seleccionar archivo o arrástralo aquí",
  description = "PNG, JPG, GIF hasta 10MB"
}: DragDropUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `file-input-${name}`;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const validateFile = (file: File): boolean => {
    // Validar tipo de archivo
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      alert('Tipo de archivo no válido. Por favor selecciona un archivo válido.');
      return false;
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      return false;
    }

    return true;
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragOver 
            ? "border-teal-400 bg-teal-50 dark:bg-teal-900/20" 
            : "border-teal-400 hover:border-teal-300",
          "bg-gray-50 dark:bg-gray-800"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-teal-400 font-medium">
              {placeholder}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        required={required}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}


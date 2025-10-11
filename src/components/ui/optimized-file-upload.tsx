// src/components/ui/optimized-file-upload.tsx
// Componente optimizado para subida de archivos con preview y compresión

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video, File, Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { optimizeFile, createFilePreview, validateFile } from '@/lib/file-optimization';

interface OptimizedFileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  currentFile?: File | null;
  currentPreview?: string | null;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function OptimizedFileUpload({
  onFileSelect,
  onFileRemove,
  currentFile,
  currentPreview,
  accept = "image/*,video/*",
  maxSizeMB = 10,
  className,
  disabled = false,
  label = "Seleccionar archivo",
  description = "Arrastra y suelta un archivo aquí, o haz clic para seleccionar"
}: OptimizedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPreview);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Validar archivo
      const validation = validateFile(file, maxSizeMB);
      if (!validation.isValid) {
        setError(validation.error || 'Archivo inválido');
        return;
      }

      // Optimizar archivo
      const optimizedFile = await optimizeFile(file);
      
      // Crear preview
      const filePreview = await createFilePreview(optimizedFile);
      setPreview(filePreview);
      
      // Notificar al componente padre
      onFileSelect(optimizedFile);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
    } finally {
      setIsProcessing(false);
    }
  }, [maxSizeMB, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileProcess(files[0]);
    }
  }, [disabled, handleFileProcess]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  }, [handleFileProcess]);

  const handleRemoveFile = useCallback(() => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileRemove?.();
  }, [onFileRemove]);

  const handleClick = useCallback(() => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click();
    }
  }, [disabled, isProcessing]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-8 w-8 text-purple-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragging && !disabled && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500 bg-red-50",
          preview && "border-green-500 bg-green-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">Procesando archivo...</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {currentFile?.type.startsWith('image/') ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-32 max-w-32 rounded-lg object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-32 w-32 bg-gray-100 rounded-lg">
                  {currentFile && getFileIcon(currentFile)}
                </div>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{currentFile?.name}</p>
              <p>{currentFile && formatFileSize(currentFile.size)}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{description}</p>
              <p className="text-xs text-gray-400 mt-1">
                Máximo {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}






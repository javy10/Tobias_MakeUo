'use client';

import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Video, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { CameraCapture } from './camera-capture';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Button } from './button';
import { Media } from '../shared/Media';

interface MediaUploaderProps {
  onUploadSuccess: (data: { url: string; type: 'image' | 'video' }) => void;
  onUploadError: (error: string) => void;
  currentMedia?: {
    url: string;
    type: 'image' | 'video';
  };
  className?: string;
}

export function MediaUploader({ 
  onUploadSuccess, 
  onUploadError, 
  currentMedia,
  className = '' 
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<{url: string; type: 'image' | 'video'} | null>(currentMedia || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      const objectUrl = URL.createObjectURL(file);
      setPreview({ url: objectUrl, type });

      const { url } = await uploadToCloudinary(file);
      
      URL.revokeObjectURL(objectUrl);
      
      const mediaData: { url: string; type: 'image' | 'video' } = { url, type };
      setPreview(mediaData);
      
      onUploadSuccess({ url, type });
    } catch (error) {
      console.error('Error al subir archivo:', error);
      onUploadError('Error al subir el archivo. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-4
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          hover:border-primary hover:bg-primary/5
          transition-all duration-200 ease-in-out
          cursor-pointer
          min-h-[200px]
          flex flex-col items-center justify-center
          text-center
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative w-full h-full min-h-[200px] sm:group">
            <Media
              src={preview.url}
              alt="Preview"
              type={preview.type}
              fill
              className="rounded-md"
              style={{ objectFit: 'contain' }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onUploadSuccess({ url: '', type: 'image' });
              }}
              className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full 
                       text-white hover:text-white transition-all duration-200
                       sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100
                       opacity-100 z-10 shadow-md ring-offset-background
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Eliminar imagen</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <CameraCapture
                onCapture={(file) => {
                  const files = [file];
                  onDrop(files);
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? (
                  'Suelta el archivo aquí'
                ) : (
                  'Arrastra y suelta un archivo, haz clic para seleccionar, o usa la cámara'
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Imágenes (PNG, JPG, GIF) o Videos (MP4, WebM)
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-white text-center space-y-2">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium">Subiendo archivo...</p>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
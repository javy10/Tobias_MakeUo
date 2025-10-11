'use client';

import { Camera, FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangeEvent } from 'react';

interface CameraFileInputProps {
  name: string;
  accept: string;
  required?: boolean;
  onFileSelect: (file: File) => void;
  className?: string;
  id?: string;
}

export function CameraFileInput({ name, accept, required, onFileSelect, className, id }: CameraFileInputProps) {
  const inputId = id || `file-input-${name}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      <Label htmlFor={inputId} className="flex-grow">
        <div className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <FileUp className="h-4 w-4" />
          <span>Seleccionar archivo</span>
        </div>
        <Input
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          required={required}
          onChange={handleChange}
          className="hidden"
        />
      </Label>

      <Label htmlFor={`${inputId}-camera`} className="md:hidden">
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background">
          <Camera className="h-5 w-5" />
        </div>
        <Input
          id={`${inputId}-camera`}
          name={`${name}-camera`}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
      </Label>
    </div>
  );
}

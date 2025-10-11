'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ className, size = 'md', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {text && (
        <p className="text-gray-500 text-sm font-medium">{text}</p>
      )}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Spinner circular con segmentos como el de la imagen */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 border-r-teal-500 animate-spin"></div>
        
        {/* Segmentos adicionales para el efecto de "sunburst" */}
        <div className="absolute inset-0 rounded-full">
          <div className="absolute top-0 left-1/2 w-1 h-1/2 bg-teal-500 rounded-full transform -translate-x-1/2 animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-1/2 h-1 bg-teal-500 rounded-full transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-1/2 bg-teal-500 rounded-full transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-teal-500 rounded-full transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
}


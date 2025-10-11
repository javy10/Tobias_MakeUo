'use client';

import React from 'react';

interface FastLoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FastLoadingSpinner({
  text = 'Cargando...',
  size = 'md',
  className = ''
}: FastLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Simple rotating circle - más rápido que triángulos */}
      <div className={`${sizeClasses[size]} relative`}>
        <div 
          className={`${sizeClasses[size]} border-2 border-teal-500 border-t-transparent rounded-full animate-spin`}
        />
      </div>

      {/* Text */}
      <p className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300`}>
        {text}
      </p>
    </div>
  );
}




'use client';

import React from 'react';

interface JumpingTriangleLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function JumpingTriangleLoader({ 
  text = 'Cargando...', 
  size = 'md',
  className = ''
}: JumpingTriangleLoaderProps) {
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
      {/* Jumping Triangle Animation */}
      <div className="relative">
        <div className={`${sizeClasses[size]} relative`}>
          {/* Triangle 1 */}
          <div className="absolute inset-0">
            <div className={`${sizeClasses[size]} bg-teal-500 transform rotate-45 animate-bounce`} 
                 style={{ animationDelay: '0ms', animationDuration: '1s' }}>
            </div>
          </div>
          {/* Triangle 2 */}
          <div className="absolute inset-0">
            <div className={`${sizeClasses[size]} bg-teal-400 transform rotate-45 animate-bounce`} 
                 style={{ animationDelay: '200ms', animationDuration: '1s' }}>
            </div>
          </div>
          {/* Triangle 3 */}
          <div className="absolute inset-0">
            <div className={`${sizeClasses[size]} bg-teal-300 transform rotate-45 animate-bounce`} 
                 style={{ animationDelay: '400ms', animationDuration: '1s' }}>
            </div>
          </div>
        </div>
      </div>
      
      {/* Text */}
      <p className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300`}>
        {text}
      </p>
    </div>
  );
}








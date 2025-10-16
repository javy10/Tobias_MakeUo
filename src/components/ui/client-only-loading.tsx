'use client';

import { FastLoadingSpinner } from './fast-loading-spinner';

interface ClientOnlyLoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  showAttempts?: boolean;
  attempt?: number;
  maxAttempts?: number;
}

export function ClientOnlyLoading({ 
  text = "Cargando...", 
  size = "lg",
  showAttempts = false,
  attempt = 1,
  maxAttempts = 3
}: ClientOnlyLoadingProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <FastLoadingSpinner text={text} size={size} />
        {showAttempts && (
          <div className="mt-4 text-sm text-gray-400">
            <p>Intento {attempt} de {maxAttempts}</p>
            <p className="mt-2">Conectando con Supabase...</p>
          </div>
        )}
      </div>
    </div>
  );
}

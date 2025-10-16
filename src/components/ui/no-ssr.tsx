'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useState, useEffect } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Componente que solo se renderiza en el cliente
const NoSSR = ({ children, fallback = null }: NoSSRProps) => {
  return <>{children}</>;
};

// Wrapper con dynamic import para evitar SSR
export const NoSSRWrapper = dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Cargando aplicación...</p>
      </div>
    </div>
  )
});

// Hook para detectar si estamos en el cliente
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

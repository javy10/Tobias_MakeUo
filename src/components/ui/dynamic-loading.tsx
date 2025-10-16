'use client';

import dynamic from 'next/dynamic';

const LoadingSpinner = dynamic(() => import('./simple-loading').then(mod => ({ default: mod.SimpleLoading })), {
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

export { LoadingSpinner };


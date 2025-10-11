// src/components/ui/centered-loading-overlay.tsx
// Componente de loading centrado que se superpone sobre el contenido

import React from 'react';
import { LoadingSpinner } from './loading-spinner';

interface CenteredLoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export function CenteredLoadingOverlay({ isVisible, text = 'Procesando...' }: CenteredLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl">
        <LoadingSpinner text={text} size="lg" />
      </div>
    </div>
  );
}




'use client';

import React from 'react';
import { JumpingTriangleLoader } from './jumping-triangle-loader';

interface GalleryLoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export function GalleryLoadingOverlay({ isVisible, text = 'Procesando...' }: GalleryLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <JumpingTriangleLoader text={text} size="lg" />
      </div>
    </div>
  );
}








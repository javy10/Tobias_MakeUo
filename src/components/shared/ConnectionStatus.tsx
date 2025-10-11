'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Verificar estado de conexión
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    // Escuchar cambios de conexión
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus && isOnline) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-2 px-3 py-2 shadow-lg"
      >
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>Conectado</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Sin conexión</span>
          </>
        )}
      </Badge>
    </div>
  );
}



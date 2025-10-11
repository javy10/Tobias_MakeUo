'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, RefreshCw } from 'lucide-react';

interface RealtimeNotificationProps {
  isConnected: boolean;
  lastUpdate?: string;
}

export function RealtimeNotification({ isConnected, lastUpdate }: RealtimeNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (lastUpdate) {
      setIsUpdating(true);
      setShowNotification(true);
      
      // Ocultar la notificación después de 3 segundos
      const timer = setTimeout(() => {
        setShowNotification(false);
        setIsUpdating(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center gap-2 px-3 py-2 shadow-lg"
      >
        {isUpdating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Actualizando...</span>
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Conectado en tiempo real</span>
          </>
        )}
      </Badge>
    </div>
  );
}


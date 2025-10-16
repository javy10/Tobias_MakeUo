// src/hooks/use-realtime.ts
// Hooks para manejar el estado de tiempo real y suscripciones

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeState {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export function useRealtimeState<T>(
  tableName: string,
  setState: React.Dispatch<React.SetStateAction<T[]>>
): RealtimeState {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Configurar suscripción con delay para no bloquear la carga inicial
    const setupRealtimeSubscription = async () => {
      try {
        // Delay más largo para permitir que la carga inicial termine primero
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!isMounted) return;

        // Limpiar suscripción anterior si existe
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
        }

        // Crear nueva suscripción
        const channel = supabase
          .channel(`${tableName}_changes`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: tableName,
            },
            (payload) => {
              if (!isMounted) return;

              console.log(`🔄 Cambio detectado en ${tableName}:`, payload);

              setLastUpdate(new Date());

              // Manejar diferentes tipos de eventos
              switch (payload.eventType) {
                case 'INSERT':
                  setState(prev => [...prev, payload.new as T]);
                  break;
                case 'UPDATE':
                  setState(prev => 
                    prev.map(item => 
                      (item as any).id === payload.new.id ? payload.new as T : item
                    )
                  );
                  break;
                case 'DELETE':
                  setState(prev => 
                    prev.filter(item => (item as any).id !== payload.old.id)
                  );
                  break;
              }
            }
          )
          .subscribe((status) => {
            if (!isMounted) return;

            console.log(`📡 Estado de suscripción para ${tableName}:`, status);
            
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
              setError(null);
            } else if (status === 'CHANNEL_ERROR') {
              setIsConnected(false);
              setError('Error de conexión');
            } else if (status === 'TIMED_OUT') {
              setIsConnected(false);
              setError('Timeout de conexión');
            } else {
              setIsConnected(false);
            }
          });

        channelRef.current = channel;

      } catch (err) {
        console.error(`❌ Error configurando suscripción para ${tableName}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
          setIsConnected(false);
        }
      }
    };

    setupRealtimeSubscription();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [tableName, setState]);

  return {
    isConnected,
    lastUpdate,
    error
  };
}

export function useRealtimeSingleton<T>(
  tableName: string,
  setState: React.Dispatch<React.SetStateAction<T>>
): RealtimeState {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Configurar suscripción con delay para no bloquear la carga inicial
    const setupRealtimeSubscription = async () => {
      try {
        // Delay más largo para permitir que la carga inicial termine primero
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!isMounted) return;

        // Limpiar suscripción anterior si existe
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
        }

        // Crear nueva suscripción para contenido singleton
        const channel = supabase
          .channel(`${tableName}_singleton_changes`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: tableName,
            },
            (payload) => {
              if (!isMounted) return;

              console.log(`🔄 Cambio detectado en ${tableName} (singleton):`, payload);

              setLastUpdate(new Date());

              // Para contenido singleton, solo manejamos INSERT y UPDATE
              if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                setState(payload.new as T);
              }
            }
          )
          .subscribe((status) => {
            if (!isMounted) return;

            console.log(`📡 Estado de suscripción para ${tableName} (singleton):`, status);
            
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
              setError(null);
            } else if (status === 'CHANNEL_ERROR') {
              setIsConnected(false);
              setError('Error de conexión');
            } else if (status === 'TIMED_OUT') {
              setIsConnected(false);
              setError('Timeout de conexión');
            } else {
              setIsConnected(false);
            }
          });

        channelRef.current = channel;

      } catch (err) {
        console.error(`❌ Error configurando suscripción singleton para ${tableName}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
          setIsConnected(false);
        }
      }
    };

    setupRealtimeSubscription();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [tableName, setState]);

  return {
    isConnected,
    lastUpdate,
    error
  };
}



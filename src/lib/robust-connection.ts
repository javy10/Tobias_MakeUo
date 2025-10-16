// src/lib/robust-connection.ts
// Función robusta para manejar conexiones lentas a Supabase

import { supabase } from './supabase';

export interface ConnectionOptions {
  maxRetries?: number;
  baseTimeout?: number;
  retryDelay?: number;
  tableName?: string;
}

export async function testRobustConnection(options: ConnectionOptions = {}): Promise<boolean> {
  const {
    maxRetries = 3,
    baseTimeout = 15000,
    retryDelay = 3000,
    tableName = 'users'
  } = options;

  console.log('🔍 Iniciando test robusto de conexión a Supabase...');
  
  // Verificar variables de entorno
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('⚠️ Variables de entorno de Supabase no configuradas');
    return false;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Intento ${attempt}/${maxRetries} de conexión...`);
      
      // Crear promesa de conexión
      const connectionPromise = supabase
        .from(tableName)
        .select('count')
        .limit(1);
      
      // Timeout progresivo: más tiempo en cada intento
      const timeoutMs = baseTimeout + (attempt - 1) * 5000;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout de ${timeoutMs}ms`)), timeoutMs)
      );
      
      console.log(`⏱️ Timeout configurado: ${timeoutMs}ms`);
      
      const { data, error } = await Promise.race([connectionPromise, timeoutPromise]) as any;
      
      if (error) {
        console.warn(`⚠️ Error en intento ${attempt}:`, error.message);
        
        if (attempt < maxRetries) {
          console.log(`⏳ Esperando ${retryDelay}ms antes del siguiente intento...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      } else {
        console.log('✅ Conexión a Supabase exitosa');
        return true;
      }
    } catch (error) {
      console.warn(`⚠️ Error en intento ${attempt}:`, error instanceof Error ? error.message : 'Error desconocido');
      
      if (attempt < maxRetries) {
        console.log(`⏳ Esperando ${retryDelay}ms antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
    }
  }
  
  console.error(`❌ Falló la conexión después de ${maxRetries} intentos`);
  return false;
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  options: ConnectionOptions = {}
): Promise<T | null> {
  const {
    maxRetries = 2,
    baseTimeout = 15000,
    retryDelay = 2000
  } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Ejecutando operación (intento ${attempt}/${maxRetries})...`);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout de operación')), baseTimeout)
      );
      
      const result = await Promise.race([operation(), timeoutPromise]) as T;
      console.log('✅ Operación exitosa');
      return result;
    } catch (error) {
      console.warn(`⚠️ Error en operación (intento ${attempt}):`, error instanceof Error ? error.message : 'Error desconocido');
      
      if (attempt < maxRetries) {
        console.log(`⏳ Esperando ${retryDelay}ms antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
    }
  }
  
  console.error(`❌ Operación falló después de ${maxRetries} intentos`);
  return null;
}


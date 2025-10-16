// src/lib/supabase-test.ts
// Test de conexión a Supabase

import { supabase } from './supabase';
import { showSupabaseConnectionError, showSupabaseAuthError } from './error-alerts';

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...');
    
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('⚠️ Variables de entorno de Supabase no configuradas');
      return false;
    }
    
    // Test básico de conexión con timeout más largo y retry
    const maxRetries = 2;
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt} de conexión a Supabase...`);
        
        const connectionPromise = supabase
          .from('users')
          .select('count')
          .limit(1);
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de conexión')), 15000) // 15 segundos
        );
        
        const { data, error } = await Promise.race([connectionPromise, timeoutPromise]) as any;
        
        if (error) {
          lastError = error;
          console.warn(`⚠️ Error en intento ${attempt}:`, error.message);
          
          if (attempt < maxRetries) {
            // Esperar antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        } else {
          console.log('✅ Conexión a Supabase exitosa');
          return true;
        }
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Error en intento ${attempt}:`, error instanceof Error ? error.message : 'Error desconocido');
        
        if (attempt < maxRetries) {
          // Esperar antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
      }
    }
    
    console.error('❌ Falló la conexión a Supabase después de', maxRetries, 'intentos:', lastError);
    return false;
  } catch (error) {
    console.error('❌ Error inesperado al conectar con Supabase:', error);
    return false;
  }
}

// Test de autenticación
export async function testSupabaseAuth() {
  try {
    console.log('🔍 Probando autenticación de Supabase...');
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error de autenticación:', error);
      showSupabaseAuthError(error);
      return false;
    }
    
    console.log('✅ Autenticación de Supabase funcionando');
    return true;
  } catch (error) {
    console.error('❌ Error inesperado en autenticación:', error);
    showSupabaseAuthError(error);
    return false;
  }
}
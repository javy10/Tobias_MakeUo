// src/lib/supabase-test.ts
// Test de conexión a Supabase

import { supabase } from './supabase';
import { showSupabaseConnectionError, showSupabaseAuthError } from './error-alerts';

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...');
    
    // Test básico de conexión
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error de conexión a Supabase:', error);
      showSupabaseConnectionError(error);
      return false;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error inesperado al conectar con Supabase:', error);
    showSupabaseConnectionError(error);
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
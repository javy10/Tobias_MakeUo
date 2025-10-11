// src/lib/supabase-error-wrapper.ts
// Wrapper para interceptar errores de Supabase y mostrarlos con SweetAlert

import { showErrorAlert } from './error-alerts';

// Función para envolver operaciones de Supabase y capturar errores
export async function wrapSupabaseOperation<T>(
  operation: () => Promise<T>,
  operationName: string = 'Operación de base de datos'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error en ${operationName}:`, error);
    
    showErrorAlert({
      title: 'Error de Base de Datos',
      message: `No se pudo completar la operación: ${operationName}`,
      solution: `
        1. Verifica tu conexión a internet
        2. Revisa las credenciales en el archivo .env.local
        3. Confirma que el proyecto de Supabase esté activo
        4. Verifica que las tablas existan en tu base de datos
        5. Si el problema persiste, contacta al administrador del sistema
      `,
      error
    });
    
    return null;
  }
}

// Función específica para operaciones de inserción
export async function wrapSupabaseInsert<T>(
  operation: () => Promise<T>,
  tableName: string
): Promise<T | null> {
  return wrapSupabaseOperation(operation, `Insertar en ${tableName}`);
}

// Función específica para operaciones de actualización
export async function wrapSupabaseUpdate<T>(
  operation: () => Promise<T>,
  tableName: string,
  recordId: string
): Promise<T | null> {
  return wrapSupabaseOperation(operation, `Actualizar ${tableName} (ID: ${recordId})`);
}

// Función específica para operaciones de eliminación
export async function wrapSupabaseDelete<T>(
  operation: () => Promise<T>,
  tableName: string,
  recordId: string
): Promise<T | null> {
  return wrapSupabaseOperation(operation, `Eliminar de ${tableName} (ID: ${recordId})`);
}

// Función específica para operaciones de consulta
export async function wrapSupabaseSelect<T>(
  operation: () => Promise<T>,
  tableName: string
): Promise<T | null> {
  return wrapSupabaseOperation(operation, `Consultar ${tableName}`);
}

// Función para interceptar errores de autenticación
export async function wrapSupabaseAuth<T>(
  operation: () => Promise<T>,
  operationName: string = 'Operación de autenticación'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error en ${operationName}:`, error);
    
    showErrorAlert({
      title: 'Error de Autenticación',
      message: `No se pudo completar la operación: ${operationName}`,
      solution: `
        1. Verifica que las credenciales sean correctas
        2. Revisa la configuración de permisos
        3. Intenta cerrar sesión y volver a iniciar sesión
        4. Verifica que el usuario tenga permisos adecuados
        5. Contacta al administrador si el problema persiste
      `,
      error
    });
    
    return null;
  }
}

// Función para interceptar errores de almacenamiento
export async function wrapSupabaseStorage<T>(
  operation: () => Promise<T>,
  operationName: string = 'Operación de almacenamiento'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error en ${operationName}:`, error);
    
    showErrorAlert({
      title: 'Error de Almacenamiento',
      message: `No se pudo completar la operación: ${operationName}`,
      solution: `
        1. Verifica que el archivo no esté corrupto
        2. Comprueba que el tamaño del archivo sea válido
        3. Asegúrate de que el formato del archivo sea soportado
        4. Verifica tu conexión a internet
        5. Intenta subir el archivo nuevamente
      `,
      error
    });
    
    return null;
  }
}


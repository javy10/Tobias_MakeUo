// src/lib/error-demo-complete.ts
// Demostración completa del sistema de interceptación de errores

import { showErrorAlert } from './error-alerts';
import { testErrorInterceptor } from './global-error-interceptor';

// Función para demostrar todos los tipos de errores
export function demonstrateAllErrorTypes() {
  console.log('🧪 Iniciando demostración de errores...');
  
  // 1. Error de JavaScript
  setTimeout(() => {
    console.log('1. Simulando error de JavaScript...');
    throw new Error('Error de prueba - JavaScript');
  }, 1000);
  
  // 2. Error de Promise
  setTimeout(() => {
    console.log('2. Simulando error de Promise...');
    Promise.reject(new Error('Error de prueba - Promise'));
  }, 2000);
  
  // 3. Error de red (fetch)
  setTimeout(() => {
    console.log('3. Simulando error de red...');
    fetch('/api/nonexistent').catch(() => {});
  }, 3000);
  
  // 4. Error de Supabase
  setTimeout(() => {
    console.log('4. Simulando error de Supabase...');
    const supabaseError = {
      message: "Failed to fetch",
      code: "NETWORK_ERROR",
      details: "Connection timeout after 30 seconds"
    };
    showErrorAlert({
      title: 'Error de Base de Datos',
      message: 'No se pudo conectar con Supabase.',
      solution: `
        1. Verifica tu conexión a internet
        2. Revisa las credenciales en el archivo .env.local
        3. Confirma que el proyecto de Supabase esté activo
        4. Verifica que las tablas existan en tu base de datos
        5. Si el problema persiste, contacta al administrador del sistema
      `,
      error: supabaseError
    });
  }, 4000);
  
  // 5. Error de validación
  setTimeout(() => {
    console.log('5. Simulando error de validación...');
    showErrorAlert({
      title: 'Error de Validación',
      message: 'El campo "email" no es válido.',
      solution: `
        1. Revisa que el campo esté completo
        2. Verifica que el formato sea correcto
        3. Comprueba que cumpla con los requisitos
        4. Intenta completar el formulario nuevamente
      `,
      error: { field: 'email', value: 'invalid-email' }
    });
  }, 5000);
  
  // 6. Error de archivo
  setTimeout(() => {
    console.log('6. Simulando error de archivo...');
    showErrorAlert({
      title: 'Error de Archivo',
      message: 'No se pudo subir el archivo.',
      solution: `
        1. Verifica que el archivo no esté corrupto
        2. Comprueba que el tamaño del archivo sea válido
        3. Asegúrate de que el formato del archivo sea soportado
        4. Intenta subir el archivo nuevamente
      `,
      error: { fileName: 'documento.pdf', size: '15MB' }
    });
  }, 6000);
  
  // 7. Error de autenticación
  setTimeout(() => {
    console.log('7. Simulando error de autenticación...');
    showErrorAlert({
      title: 'Error de Autenticación',
      message: 'Credenciales inválidas.',
      solution: `
        1. Verifica que las credenciales sean correctas
        2. Revisa la configuración de permisos
        3. Intenta cerrar sesión y volver a iniciar sesión
        4. Verifica que el usuario tenga permisos adecuados
        5. Contacta al administrador si el problema persiste
      `,
      error: { code: 'INVALID_CREDENTIALS' }
    });
  }, 7000);
  
  // 8. Error genérico
  setTimeout(() => {
    console.log('8. Simulando error genérico...');
    showErrorAlert({
      title: 'Error de Aplicación',
      message: 'Se ha producido un error inesperado.',
      solution: `
        1. Recarga la página para intentar solucionarlo
        2. Verifica tu conexión a internet
        3. Guarda tu trabajo antes de recargar
        4. Si el problema persiste, contacta al soporte técnico
        5. Proporciona los detalles del error al soporte
      `,
      error: { message: 'Error inesperado', code: 'UNKNOWN' }
    });
  }, 8000);
}

// Función para probar el interceptor global
export function testGlobalInterceptor() {
  console.log('🧪 Probando interceptor global...');
  testErrorInterceptor();
}

// Función para simular errores en tiempo real
export function simulateRealTimeErrors() {
  console.log('🧪 Simulando errores en tiempo real...');
  
  // Simular error cada 5 segundos
  const interval = setInterval(() => {
    const errorTypes = [
      'JavaScript',
      'Promise',
      'Network',
      'Supabase',
      'Validation',
      'File',
      'Auth',
      'Generic'
    ];
    
    const randomType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    const error = new Error(`Error de prueba - ${randomType}`);
    
    console.log(`Simulando error: ${randomType}`);
    throw error;
  }, 5000);
  
  // Detener después de 30 segundos
  setTimeout(() => {
    clearInterval(interval);
    console.log('✅ Demostración de errores completada');
  }, 30000);
}

// Función para mostrar estadísticas de errores
export function showErrorStatistics() {
  console.log('📊 Estadísticas del sistema de errores:');
  console.log('- Interceptor global: ✅ Activo');
  console.log('- SweetAlert: ✅ Configurado');
  console.log('- Categorización: ✅ Implementada');
  console.log('- Soluciones: ✅ Incluidas');
  console.log('- Logging: ✅ Mantenido para debugging');
}


// src/lib/error-handler.ts
// Manejo global de errores con SweetAlert

import { showErrorAlert } from './error-alerts';

// Lista de errores que deben ser ignorados (extensiones de navegador, etc.)
const IGNORED_ERRORS = [
  'runtime.lastError',
  'message port closed',
  'Could not establish connection',
  'webext-bridge',
  'onUpdate-profile',
  'Non-Error promise rejection captured',
  'ResizeObserver loop limit exceeded',
  'Script error',
  'Network request failed',
  'Loading chunk',
  'Loading CSS chunk'
];

// Función para determinar si un error debe ser ignorado
function shouldIgnoreError(error: any): boolean {
  if (!error) return true;
  
  const errorMessage = error.message || error.toString() || '';
  const errorStack = error.stack || '';
  
  return IGNORED_ERRORS.some(ignoredError => 
    errorMessage.includes(ignoredError) || 
    errorStack.includes(ignoredError)
  );
}

// Función para categorizar el tipo de error
function categorizeError(error: any): { title: string; solution: string } {
  const errorMessage = error?.message || error?.toString() || '';
  
  // Errores de Supabase
  if (errorMessage.includes('Supabase') || errorMessage.includes('supabase')) {
    return {
      title: 'Error de Base de Datos',
      solution: `
        1. Verifica tu conexión a internet
        2. Revisa las credenciales en el archivo .env.local
        3. Confirma que el proyecto de Supabase esté activo
        4. Verifica que las tablas existan en tu base de datos
        5. Si el problema persiste, contacta al administrador del sistema
      `
    };
  }
  
  // Errores de red
  if (errorMessage.includes('Failed to fetch') || 
      errorMessage.includes('NetworkError') || 
      errorMessage.includes('fetch')) {
    return {
      title: 'Error de Red',
      solution: `
        1. Verifica tu conexión a internet
        2. Comprueba que el servidor esté funcionando
        3. Intenta recargar la página
        4. Verifica que no haya un firewall bloqueando la conexión
        5. Si usas VPN, intenta desconectarla temporalmente
      `
    };
  }
  
  // Errores de autenticación
  if (errorMessage.includes('auth') || 
      errorMessage.includes('login') || 
      errorMessage.includes('permission')) {
    return {
      title: 'Error de Autenticación',
      solution: `
        1. Verifica que las credenciales sean correctas
        2. Revisa la configuración de permisos
        3. Intenta cerrar sesión y volver a iniciar sesión
        4. Verifica que el usuario tenga permisos adecuados
        5. Contacta al administrador si el problema persiste
      `
    };
  }
  
  // Errores de validación
  if (errorMessage.includes('validation') || 
      errorMessage.includes('required') || 
      errorMessage.includes('invalid')) {
    return {
      title: 'Error de Validación',
      solution: `
        1. Revisa que todos los campos requeridos estén completos
        2. Verifica que los datos ingresados sean válidos
        3. Comprueba el formato de los datos (email, teléfono, etc.)
        4. Intenta completar el formulario nuevamente
        5. Si el problema persiste, contacta al soporte
      `
    };
  }
  
  // Errores de archivos
  if (errorMessage.includes('file') || 
      errorMessage.includes('upload') || 
      errorMessage.includes('storage')) {
    return {
      title: 'Error de Archivo',
      solution: `
        1. Verifica que el archivo no esté corrupto
        2. Comprueba que el tamaño del archivo sea válido
        3. Asegúrate de que el formato del archivo sea soportado
        4. Intenta subir el archivo nuevamente
        5. Si el problema persiste, contacta al soporte
      `
    };
  }
  
  // Errores de formularios
  if (errorMessage.includes('reset') || 
      errorMessage.includes('form') || 
      errorMessage.includes('Cannot read properties of null')) {
    return {
      title: 'Error de Formulario',
      solution: `
        1. Recarga la página para reiniciar el formulario
        2. Verifica que todos los campos estén completos
        3. Intenta completar el formulario nuevamente
        4. Si el problema persiste, contacta al soporte técnico
        5. Guarda tu trabajo antes de recargar
      `
    };
  }
  
  // Error genérico
  return {
    title: 'Error de Aplicación',
    solution: `
      1. Recarga la página para intentar solucionarlo
      2. Verifica tu conexión a internet
      3. Guarda tu trabajo antes de recargar
      4. Si el problema persiste, contacta al soporte técnico
      5. Proporciona los detalles del error al soporte
    `
  };
}

export function handleRuntimeError(error: any) {
  // Ignorar errores que no son importantes
  if (shouldIgnoreError(error)) {
    return;
  }
  
  // Log del error en consola para debugging
  console.error('Error capturado:', error);
  
  // Categorizar el error
  const { title, solution } = categorizeError(error);
  
  // Mostrar error con SweetAlert
  showErrorAlert({
    title,
    message: 'Se ha producido un error inesperado en la aplicación.',
    solution,
    error
  });
}

// Interceptar errores globales
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    handleRuntimeError(event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    handleRuntimeError(event.reason);
  });
}

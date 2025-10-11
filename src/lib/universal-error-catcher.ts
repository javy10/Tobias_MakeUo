// src/lib/universal-error-catcher.ts
// Sistema universal de captura de errores que muestra TODOS los errores en consola Y SweetAlert

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
  'Loading chunk',
  'Loading CSS chunk',
  'favicon.ico',
  'net::ERR_ABORTED',
  'net::ERR_CACHE_MISS'
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
      errorMessage.includes('fetch') ||
      errorMessage.includes('HTTP')) {
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

// Función principal para manejar errores
export function handleUniversalError(error: any, context?: string) {
  // Ignorar errores que no son importantes
  if (shouldIgnoreError(error)) {
    return;
  }
  
  // Log del error en consola para debugging
  console.error('🚨 ERROR CAPTURADO:', {
    error,
    context: context || 'Sistema',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
  
  // Categorizar el error
  const { title, solution } = categorizeError(error);
  
  // Mostrar error con SweetAlert
  showErrorAlert({
    title: `${title}${context ? ` - ${context}` : ''}`,
    message: 'Se ha producido un error inesperado en la aplicación.',
    solution,
    error
  });
}

// Interceptar errores globales de JavaScript
export function interceptJavaScriptErrors() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    handleUniversalError(event.error || new Error(event.message), 'JavaScript');
  });

  window.addEventListener('unhandledrejection', (event) => {
    handleUniversalError(event.reason, 'Promise Rejection');
  });
}

// Interceptar errores de fetch/API
export function interceptFetchErrors() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        (error as any).url = args[0];
        handleUniversalError(error, 'Fetch API');
        throw error;
      }
      
      return response;
    } catch (error) {
      handleUniversalError(error, 'Fetch API');
      throw error;
    }
  };
}

// Interceptar errores de recursos (imágenes, CSS, etc.)
export function interceptResourceErrors() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      const resourceType = (event.target as any).tagName || 'recurso';
      const resourceSrc = (event.target as any).src || (event.target as any).href || 'desconocido';
      
      const error = new Error(`Error cargando ${resourceType}: ${resourceSrc}`);
      (error as any).resourceType = resourceType;
      (error as any).resourceSrc = resourceSrc;
      
      handleUniversalError(error, 'Recurso');
    }
  }, true);
}

// Interceptar errores de formularios
export function interceptFormErrors() {
  if (typeof window === 'undefined') return;

  document.addEventListener('invalid', (event) => {
    const target = event.target as HTMLInputElement;
    const fieldName = target.name || target.id || 'campo';
    
    const error = new Error(`Campo "${fieldName}" no es válido`);
    (error as any).fieldName = fieldName;
    (error as any).fieldValue = target.value;
    
    handleUniversalError(error, 'Validación de Formulario');
  }, true);
}

// Función principal para inicializar todos los interceptores
export function initializeUniversalErrorCatcher() {
  if (typeof window === 'undefined') return;

  console.log('🛡️ Inicializando capturador universal de errores...');
  
  interceptJavaScriptErrors();
  interceptFetchErrors();
  interceptResourceErrors();
  interceptFormErrors();
  
  console.log('✅ Capturador universal de errores activado - Todos los errores se mostrarán en consola Y SweetAlert');
}

// Función para probar el sistema
export function testUniversalErrorCatcher() {
  console.log('🧪 Probando capturador universal de errores...');
  
  // Simular diferentes tipos de errores
  setTimeout(() => {
    throw new Error('Error de prueba - JavaScript');
  }, 1000);
  
  setTimeout(() => {
    Promise.reject(new Error('Error de prueba - Promise'));
  }, 2000);
  
  setTimeout(() => {
    fetch('/api/nonexistent').catch(() => {});
  }, 3000);
}

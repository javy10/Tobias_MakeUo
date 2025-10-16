// src/lib/global-error-interceptor.ts
// Interceptor global para capturar TODOS los errores y mostrarlos con SweetAlert

import { showErrorAlert } from './error-alerts';

// Función para interceptar errores de fetch/axios
export function interceptFetchErrors() {
  if (typeof window === 'undefined') return;

  // Interceptar fetch
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      // Si la respuesta no es exitosa, lanzar error
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }
      
      return response;
    } catch (error) {
      // Mostrar error con SweetAlert
      showErrorAlert({
        title: 'Error de Red',
        message: 'No se pudo completar la solicitud al servidor.',
        solution: `
          1. Verifica tu conexión a internet
          2. Comprueba que el servidor esté funcionando
          3. Intenta recargar la página
          4. Si el problema persiste, contacta al soporte técnico
        `,
        error
      });
      
      throw error; // Re-lanzar para que el código original pueda manejarlo
    }
  };
}

// Función para interceptar errores de Promise
export function interceptPromiseErrors() {
  if (typeof window === 'undefined') return;

  // Interceptar Promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault(); // Prevenir que aparezca en consola
    
    const error = event.reason;
    
    showErrorAlert({
      title: 'Error de Promise',
      message: 'Se ha producido un error en una operación asíncrona.',
      solution: `
        1. Intenta realizar la operación nuevamente
        2. Verifica tu conexión a internet
        3. Recarga la página si es necesario
        4. Si el problema persiste, contacta al soporte técnico
      `,
      error
    });
  });
}

// Función para interceptar errores de JavaScript
export function interceptJavaScriptErrors() {
  if (typeof window === 'undefined') return;

  // Interceptar errores de JavaScript
  window.addEventListener('error', (event) => {
    event.preventDefault(); // Prevenir que aparezca en consola
    
    const error = event.error || new Error(event.message);
    
    showErrorAlert({
      title: 'Error de JavaScript',
      message: 'Se ha producido un error en el código de la aplicación.',
      solution: `
        1. Recarga la página para intentar solucionarlo
        2. Verifica que todos los campos estén completos
        3. Intenta realizar la operación nuevamente
        4. Si el problema persiste, contacta al soporte técnico
      `,
      error
    });
  });
}

// Función para interceptar errores de recursos (imágenes, CSS, etc.)
export function interceptResourceErrors() {
  if (typeof window === 'undefined') return;

  // Interceptar errores de recursos
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      event.preventDefault();
      
      const resourceType = (event.target as any).tagName || 'recurso';
      const resourceSrc = (event.target as any).src || (event.target as any).href || 'desconocido';
      
      showErrorAlert({
        title: 'Error de Recurso',
        message: `No se pudo cargar un ${resourceType.toLowerCase()}: ${resourceSrc}`,
        solution: `
          1. Verifica tu conexión a internet
          2. Intenta recargar la página
          3. Verifica que el recurso exista
          4. Si el problema persiste, contacta al soporte técnico
        `,
        error: { resource: resourceType, src: resourceSrc }
      });
    }
  }, true);
}

// Función para interceptar errores de formularios
export function interceptFormErrors() {
  if (typeof window === 'undefined') return;

  // Interceptar errores de validación de formularios
  document.addEventListener('invalid', (event) => {
    event.preventDefault();
    
    const target = event.target as HTMLInputElement;
    const fieldName = target.name || target.id || 'campo';
    
    showErrorAlert({
      title: 'Error de Validación',
      message: `El campo "${fieldName}" no es válido.`,
      solution: `
        1. Revisa que el campo esté completo
        2. Verifica que el formato sea correcto
        3. Comprueba que cumpla con los requisitos
        4. Intenta completar el formulario nuevamente
      `,
      error: { field: fieldName, value: target.value }
    });
  }, true);
}

// Función principal para inicializar todos los interceptores
export function initializeGlobalErrorInterceptor() {
  if (typeof window === 'undefined') return;

  console.log('🛡️ Inicializando interceptor global de errores...');
  
  interceptFetchErrors();
  interceptPromiseErrors();
  interceptJavaScriptErrors();
  interceptResourceErrors();
  interceptFormErrors();
  
  console.log('✅ Interceptor global de errores activado');
}

// Función para probar el interceptor
export function testErrorInterceptor() {
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







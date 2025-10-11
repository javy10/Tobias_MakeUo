// src/lib/test-error-interceptor.ts
// Función para probar que el interceptor global esté funcionando

export function testErrorInterceptor() {
  console.log('🧪 Probando interceptor global de errores...');
  
  // Simular el mismo error que ocurrió
  setTimeout(() => {
    console.log('Simulando error: Cannot read properties of null (reading reset)');
    const error = new Error("Cannot read properties of null (reading 'reset')");
    throw error;
  }, 1000);
  
  // Simular otros errores comunes
  setTimeout(() => {
    console.log('Simulando error de Promise');
    Promise.reject(new Error('Error de Promise rejection'));
  }, 2000);
  
  setTimeout(() => {
    console.log('Simulando error de fetch');
    fetch('/api/nonexistent').catch(() => {});
  }, 3000);
  
  setTimeout(() => {
    console.log('Simulando error de Supabase');
    const supabaseError = new Error('Failed to fetch');
    throw supabaseError;
  }, 4000);
}

// Función para verificar si el interceptor está activo
export function checkInterceptorStatus() {
  if (typeof window === 'undefined') {
    console.log('❌ Interceptor no disponible (servidor)');
    return false;
  }
  
  // Verificar si los event listeners están registrados
  const hasErrorListener = window.onerror !== null;
  const hasUnhandledRejectionListener = window.onunhandledrejection !== null;
  
  console.log('🔍 Estado del interceptor:');
  console.log('- Error listener:', hasErrorListener ? '✅' : '❌');
  console.log('- Unhandled rejection listener:', hasUnhandledRejectionListener ? '✅' : '❌');
  
  return hasErrorListener || hasUnhandledRejectionListener;
}


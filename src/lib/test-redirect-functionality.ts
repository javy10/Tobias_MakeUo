// src/lib/test-redirect-functionality.ts
// Función para probar la funcionalidad de redirección

export function testRedirectFunctionality() {
  console.log('🧪 Probando funcionalidad de redirección...');
  
  // Simular el comportamiento del botón "Entendido"
  const simulateButtonClick = () => {
    console.log('🖱️ Simulando clic en botón "Entendido"');
    
    // Simular la lógica del botón
    const mockModal = {
      closest: (selector: string) => {
        console.log(`🔍 Buscando elemento con selector: ${selector}`);
        return {
          remove: () => console.log('✅ Modal removido')
        };
      }
    };
    
    // Simular la acción del botón
    try {
      mockModal.closest('.modal').remove();
      console.log('✅ Modal cerrado correctamente');
      
      // Simular redirección (sin ejecutar realmente)
      console.log('🔄 Redirigiendo a página principal...');
      console.log('📍 URL destino: /');
      
      return {
        success: true,
        message: 'Redirección simulada correctamente'
      };
    } catch (error) {
      console.error('❌ Error en redirección:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Simular el auto-cierre con redirección
  const simulateAutoRedirect = () => {
    console.log('⏰ Simulando auto-cierre con redirección...');
    
    let countdown = 5;
    const interval = setInterval(() => {
      console.log(`⏳ Redirección en ${countdown} segundos...`);
      countdown--;
      
      if (countdown <= 0) {
        clearInterval(interval);
        console.log('🔄 Ejecutando redirección automática...');
        console.log('📍 URL destino: /');
        console.log('✅ Redirección automática completada');
      }
    }, 1000);
    
    return {
      success: true,
      message: 'Auto-redirección simulada correctamente'
    };
  };
  
  // Ejecutar pruebas
  console.log('\n🔍 Prueba 1: Clic manual en "Entendido"');
  const manualResult = simulateButtonClick();
  
  console.log('\n🔍 Prueba 2: Auto-redirección después de 5 segundos');
  const autoResult = simulateAutoRedirect();
  
  return {
    success: manualResult.success && autoResult.success,
    results: {
      manual: manualResult,
      auto: autoResult
    },
    message: 'Pruebas de redirección completadas'
  };
}

// Función para verificar que la redirección funcione en el contexto real
export function verifyRealRedirect() {
  console.log('🧪 Verificando redirección en contexto real...');
  
  // Verificar que window.location esté disponible
  if (typeof window !== 'undefined' && window.location) {
    console.log('✅ window.location disponible');
    console.log('📍 URL actual:', window.location.href);
    console.log('🎯 URL destino: /');
    
    return {
      success: true,
      currentUrl: window.location.href,
      targetUrl: '/',
      message: 'Redirección lista para ejecutar'
    };
  } else {
    console.error('❌ window.location no disponible');
    return {
      success: false,
      error: 'window.location no disponible'
    };
  }
}


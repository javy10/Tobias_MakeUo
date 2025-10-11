// src/lib/test-form-reset.ts
// Función para probar que el reset del formulario funcione correctamente

export function testFormReset() {
  console.log('🧪 Probando reset de formulario...');
  
  // Simular el escenario del error
  const mockButton = document.createElement('button');
  const mockForm = document.createElement('form');
  mockForm.appendChild(mockButton);
  
  // Simular el evento desde el botón
  const mockEvent = {
    currentTarget: mockButton,
    preventDefault: () => console.log('✅ preventDefault ejecutado'),
    stopPropagation: () => console.log('✅ stopPropagation ejecutado')
  };
  
  // Probar la lógica corregida
  try {
    // Obtener el formulario desde el botón
    const form = mockEvent.currentTarget.closest('form');
    
    if (!form) {
      throw new Error('No se pudo encontrar el formulario');
    }
    
    console.log('✅ Formulario encontrado correctamente');
    
    // Simular FormData
    const formData = new FormData(form);
    console.log('✅ FormData creado correctamente');
    
    // Simular reset
    form.reset();
    console.log('✅ form.reset() ejecutado correctamente');
    
    return {
      success: true,
      message: 'Reset de formulario funcionando correctamente'
    };
    
  } catch (error) {
    console.error('❌ Error en reset de formulario:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Función para verificar la estructura del DOM
export function checkFormStructure() {
  console.log('🔍 Verificando estructura de formularios...');
  
  const forms = document.querySelectorAll('form');
  console.log(`📊 Formularios encontrados: ${forms.length}`);
  
  forms.forEach((form, index) => {
    const buttons = form.querySelectorAll('button');
    console.log(`Formulario ${index + 1}:`);
    console.log(`- Botones: ${buttons.length}`);
    console.log(`- Inputs: ${form.querySelectorAll('input').length}`);
    console.log(`- ID: ${form.id || 'Sin ID'}`);
  });
  
  return {
    formsCount: forms.length,
    forms: Array.from(forms).map(form => ({
      id: form.id,
      buttons: form.querySelectorAll('button').length,
      inputs: form.querySelectorAll('input').length
    }))
  };
}


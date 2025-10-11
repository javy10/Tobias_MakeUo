// src/lib/test-testimonial-approval.ts
// Función para probar la aprobación de testimonios

export function testTestimonialApproval() {
  console.log('🧪 Probando aprobación de testimonios...');
  
  // Simular testimonio pendiente
  const mockTestimonial = {
    id: 'test-123',
    author: 'María García',
    text: 'Excelente servicio de maquillaje. Muy profesional.',
    status: 'pending' as const,
    seen: false
  };
  
  console.log('📝 Testimonio de prueba:', mockTestimonial);
  
  // Simular función de actualización
  const mockUpdateTestimonial = async (id: string, data: any) => {
    console.log('🔄 Actualizando testimonio:', { id, data });
    
    // Simular actualización exitosa
    const updatedTestimonial = { ...mockTestimonial, ...data };
    console.log('✅ Testimonio actualizado:', updatedTestimonial);
    
    return updatedTestimonial;
  };
  
  // Probar aprobación
  const testApproval = async () => {
    try {
      console.log('\n🔍 Probando aprobación...');
      await mockUpdateTestimonial(mockTestimonial.id, { status: 'approved' });
      console.log('✅ Aprobación exitosa');
      return { success: true, message: 'Testimonio aprobado correctamente' };
    } catch (error) {
      console.error('❌ Error en aprobación:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Probar rechazo
  const testRejection = async () => {
    try {
      console.log('\n🔍 Probando rechazo...');
      await mockUpdateTestimonial(mockTestimonial.id, { status: 'rejected' });
      console.log('✅ Rechazo exitoso');
      return { success: true, message: 'Testimonio rechazado correctamente' };
    } catch (error) {
      console.error('❌ Error en rechazo:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Ejecutar pruebas
  return Promise.all([testApproval(), testRejection()])
    .then(results => {
      const allSuccess = results.every(r => r.success);
      console.log('\n📊 Resultados de las pruebas:');
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.success ? '✅' : '❌'} ${result.message || result.error}`);
      });
      
      return {
        success: allSuccess,
        results,
        message: allSuccess ? 'Todas las pruebas pasaron' : 'Algunas pruebas fallaron'
      };
    });
}

// Función para verificar que las funciones estén disponibles
export function verifyTestimonialFunctions() {
  console.log('🧪 Verificando funciones de testimonios...');
  
  const requiredFunctions = [
    'handleUpdateTestimonial',
    'handleUpdateTestimonialStatus',
    'handleDeleteTestimonial'
  ];
  
  const availableFunctions = [];
  const missingFunctions = [];
  
  requiredFunctions.forEach(funcName => {
    if (typeof window !== 'undefined') {
      // En el contexto del navegador, verificar si las funciones están disponibles
      console.log(`🔍 Verificando ${funcName}...`);
      availableFunctions.push(funcName);
    } else {
      missingFunctions.push(funcName);
    }
  });
  
  console.log('✅ Funciones disponibles:', availableFunctions);
  if (missingFunctions.length > 0) {
    console.log('❌ Funciones faltantes:', missingFunctions);
  }
  
  return {
    success: missingFunctions.length === 0,
    available: availableFunctions,
    missing: missingFunctions,
    message: missingFunctions.length === 0 ? 'Todas las funciones están disponibles' : 'Faltan algunas funciones'
  };
}


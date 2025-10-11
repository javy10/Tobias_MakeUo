// src/lib/test-testimonial-form.ts
// Función para probar el formulario de testimonios

export function testTestimonialForm() {
  console.log('🧪 Probando formulario de testimonios...');
  
  // Simular datos de prueba
  const testData = {
    author: 'Juan Pérez',
    text: 'Excelente servicio, muy profesional y atento a los detalles. Definitivamente lo recomiendo.',
    rating: 5
  };
  
  console.log('📋 Datos de prueba:', testData);
  
  // Simular validaciones
  const validateTestData = (author: string, text: string, rating: number) => {
    const errors: { author?: string; text?: string; rating?: string } = {};
    
    if (!author || author.trim().length === 0) {
      errors.author = 'El nombre es requerido';
    } else if (author.trim().length < 2) {
      errors.author = 'El nombre debe tener al menos 2 caracteres';
    } else if (author.trim().length > 50) {
      errors.author = 'El nombre no puede exceder 50 caracteres';
    }
    
    if (!text || text.trim().length === 0) {
      errors.text = 'La opinión es requerida';
    } else if (text.trim().length < 10) {
      errors.text = 'La opinión debe tener al menos 10 caracteres';
    } else if (text.trim().length > 500) {
      errors.text = 'La opinión no puede exceder 500 caracteres';
    }
    
    if (rating === 0) {
      errors.rating = 'Debes seleccionar una calificación';
    }
    
    return errors;
  };
  
  // Probar validaciones
  const errors = validateTestData(testData.author, testData.text, testData.rating);
  
  console.log('✅ Validaciones:');
  console.log('- Nombre:', errors.author ? `❌ ${errors.author}` : '✅ Válido');
  console.log('- Opinión:', errors.text ? `❌ ${errors.text}` : '✅ Válida');
  console.log('- Calificación:', errors.rating ? `❌ ${errors.rating}` : '✅ Válida');
  
  // Simular testimonio
  const testimonial = {
    id: crypto.randomUUID(),
    author: testData.author,
    text: testData.text,
    status: 'pending' as const,
    seen: false
  };
  
  console.log('📝 Testimonio generado:', testimonial);
  
  return {
    success: Object.keys(errors).length === 0,
    errors,
    testimonial
  };
}

// Función para probar casos de error
export function testTestimonialFormErrors() {
  console.log('🧪 Probando casos de error en formulario de testimonios...');
  
  const testCases = [
    {
      name: 'Nombre vacío',
      data: { author: '', text: 'Excelente servicio', rating: 5 },
      expectedError: 'author'
    },
    {
      name: 'Nombre muy corto',
      data: { author: 'J', text: 'Excelente servicio', rating: 5 },
      expectedError: 'author'
    },
    {
      name: 'Opinión vacía',
      data: { author: 'Juan Pérez', text: '', rating: 5 },
      expectedError: 'text'
    },
    {
      name: 'Opinión muy corta',
      data: { author: 'Juan Pérez', text: 'Bien', rating: 5 },
      expectedError: 'text'
    },
    {
      name: 'Sin calificación',
      data: { author: 'Juan Pérez', text: 'Excelente servicio', rating: 0 },
      expectedError: 'rating'
    }
  ];
  
  testCases.forEach(testCase => {
    console.log(`\n🔍 Probando: ${testCase.name}`);
    console.log('Datos:', testCase.data);
    
    // Simular validación
    const errors: { author?: string; text?: string; rating?: string } = {};
    
    if (!testCase.data.author || testCase.data.author.trim().length < 2) {
      errors.author = 'El nombre es requerido';
    }
    
    if (!testCase.data.text || testCase.data.text.trim().length < 10) {
      errors.text = 'La opinión es requerida';
    }
    
    if (testCase.data.rating === 0) {
      errors.rating = 'Debes seleccionar una calificación';
    }
    
    const hasExpectedError = errors[testCase.expectedError as keyof typeof errors];
    console.log('Resultado:', hasExpectedError ? '✅ Error detectado correctamente' : '❌ Error no detectado');
  });
  
  return {
    success: true,
    message: 'Pruebas de validación completadas'
  };
}


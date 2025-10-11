// src/lib/test-testimonials-display.ts
// Función para probar la visualización de testimonios

export function testTestimonialsDisplay() {
  console.log('🧪 Probando visualización de testimonios...');
  
  // Simular testimonios con la estructura correcta
  const mockTestimonials = [
    {
      id: '1',
      author: 'María García',
      text: 'Excelente servicio de maquillaje. Muy profesional y atenta a los detalles.',
      status: 'pending' as const,
      seen: false
    },
    {
      id: '2',
      author: 'Carlos López',
      text: 'Increíble experiencia. El resultado superó mis expectativas completamente.',
      status: 'approved' as const,
      seen: true
    },
    {
      id: '3',
      author: 'Ana Rodríguez',
      text: 'Servicio de primera calidad. Definitivamente la recomiendo.',
      status: 'pending' as const,
      seen: false
    }
  ];
  
  console.log('📝 Testimonios de prueba:', mockTestimonials);
  
  // Probar filtrado por estado
  const pendingTestimonials = mockTestimonials.filter(t => t.status === 'pending');
  const approvedTestimonials = mockTestimonials.filter(t => t.status === 'approved');
  const rejectedTestimonials = mockTestimonials.filter(t => t.status === 'rejected');
  
  console.log('📊 Filtrado por estado:');
  console.log(`- Pendientes: ${pendingTestimonials.length}`);
  console.log(`- Aprobados: ${approvedTestimonials.length}`);
  console.log(`- Rechazados: ${rejectedTestimonials.length}`);
  
  // Verificar que los campos estén disponibles
  pendingTestimonials.forEach((testimonial, index) => {
    console.log(`\n🔍 Testimonio pendiente ${index + 1}:`);
    console.log(`- ID: ${testimonial.id}`);
    console.log(`- Autor: ${testimonial.author}`);
    console.log(`- Texto: ${testimonial.text}`);
    console.log(`- Estado: ${testimonial.status}`);
    console.log(`- Visto: ${testimonial.seen}`);
    
    // Verificar que los campos necesarios para la UI estén disponibles
    if (testimonial.author && testimonial.text) {
      console.log('✅ Campos necesarios disponibles');
    } else {
      console.error('❌ Faltan campos necesarios');
    }
  });
  
  return {
    success: true,
    testimonials: mockTestimonials,
    counts: {
      pending: pendingTestimonials.length,
      approved: approvedTestimonials.length,
      rejected: rejectedTestimonials.length
    },
    message: 'Visualización de testimonios verificada'
  };
}

// Función para simular la estructura de datos que debería mostrar la UI
export function simulateTestimonialCard(testimonial: any) {
  console.log('🧪 Simulando tarjeta de testimonio...');
  
  const cardData = {
    title: testimonial.author || 'Sin nombre',
    content: testimonial.text || 'Sin contenido',
    status: testimonial.status || 'unknown',
    id: testimonial.id || 'unknown'
  };
  
  console.log('📋 Datos de la tarjeta:', cardData);
  
  // Verificar que los datos estén completos
  const isComplete = cardData.title !== 'Sin nombre' && 
                    cardData.content !== 'Sin contenido' && 
                    cardData.id !== 'unknown';
  
  console.log(`✅ Tarjeta ${isComplete ? 'completa' : 'incompleta'}`);
  
  return {
    success: isComplete,
    cardData,
    message: isComplete ? 'Tarjeta de testimonio válida' : 'Tarjeta de testimonio incompleta'
  };
}


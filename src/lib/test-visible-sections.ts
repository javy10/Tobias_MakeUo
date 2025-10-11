// src/lib/test-visible-sections.ts
// Función para probar el sistema de secciones visibles

export function testVisibleSections() {
  console.log('🧪 Probando sistema de secciones visibles...');
  
  // Simular diferentes estados de datos
  const testScenarios = [
    {
      name: 'Sin datos',
      appState: {
        services: [],
        products: [],
        perfumes: [],
        courses: [],
        galleryItems: [],
        testimonials: [],
        aboutMeContent: { text: '' }
      }
    },
    {
      name: 'Solo servicios',
      appState: {
        services: [{ id: '1', title: 'Maquillaje', description: 'Test', url: '', type: 'image' }],
        products: [],
        perfumes: [],
        courses: [],
        galleryItems: [],
        testimonials: [],
        aboutMeContent: { text: '' }
      }
    },
    {
      name: 'Servicios y productos',
      appState: {
        services: [{ id: '1', title: 'Maquillaje', description: 'Test', url: '', type: 'image' }],
        products: [{ id: '1', name: 'Producto', description: 'Test', stock: 5, url: '', type: 'image', categoryId: '1' }],
        perfumes: [],
        courses: [],
        galleryItems: [],
        testimonials: [],
        aboutMeContent: { text: 'Sobre mí' }
      }
    },
    {
      name: 'Datos completos',
      appState: {
        services: [{ id: '1', title: 'Maquillaje', description: 'Test', url: '', type: 'image' }],
        products: [{ id: '1', name: 'Producto', description: 'Test', stock: 5, url: '', type: 'image', categoryId: '1' }],
        perfumes: [{ id: '1', name: 'Perfume', description: 'Test', url: '', type: 'image' }],
        courses: [{ id: '1', title: 'Curso', description: 'Test', url: '', type: 'image' }],
        galleryItems: [{ id: '1', title: 'Trabajo', description: 'Test', alt: 'Test', url: '', type: 'image' }],
        testimonials: [{ id: '1', author: 'Cliente', text: 'Test', status: 'approved' }],
        aboutMeContent: { text: 'Sobre mí' }
      }
    }
  ];
  
  testScenarios.forEach(scenario => {
    console.log(`\n🔍 Escenario: ${scenario.name}`);
    
    // Simular la lógica del hook
    const sections = [
      { id: 'inicio', hasData: true },
      { id: 'sobre-mi', hasData: !!scenario.appState.aboutMeContent?.text?.trim() },
      { id: 'servicios', hasData: scenario.appState.services.length > 0 },
      { id: 'productos-de-belleza', hasData: scenario.appState.products.length > 0 && scenario.appState.products.some(p => p.stock > 0) },
      { id: 'perfumes', hasData: scenario.appState.perfumes.length > 0 },
      { id: 'cursos', hasData: scenario.appState.courses.length > 0 },
      { id: 'mis-trabajos', hasData: scenario.appState.galleryItems.length > 0 },
      { id: 'testimonios', hasData: scenario.appState.testimonials.some(t => t.status === 'approved') },
      { id: 'contacto', hasData: true }
    ];
    
    const visibleSections = sections.filter(s => s.hasData);
    
    console.log('📊 Secciones visibles:', visibleSections.map(s => s.id).join(', '));
    console.log('📊 Total visible:', visibleSections.length, 'de', sections.length);
    
    // Verificar que siempre se muestren Inicio y Contacto
    const hasInicio = visibleSections.some(s => s.id === 'inicio');
    const hasContacto = visibleSections.some(s => s.id === 'contacto');
    
    if (hasInicio && hasContacto) {
      console.log('✅ Inicio y Contacto siempre visibles');
    } else {
      console.error('❌ Error: Inicio o Contacto no visibles');
    }
  });
  
  return {
    success: true,
    message: 'Pruebas de secciones visibles completadas'
  };
}

// Función para simular el comportamiento del menú
export function simulateMenuBehavior() {
  console.log('🧪 Simulando comportamiento del menú...');
  
  const mockVisibleSections = [
    { id: 'inicio', href: '/#inicio', label: 'Inicio', hasData: true },
    { id: 'servicios', href: '/#servicios', label: 'Servicios', hasData: true },
    { id: 'contacto', href: '/#contacto', label: 'Contacto', hasData: true }
  ];
  
  console.log('📱 Menú desktop:', mockVisibleSections.map(s => s.label).join(' | '));
  console.log('📱 Menú tablet (primeros 4):', mockVisibleSections.slice(0, 4).map(s => s.label).join(' | '));
  console.log('📱 Menú tablet (resto):', mockVisibleSections.slice(4).map(s => s.label).join(' | '));
  console.log('📱 Menú móvil:', mockVisibleSections.map(s => s.label).join(' | '));
  
  return {
    success: true,
    sections: mockVisibleSections,
    message: 'Simulación del menú completada'
  };
}


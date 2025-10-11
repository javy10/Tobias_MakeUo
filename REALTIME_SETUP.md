# Sistema de Tiempo Real - Tobias MakeUp

## Descripción

Se ha implementado un sistema de actualizaciones en tiempo real que permite que los cambios realizados en el panel de administración se reflejen automáticamente en la página principal sin necesidad de refrescar la página.

## Componentes Implementados

### 1. Hook de Tiempo Real (`src/hooks/use-realtime.ts`)

- **`useRealtimeSubscription`**: Hook base para suscribirse a cambios en tablas específicas
- **`useRealtimeState`**: Hook especializado para arrays de datos (servicios, productos, etc.)
- **`useRealtimeSingleton`**: Hook especializado para contenido único (hero, about_me)

### 2. Notificación de Estado (`src/components/shared/RealtimeNotification.tsx`)

- Muestra el estado de conexión en tiempo real
- Notifica cuando se detectan actualizaciones
- Se oculta automáticamente después de 3 segundos

### 3. Integración en Layout (`src/app/layout.tsx`)

- Configura suscripciones para todas las tablas
- Maneja el estado de conexión global
- Proporciona notificaciones visuales

## Tablas Monitoreadas

El sistema monitorea cambios en tiempo real en las siguientes tablas:

- `services` - Servicios
- `products` - Productos
- `perfumes` - Perfumes
- `courses` - Cursos de belleza
- `gallery_items` - Elementos de galería
- `testimonials` - Testimonios
- `users` - Usuarios
- `categories` - Categorías
- `hero_content` - Contenido del hero
- `about_me_content` - Contenido "Sobre mí"

## Tipos de Eventos Monitoreados

- **INSERT**: Nuevos elementos agregados
- **UPDATE**: Elementos modificados
- **DELETE**: Elementos eliminados

## Funcionamiento

1. **Carga Inicial**: Los datos se cargan desde Supabase al iniciar la aplicación
2. **Suscripciones**: Se establecen suscripciones de tiempo real para cada tabla
3. **Detección de Cambios**: Cuando se detecta un cambio en la base de datos:
   - Se actualiza el estado local automáticamente
   - Se muestra una notificación de actualización
   - Los cambios se reflejan inmediatamente en la UI

## Configuración de Supabase

Para que funcione correctamente, asegúrate de que:

1. **Realtime está habilitado** en tu proyecto de Supabase
2. **Las políticas RLS** permiten las operaciones necesarias
3. **Las tablas tienen habilitado** el realtime en la configuración de Supabase

### Habilitar Realtime en Supabase

```sql
-- Habilitar realtime para todas las tablas
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE perfumes;
ALTER PUBLICATION supabase_realtime ADD TABLE courses;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery_items;
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE hero_content;
ALTER PUBLICATION supabase_realtime ADD TABLE about_me_content;
```

## Beneficios

- **Experiencia de Usuario Mejorada**: No es necesario refrescar la página
- **Sincronización Automática**: Los cambios se propagan instantáneamente
- **Feedback Visual**: El usuario sabe cuando se están actualizando los datos
- **Escalabilidad**: El sistema puede manejar múltiples usuarios simultáneamente

## Monitoreo

- Los logs de consola muestran el estado de las suscripciones
- Las notificaciones visuales indican el estado de conexión
- Los errores se registran en la consola para debugging

## Consideraciones de Rendimiento

- Las suscripciones se establecen solo una vez al cargar la aplicación
- Se limpian automáticamente al desmontar los componentes
- El sistema es eficiente y no impacta significativamente el rendimiento




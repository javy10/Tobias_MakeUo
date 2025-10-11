// src/lib/error-alerts.ts
// Sistema de alertas de error con SweetAlert

import Swal from 'sweetalert2';

export interface ErrorInfo {
  title: string;
  message: string;
  solution: string;
  error?: any;
}

export function showErrorAlert(errorInfo: ErrorInfo) {
  const { title, message, solution, error } = errorInfo;
  
  // Preparar detalles del error para mostrar
  let errorDetails = '';
  if (error) {
    if (typeof error === 'string') {
      errorDetails = error;
    } else if (error.message) {
      errorDetails = error.message;
    } else if (error.code) {
      errorDetails = `Código: ${error.code}`;
    } else {
      errorDetails = JSON.stringify(error, null, 2);
    }
  }

  Swal.fire({
    icon: 'error',
    title: `ERROR: ${title}`,
    html: `
      <div style="text-align: left;">
        <div style="margin-bottom: 15px;">
          <strong style="color: #dc2626;">Descripción del Error:</strong><br>
          <span style="color: #374151;">${message}</span>
        </div>
        
        ${errorDetails ? `
        <div style="margin-bottom: 15px;">
          <strong style="color: #dc2626;">Detalles Técnicos:</strong><br>
          <code style="background: #f3f4f6; padding: 5px; border-radius: 4px; font-size: 12px; color: #374151; display: block; margin-top: 5px; white-space: pre-wrap;">${errorDetails}</code>
        </div>
        ` : ''}
        
        <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 10px; border-radius: 4px;">
          <strong style="color: #0369a1;">💡 SOLUCIÓN SUGERIDA:</strong><br>
          <span style="color: #0c4a6e;">${solution}</span>
        </div>
      </div>
    `,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#dc2626',
    width: '600px',
    customClass: {
      popup: 'swal2-popup-custom',
      title: 'swal2-title-custom',
      htmlContainer: 'swal2-html-container-custom'
    }
  });
}

// Función específica para errores de conexión a Supabase
export function showSupabaseConnectionError(error: any) {
  showErrorAlert({
    title: 'Conexión a Supabase',
    message: 'No se pudo establecer conexión con la base de datos de Supabase.',
    solution: `
      1. Verifica tu conexión a internet
      2. Revisa las credenciales en el archivo .env.local
      3. Confirma que el proyecto de Supabase esté activo
      4. Verifica que las tablas 'users' existan en tu base de datos
      5. Si el problema persiste, contacta al administrador del sistema
    `,
    error
  });
}

// Función específica para errores de autenticación
export function showSupabaseAuthError(error: any) {
  showErrorAlert({
    title: 'Error de Autenticación',
    message: 'No se pudo verificar la autenticación con Supabase.',
    solution: `
      1. Verifica que las credenciales de autenticación sean correctas
      2. Revisa la configuración de RLS (Row Level Security) en Supabase
      3. Confirma que el usuario tenga permisos adecuados
      4. Intenta cerrar sesión y volver a iniciar sesión
    `,
    error
  });
}

// Función específica para errores de base de datos
export function showDatabaseError(error: any, operation: string) {
  showErrorAlert({
    title: `Error de Base de Datos - ${operation}`,
    message: `No se pudo completar la operación: ${operation}`,
    solution: `
      1. Verifica que la tabla exista en la base de datos
      2. Confirma que tengas permisos para realizar esta operación
      3. Revisa que los datos enviados sean válidos
      4. Verifica la conexión a internet
      5. Si el error persiste, contacta al administrador
    `,
    error
  });
}

// Función específica para errores de red
export function showNetworkError(error: any) {
  showErrorAlert({
    title: 'Error de Red',
    message: 'No se pudo conectar con el servidor.',
    solution: `
      1. Verifica tu conexión a internet
      2. Comprueba que el servidor esté funcionando
      3. Intenta recargar la página
      4. Verifica que no haya un firewall bloqueando la conexión
      5. Si usas VPN, intenta desconectarla temporalmente
    `,
    error
  });
}



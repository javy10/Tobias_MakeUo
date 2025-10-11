// src/lib/error-demo.ts
// Archivo de demostración para mostrar cómo se ven las alertas de error

import { showSupabaseConnectionError, showDatabaseError, showNetworkError } from './error-alerts';

// Función para demostrar las alertas de error
export function demonstrateErrorAlerts() {
  // Simular error de conexión a Supabase
  const supabaseError = {
    message: "Failed to fetch",
    code: "NETWORK_ERROR",
    details: "Connection timeout after 30 seconds"
  };
  
  // Mostrar alerta de error de conexión
  showSupabaseConnectionError(supabaseError);
  
  // Después de 3 segundos, mostrar error de base de datos
  setTimeout(() => {
    const dbError = {
      message: "relation 'users' does not exist",
      code: "PGRST116",
      details: "The table 'users' was not found in the database"
    };
    showDatabaseError(dbError, "Crear usuario");
  }, 3000);
  
  // Después de 6 segundos, mostrar error de red
  setTimeout(() => {
    const networkError = {
      message: "Network request failed",
      code: "NETWORK_ERROR",
      details: "Unable to reach the server"
    };
    showNetworkError(networkError);
  }, 6000);
}

// Función para probar un error específico
export function testSpecificError(errorType: 'supabase' | 'database' | 'network') {
  const errors = {
    supabase: {
      message: "Invalid API key",
      code: "INVALID_API_KEY",
      details: "The provided API key is not valid"
    },
    database: {
      message: "Permission denied",
      code: "PGRST301",
      details: "You don't have permission to access this resource"
    },
    network: {
      message: "Connection refused",
      code: "CONNECTION_REFUSED",
      details: "The server refused the connection"
    }
  };
  
  const error = errors[errorType];
  
  switch (errorType) {
    case 'supabase':
      showSupabaseConnectionError(error);
      break;
    case 'database':
      showDatabaseError(error, "Operación de prueba");
      break;
    case 'network':
      showNetworkError(error);
      break;
  }
}


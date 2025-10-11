// src/lib/alerts.ts
// Sistema de alertas para la aplicación

import Swal from 'sweetalert2';

export interface AlertOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  showCloseButton?: boolean;
}

// Función para mostrar alertas de éxito
export function showSuccessAlert(title: string, message: string): void {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#10b981',
    timer: 3000,
    timerProgressBar: true
  });
}

// Función para mostrar alertas de error (compatibilidad con error-alerts.ts)
export function showErrorAlert(title: string, message: string): void {
  Swal.fire({
    icon: 'error',
    title: `ERROR: ${title}`,
    html: `
      <div style="text-align: left;">
        <div style="margin-bottom: 15px;">
          <strong style="color: #dc2626;">Descripción del Error:</strong><br>
          <span style="color: #374151;">${message}</span>
        </div>
        
        <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 10px; border-radius: 4px;">
          <strong style="color: #0369a1;">💡 SOLUCIÓN SUGERIDA:</strong><br>
          <span style="color: #0c4a6e;">Por favor, intenta nuevamente. Si el problema persiste, contacta al administrador.</span>
        </div>
      </div>
    `,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#dc2626',
    width: '600px'
  });
}

export class AlertManager {
  private static instance: AlertManager;
  private alerts: AlertOptions[] = [];

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  show(options: AlertOptions): void {
    this.alerts.push(options);
    this.render();
  }

  success(message: string, title?: string): void {
    this.show({
      title: title || 'Éxito',
      message,
      type: 'success',
      duration: 3000
    });
  }

  error(message: string, title?: string): void {
    this.show({
      title: title || 'Error',
      message,
      type: 'error',
      duration: 5000
    });
  }

  warning(message: string, title?: string): void {
    this.show({
      title: title || 'Advertencia',
      message,
      type: 'warning',
      duration: 4000
    });
  }

  info(message: string, title?: string): void {
    this.show({
      title: title || 'Información',
      message,
      type: 'info',
      duration: 3000
    });
  }

  private render(): void {
    // Implementación básica de renderizado
    console.log('Alert:', this.alerts[this.alerts.length - 1]);
  }
}

// Instancia global
export const alertManager = AlertManager.getInstance();
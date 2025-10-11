// src/lib/alerts.ts
// Sistema de alertas para la aplicación

export interface AlertOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  showCloseButton?: boolean;
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
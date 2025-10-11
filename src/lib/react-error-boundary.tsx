// src/lib/react-error-boundary.tsx
// Error Boundary de React para capturar errores de componentes

'use client';

import React from 'react';
import { handleUniversalError } from './universal-error-catcher';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class UniversalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log del error en consola
    console.error('🚨 ERROR DE REACT CAPTURADO:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Mostrar error con SweetAlert
    handleUniversalError(error, 'React Component');

    this.setState({
      error,
      errorInfo
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid #dc2626',
          borderRadius: '8px',
          backgroundColor: '#fef2f2',
          color: '#dc2626'
        }}>
          <h2>🚨 Error en Componente React</h2>
          <p>Se ha producido un error en un componente de React.</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Detalles del error</summary>
            <pre style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button 
            onClick={this.resetError}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para manejar errores en componentes funcionales
export function useErrorHandler() {
  return (error: Error, context?: string) => {
    handleUniversalError(error, `React Hook - ${context || 'Componente'}`);
  };
}

// HOC para envolver componentes con manejo de errores
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) {
  return function WrappedComponent(props: P) {
    return (
      <UniversalErrorBoundary fallback={fallback}>
        <Component {...props} />
      </UniversalErrorBoundary>
    );
  };
}

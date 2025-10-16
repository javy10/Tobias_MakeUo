// src/components/ui/optimized-loading.tsx
// Componentes de loading optimizados para mejor UX

import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedLoadingProps {
  isLoading: boolean;
  success?: boolean;
  error?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function OptimizedLoading({ 
  isLoading, 
  success, 
  error, 
  message, 
  size = 'md',
  className 
}: OptimizedLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (success) {
    return (
      <div className={cn("flex items-center gap-2 text-green-600", className)}>
        <CheckCircle className={sizeClasses[size]} />
        {message && <span className="text-sm">{message}</span>}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center gap-2 text-red-600", className)}>
        <AlertCircle className={sizeClasses[size]} />
        {message && <span className="text-sm">{message}</span>}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2 text-blue-600", className)}>
        <Loader2 className={cn(sizeClasses[size], "animate-spin")} />
        {message && <span className="text-sm">{message}</span>}
      </div>
    );
  }

  return null;
}

interface OptimizedButtonProps {
  isLoading: boolean;
  success?: boolean;
  error?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function OptimizedButton({
  isLoading,
  success,
  error,
  loadingText = 'Guardando...',
  successText = 'Guardado',
  errorText = 'Error',
  children,
  className,
  disabled,
  onClick,
  type = 'button'
}: OptimizedButtonProps) {
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {loadingText}
        </>
      );
    }
    
    if (success) {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          {successText}
        </>
      );
    }
    
    if (error) {
      return (
        <>
          <AlertCircle className="h-4 w-4 mr-2" />
          {errorText}
        </>
      );
    }
    
    return children;
  };

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    if (success) {
      return cn(baseClasses, "bg-green-600 text-white hover:bg-green-700", className);
    }
    
    if (error) {
      return cn(baseClasses, "bg-red-600 text-white hover:bg-red-700", className);
    }
    
    return cn(baseClasses, "bg-primary text-primary-foreground hover:bg-primary/90", className);
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {getButtonContent()}
    </button>
  );
}

interface OptimizedFormStateProps {
  isLoading: boolean;
  success?: boolean;
  error?: boolean;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export function OptimizedFormState({
  isLoading,
  success,
  error,
  loadingMessage = 'Procesando...',
  successMessage = 'Operación completada exitosamente',
  errorMessage = 'Ocurrió un error',
  className
}: OptimizedFormStateProps) {
  if (!isLoading && !success && !error) {
    return null;
  }

  return (
    <div className={cn("p-4 rounded-lg border", className)}>
      <OptimizedLoading
        isLoading={isLoading}
        success={success}
        error={error}
        message={isLoading ? loadingMessage : success ? successMessage : errorMessage}
        size="md"
      />
    </div>
  );
}









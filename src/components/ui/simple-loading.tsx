'use client';

interface SimpleLoadingProps {
  text?: string;
  showAttempts?: boolean;
  attempt?: number;
  maxAttempts?: number;
}

export function SimpleLoading({ 
  text = "Cargando...", 
  showAttempts = false,
  attempt = 1,
  maxAttempts = 3
}: SimpleLoadingProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-white mb-4">{text}</h2>
        {showAttempts && (
          <div className="text-sm text-gray-400 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <p>Intento {attempt} de {maxAttempts}</p>
            </div>
            <p className="text-gray-500">Conectando con Supabase...</p>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-3">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-500"
                style={{ width: `${(attempt / maxAttempts) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-600 mt-4">
          Si la carga toma más tiempo del esperado, verifica tu conexión a internet
        </p>
      </div>
    </div>
  );
}

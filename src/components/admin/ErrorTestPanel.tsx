// src/components/admin/ErrorTestPanel.tsx
// Panel de prueba para el sistema universal de captura de errores

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { testUniversalErrorCatcher, handleUniversalError } from '@/lib/universal-error-catcher';
import { useErrorHandler } from '@/lib/react-error-boundary';

export function ErrorTestPanel() {
  const handleError = useErrorHandler();

  const testJavaScriptError = () => {
    throw new Error('Error de prueba - JavaScript');
  };

  const testPromiseError = () => {
    Promise.reject(new Error('Error de prueba - Promise'));
  };

  const testFetchError = () => {
    fetch('/api/nonexistent')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .catch(error => {
        handleUniversalError(error, 'Fetch Test');
      });
  };

  const testReactError = () => {
    handleError(new Error('Error de prueba - React Hook'), 'Test Panel');
  };

  const testSupabaseError = () => {
    const error = new Error('Error de conexión a Supabase');
    error.name = 'SupabaseError';
    handleUniversalError(error, 'Supabase Test');
  };

  const testValidationError = () => {
    const error = new Error('Campo requerido no puede estar vacío');
    error.name = 'ValidationError';
    handleUniversalError(error, 'Validación Test');
  };

  const testFileError = () => {
    const error = new Error('Error al subir archivo: archivo muy grande');
    error.name = 'FileUploadError';
    handleUniversalError(error, 'Archivo Test');
  };

  const testNetworkError = () => {
    const error = new Error('Failed to fetch: Network request failed');
    error.name = 'NetworkError';
    handleUniversalError(error, 'Red Test');
  };

  const testAuthError = () => {
    const error = new Error('Usuario no autenticado');
    error.name = 'AuthError';
    handleUniversalError(error, 'Autenticación Test');
  };

  const testFormError = () => {
    const error = new Error('Cannot read properties of null (reading \'reset\')');
    error.name = 'FormError';
    handleUniversalError(error, 'Formulario Test');
  };

  const runAllTests = () => {
    testUniversalErrorCatcher();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-red-600">
          🧪 Panel de Prueba - Sistema Universal de Errores
        </CardTitle>
        <CardDescription>
          Prueba el sistema de captura de errores que muestra todos los errores tanto en consola como en SweetAlert
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            onClick={testJavaScriptError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">🚨</span>
            <span>Error JavaScript</span>
          </Button>

          <Button 
            onClick={testPromiseError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">⏳</span>
            <span>Error Promise</span>
          </Button>

          <Button 
            onClick={testFetchError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">🌐</span>
            <span>Error Fetch</span>
          </Button>

          <Button 
            onClick={testReactError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">⚛️</span>
            <span>Error React</span>
          </Button>

          <Button 
            onClick={testSupabaseError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">🗄️</span>
            <span>Error Supabase</span>
          </Button>

          <Button 
            onClick={testValidationError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">✅</span>
            <span>Error Validación</span>
          </Button>

          <Button 
            onClick={testFileError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">📁</span>
            <span>Error Archivo</span>
          </Button>

          <Button 
            onClick={testNetworkError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">📡</span>
            <span>Error Red</span>
          </Button>

          <Button 
            onClick={testAuthError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">🔐</span>
            <span>Error Auth</span>
          </Button>

          <Button 
            onClick={testFormError}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <span className="text-lg">📝</span>
            <span>Error Formulario</span>
          </Button>
        </div>

        <div className="border-t pt-4">
          <Button 
            onClick={runAllTests}
            variant="outline"
            className="w-full h-12 text-lg font-semibold"
          >
            🚀 Ejecutar Todas las Pruebas
          </Button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            📋 Instrucciones:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Cada botón simula un tipo diferente de error</li>
            <li>• Los errores se mostrarán tanto en la consola como en SweetAlert</li>
            <li>• Revisa la consola del navegador para ver los logs detallados</li>
            <li>• Los SweetAlerts incluyen soluciones sugeridas para cada tipo de error</li>
            <li>• El sistema ignora errores de extensiones del navegador automáticamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

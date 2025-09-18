'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateIdeasAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState = {
  success: false,
  data: [] as string[],
  error: null as string | null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="rounded-full w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      {pending ? 'Generando...' : 'Generar Ideas'}
    </Button>
  );
}

export function AIContentGenerator() {
  const [state, formAction] = useFormState(generateIdeasAction, initialState);
  const [key, setKey] = useState(0); // Add key to reset form state if needed

  const handleReset = () => {
    setKey(prevKey => prevKey + 1);
  };
  
  return (
    <Card key={key}>
      <CardHeader>
        <CardTitle className="font-headline">Generador de Ideas con IA</CardTitle>
        <CardDescription>
          ¿Sin inspiración? Deja que la IA te ayude a crear contenido para tu sitio web.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">Sección del Sitio</Label>
              <Select name="section" defaultValue="hero" required>
                <SelectTrigger id="section">
                  <SelectValue placeholder="Selecciona una sección" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Sección Inicial (Hero)</SelectItem>
                  <SelectItem value="services">Servicios</SelectItem>
                  <SelectItem value="gallery">Galería</SelectItem>
                  <SelectItem value="testimonials">Testimonios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Tópico (Opcional)</Label>
              <Input
                id="topic"
                name="topic"
                placeholder="Ej: Maquillaje de verano"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <SubmitButton />
             {(state.data.length > 0 || state.error) && (
              <Button type="button" variant="outline" onClick={handleReset} className="rounded-full w-full sm:w-auto">
                Empezar de Nuevo
              </Button>
            )}
          </div>
        </form>

        {state.error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.success && state.data.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 text-lg">Ideas Generadas:</h3>
            <ul className="list-disc list-inside space-y-2 bg-muted p-4 rounded-md">
              {state.data.map((idea, index) => (
                <li key={index}>{idea}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/app/layout';
import { saveItem } from '@/lib/supabase-db';
import { showSimpleErrorAlert, showSimpleSuccessAlert } from '@/lib/simple-alerts';
import type { Testimonial } from '@/lib/types';

export function TestimonialForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState<{ author?: string; text?: string; rating?: string }>({});
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([]);
  const router = useRouter();
  
  // Manejo seguro del contexto
  let context;
  let setTestimonials;
  
  try {
    context = useAppContext();
    setTestimonials = context?.setTestimonials;
  } catch (error) {
    console.error('Error al acceder al contexto:', error);
    setTestimonials = null;
  }


  const validateForm = (author: string, text: string, rating: number) => {
    const newErrors: { author?: string; text?: string; rating?: string } = {};

    // Validar nombre
    if (!author || author.trim().length === 0) {
      newErrors.author = 'El nombre es requerido';
    } else if (author.trim().length < 2) {
      newErrors.author = 'El nombre debe tener al menos 2 caracteres';
    } else if (author.trim().length > 50) {
      newErrors.author = 'El nombre no puede exceder 50 caracteres';
    }

    // Validar texto
    if (!text || text.trim().length === 0) {
      newErrors.text = 'La opinión es requerida';
    } else if (text.trim().length < 10) {
      newErrors.text = 'La opinión debe tener al menos 10 caracteres';
    } else if (text.trim().length > 500) {
      newErrors.text = 'La opinión no puede exceder 500 caracteres';
    }

    // Validar calificación
    if (rating === 0) {
      newErrors.rating = 'Debes seleccionar una calificación';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrors({});
    
    // Verificar que el contexto esté disponible
    if (!setTestimonials) {
      console.error('Contexto de aplicación no disponible');
      setStatus('error');
      showSimpleErrorAlert({
        title: 'Error de Aplicación',
        message: 'No se pudo acceder al contexto de la aplicación.',
        solution: `
          1. Recarga la página
          2. Verifica tu conexión a internet
          3. Si el problema persiste, contacta al soporte técnico
        `,
        error: 'Contexto no disponible'
      });
      return;
    }
    
    const formData = new FormData(event.currentTarget);
    const author = (formData.get('author') as string)?.trim();
    const text = (formData.get('text') as string)?.trim();

    // Validar formulario
    if (!validateForm(author, text, rating)) {
      setStatus('error');
      showSimpleErrorAlert({
        title: 'Error de Validación',
        message: 'Por favor, corrige los errores en el formulario.',
        solution: `
          1. Completa todos los campos requeridos
          2. Asegúrate de que el nombre tenga al menos 2 caracteres
          3. La opinión debe tener entre 10 y 500 caracteres
          4. Selecciona una calificación
        `,
        error: errors
      });
      return;
    }

    try {
      const newTestimonial: Testimonial = {
        id: crypto.randomUUID(),
        author,
        text,
        status: 'pending',
        seen: false
      };

      // Guardar en la base de datos
      await saveItem('testimonials', newTestimonial);

      // Actualizar estado local (contexto o local como respaldo)
      if (setTestimonials) {
        setTestimonials(prevTestimonials => [...prevTestimonials, newTestimonial]);
      } else {
        setLocalTestimonials(prev => [...prev, newTestimonial]);
      }

      // Mostrar mensaje de éxito
      showSimpleSuccessAlert('Testimonio enviado', 'Tu opinión ha sido enviada exitosamente. Será revisada antes de ser publicada.');

      setStatus('success');

      // Limpiar formulario de manera segura
      try {
        if (event.currentTarget && typeof event.currentTarget.reset === 'function') {
          event.currentTarget.reset();
        }
      } catch (resetError) {
        console.warn('No se pudo limpiar el formulario automáticamente:', resetError);
        // Limpiar manualmente los campos
        const authorInput = document.querySelector('input[name="author"]') as HTMLInputElement;
        const textInput = document.querySelector('textarea[name="text"]') as HTMLTextAreaElement;
        
        if (authorInput) authorInput.value = '';
        if (textInput) textInput.value = '';
      }
      
      setRating(0);
      setHover(0);

    } catch (error) {
      console.error('Error al guardar testimonio:', error);
      setStatus('error');
      
      // Determinar el tipo de error para mostrar mensaje específico
      let errorMessage = 'No se pudo enviar tu opinión. Inténtalo de nuevo.';
      let solution = `
        1. Verifica tu conexión a internet
        2. Intenta enviar el testimonio nuevamente
        3. Si el problema persiste, contacta al soporte técnico
      `;
      
      if (error instanceof Error) {
        if (error.message.includes('reset')) {
          errorMessage = 'Error al limpiar el formulario. El testimonio se envió correctamente.';
          solution = `
            1. El testimonio se guardó exitosamente
            2. Puedes cerrar esta ventana
            3. El formulario se limpiará automáticamente
          `;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet.';
          solution = `
            1. Verifica tu conexión a internet
            2. Intenta enviar el testimonio nuevamente
            3. Si el problema persiste, contacta al soporte técnico
          `;
        }
      }
      
      showSimpleErrorAlert({
        title: 'Error al Enviar Testimonio',
        message: errorMessage,
        solution,
        error
      });
    }
  };

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/');
      }, 2000); // Redirect after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <Card className="max-w-xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">Comparte tu Experiencia</CardTitle>
        <CardDescription className="text-center">
          Tu opinión es muy importante para nosotros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <div className="text-center p-8">
            <h3 className="text-2xl font-semibold text-green-500 font-headline">¡Gracias por tu opinión!</h3>
            <p className="mt-2 text-foreground/80">Hemos recibido tu mensaje. Serás redirigido a la página principal en un momento.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="author">Tu Nombre</Label>
              <Input 
                id="author" 
                name="author" 
                type="text" 
                placeholder="Nombre y Apellido" 
                required 
                className={errors.author ? 'border-red-500 focus:border-red-500' : ''}
                onChange={() => {
                  if (errors.author) {
                    setErrors(prev => ({ ...prev, author: undefined }));
                  }
                }}
              />
              {errors.author && (
                <p className="text-sm text-red-500">{errors.author}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Tu Opinión</Label>
              <Textarea 
                id="text" 
                name="text" 
                placeholder="Cuéntanos cómo fue tu experiencia..." 
                required 
                rows={6}
                className={errors.text ? 'border-red-500 focus:border-red-500' : ''}
                onChange={() => {
                  if (errors.text) {
                    setErrors(prev => ({ ...prev, text: undefined }));
                  }
                }}
              />
              {errors.text && (
                <p className="text-sm text-red-500">{errors.text}</p>
              )}
            </div>
             <div className="space-y-2">
              <Label>Calificación</Label>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={starValue}
                      onClick={() => {
                        setRating(starValue);
                        if (errors.rating) {
                          setErrors(prev => ({ ...prev, rating: undefined }));
                        }
                      }}
                      onMouseEnter={() => setHover(starValue)}
                      onMouseLeave={() => setHover(0)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          starValue <= (hover || rating) ? "text-primary fill-primary" : "text-muted-foreground"
                        )}
                      />
                    </button>
                  );
                })}
                 <input type="hidden" name="rating" value={rating} />
              </div>
              {errors.rating && (
                <p className="text-sm text-red-500">{errors.rating}</p>
              )}
            </div>
            <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Enviando...' : 'Enviar Opinión'}
            </Button>
            {status === 'error' && (
              <p className="text-center text-red-500">Hubo un error al enviar la opinión. Por favor, completa todos los campos e inténtalo de nuevo.</p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}

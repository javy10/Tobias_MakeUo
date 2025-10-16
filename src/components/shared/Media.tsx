'use client'

import Image from 'next/image'
import { CSSProperties } from 'react'
import { SupabaseImage } from './SupabaseImage'

interface MediaProps {
  src: string
  alt: string
  type: 'image' | 'video'
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  quality?: number
  loading?: 'lazy' | 'eager'
  style?: CSSProperties
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  controls?: boolean
  poster?: string
}

export function Media({
  src,
  alt,
  type,
  className = '',
  fill,
  width,
  height,
  sizes = '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw',
  priority = false,
  quality = 90,
  loading = 'lazy',
  style,
  autoPlay = true, // Por defecto auto-reproducir
  loop = true, // Por defecto en bucle
  muted = true, // Por defecto silenciado
  playsInline = true, // Por defecto reproducción inline
  controls = false, // Por defecto sin controles
  poster
}: MediaProps) {
  // Validar que src no esté vacío
  if (!src || src.trim() === '') {
    return (
      <div className={`relative ${fill ? 'w-full h-full' : 'w-full h-48'} bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm">Cargando imagen...</p>
        </div>
      </div>
    );
  }

  const containerClass = `relative ${fill ? 'w-full h-full' : ''}`
  const mediaClass = `${className} transition-transform duration-300`
  const mediaStyle: CSSProperties = {
    ...style,
    // Usar el objectFit del style prop si está definido, sino usar cover por defecto
    objectFit: style?.objectFit || 'cover'
  }

  if (type === 'image') {
    // Verificar si es una URL de Supabase
    const isSupabaseUrl = src.includes('supabase.co');
    
    // Usar componente especializado para Supabase
    if (isSupabaseUrl) {
      return (
        <SupabaseImage
          src={src}
          alt={alt}
          className={mediaClass}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
          quality={75}
          loading={priority ? undefined : loading}
          style={mediaStyle}
        />
      )
    }
    
    // Para otras imágenes, usar el componente Image normal
    return (
      <div className={containerClass}>
        <Image
          src={src}
          alt={alt}
          className={mediaClass}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
          quality={quality}
          loading={priority ? undefined : loading}
          style={mediaStyle}
          onError={(e) => {
            console.error('Error al cargar imagen:', src);
            // Fallback a imagen placeholder si falla la carga
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
      </div>
    )
  }

  return type === 'video' ? (
    <div className={containerClass}>
      <video
        src={src}
        className={`${mediaClass} w-full h-full`}
        style={mediaStyle}
        autoPlay={true} // Siempre auto-reproducir
        loop={true} // Siempre en bucle
        muted={true} // Siempre silenciado
        playsInline={true} // Reproducción inline
        controls={false} // Sin controles
        poster={poster}
      />
    </div>
  ) : null
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CSSProperties } from 'react'
import { getSupabaseBucketFromUrl, getSupabaseImageFallback } from '@/lib/supabase-image-utils'

interface SupabaseImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  quality?: number
  loading?: 'lazy' | 'eager'
  style?: CSSProperties
}

export function SupabaseImage({
  src,
  alt,
  className = '',
  fill,
  width,
  height,
  sizes = '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw',
  priority = false,
  quality = 75,
  loading = 'lazy',
  style
}: SupabaseImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const containerClass = `relative ${fill ? 'w-full h-full' : ''}`
  const imageClass = `${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`

  // Placeholder SVG para cuando falla la carga
  const placeholderSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='

  const handleError = () => {
    console.error('❌ Error al cargar imagen de Supabase:', src)
    const bucket = getSupabaseBucketFromUrl(src)
    console.error('Bucket detectado:', bucket)
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    console.log('✅ Imagen de Supabase cargada exitosamente:', src)
    setIsLoading(false)
  }

  // Si hay error, mostrar placeholder específico del bucket
  if (imageError) {
    const bucket = getSupabaseBucketFromUrl(src)
    const fallbackSrc = bucket ? getSupabaseImageFallback(bucket) : placeholderSvg
    
    return (
      <div className={containerClass}>
        <Image
          src={fallbackSrc}
          alt="Imagen no disponible"
          className={className}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          style={style}
          unoptimized
        />
      </div>
    )
  }

  return (
    <div className={containerClass}>
      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        className={imageClass}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        quality={quality}
        loading={priority ? undefined : loading}
        style={style}
        // Deshabilitar optimización para Supabase
        unoptimized={true}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}

'use client'

import Image from 'next/image'
import { CSSProperties } from 'react'

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
  const containerClass = `relative ${fill ? 'w-full h-full' : ''}`
  const mediaClass = `${className} transition-transform duration-300`
  const mediaStyle: CSSProperties = {
    ...style,
    objectFit: 'cover' // Siempre usar cover para mejor ajuste
  }

  if (type === 'image') {
    return (
      <div className={containerClass}>
        <Image
          src={src}
          alt={alt}
          className={`${mediaClass} object-cover`}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
          quality={quality}
          loading={priority ? undefined : loading}
          style={mediaStyle}
        />
      </div>
    )
  }

  return type === 'video' ? (
    <div className={containerClass}>
      <video
        src={src}
        className={`${mediaClass} w-full h-full object-cover`}
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

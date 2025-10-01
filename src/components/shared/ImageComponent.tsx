'use client'

import Image from 'next/image'
import { CSSProperties } from 'react'

interface ImageComponentProps {
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

export function ImageComponent({
  src,
  alt,
  className = '',
  fill,
  width,
  height,
  sizes = '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw',
  priority = false,
  quality = 90,
  loading = 'lazy',
  style
}: ImageComponentProps) {
  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      <Image
        src={src}
        alt={alt}
        className={`${className} transition-transform duration-300`}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        quality={quality}
        loading={loading}
        style={{
          ...style,
          objectFit: fill ? 'cover' : undefined
        }}
      />
    </div>
  )
}
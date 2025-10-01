'use client'

import { CSSProperties } from 'react'

interface VideoComponentProps {
  src: string
  className?: string
  fill?: boolean
  style?: CSSProperties
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  controls?: boolean
  poster?: string
}

export function VideoComponent({
  src,
  className = '',
  fill,
  style,
  autoPlay = false,
  loop = false,
  muted = false,
  playsInline = false,
  controls = true,
  poster
}: VideoComponentProps) {
  const videoStyle: CSSProperties = {
    ...(fill ? {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    } : {}),
    ...style
  }

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      <video
        className={`${className} transition-transform duration-300`}
        style={videoStyle}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        <p>Tu navegador no soporta el elemento video.</p>
      </video>
    </div>
  )
}
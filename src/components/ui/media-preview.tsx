'use client';

interface MediaPreviewProps {
  media: { url: string; type: 'image' | 'video' } | null;
  onRemove?: () => void;
  className?: string;
}

export function MediaPreviewDisplay({ media, onRemove, className = '' }: MediaPreviewProps) {
  if (!media) return null;

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {media.type === 'image' ? (
        <img
          src={media.url}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={media.url}
          controls
          className="w-full h-full"
        />
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/70 rounded-full 
                    text-white hover:text-white transition-all duration-200
                    opacity-100 z-10 shadow"
          type="button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          <span className="sr-only">Eliminar imagen</span>
        </button>
      )}
    </div>
  );
}
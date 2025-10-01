'use client';

import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogTrigger } from './dialog';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: 'environment' } // Intenta usar la cámara trasera primero
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Configurar el canvas al tamaño del video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dibujar el frame actual del video en el canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0);

        // Convertir el canvas a un archivo
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            onCapture(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8); // 0.8 es la calidad de la imagen
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        startCamera();
      } else {
        stopCamera();
      }
    }}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 z-10"
            onClick={stopCamera}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="aspect-video relative rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              onClick={takePhoto}
              className="rounded-full px-8"
            >
              Tomar foto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
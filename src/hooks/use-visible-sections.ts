// src/hooks/use-visible-sections.ts
// Hook para determinar qué secciones deben mostrarse basado en los datos disponibles

import { useMemo } from 'react';
import type { AppState } from '@/lib/types';

export interface SectionConfig {
  id: string;
  href: string;
  label: string;
  hasData: boolean;
}

export function useVisibleSections(appState: AppState): SectionConfig[] {
  return useMemo(() => {
    const sections: SectionConfig[] = [
      {
        id: 'inicio',
        href: '/#inicio',
        label: 'Inicio',
        hasData: true // Siempre visible
      },
      {
        id: 'sobre-mi',
        href: '/#sobre-mi',
        label: 'Sobre Mí',
        hasData: !!appState.aboutMeContent?.text?.trim()
      },
      {
        id: 'servicios',
        href: '/#servicios',
        label: 'Servicios',
        hasData: appState.services.length > 0
      },
      {
        id: 'productos-de-belleza',
        href: '/#productos-de-belleza',
        label: 'Productos de Belleza',
        hasData: appState.products.length > 0 && appState.products.some(p => p.stock > 0)
      },
      {
        id: 'perfumes',
        href: '/#perfumes',
        label: 'Perfumes',
        hasData: appState.perfumes.length > 0
      },
      {
        id: 'cursos',
        href: '/#cursos',
        label: 'Cursos de Belleza',
        hasData: appState.courses.length > 0
      },
      {
        id: 'mis-trabajos',
        href: '/#mis-trabajos',
        label: 'Mis Trabajos',
        hasData: appState.galleryItems.length > 0
      },
      {
        id: 'testimonios',
        href: '/#testimonios',
        label: 'Testimonios',
        hasData: appState.testimonials.some(t => t.status === 'approved')
      },
      {
        id: 'contacto',
        href: '/#contacto',
        label: 'Contacto',
        hasData: true // Siempre visible
      }
    ];

    return sections;
  }, [appState]);
}

export function useVisibleSectionsOnly(appState: AppState): SectionConfig[] {
  const allSections = useVisibleSections(appState);
  return allSections.filter(section => section.hasData);
}


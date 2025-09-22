// src/app/politicas/page-layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

interface PolicyPageClientLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PolicyPageClientLayout({ title, children }: PolicyPageClientLayoutProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('...');

  useEffect(() => {
    // This code runs only on the client, after hydration
    setLastUpdated(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <LegalPageLayout title={title}>
      <div className="space-y-6">
        <p className="text-muted-foreground">Última actualización: {lastUpdated}</p>
        {children}
      </div>
    </LegalPageLayout>
  );
}

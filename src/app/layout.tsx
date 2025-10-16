import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ClientLayoutProvider, useAppContext } from './client-layout';

// Re-export useAppContext for backward compatibility
export { useAppContext };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)

{
  return (
    <html lang="en" className="!scroll-smooth dark">
      <head>
        <title>Tobias MakeUp</title>
        <meta name="description" content="Belleza que Transforma. Tu estilo personal, realzado con el arte del maquillaje profesional." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark transition-colors duration-300 antialiased" suppressHydrationWarning>
        <ClientLayoutProvider>
          {children}
        </ClientLayoutProvider>
        <Toaster />
      </body>
    </html>
  );
}
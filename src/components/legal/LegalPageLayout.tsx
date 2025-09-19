import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                {title}
              </h1>
            </header>
            <article className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-headline">
              {children}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

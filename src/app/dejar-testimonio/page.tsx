import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { TestimonialForm } from '@/components/landing/TestimonialForm';

export default function LeaveTestimonialPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section id="dejar-testimonio" className="container mx-auto px-4 py-16 md:py-24">
           <TestimonialForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}

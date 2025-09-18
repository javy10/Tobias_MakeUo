import { TestimonialForm } from '@/components/landing/TestimonialForm';

export default function LeaveTestimonialPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background items-center justify-center">
      <main className="flex-1 w-full max-w-2xl px-4 py-16 md:py-24">
        <TestimonialForm />
      </main>
    </div>
  );
}

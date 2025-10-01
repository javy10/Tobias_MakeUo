import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps = {}) {
  return (
    <Link 
      href="/" 
      className={`text-xl sm:text-2xl font-headline font-bold text-primary transition-all hover:opacity-80 hover:scale-105 ${className || ''}`}
    >
      Tobias MakeUp
    </Link>
  );
}

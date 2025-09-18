import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="text-2xl font-headline font-bold text-primary transition-opacity hover:opacity-80">
      Tobias MakeUp
    </Link>
  );
}

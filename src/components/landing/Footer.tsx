export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Tobias MakeUp. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

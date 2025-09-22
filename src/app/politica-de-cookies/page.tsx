import PolicyPageClientLayout from '../politicas/page-layout';

export default function CookiePolicyPage() {
  return (
    <PolicyPageClientLayout title="Política de Cookies">
      <p>
        Este sitio web, Tobias MakeUp, al igual que muchos otros, utiliza tecnologías de almacenamiento en el navegador para mejorar tu experiencia. A continuación, te explicamos qué son y cómo las utilizamos.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">1. ¿Qué son las Cookies y el Almacenamiento Local?</h2>
        <p>
          Las cookies son pequeños archivos de texto que los sitios web guardan en tu ordenador o dispositivo móvil mientras navegas. El almacenamiento local (LocalStorage e IndexedDB) es una tecnología similar y más moderna que permite a los sitios web guardar datos en tu navegador de forma más eficiente y segura. En este sitio, utilizamos principalmente el almacenamiento local para su funcionalidad.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">2. ¿Qué Datos Almacenamos?</h2>
        <p>
          Nuestro sitio web utiliza el almacenamiento local para:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li><strong>Guardar el contenido del sitio:</strong> Para que la página cargue más rápido y funcione correctamente, guardamos la información de los servicios, productos, testimonios y la galería directamente en tu navegador.</li>
          <li><strong>Mantener tu sesión de administrador:</strong> Si inicias sesión en el panel de administración, guardamos un identificador para mantener tu sesión activa y no tener que volver a introducir tus credenciales.</li>
        </ul>
        <p>
          No utilizamos cookies de seguimiento de terceros ni cookies con fines publicitarios.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">3. Cómo Gestionar tus Datos</h2>
        <p>
          Puedes controlar y/o eliminar los datos almacenados en tu navegador cuando lo desees. La mayoría de los navegadores te permiten borrar los datos del sitio desde su menú de configuración o herramientas de desarrollador.
        </p>
        <p>
          Ten en cuenta que si borras los datos de nuestro sitio, es posible que el contenido personalizado que hayas guardado (como nuevos elementos en la galería) se elimine y la sesión de administrador se cierre.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">4. Cambios en la Política de Cookies</h2>
        <p>
          Podemos actualizar esta política ocasionalmente. Te recomendamos que la revises periódicamente para estar informado/a.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">5. Contacto</h2>
        <p>
          Si tienes alguna pregunta sobre nuestra Política de Cookies, por favor, <a href="/#contacto" className="text-primary underline hover:no-underline">contáctanos</a>.
        </p>
      </section>
    </PolicyPageClientLayout>
  );
}

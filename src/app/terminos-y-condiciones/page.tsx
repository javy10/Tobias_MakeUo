import PolicyPageClientLayout from '../politicas/page-layout';

export default function TermsAndConditionsPage() {
  return (
    <PolicyPageClientLayout title="Términos y Condiciones">
      <p>
        Bienvenido/a a Tobias MakeUp. Al acceder y utilizar nuestro sitio web y servicios, aceptas cumplir y estar sujeto/a a los siguientes términos y condiciones. Por favor, léelos detenidamente.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">1. Servicios Ofrecidos</h2>
        <p>
          Tobias MakeUp ofrece servicios de maquillaje profesional, incluyendo pero no limitado a maquillaje social, maquillaje para novias y clases de automaquillaje, así como la venta de productos cosméticos. Todos los servicios se realizan con cita previa y están sujetos a disponibilidad.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">2. Citas y Reservas</h2>
        <p>
          Para agendar una cita, es necesario contactarnos a través de los canales proporcionados en este sitio web. Para servicios especiales como el maquillaje de novia, se puede requerir un depósito no reembolsable para asegurar la fecha.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">3. Política de Cancelación</h2>
        <p>
          Entendemos que pueden surgir imprevistos. Te pedimos que nos notifiques cualquier cancelación o necesidad de reprogramación con al menos 48 horas de antelación. Las cancelaciones realizadas con menos de 24 horas de antelación pueden estar sujetas a un cargo por cancelación. Los depósitos para servicios de novia no son reembolsables.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">4. Pagos</h2>
        <p>
          Los pagos por servicios y productos se pueden realizar a través de los métodos especificados en el momento de la reserva o compra. Todos los precios se indican en la moneda local y pueden estar sujetos a impuestos aplicables.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">5. Propiedad Intelectual</h2>
        <p>
          Todo el contenido de este sitio web, incluyendo imágenes, textos, logos y diseños, es propiedad de Tobias MakeUp y está protegido por las leyes de derechos de autor. No se permite su uso, reproducción o distribución sin nuestro consentimiento explícito por escrito.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">6. Limitación de Responsabilidad</h2>
        <p>
          Utilizamos productos de alta calidad y seguimos estrictos protocolos de higiene. Sin embargo, es responsabilidad del cliente informar sobre cualquier alergia o condición de la piel antes de la prestación del servicio. No nos hacemos responsables de reacciones alérgicas si no se nos ha informado previamente de las sensibilidades existentes.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">7. Modificaciones de los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Cualquier cambio será efectivo inmediatamente después de su publicación en el sitio web.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">8. Contacto</h2>
        <p>
          Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor, <a href="/#contacto" className="text-primary underline hover:no-underline">contáctanos</a>.
        </p>
      </section>
    </PolicyPageClientLayout>
  );
}
